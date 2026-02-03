"""
Daily Cleanup Job
Removes expired anonymous conversations and old messages
"""

import os
import logging
from datetime import datetime, timedelta
from typing import Dict, Any

logger = logging.getLogger(__name__)


def run_daily_cleanup() -> Dict[str, Any]:
    """
    Run daily cleanup of expired conversations

    Returns:
        Dict with cleanup statistics
    """
    logger.info("Starting daily cleanup job...")
    start_time = datetime.utcnow()

    try:
        from ..db.postgres import get_postgres
        from ..services.observability import get_sentry

        db = get_postgres()
        sentry = get_sentry()

        # Delete expired anonymous conversations
        deleted_conversations = _delete_expired_conversations(db)

        # Delete orphaned messages
        deleted_messages = _delete_orphaned_messages(db)

        # Delete old rate limit records (keep only last 24h)
        deleted_rate_limits = _delete_old_rate_limits()

        # Vacuum database (optional, only if enabled)
        vacuum_performed = False
        if os.getenv("ENABLE_VACUUM", "false").lower() == "true":
            _vacuum_database(db)
            vacuum_performed = True

        # Calculate duration
        duration = (datetime.utcnow() - start_time).total_seconds()

        stats = {
            "status": "success",
            "timestamp": start_time.isoformat(),
            "duration_seconds": round(duration, 2),
            "deleted_conversations": deleted_conversations,
            "deleted_messages": deleted_messages,
            "deleted_rate_limits": deleted_rate_limits,
            "vacuum_performed": vacuum_performed,
        }

        logger.info(f"Daily cleanup completed: {stats}")

        # Send success notification to Sentry
        sentry.capture_message(
            f"Daily cleanup successful: {deleted_conversations} conversations, {deleted_messages} messages deleted",
            level="info",
            context=stats,
        )

        return stats

    except Exception as e:
        logger.error(f"Daily cleanup failed: {e}", exc_info=True)

        # Send error to Sentry
        try:
            from ..services.observability import get_sentry
            sentry = get_sentry()
            sentry.capture_exception(e, context={"job": "daily_cleanup"})
        except:
            pass

        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat(),
        }


def _delete_expired_conversations(db) -> int:
    """Delete conversations past their expiration date"""
    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM conversations
                WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP
                RETURNING id
                """
            )

            deleted = cur.fetchall()
            count = len(deleted)

            logger.info(f"Deleted {count} expired conversations")
            return count


def _delete_orphaned_messages(db) -> int:
    """Delete messages that have no parent conversation"""
    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM messages
                WHERE conversation_id NOT IN (SELECT id FROM conversations)
                RETURNING id
                """
            )

            deleted = cur.fetchall()
            count = len(deleted)

            logger.info(f"Deleted {count} orphaned messages")
            return count


def _delete_old_rate_limits() -> int:
    """Delete rate limit records older than 24 hours from Upstash"""
    try:
        from ..db.upstash import get_upstash

        upstash = get_upstash()

        if not upstash.enabled:
            logger.info("Upstash disabled, skipping rate limit cleanup")
            return 0

        # Note: Upstash Redis automatically expires keys with TTL
        # This is a placeholder for future manual cleanup if needed
        logger.info("Rate limit records auto-expire via TTL")
        return 0

    except Exception as e:
        logger.warning(f"Failed to delete old rate limits: {e}")
        return 0


def _vacuum_database(db):
    """Run VACUUM to reclaim storage"""
    logger.info("Running VACUUM on database...")
    try:
        with db.get_connection() as conn:
            # Set isolation level for VACUUM
            old_isolation = conn.isolation_level
            conn.set_isolation_level(0)  # AUTOCOMMIT

            with conn.cursor() as cur:
                cur.execute("VACUUM ANALYZE conversations")
                cur.execute("VACUUM ANALYZE messages")

            # Restore isolation level
            conn.set_isolation_level(old_isolation)

        logger.info("VACUUM completed successfully")

    except Exception as e:
        logger.error(f"VACUUM failed: {e}", exc_info=True)
        raise
