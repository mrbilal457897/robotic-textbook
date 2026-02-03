"""
Observability Service
Structured logging, Sentry error tracking, and metrics collection
"""

import os
import logging
import json
from typing import Dict, Any, Optional
from datetime import datetime
from enum import Enum


# ============================================
# Structured Logging
# ============================================


class LogFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging"""

    def format(self, record: logging.LogRecord) -> str:
        """
        Format log record as JSON

        Args:
            record: Log record

        Returns:
            JSON string
        """
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Add extra fields
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id

        if hasattr(record, "user_id"):
            log_data["user_id"] = record.user_id

        if hasattr(record, "duration_ms"):
            log_data["duration_ms"] = record.duration_ms

        if hasattr(record, "status_code"):
            log_data["status_code"] = record.status_code

        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_data)


def setup_structured_logging():
    """
    Configure structured logging for the application

    Uses JSON format if LOG_FORMAT=json, otherwise uses standard format
    """
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    log_format = os.getenv("LOG_FORMAT", "text")

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level, logging.INFO))

    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(getattr(logging, log_level, logging.INFO))

    # Set formatter
    if log_format == "json":
        console_handler.setFormatter(LogFormatter())
    else:
        console_handler.setFormatter(
            logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
            )
        )

    root_logger.addHandler(console_handler)

    # File logging (if configured)
    log_file_path = os.getenv("LOG_FILE_PATH")
    if log_file_path:
        try:
            file_handler = logging.FileHandler(log_file_path)
            file_handler.setLevel(getattr(logging, log_level, logging.INFO))

            if log_format == "json":
                file_handler.setFormatter(LogFormatter())
            else:
                file_handler.setFormatter(
                    logging.Formatter(
                        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                        datefmt="%Y-%m-%d %H:%M:%S",
                    )
                )

            root_logger.addHandler(file_handler)

        except Exception as e:
            logging.error(f"Failed to setup file logging: {e}")


# ============================================
# Sentry Integration
# ============================================


class SentryIntegration:
    """Sentry error tracking integration"""

    def __init__(self):
        self.dsn = os.getenv("SENTRY_DSN")
        self.environment = os.getenv("SENTRY_ENVIRONMENT", "development")
        self.traces_sample_rate = float(
            os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")
        )
        self.enabled = bool(self.dsn)

        if self.enabled:
            self._initialize_sentry()
        else:
            logging.warning("Sentry DSN not configured - error tracking disabled")

    def _initialize_sentry(self):
        """Initialize Sentry SDK"""
        try:
            import sentry_sdk
            from sentry_sdk.integrations.logging import LoggingIntegration

            # Configure Sentry logging
            sentry_logging = LoggingIntegration(
                level=logging.INFO,  # Capture info and above as breadcrumbs
                event_level=logging.ERROR,  # Send errors as events
            )

            sentry_sdk.init(
                dsn=self.dsn,
                environment=self.environment,
                traces_sample_rate=self.traces_sample_rate,
                integrations=[sentry_logging],
                release=os.getenv("APP_VERSION", "1.0.0"),
                send_default_pii=False,  # Don't send PII by default
            )

            logging.info(f"Sentry initialized (environment: {self.environment})")

        except ImportError:
            logging.error("sentry-sdk not installed - run: pip install sentry-sdk")
            self.enabled = False
        except Exception as e:
            logging.error(f"Failed to initialize Sentry: {e}")
            self.enabled = False

    def capture_exception(self, exception: Exception, context: Optional[Dict] = None):
        """
        Capture exception to Sentry

        Args:
            exception: Exception to capture
            context: Additional context dict
        """
        if not self.enabled:
            return

        try:
            import sentry_sdk

            if context:
                with sentry_sdk.push_scope() as scope:
                    for key, value in context.items():
                        scope.set_extra(key, value)
                    sentry_sdk.capture_exception(exception)
            else:
                sentry_sdk.capture_exception(exception)

        except Exception as e:
            logging.error(f"Failed to capture exception in Sentry: {e}")

    def capture_message(self, message: str, level: str = "info", context: Optional[Dict] = None):
        """
        Capture message to Sentry

        Args:
            message: Message to capture
            level: Severity level (debug, info, warning, error)
            context: Additional context dict
        """
        if not self.enabled:
            return

        try:
            import sentry_sdk

            if context:
                with sentry_sdk.push_scope() as scope:
                    for key, value in context.items():
                        scope.set_extra(key, value)
                    sentry_sdk.capture_message(message, level)
            else:
                sentry_sdk.capture_message(message, level)

        except Exception as e:
            logging.error(f"Failed to capture message in Sentry: {e}")


# ============================================
# Metrics Collection
# ============================================


class MetricType(str, Enum):
    """Metric types"""

    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"
    TIMER = "timer"


class MetricsCollector:
    """
    Simple in-memory metrics collector

    For production, replace with Prometheus, StatsD, or similar
    """

    def __init__(self):
        self.metrics: Dict[str, Any] = {}
        self.enabled = True

    def increment(self, metric_name: str, value: int = 1, tags: Optional[Dict] = None):
        """
        Increment counter metric

        Args:
            metric_name: Metric name
            value: Increment value (default: 1)
            tags: Optional tags dict
        """
        if not self.enabled:
            return

        key = self._get_metric_key(metric_name, tags)

        if key not in self.metrics:
            self.metrics[key] = {"type": MetricType.COUNTER, "value": 0, "tags": tags}

        self.metrics[key]["value"] += value

    def gauge(self, metric_name: str, value: float, tags: Optional[Dict] = None):
        """
        Set gauge metric

        Args:
            metric_name: Metric name
            value: Gauge value
            tags: Optional tags dict
        """
        if not self.enabled:
            return

        key = self._get_metric_key(metric_name, tags)

        self.metrics[key] = {"type": MetricType.GAUGE, "value": value, "tags": tags}

    def histogram(self, metric_name: str, value: float, tags: Optional[Dict] = None):
        """
        Record histogram value

        Args:
            metric_name: Metric name
            value: Observed value
            tags: Optional tags dict
        """
        if not self.enabled:
            return

        key = self._get_metric_key(metric_name, tags)

        if key not in self.metrics:
            self.metrics[key] = {
                "type": MetricType.HISTOGRAM,
                "values": [],
                "tags": tags,
            }

        self.metrics[key]["values"].append(value)

    def timer(self, metric_name: str, duration_ms: float, tags: Optional[Dict] = None):
        """
        Record timing metric

        Args:
            metric_name: Metric name
            duration_ms: Duration in milliseconds
            tags: Optional tags dict
        """
        self.histogram(f"{metric_name}.duration_ms", duration_ms, tags)

    def get_metrics(self) -> Dict[str, Any]:
        """
        Get all collected metrics

        Returns:
            Metrics dict
        """
        return self.metrics.copy()

    def reset(self):
        """Reset all metrics"""
        self.metrics.clear()

    def _get_metric_key(self, metric_name: str, tags: Optional[Dict]) -> str:
        """Generate metric key with tags"""
        if not tags:
            return metric_name

        tag_str = ",".join(f"{k}={v}" for k, v in sorted(tags.items()))
        return f"{metric_name}[{tag_str}]"


# ============================================
# RAG Pipeline Metrics
# ============================================


class RAGMetrics:
    """
    RAG-specific metrics collector for tracking pipeline performance,
    retrieval quality, and response quality
    """

    def __init__(self, metrics_collector: MetricsCollector):
        self.metrics = metrics_collector

    # ============================================
    # Stage Latency Metrics (6 stages)
    # ============================================

    def record_routing_latency(self, duration_ms: float, mode: str, intent: str):
        """Record Router Agent latency"""
        self.metrics.timer(
            "rag.stage.routing",
            duration_ms,
            tags={"mode": mode, "intent": intent},
        )

    def record_retrieval_latency(self, duration_ms: float, mode: str, num_results: int):
        """Record Retrieval Agent latency"""
        self.metrics.timer(
            "rag.stage.retrieval",
            duration_ms,
            tags={"mode": mode, "num_results": num_results},
        )

    def record_embedding_latency(self, duration_ms: float):
        """Record embedding generation latency"""
        self.metrics.timer("rag.stage.embedding", duration_ms)

    def record_reranking_latency(self, duration_ms: float):
        """Record reranking latency"""
        self.metrics.timer("rag.stage.reranking", duration_ms)

    def record_response_generation_latency(self, duration_ms: float, tone: str, num_chunks: int):
        """Record Response Agent latency"""
        self.metrics.timer(
            "rag.stage.response_generation",
            duration_ms,
            tags={"tone": tone, "num_chunks": num_chunks},
        )

    def record_citation_validation_latency(self, duration_ms: float):
        """Record Citation Agent latency"""
        self.metrics.timer("rag.stage.citation_validation", duration_ms)

    # ============================================
    # Retrieval Quality Metrics (4 metrics)
    # ============================================

    def record_retrieval_candidates(self, count: int, mode: str):
        """Record number of retrieval candidates found"""
        self.metrics.gauge("rag.retrieval.candidates_found", count, tags={"mode": mode})

    def record_retrieval_confidence(self, score: float, mode: str):
        """Record average retrieval confidence score"""
        self.metrics.gauge("rag.retrieval.confidence_score", score, tags={"mode": mode})

    def record_retrieval_failure(self, reason: str, mode: str):
        """Record retrieval failure with reason"""
        self.metrics.increment(
            "rag.retrieval.failures",
            tags={"reason": reason, "mode": mode},
        )

    def record_fallback_triggered(self, fallback_type: str):
        """Record fallback usage (e.g., Postgres full-text search)"""
        self.metrics.increment(
            "rag.retrieval.fallback_triggered",
            tags={"type": fallback_type},
        )

    # ============================================
    # Response Quality Metrics (4 metrics)
    # ============================================

    def record_response_confidence(self, score: float, mode: str, tone: str):
        """Record response confidence score"""
        self.metrics.gauge(
            "rag.response.confidence_score",
            score,
            tags={"mode": mode, "tone": tone},
        )

    def record_citation_count(self, count: int, mode: str):
        """Record number of citations in response"""
        self.metrics.gauge("rag.response.citation_count", count, tags={"mode": mode})

    def record_hallucination_detected(self, mode: str):
        """Record potential hallucination detection"""
        self.metrics.increment("rag.response.hallucinations", tags={"mode": mode})

    def record_refusal(self, reason: str, mode: str):
        """Record refusal with reason"""
        self.metrics.increment(
            "rag.response.refusals",
            tags={"reason": reason, "mode": mode},
        )

    # ============================================
    # Error Metrics (4 types)
    # ============================================

    def record_llm_error(self, error_type: str, is_retry: bool = False):
        """Record LLM API error"""
        self.metrics.increment(
            "rag.errors.llm",
            tags={"error_type": error_type, "is_retry": str(is_retry)},
        )

    def record_vector_db_error(self, error_type: str):
        """Record vector database error"""
        self.metrics.increment("rag.errors.vector_db", tags={"error_type": error_type})

    def record_database_error(self, error_type: str):
        """Record Postgres database error"""
        self.metrics.increment("rag.errors.database", tags={"error_type": error_type})

    def record_validation_error(self, error_type: str):
        """Record validation error"""
        self.metrics.increment("rag.errors.validation", tags={"error_type": error_type})

    # ============================================
    # Mode & Action Distribution
    # ============================================

    def record_mode_usage(self, mode: str):
        """Record answering mode usage"""
        self.metrics.increment("rag.usage.mode", tags={"mode": mode})

    def record_action_usage(self, action: str):
        """Record text action usage (explain, summarize, example, simplify)"""
        self.metrics.increment("rag.usage.action", tags={"action": action})

    def record_tone_usage(self, tone: str):
        """Record tone usage"""
        self.metrics.increment("rag.usage.tone", tags={"tone": tone})

    # ============================================
    # Alerting Threshold Checks
    # ============================================

    def check_alerting_thresholds(self) -> Dict[str, Any]:
        """
        Check if any metrics exceed alerting thresholds

        Thresholds (from spec):
        - Confidence p50 < 0.75: Quality degradation
        - Refusal rate > 20%: Content coverage issue
        - Latency p95 > 5s: Performance degradation
        - Fallback triggers > 10/hr: Vector DB issue

        Returns:
            Dict with alerts and metric values
        """
        alerts = []
        metrics_summary = self.metrics.get_metrics()

        # Calculate confidence p50 (median)
        confidence_scores = []
        for key, metric in metrics_summary.items():
            if "rag.response.confidence_score" in key and metric["type"] == MetricType.GAUGE:
                confidence_scores.append(metric["value"])

        if confidence_scores:
            confidence_p50 = sorted(confidence_scores)[len(confidence_scores) // 2]
            if confidence_p50 < 0.75:
                alerts.append({
                    "severity": "warning",
                    "metric": "confidence_score_p50",
                    "value": confidence_p50,
                    "threshold": 0.75,
                    "message": f"Response confidence p50 ({confidence_p50:.2f}) below threshold (0.75)",
                })

        # Calculate refusal rate
        total_requests = sum(
            m["value"] for k, m in metrics_summary.items()
            if "rag.usage.mode" in k and m["type"] == MetricType.COUNTER
        )
        total_refusals = sum(
            m["value"] for k, m in metrics_summary.items()
            if "rag.response.refusals" in k and m["type"] == MetricType.COUNTER
        )

        if total_requests > 0:
            refusal_rate = (total_refusals / total_requests) * 100
            if refusal_rate > 20:
                alerts.append({
                    "severity": "warning",
                    "metric": "refusal_rate",
                    "value": refusal_rate,
                    "threshold": 20.0,
                    "message": f"Refusal rate ({refusal_rate:.1f}%) exceeds threshold (20%)",
                })

        # Check latency p95
        latency_values = []
        for key, metric in metrics_summary.items():
            if "duration_ms" in key and metric["type"] == MetricType.HISTOGRAM:
                latency_values.extend(metric["values"])

        if latency_values:
            sorted_latencies = sorted(latency_values)
            p95_index = int(len(sorted_latencies) * 0.95)
            latency_p95 = sorted_latencies[p95_index]

            if latency_p95 > 5000:
                alerts.append({
                    "severity": "critical",
                    "metric": "latency_p95",
                    "value": latency_p95,
                    "threshold": 5000,
                    "message": f"Latency p95 ({latency_p95:.0f}ms) exceeds threshold (5000ms)",
                })

        # Check fallback trigger rate
        fallback_count = sum(
            m["value"] for k, m in metrics_summary.items()
            if "rag.retrieval.fallback_triggered" in k and m["type"] == MetricType.COUNTER
        )

        # Assuming metrics are per hour (adjust if different)
        if fallback_count > 10:
            alerts.append({
                "severity": "warning",
                "metric": "fallback_triggers",
                "value": fallback_count,
                "threshold": 10,
                "message": f"Fallback triggers ({fallback_count}/hr) exceed threshold (10/hr)",
            })

        return {
            "alerts": alerts,
            "has_alerts": len(alerts) > 0,
            "metrics_summary": {
                "confidence_p50": confidence_scores[-1] if confidence_scores else None,
                "refusal_rate": refusal_rate if total_requests > 0 else 0,
                "latency_p95": latency_p95 if latency_values else None,
                "fallback_count": fallback_count,
            },
        }


# ============================================
# Global Observability Instances
# ============================================

# Setup structured logging
setup_structured_logging()

# Initialize Sentry
_sentry = SentryIntegration()

# Initialize metrics collector
_metrics = MetricsCollector()

# Initialize RAG metrics
_rag_metrics = RAGMetrics(_metrics)


def get_sentry() -> SentryIntegration:
    """Get Sentry integration instance"""
    return _sentry


def get_metrics() -> MetricsCollector:
    """Get metrics collector instance"""
    return _metrics


def get_rag_metrics() -> RAGMetrics:
    """Get RAG metrics instance"""
    return _rag_metrics
