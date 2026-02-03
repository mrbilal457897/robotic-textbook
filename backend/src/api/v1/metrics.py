"""
Metrics API Endpoint
Exposes RAG pipeline metrics and alerting status
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Any
import logging

from ...services.observability import get_metrics, get_rag_metrics

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("", response_model=Dict[str, Any])
async def get_all_metrics() -> Dict[str, Any]:
    """
    Get all collected metrics

    Returns:
        Dict with all metrics organized by category
    """
    try:
        metrics_collector = get_metrics()
        all_metrics = metrics_collector.get_metrics()

        # Organize metrics by category
        categorized = {
            "stage_latency": {},
            "retrieval_quality": {},
            "response_quality": {},
            "errors": {},
            "usage": {},
        }

        for metric_key, metric_data in all_metrics.items():
            if "rag.stage" in metric_key:
                categorized["stage_latency"][metric_key] = metric_data
            elif "rag.retrieval" in metric_key:
                categorized["retrieval_quality"][metric_key] = metric_data
            elif "rag.response" in metric_key:
                categorized["response_quality"][metric_key] = metric_data
            elif "rag.errors" in metric_key:
                categorized["errors"][metric_key] = metric_data
            elif "rag.usage" in metric_key:
                categorized["usage"][metric_key] = metric_data

        return {
            "status": "success",
            "metrics": categorized,
            "total_metrics": len(all_metrics),
        }

    except Exception as e:
        logger.error(f"Failed to retrieve metrics: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve metrics")


@router.get("/alerts", response_model=Dict[str, Any])
async def get_alerts() -> Dict[str, Any]:
    """
    Check alerting thresholds and return active alerts

    Returns:
        Dict with active alerts and metrics summary
    """
    try:
        rag_metrics = get_rag_metrics()
        alert_status = rag_metrics.check_alerting_thresholds()

        return {
            "status": "success",
            "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
            **alert_status,
        }

    except Exception as e:
        logger.error(f"Failed to check alerts: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to check alerts")


@router.post("/reset")
async def reset_metrics() -> Dict[str, str]:
    """
    Reset all metrics (for testing/debugging)

    Returns:
        Success message
    """
    try:
        metrics_collector = get_metrics()
        metrics_collector.reset()

        return {
            "status": "success",
            "message": "All metrics have been reset",
        }

    except Exception as e:
        logger.error(f"Failed to reset metrics: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to reset metrics")


@router.get("/summary", response_model=Dict[str, Any])
async def get_metrics_summary() -> Dict[str, Any]:
    """
    Get high-level metrics summary for dashboards

    Returns:
        Dict with summarized metrics
    """
    try:
        metrics_collector = get_metrics()
        all_metrics = metrics_collector.get_metrics()

        # Calculate summary statistics
        total_requests = sum(
            m["value"] for k, m in all_metrics.items()
            if "rag.usage.mode" in k and m.get("type") == "counter"
        )

        total_errors = sum(
            m["value"] for k, m in all_metrics.items()
            if "rag.errors" in k and m.get("type") == "counter"
        )

        # Average confidence
        confidence_scores = [
            m["value"] for k, m in all_metrics.items()
            if "rag.response.confidence_score" in k and m.get("type") == "gauge"
        ]
        avg_confidence = (
            sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0.0
        )

        # Average latency
        latency_values = []
        for k, m in all_metrics.items():
            if "duration_ms" in k and m.get("type") == "histogram":
                latency_values.extend(m.get("values", []))

        avg_latency = (
            sum(latency_values) / len(latency_values) if latency_values else 0.0
        )

        return {
            "status": "success",
            "summary": {
                "total_requests": total_requests,
                "total_errors": total_errors,
                "error_rate": (
                    (total_errors / total_requests * 100) if total_requests > 0 else 0.0
                ),
                "avg_confidence_score": round(avg_confidence, 3),
                "avg_latency_ms": round(avg_latency, 2),
            },
        }

    except Exception as e:
        logger.error(f"Failed to generate metrics summary: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate metrics summary")
