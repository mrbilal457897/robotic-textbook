"""
FastAPI Application Entry Point
Main application setup with middleware and routing
"""

import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# Ensure .env is loaded regardless of working directory
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .api.middleware import (
    RequestIDMiddleware,
    RateLimitMiddleware,
    RequestValidationMiddleware,
    ErrorHandlingMiddleware,
    LoggingMiddleware,
    IPBanMiddleware,
    PromptInjectionMiddleware,
)
from .api.v1 import auth, chat, conversations, metrics, cleanup, metadata
from .config import Settings

# Initialize settings
settings = Settings()

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format=settings.log_format
    if settings.log_format == "json"
    else "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


# ============================================
# Application Lifespan Events
# ============================================


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events (startup/shutdown)
    """
    # Startup
    logger.info("Starting RAG Textbook Chatbot API...")
    logger.info(f"Environment: {settings.app_env}")
    logger.info(f"Debug mode: {settings.app_debug}")

    yield

    # Shutdown
    logger.info("Shutting down RAG Textbook Chatbot API...")


# ============================================
# Create FastAPI Application
# ============================================

app = FastAPI(
    title="RAG Textbook Chatbot API",
    description="Backend API for RAG-powered textbook chatbot with citation-backed answers",
    version="1.0.0",
    docs_url="/docs" if settings.app_debug else None,
    redoc_url="/redoc" if settings.app_debug else None,
    lifespan=lifespan,
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Log exact validation errors so we can debug 422s"""
    # Strip non-serializable ctx values before logging/returning
    errors = [
        {k: str(v) if k == "ctx" else v for k, v in err.items()}
        for err in exc.errors()
    ]
    logger.error(f"422 Validation error on {request.method} {request.url.path}: {errors}")
    try:
        body = await request.body()
        logger.error(f"Request body: {body.decode()}")
    except Exception:
        pass
    return JSONResponse(status_code=422, content={"detail": errors})


# ============================================
# Configure CORS
# ============================================

# CORS origins (already parsed as list by Settings validator)
cors_origins = settings.cors_origins if isinstance(settings.cors_origins, list) else [
    origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
)

# ============================================
# Add Custom Middleware (order matters!)
# ============================================

# 1. Request ID (first - adds tracing)
app.add_middleware(RequestIDMiddleware)

# 2. Logging (early - logs all requests)
app.add_middleware(LoggingMiddleware)

# 3. Error Handling (wraps everything)
app.add_middleware(ErrorHandlingMiddleware)

# 4. IP Ban Check (early - blocks banned IPs immediately)
app.add_middleware(
    IPBanMiddleware,
    rate_limit_violations_threshold=5,
    injection_attempts_threshold=3,
    ban_duration_seconds=86400,  # 24 hours
)

# 5. Request Validation (before processing)
app.add_middleware(RequestValidationMiddleware, max_content_length=10 * 1024 * 1024)

# 6. Rate Limiting (after validation, records violations via IP ban middleware)
# Config values are per-hour limits; use defaults for per-minute
app.add_middleware(
    RateLimitMiddleware,
    anonymous_per_minute=10,  # Default from middleware
    anonymous_per_hour=int(settings.rate_limit_anonymous),
    authenticated_per_minute=30,  # Default from middleware
    authenticated_per_hour=int(settings.rate_limit_authenticated),
)

# 7. Prompt Injection Detection (after rate limiting, records violations)
# Note: Since we can't pass middleware instances in add_middleware,
# the PromptInjectionMiddleware will need to access IPBanMiddleware via app state
app.add_middleware(PromptInjectionMiddleware)

# ============================================
# Register API Routers
# ============================================

app.include_router(auth.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(conversations.router, prefix="/api/v1")
app.include_router(metrics.router, prefix="/api/v1")
app.include_router(cleanup.router, prefix="/api/v1")
app.include_router(metadata.router, prefix="/api/v1")

# ============================================
# Health Check Endpoints
# ============================================


@app.get("/health")
@app.get("/healthz")
async def health_check():
    """
    Health check endpoint for monitoring

    Returns:
        Status dict
    """
    return {
        "status": "healthy",
        "service": "rag-textbook-chatbot-api",
        "version": "1.0.0",
        "environment": settings.app_env,
    }


@app.get("/")
async def root():
    """
    Root endpoint

    Returns:
        API info
    """
    return {
        "service": "RAG Textbook Chatbot API",
        "version": "1.0.0",
        "docs": "/docs" if settings.app_debug else "disabled",
        "health": "/health",
    }


# ============================================
# Run Application (Development)
# ============================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.reload if hasattr(settings, "reload") else True,
        log_level=settings.log_level.lower(),
    )
