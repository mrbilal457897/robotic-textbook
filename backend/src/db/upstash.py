"""
Upstash Redis Client
Provides rate limiting and caching operations using Upstash Redis REST API
"""

import os
from typing import Optional
import requests
import logging
from datetime import timedelta

logger = logging.getLogger(__name__)


class UpstashRedis:
    """Manages Upstash Redis operations via REST API"""

    def __init__(self):
        """Initialize Upstash Redis client from environment variables"""
        self.redis_url = os.getenv("UPSTASH_REDIS_URL")
        self.redis_token = os.getenv("UPSTASH_REDIS_TOKEN")

        if not self.redis_url or not self.redis_token:
            logger.warning(
                "UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN not set - rate limiting disabled"
            )
            self.enabled = False
        else:
            self.enabled = True
            self.headers = {"Authorization": f"Bearer {self.redis_token}"}
            logger.info("Upstash Redis client initialized")

    def _make_request(self, commands: list) -> list:
        """
        Make a request to Upstash Redis REST API

        Args:
            commands: List of Redis commands (e.g., ["GET", "mykey"])

        Returns:
            Response data from Redis
        """
        if not self.enabled:
            return []

        try:
            response = requests.post(
                f"{self.redis_url}/pipeline",
                headers=self.headers,
                json=commands,
                timeout=5,
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Upstash Redis request failed: {e}")
            # Don't raise - allow graceful degradation
            return []

    def get(self, key: str) -> Optional[str]:
        """
        Get value by key

        Args:
            key: Redis key

        Returns:
            Value as string or None
        """
        if not self.enabled:
            return None

        result = self._make_request([["GET", key]])
        return result[0].get("result") if result else None

    def set(
        self, key: str, value: str, ex: Optional[int] = None, ttl: Optional[int] = None, nx: bool = False
    ) -> bool:
        """
        Set key-value pair

        Args:
            key: Redis key
            value: Value to set
            ex: Expiration time in seconds (alias for ttl)
            ttl: Expiration time in seconds
            nx: Only set if key doesn't exist (SET NX)

        Returns:
            True if successful
        """
        if not self.enabled:
            return False

        command = ["SET", key, value]
        expiration = ex or ttl
        if expiration:
            command.extend(["EX", str(expiration)])
        if nx:
            command.append("NX")

        result = self._make_request([command])
        return result[0].get("result") == "OK" if result else False

    def incr(self, key: str, window_seconds: Optional[int] = None) -> Optional[int]:
        """
        Increment counter with optional expiration window

        Args:
            key: Redis key
            window_seconds: If provided, sets expiration on first increment

        Returns:
            New counter value
        """
        if not self.enabled:
            return None

        result = self._make_request([["INCR", key]])
        new_count = result[0].get("result") if result else None

        # Set expiration on first increment if window provided
        if new_count == 1 and window_seconds:
            self.expire(key, window_seconds)

        return new_count

    def expire(self, key: str, seconds: int) -> bool:
        """
        Set expiration on key

        Args:
            key: Redis key
            seconds: Expiration time in seconds

        Returns:
            True if expiration was set
        """
        if not self.enabled:
            return False

        result = self._make_request([["EXPIRE", key, str(seconds)]])
        return result[0].get("result") == 1 if result else False

    def delete(self, key: str) -> bool:
        """
        Delete key

        Args:
            key: Redis key

        Returns:
            True if key was deleted
        """
        if not self.enabled:
            return False

        result = self._make_request([["DEL", key]])
        return result[0].get("result") == 1 if result else False

    def get_ttl(self, key: str) -> Optional[int]:
        """
        Get time-to-live for a key in seconds

        Args:
            key: Redis key

        Returns:
            TTL in seconds, None if key doesn't exist or has no expiration
        """
        if not self.enabled:
            return None

        result = self._make_request([["TTL", key]])
        ttl = result[0].get("result") if result else None

        # Redis returns -2 if key doesn't exist, -1 if no expiration
        if ttl == -2 or ttl == -1:
            return None

        return ttl

    def check_rate_limit(
        self, identifier: str, limit: int, window_seconds: int
    ) -> tuple[bool, int]:
        """
        Check and enforce rate limit using sliding window

        Args:
            identifier: Unique identifier (e.g., user_id, ip_address)
            limit: Maximum requests allowed in window
            window_seconds: Time window in seconds

        Returns:
            Tuple of (is_allowed, remaining_requests)
        """
        if not self.enabled:
            return (True, limit)  # Allow if Redis is disabled

        key = f"rate_limit:{identifier}"

        # Get current count
        current = self.get(key)
        current_count = int(current) if current else 0

        if current_count >= limit:
            return (False, 0)

        # Increment counter
        new_count = self.incr(key)

        # Set expiration on first request
        if new_count == 1:
            self.expire(key, window_seconds)

        remaining = max(0, limit - (new_count or 0))
        return (True, remaining)


# Global Upstash instance
_upstash_instance: Optional[UpstashRedis] = None


def get_upstash() -> UpstashRedis:
    """Get or create the global Upstash instance"""
    global _upstash_instance
    if _upstash_instance is None:
        _upstash_instance = UpstashRedis()
    return _upstash_instance
