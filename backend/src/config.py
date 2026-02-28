"""
Configuration Management
Centralized configuration using Pydantic Settings
"""

from functools import lru_cache
from pathlib import Path
from typing import Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Always resolve .env relative to the backend/ directory, not cwd
_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ============================================
    # Application Configuration
    # ============================================
    app_env: str = Field(default="development", description="Application environment")
    app_host: str = Field(default="0.0.0.0", description="Server host")
    app_port: int = Field(default=8000, description="Server port")
    app_debug: bool = Field(default=True, description="Debug mode")

    # ============================================
    # Cohere Embeddings Configuration
    # ============================================
    cohere_api_key: str = Field(..., description="Cohere API key")
    cohere_embedding_model: str = Field(
        default="embed-english-v3.0", description="Cohere embedding model"
    )
    cohere_input_type: str = Field(
        default="search_document", description="Cohere input type for embeddings"
    )

    # ============================================
    # Gemini Chat Configuration
    # ============================================
    gemini_api_key: str = Field(..., description="Google Gemini API key")
    gemini_chat_model: str = Field(
        default="gemini-1.5-flash", description="Gemini chat model"
    )

    # ============================================
    # Qdrant Vector Database
    # ============================================
    qdrant_url: str = Field(..., description="Qdrant Cloud URL")
    qdrant_api_key: str = Field(..., description="Qdrant API key")
    qdrant_collection_name: str = Field(
        default="textbook_chunks", description="Qdrant collection name"
    )
    qdrant_vector_size: int = Field(
        default=1024, description="Vector dimensions (must match embedding model)"
    )

    # ============================================
    # Neon Postgres Database
    # ============================================
    neon_database_url: str = Field(..., description="Neon Postgres connection string")
    database_pool_size: int = Field(default=20, description="Connection pool size")
    database_max_overflow: int = Field(default=10, description="Max pool overflow")

    # ============================================
    # Upstash Redis (Rate Limiting)
    # ============================================
    upstash_redis_url: Optional[str] = Field(
        default=None, description="Upstash Redis URL"
    )
    upstash_redis_token: Optional[str] = Field(
        default=None, description="Upstash Redis token"
    )

    # ============================================
    # Rate Limiting
    # ============================================
    rate_limit_anonymous: int = Field(
        default=10, description="Requests per hour for anonymous users"
    )
    rate_limit_authenticated: int = Field(
        default=100, description="Requests per hour for authenticated users"
    )

    # ============================================
    # OAuth Configuration
    # ============================================
    github_client_id: Optional[str] = Field(default=None, description="GitHub OAuth client ID")
    github_client_secret: Optional[str] = Field(default=None, description="GitHub OAuth secret")
    github_redirect_uri: Optional[str] = Field(
        default="http://localhost:8000/api/v1/auth/github/callback",
        description="GitHub OAuth redirect URI",
    )

    google_client_id: Optional[str] = Field(default=None, description="Google OAuth client ID")
    google_client_secret: Optional[str] = Field(default=None, description="Google OAuth secret")
    google_redirect_uri: Optional[str] = Field(
        default="http://localhost:8000/api/v1/auth/google/callback",
        description="Google OAuth redirect URI",
    )

    # ============================================
    # Session Configuration
    # ============================================
    session_secret_key: str = Field(..., description="Secret key for session signing")
    session_cookie_name: str = Field(
        default="rag_chatbot_session", description="Session cookie name"
    )
    session_max_age: int = Field(
        default=2592000, description="Session max age in seconds (30 days)"
    )
    anonymous_session_expiry_hours: int = Field(
        default=24, description="Anonymous session expiry in hours"
    )

    # ============================================
    # Frontend Configuration
    # ============================================
    frontend_url: str = Field(
        default="http://localhost:3000",
        description="Frontend URL for OAuth redirects",
    )

    # ============================================
    # CORS Configuration
    # ============================================
    cors_origins: str = Field(
        default="http://localhost:3000,http://localhost:3001",
        description="Comma-separated CORS origins",
    )

    @field_validator("cors_origins")
    @classmethod
    def parse_cors_origins(cls, v: str) -> list[str]:
        """Parse comma-separated CORS origins into list"""
        return [origin.strip() for origin in v.split(",")]

    # ============================================
    # Sentry Monitoring
    # ============================================
    sentry_dsn: Optional[str] = Field(default=None, description="Sentry DSN")
    sentry_environment: str = Field(default="development", description="Sentry environment")
    sentry_traces_sample_rate: float = Field(
        default=0.1, description="Sentry traces sample rate"
    )

    # ============================================
    # RAG Pipeline Configuration
    # ============================================
    rag_top_k_candidates: int = Field(default=20, description="Initial retrieval count")
    rag_top_k_reranked: int = Field(default=10, description="After reranking")
    rag_top_k_final: int = Field(default=5, description="Final chunks for LLM")
    rag_similarity_threshold: float = Field(
        default=0.70, description="Minimum similarity threshold"
    )

    # ============================================
    # Chunking Configuration (for ingestion)
    # ============================================
    chunk_size_words: int = Field(default=750, description="Target chunk size in words")
    chunk_overlap_words: int = Field(default=100, description="Chunk overlap in words")
    chunk_min_size_words: int = Field(default=200, description="Minimum chunk size")
    chunk_max_size_words: int = Field(default=1000, description="Maximum chunk size")

    # ============================================
    # Response Configuration
    # ============================================
    response_temperature: float = Field(
        default=0.3, description="LLM temperature for grounding"
    )
    response_max_tokens: int = Field(
        default=1000, description="Maximum tokens in response"
    )
    response_timeout_seconds: int = Field(
        default=30, description="API call timeout in seconds"
    )

    # ============================================
    # Request Limits
    # ============================================
    max_message_length: int = Field(
        default=2000, description="Max message length in characters"
    )
    max_selected_text_length: int = Field(
        default=8000, description="Max selected text length in characters"
    )
    max_conversation_messages: int = Field(
        default=100, description="Max messages per conversation"
    )

    # ============================================
    # API Timeouts
    # ============================================
    api_timeout_seconds: int = Field(default=30, description="General API timeout")
    embedding_timeout_seconds: int = Field(default=10, description="Embedding API timeout")
    search_timeout_seconds: int = Field(default=5, description="Vector search timeout")

    # ============================================
    # Feature Flags
    # ============================================
    feature_general_knowledge_mode: bool = Field(
        default=True, description="Enable general knowledge mode"
    )
    feature_tone_control: bool = Field(default=True, description="Enable tone control")
    feature_key_term_highlighting: bool = Field(
        default=True, description="Enable key term highlighting"
    )
    feature_citation_navigation: bool = Field(
        default=True, description="Enable citation navigation"
    )

    # ============================================
    # Logging Configuration
    # ============================================
    log_level: str = Field(default="INFO", description="Logging level")
    log_format: str = Field(default="json", description="Log format: json or text")
    log_file_path: str = Field(default="logs/backend.log", description="Log file path")

    # ============================================
    # Admin Configuration
    # ============================================
    admin_api_key: Optional[str] = Field(
        default=None, description="Admin API key for ingestion endpoint"
    )
    admin_emails: str = Field(
        default="admin@example.com", description="Comma-separated admin emails"
    )

    @field_validator("admin_emails")
    @classmethod
    def parse_admin_emails(cls, v: str) -> list[str]:
        """Parse comma-separated admin emails into list"""
        return [email.strip() for email in v.split(",")]

    # ============================================
    # Development Tools
    # ============================================
    reload: bool = Field(default=True, description="Enable hot reload")
    log_sql_queries: bool = Field(default=False, description="Log SQL queries")
    show_error_traces: bool = Field(default=True, description="Show detailed error traces")

    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.app_env.lower() == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development"""
        return self.app_env.lower() == "development"

    @property
    def database_url(self) -> str:
        """Alias for neon_database_url"""
        return self.neon_database_url


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance
    Uses LRU cache to ensure settings are loaded only once
    """
    return Settings()


# Convenience export
settings = get_settings()
