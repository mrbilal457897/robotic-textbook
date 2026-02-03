"""
API Middleware
Rate limiting, request validation, error handling, and request tracing
"""

import time
import uuid
import logging
from typing import Callable
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware

from ..db.upstash import get_upstash

logger = logging.getLogger(__name__)


# ============================================
# Request ID Tracing Middleware
# ============================================


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Add unique request ID to each request for tracing"""

    async def dispatch(self, request: Request, call_next: Callable):
        # Generate or extract request ID
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

        # Add to request state
        request.state.request_id = request_id

        # Process request
        response = await call_next(request)

        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id

        return response


# ============================================
# Rate Limiting Middleware
# ============================================


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Enforce multi-tier rate limits using Upstash Redis

    Implements both per-minute and per-hour rate limits:
    - Anonymous users: 10/min, 100/hr
    - Authenticated users: 30/min, 300/hr
    """

    def __init__(
        self,
        app,
        anonymous_per_minute: int = 10,
        anonymous_per_hour: int = 100,
        authenticated_per_minute: int = 30,
        authenticated_per_hour: int = 300,
    ):
        super().__init__(app)
        self.anonymous_per_minute = anonymous_per_minute
        self.anonymous_per_hour = anonymous_per_hour
        self.authenticated_per_minute = authenticated_per_minute
        self.authenticated_per_hour = authenticated_per_hour
        self.upstash = get_upstash()

    async def dispatch(self, request: Request, call_next: Callable):
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/healthz", "/"]:
            return await call_next(request)

        # Get identifier (user_id from session or IP address)
        session_id = request.cookies.get("session_id")
        identifier = session_id if session_id else request.client.host
        is_authenticated = bool(session_id)

        # Check per-minute limit first (stricter)
        minute_limit = (
            self.authenticated_per_minute
            if is_authenticated
            else self.anonymous_per_minute
        )
        minute_allowed, minute_remaining = self.upstash.check_rate_limit(
            identifier=f"rl:min:{identifier}",
            limit=minute_limit,
            window_seconds=60,
        )

        if not minute_allowed:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "rate_limit_exceeded",
                    "message": f"Rate limit exceeded. Maximum {minute_limit} requests per minute.",
                    "retry_after": 60,
                },
                headers={
                    "Retry-After": "60",
                    "X-RateLimit-Limit": str(minute_limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time()) + 60),
                },
            )

        # Check per-hour limit
        hour_limit = (
            self.authenticated_per_hour if is_authenticated else self.anonymous_per_hour
        )
        hour_allowed, hour_remaining = self.upstash.check_rate_limit(
            identifier=f"rl:hour:{identifier}",
            limit=hour_limit,
            window_seconds=3600,
        )

        if not hour_allowed:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "rate_limit_exceeded",
                    "message": f"Rate limit exceeded. Maximum {hour_limit} requests per hour.",
                    "retry_after": 3600,
                },
                headers={
                    "Retry-After": "3600",
                    "X-RateLimit-Limit": str(hour_limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time()) + 3600),
                },
            )

        # Process request
        response = await call_next(request)

        # Add rate limit headers (use the more restrictive remaining count)
        response.headers["X-RateLimit-Limit-Minute"] = str(minute_limit)
        response.headers["X-RateLimit-Remaining-Minute"] = str(minute_remaining)
        response.headers["X-RateLimit-Limit-Hour"] = str(hour_limit)
        response.headers["X-RateLimit-Remaining-Hour"] = str(hour_remaining)

        return response


# ============================================
# Request Validation Middleware
# ============================================


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """Validate request content and enforce limits"""

    def __init__(
        self,
        app,
        max_content_length: int = 10 * 1024 * 1024,  # 10 MB
    ):
        super().__init__(app)
        self.max_content_length = max_content_length

    async def dispatch(self, request: Request, call_next: Callable):
        # Check content length
        content_length = request.headers.get("content-length")

        if content_length and int(content_length) > self.max_content_length:
            return JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content={
                    "error": "payload_too_large",
                    "message": f"Request body too large. Maximum size: {self.max_content_length} bytes",
                },
            )

        # Process request
        response = await call_next(request)

        return response


