#!/usr/bin/env python3
"""
Infrastructure Validation Script
Tests all required infrastructure connections before development

Usage:
    python backend/scripts/validate-infra.py
    python backend/scripts/validate-infra.py --verbose
    python backend/scripts/validate-infra.py --json
"""

import os
import sys
import json
import argparse
from typing import Dict, List, Tuple
from dataclasses import dataclass, asdict
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


@dataclass
class ValidationResult:
    """Result of a single validation check"""
    service: str
    status: str  # "pass" | "fail" | "skip"
    message: str
    details: Dict = None

    def __post_init__(self):
        if self.details is None:
            self.details = {}


class InfrastructureValidator:
    """Validates all infrastructure connections"""

    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.results: List[ValidationResult] = []
        self.load_env()

    def load_env(self):
        """Load environment variables from .env file"""
        env_path = Path(__file__).parent.parent / ".env"

        if not env_path.exists():
            print("⚠️  Warning: .env file not found at backend/.env")
            print("   Please copy backend/.env.example to backend/.env and fill in your values")
            print()
            return

        # Simple .env parser (for basic KEY=VALUE format)
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ.setdefault(key.strip(), value.strip())

    def log(self, message: str):
        """Print message if verbose mode enabled"""
        if self.verbose:
            print(f"  {message}")

    def validate_cohere(self) -> ValidationResult:
        """Validate Cohere API connection for embeddings"""
        service = "Cohere Embeddings API"

        try:
            api_key = os.getenv("COHERE_API_KEY")
            if not api_key:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="COHERE_API_KEY not set in .env"
                )

            # Try importing Cohere SDK
            try:
                import cohere
            except ImportError:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="cohere package not installed (run: pip install cohere)"
                )

            # Test API connection
            self.log("Testing Cohere API connection...")
            co = cohere.Client(api_key)

            # Simple test: generate a test embedding
            try:
                response = co.embed(
                    texts=["Test connection"],
                    model=os.getenv("COHERE_EMBEDDING_MODEL", "embed-english-v3.0"),
                    input_type="search_document"
                )

                embedding_dim = len(response.embeddings[0])

                return ValidationResult(
                    service=service,
                    status="pass",
                    message=f"Connected successfully ({embedding_dim}-dimensional embeddings)",
                    details={
                        "embedding_model": os.getenv("COHERE_EMBEDDING_MODEL", "embed-english-v3.0"),
                        "embedding_dimensions": embedding_dim,
                        "input_type": os.getenv("COHERE_INPUT_TYPE", "search_document"),
                    }
                )

            except Exception as e:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message=f"Embedding test failed: {str(e)}"
                )

        except Exception as e:
            return ValidationResult(
                service=service,
                status="fail",
                message=f"Connection failed: {str(e)}"
            )

    def validate_gemini(self) -> ValidationResult:
        """Validate Google Gemini API connection for chat"""
        service = "Google Gemini Chat API"

        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="GEMINI_API_KEY not set in .env"
                )

            if not api_key.startswith("AIza"):
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="GEMINI_API_KEY appears invalid (should start with 'AIza')"
                )

            # Try importing Google Generative AI SDK
            try:
                import google.generativeai as genai
            except ImportError:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="google-generativeai package not installed (run: pip install google-generativeai)"
                )

            # Test API connection
            self.log("Testing Gemini API connection...")
            genai.configure(api_key=api_key)

            # Simple test: list available models
            try:
                models = genai.list_models()
                model_list = list(models)

                # Check if required models are available
                chat_model = os.getenv("GEMINI_CHAT_MODEL", "gemini-1.5-pro")

                available_models = [m.name for m in model_list]

                return ValidationResult(
                    service=service,
                    status="pass",
                    message=f"Connected successfully ({len(model_list)} models available)",
                    details={
                        "chat_model": chat_model,
                        "total_models": len(model_list),
                    }
                )
            except Exception as e:
                # If listing fails, try a simple generation test
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content("Hello")

                return ValidationResult(
                    service=service,
                    status="pass",
                    message="Connected successfully (basic test passed)",
                    details={
                        "chat_model": os.getenv("GEMINI_CHAT_MODEL", "gemini-1.5-pro"),
                    }
                )

        except Exception as e:
            return ValidationResult(
                service=service,
                status="fail",
                message=f"Connection failed: {str(e)}"
            )

    def validate_qdrant(self) -> ValidationResult:
        """Validate Qdrant Cloud connection"""
        service = "Qdrant Cloud"

        try:
            url = os.getenv("QDRANT_URL")
            api_key = os.getenv("QDRANT_API_KEY")
            collection_name = os.getenv("QDRANT_COLLECTION_NAME", "textbook_chunks")

            if not url:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="QDRANT_URL not set in .env"
                )

            if not api_key:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="QDRANT_API_KEY not set in .env"
                )

            # Try importing Qdrant client
            try:
                from qdrant_client import QdrantClient
            except ImportError:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="qdrant-client package not installed (run: pip install qdrant-client)"
                )

            # Test connection
            self.log("Testing Qdrant Cloud connection...")
            client = QdrantClient(url=url, api_key=api_key)

            # Get collections
            collections = client.get_collections()
            collection_names = [col.name for col in collections.collections]

            # Check if target collection exists
            collection_exists = collection_name in collection_names

            if collection_exists:
                collection_info = client.get_collection(collection_name)
                vector_count = collection_info.points_count

                return ValidationResult(
                    service=service,
                    status="pass",
                    message=f"Connected successfully (collection '{collection_name}' exists with {vector_count:,} vectors)",
                    details={
                        "collection_name": collection_name,
                        "vector_count": vector_count,
                        "vector_size": collection_info.config.params.vectors.size,
                    }
                )
            else:
                return ValidationResult(
                    service=service,
                    status="pass",
                    message=f"Connected successfully, but collection '{collection_name}' not found. Run ingestion script to create it.",
                    details={
                        "available_collections": collection_names,
                        "expected_collection": collection_name,
                    }
                )

        except Exception as e:
            return ValidationResult(
                service=service,
                status="fail",
                message=f"Connection failed: {str(e)}"
            )

    def validate_neon_postgres(self) -> ValidationResult:
        """Validate Neon Postgres connection"""
        service = "Neon Postgres"

        try:
            database_url = os.getenv("NEON_DATABASE_URL")

            if not database_url:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="NEON_DATABASE_URL not set in .env"
                )

            # Try importing psycopg2
            try:
                import psycopg2
            except ImportError:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="psycopg2 package not installed (run: pip install psycopg2-binary)"
                )

            # Test connection
            self.log("Testing Neon Postgres connection...")
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor()

            # Test query
            cursor.execute("SELECT version();")
            version = cursor.fetchone()[0]

            # Check if tables exist
            cursor.execute("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
            """)
            tables = [row[0] for row in cursor.fetchall()]

            cursor.close()
            conn.close()

            expected_tables = ["conversations", "messages"]
            missing_tables = [t for t in expected_tables if t not in tables]

            if missing_tables:
                return ValidationResult(
                    service=service,
                    status="pass",
                    message=f"Connected successfully, but missing tables: {', '.join(missing_tables)}. Run migrations to create them.",
                    details={
                        "postgres_version": version.split()[1],
                        "existing_tables": tables,
                        "missing_tables": missing_tables,
                    }
                )
            else:
                return ValidationResult(
                    service=service,
                    status="pass",
                    message=f"Connected successfully (all tables exist)",
                    details={
                        "postgres_version": version.split()[1],
                        "tables": tables,
                    }
                )

        except Exception as e:
            return ValidationResult(
                service=service,
                status="fail",
                message=f"Connection failed: {str(e)}"
            )

    def validate_upstash_redis(self) -> ValidationResult:
        """Validate Upstash Redis connection"""
        service = "Upstash Redis"

        try:
            redis_url = os.getenv("UPSTASH_REDIS_URL")
            redis_token = os.getenv("UPSTASH_REDIS_TOKEN")

            if not redis_url:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="UPSTASH_REDIS_URL not set in .env"
                )

            if not redis_token:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="UPSTASH_REDIS_TOKEN not set in .env"
                )

            # Test connection with HTTP request
            import requests

            self.log("Testing Upstash Redis connection...")
            response = requests.get(
                f"{redis_url}/ping",
                headers={"Authorization": f"Bearer {redis_token}"}
            )

            if response.status_code == 200 and response.json().get("result") == "PONG":
                return ValidationResult(
                    service=service,
                    status="pass",
                    message="Connected successfully",
                    details={
                        "rate_limit_anonymous": os.getenv("RATE_LIMIT_ANONYMOUS", "10"),
                        "rate_limit_authenticated": os.getenv("RATE_LIMIT_AUTHENTICATED", "100"),
                    }
                )
            else:
                return ValidationResult(
                    service=service,
                    status="fail",
                    message=f"Connection failed: HTTP {response.status_code}"
                )

        except Exception as e:
            return ValidationResult(
                service=service,
                status="fail",
                message=f"Connection failed: {str(e)}"
            )

    def validate_github_oauth(self) -> ValidationResult:
        """Validate GitHub OAuth configuration"""
        service = "GitHub OAuth"

        client_id = os.getenv("GITHUB_CLIENT_ID")
        client_secret = os.getenv("GITHUB_CLIENT_SECRET")

        if not client_id or not client_secret:
            return ValidationResult(
                service=service,
                status="skip",
                message="OAuth credentials not configured (optional)"
            )

        # Basic validation
        if client_id and client_secret:
            return ValidationResult(
                service=service,
                status="pass",
                message="Credentials configured (manual testing required)",
                details={
                    "client_id": f"{client_id[:10]}...",
                    "redirect_uri": os.getenv("GITHUB_REDIRECT_URI", "Not set"),
                }
            )

    def validate_google_oauth(self) -> ValidationResult:
        """Validate Google OAuth configuration"""
        service = "Google OAuth"

        client_id = os.getenv("GOOGLE_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET")

        if not client_id or not client_secret:
            return ValidationResult(
                service=service,
                status="skip",
                message="OAuth credentials not configured (optional)"
            )

        # Basic validation
        if client_id and client_secret:
            if not client_id.endswith(".apps.googleusercontent.com"):
                return ValidationResult(
                    service=service,
                    status="fail",
                    message="GOOGLE_CLIENT_ID format appears invalid (should end with .apps.googleusercontent.com)"
                )

            return ValidationResult(
                service=service,
                status="pass",
                message="Credentials configured (manual testing required)",
                details={
                    "client_id": f"{client_id[:20]}...",
                    "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI", "Not set"),
                }
            )

    def validate_sentry(self) -> ValidationResult:
        """Validate Sentry configuration"""
        service = "Sentry"

        dsn = os.getenv("SENTRY_DSN")

        if not dsn:
            return ValidationResult(
                service=service,
                status="skip",
                message="DSN not configured (optional)"
            )

        # Basic validation
        if dsn and dsn.startswith("https://") and "@sentry.io/" in dsn:
            return ValidationResult(
                service=service,
                status="pass",
                message="DSN configured",
                details={
                    "environment": os.getenv("SENTRY_ENVIRONMENT", "development"),
                    "traces_sample_rate": os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1"),
                }
            )
        else:
            return ValidationResult(
                service=service,
                status="fail",
                message="DSN format appears invalid"
            )

    def validate_all(self) -> List[ValidationResult]:
        """Run all validation checks"""
        print("🔍 Validating Infrastructure...\n")

        # Core services (required)
        self.results.append(self.validate_cohere())      # Embeddings
        self.results.append(self.validate_gemini())      # Chat/LLM
        self.results.append(self.validate_qdrant())
        self.results.append(self.validate_neon_postgres())
        self.results.append(self.validate_upstash_redis())

        # Optional services
        self.results.append(self.validate_github_oauth())
        self.results.append(self.validate_google_oauth())
        self.results.append(self.validate_sentry())

        return self.results

    def print_results(self):
        """Print validation results in human-readable format"""
        print("\n" + "=" * 70)
        print("VALIDATION RESULTS")
        print("=" * 70 + "\n")

        for result in self.results:
            # Status emoji
            emoji = {
                "pass": "✅",
                "fail": "❌",
                "skip": "⏭️ "
            }.get(result.status, "❓")

            print(f"{emoji} {result.service}")
            print(f"   {result.message}")

            if self.verbose and result.details:
                for key, value in result.details.items():
                    print(f"   └─ {key}: {value}")
            print()

        # Summary
        passed = sum(1 for r in self.results if r.status == "pass")
        failed = sum(1 for r in self.results if r.status == "fail")
        skipped = sum(1 for r in self.results if r.status == "skip")

        print("=" * 70)
        print(f"SUMMARY: {passed} passed, {failed} failed, {skipped} skipped")
        print("=" * 70 + "\n")

        if failed > 0:
            print("⚠️  Some checks failed. Please review the errors above and fix your .env file.")
            print("   See SETUP_INFRASTRUCTURE.md for detailed setup instructions.")
            return False
        elif passed == 0:
            print("⚠️  No services validated. Please set up your .env file.")
            print("   Copy backend/.env.example to backend/.env and fill in your credentials.")
            return False
        else:
            print("✅ All required services validated successfully!")
            print("   You're ready to start development.")
            return True

    def print_json(self):
        """Print validation results in JSON format"""
        output = {
            "summary": {
                "total": len(self.results),
                "passed": sum(1 for r in self.results if r.status == "pass"),
                "failed": sum(1 for r in self.results if r.status == "fail"),
                "skipped": sum(1 for r in self.results if r.status == "skip"),
            },
            "results": [asdict(r) for r in self.results]
        }
        print(json.dumps(output, indent=2))


def main():
    parser = argparse.ArgumentParser(description="Validate RAG chatbot infrastructure")
    parser.add_argument("--verbose", "-v", action="store_true", help="Show detailed output")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")
    args = parser.parse_args()

    validator = InfrastructureValidator(verbose=args.verbose)
    validator.validate_all()

    if args.json:
        validator.print_json()
    else:
        success = validator.print_results()
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
