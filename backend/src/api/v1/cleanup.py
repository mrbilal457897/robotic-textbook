"""
Cleanup API Endpoint
Triggers daily cleanup job (for Vercel Cron or manual invocation)
"""

from fastapi import APIRouter, HTTPException, Header
from typing import Dict, Any, Optional
import os
import logging

from ...services.cleanup import run_daily_cleanup

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/cleanup", tags=["cleanup"])


@router.post("", response_model=Dict[str, Any])
async def trigger_cleanup(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Trigger daily cleanup job

    Protected endpoint - requires authorization header matching CRON_SECRET

    Returns:
        Dict with cleanup statistics
    """
    # Verify authorization (Vercel Cron secret)
    cron_secret = os.getenv("CRON_SECRET")

    if not cron_secret:
        logger.error("CRON_SECRET not configured")
        raise HTTPException(
            status_code=500,
            detail="Cleanup endpoint not configured properly",
        )

    # Extract bearer token
    if not authorization:
        logger.warning("Cleanup triggered without authorization header")
        raise HTTPException(
            status_code=401,
            detail="Authorization required",
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format. Use: Bearer <token>",
        )

    token = authorization.split("Bearer ", 1)[1]

    if token != cron_secret:
        logger.warning("Cleanup triggered with invalid token")
        raise HTTPException(
            status_code=403,
            detail="Invalid authorization token",
        )

    # Run cleanup
    logger.info("Cleanup job triggered via API")
    result = run_daily_cleanup()

    return result


@router.get("/status")
async def get_cleanup_status() -> Dict[str, Any]:
    """
    Get cleanup job status and configuration

    Returns:
        Dict with cleanup configuration
    """
    return {
        "status": "configured",
        "cron_secret_configured": bool(os.getenv("CRON_SECRET")),
        "vacuum_enabled": os.getenv("ENABLE_VACUUM", "false").lower() == "true",
        "schedule": "Daily at 2:00 AM UTC",
    }