# ============================================
# Error Handling Middleware
# ============================================


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Catch and format all errors"""

    async def dispatch(self, request: Request, call_next: Callable):
        try:
            response = await call_next(request)
            return response

        except Exception as e:
            logger.error(
                f"Unhandled error: {e}",
                exc_info=True,
                extra={"request_id": getattr(request.state, "request_id", None)},
            )

            # Return generic error response
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "internal_server_error",
                    "message": "An unexpected error occurred. Please try again later.",
                    "request_id": getattr(request.state, "request_id", None),
                },
            )


# ============================================
# Logging Middleware
# ============================================


class LoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests and responses"""

    async def dispatch(self, request: Request, call_next: Callable):
        # Start timer
        start_time = time.time()

        # Process request
        response = await call_next(request)

        # Calculate duration
        duration = time.time() - start_time

        # Log request
        logger.info(
            f"{request.method} {request.url.path}",
            extra={
                "request_id": getattr(request.state, "request_id", None),
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "duration_ms": round(duration * 1000, 2),
                "client_ip": request.client.host if request.client else None,
            },
        )

        return response


# ============================================
# IP Ban Management (Security)
# ============================================


class IPBanMiddleware(BaseHTTPMiddleware):
    """
    Track and enforce IP-based temporary bans for abusive behavior

    Ban triggers:
    - Excessive rate limit violations (5+ in 1 hour)
    - Multiple prompt injection attempts (3+ in 1 hour)
    - Ban duration: 24 hours
    """

    def __init__(
        self,
        app,
        rate_limit_violations_threshold: int = 5,
        injection_attempts_threshold: int = 3,
        ban_duration_seconds: int = 86400,  # 24 hours
    ):
        super().__init__(app)
        self.rate_limit_violations_threshold = rate_limit_violations_threshold
        self.injection_attempts_threshold = injection_attempts_threshold
        self.ban_duration_seconds = ban_duration_seconds
        self.upstash = get_upstash()

    def is_banned(self, ip: str) -> tuple[bool, int | None]:
        """
        Check if IP is currently banned

        Returns:
            (is_banned, remaining_seconds)
        """
        ban_key = f"ban:{ip}"
        ttl = self.upstash.get_ttl(ban_key)

        if ttl and ttl > 0:
            return (True, ttl)

        return (False, None)

    def record_violation(self, ip: str, violation_type: str):
        """
        Record a violation and check if ban threshold is reached

        Args:
            ip: IP address
            violation_type: "rate_limit" or "injection"
        """
        violation_key = f"violations:{violation_type}:{ip}"

        # Increment violation count with 1-hour window
        count = self.upstash.incr(violation_key, window_seconds=3600)

        # Check thresholds
        should_ban = False
        if violation_type == "rate_limit" and count >= self.rate_limit_violations_threshold:
            should_ban = True
        elif violation_type == "injection" and count >= self.injection_attempts_threshold:
            should_ban = True

        if should_ban:
            self.ban_ip(ip, violation_type)

    def ban_ip(self, ip: str, reason: str):
        """
        Ban an IP address for the configured duration

        Args:
            ip: IP address to ban
            reason: Ban reason for logging
        """
        ban_key = f"ban:{ip}"
        self.upstash.set(ban_key, reason, ttl=self.ban_duration_seconds)

        logger.warning(
            f"Banned IP {ip} for {self.ban_duration_seconds}s due to: {reason}"
        )

    async def dispatch(self, request: Request, call_next: Callable):
        # Skip ban check for health checks
        if request.url.path in ["/health", "/healthz", "/"]:
            return await call_next(request)

        ip = request.client.host if request.client else None

        if not ip:
            return await call_next(request)

        # Check if IP is banned
        is_banned, remaining_seconds = self.is_banned(ip)

        if is_banned:
            logger.warning(f"Blocked request from banned IP: {ip}")
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={
                    "error": "ip_banned",
                    "message": "Your IP address has been temporarily banned due to abusive behavior.",
                    "retry_after": remaining_seconds,
                    "details": "If you believe this is an error, please contact support.",
                },
                headers={
                    "Retry-After": str(remaining_seconds),
                },
            )

        # Store IP in request state for violation tracking
        request.state.client_ip = ip

        # Process request
        response = await call_next(request)

        # Record rate limit violations
        if response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
            self.record_violation(ip, "rate_limit")

        return response


# ============================================
# Prompt Injection Detection (Security)
# ============================================


def detect_prompt_injection(text: str) -> tuple[bool, str | None]:
    """
    Detect potential prompt injection attempts with enhanced pattern matching

    Args:
        text: User input text

    Returns:
        (is_injection, matched_pattern) tuple
    """
    import re

    # Enhanced prompt injection patterns
    injection_patterns = [
        # Instruction override attempts
        (r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions?", "instruction_override"),
        (r"disregard\s+(all\s+)?(previous|prior|above)\s+instructions?", "instruction_override"),
        (r"forget\s+(all\s+)?(previous|prior|above)\s+instructions?", "instruction_override"),
        (r"override\s+system\s+prompt", "instruction_override"),

        # Role/identity manipulation
        (r"(you\s+are\s+now|act\s+as|pretend\s+to\s+be)\s+(a\s+)?(different|another)", "role_manipulation"),
        (r"system\s*:\s*you\s+(are|must)", "role_manipulation"),
        (r"new\s+instructions?\s*:", "role_manipulation"),

        # System marker injection
        (r"\[?(system|assistant|user)\]?\s*:", "marker_injection"),
        (r"<\s*system\s*>", "marker_injection"),
        (r"<\s*assistant\s*>", "marker_injection"),

        # Template/variable injection
        (r"\{\{.+\}\}", "template_injection"),
        (r"\$\{.+\}", "template_injection"),

        # Code/script injection
        (r"<\s*script\s*>", "script_injection"),
        (r"javascript\s*:", "script_injection"),
        (r"eval\s*\(", "script_injection"),

        # Prompt leakage attempts
        (r"(show|reveal|display|print)\s+(me\s+)?(the\s+)?(system\s+)?(prompt|instructions)", "prompt_leakage"),
        (r"what\s+(are|is)\s+your\s+(system\s+)?(prompt|instructions)", "prompt_leakage"),
        (r"(show|give|tell)\s+(me\s+)?(your\s+)?(system\s+)?(prompt|instructions)", "prompt_leakage"),
    ]

    text_lower = text.lower()

    # Check regex patterns
    for pattern, pattern_type in injection_patterns:
        if re.search(pattern, text_lower):
            logger.warning(
                f"Prompt injection detected: type={pattern_type}, pattern={pattern}"
            )
            return (True, pattern_type)

    return (False, None)


class PromptInjectionMiddleware(BaseHTTPMiddleware):
    """
    Detect and block prompt injection attempts in request bodies

    Monitors POST requests to chat endpoints for injection patterns
    Records violations for IP ban tracking
    """

    def __init__(self, app):
        super().__init__(app)
        self.upstash = get_upstash()

    def record_injection_violation(self, ip: str):
        """Record injection attempt and trigger ban if threshold reached"""
        violation_key = f"violations:injection:{ip}"

        # Increment violation count with 1-hour window
        count = self.upstash.incr(violation_key, window_seconds=3600)

        # Ban if threshold reached (3 attempts)
        if count and count >= 3:
            ban_key = f"ban:{ip}"
            self.upstash.set(ban_key, "prompt_injection", ttl=86400)  # 24 hours
            logger.warning(f"Banned IP {ip} for prompt injection attempts")

    async def dispatch(self, request: Request, call_next: Callable):
        # Only check POST requests to chat endpoints
        if request.method == "POST" and "/chat" in request.url.path:
            try:
                # Read request body
                body = await request.body()

                # Decode and parse JSON
                import json
                try:
                    data = json.loads(body.decode("utf-8"))
                except (json.JSONDecodeError, UnicodeDecodeError):
                    # Invalid JSON - let downstream validation handle it
                    pass
                else:
                    # Check query and selected_text fields
                    query = data.get("query", "")
                    selected_text = data.get("selected_text", "")

                    # Check for injection
                    is_injection, pattern_type = detect_prompt_injection(query)
                    if is_injection:
                        ip = request.client.host if request.client else None
                        logger.warning(
                            f"Blocked prompt injection attempt: type={pattern_type}, ip={ip}"
                        )

                        # Record violation for IP ban tracking
                        if ip:
                            self.record_injection_violation(ip)

                        return JSONResponse(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            content={
                                "error": "invalid_input",
                                "message": "Your input contains patterns that are not allowed. Please rephrase your question.",
                                "details": "Potential security violation detected",
                            },
                        )

                    # Also check selected text
                    is_injection, pattern_type = detect_prompt_injection(selected_text)
                    if is_injection:
                        ip = request.client.host if request.client else None
                        logger.warning(
                            f"Blocked prompt injection in selected text: type={pattern_type}, ip={ip}"
                        )

                        # Record violation for IP ban tracking
                        if ip:
                            self.record_injection_violation(ip)

                        return JSONResponse(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            content={
                                "error": "invalid_input",
                                "message": "The selected text contains patterns that are not allowed.",
                                "details": "Potential security violation detected",
                            },
                        )

                # Reconstruct request with original body
                async def receive():
                    return {"type": "http.request", "body": body}

                request._receive = receive

            except Exception as e:
                logger.error(f"Error in prompt injection detection: {e}", exc_info=True)
                # Continue processing - don't block legitimate requests on detection errors

        # Process request
        response = await call_next(request)
        return response
