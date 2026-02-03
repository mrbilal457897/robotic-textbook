#!/usr/bin/env python3
"""
Database Migration Runner
Applies SQL migrations to Neon Postgres database

Usage:
    python backend/scripts/migrate-db.py
    python backend/scripts/migrate-db.py --rollback
    python backend/scripts/migrate-db.py --status
"""

import os
import sys
from pathlib import Path
import argparse
import psycopg2
from psycopg2 import sql
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Add parent directories to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Load .env
env_path = backend_dir / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip())


class MigrationRunner:
    """Manages database schema migrations"""

    def __init__(self):
        self.database_url = os.getenv("NEON_DATABASE_URL")
        if not self.database_url:
            raise ValueError("NEON_DATABASE_URL environment variable not set")

        self.migrations_dir = backend_dir / "db" / "migrations"
        if not self.migrations_dir.exists():
            raise FileNotFoundError(f"Migrations directory not found: {self.migrations_dir}")

        self.conn = None

    def connect(self):
        """Establish database connection"""
        try:
            self.conn = psycopg2.connect(self.database_url)
            logger.info("Connected to database")
        except psycopg2.Error as e:
            logger.error(f"Failed to connect to database: {e}")
            raise

    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            logger.info("Database connection closed")

    def ensure_migrations_table(self):
        """Create migrations tracking table if it doesn't exist"""
        query = """
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id SERIAL PRIMARY KEY,
            migration_name VARCHAR(255) NOT NULL UNIQUE,
            applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """
        cursor = self.conn.cursor()
        cursor.execute(query)
        self.conn.commit()
        cursor.close()
        logger.info("Ensured schema_migrations table exists")

    def get_applied_migrations(self) -> set:
        """Get set of already applied migrations"""
        cursor = self.conn.cursor()
        cursor.execute("SELECT migration_name FROM schema_migrations ORDER BY id")
        applied = {row[0] for row in cursor.fetchall()}
        cursor.close()
        return applied

    def get_migration_files(self) -> list:
        """Get list of migration files sorted by name"""
        migration_files = sorted(self.migrations_dir.glob("*.sql"))
        return migration_files

    def apply_migration(self, migration_file: Path) -> bool:
        """
        Apply a single migration file

        Args:
            migration_file: Path to SQL migration file

        Returns:
            True if successful
        """
        migration_name = migration_file.stem

        try:
            # Read migration SQL
            with open(migration_file, "r") as f:
                migration_sql = f.read()

            # Execute migration
            cursor = self.conn.cursor()
            cursor.execute(migration_sql)

            # Record migration
            cursor.execute(
                "INSERT INTO schema_migrations (migration_name) VALUES (%s)",
                (migration_name,),
            )

            self.conn.commit()
            cursor.close()

            logger.info(f"✓ Applied migration: {migration_name}")
            return True

        except psycopg2.Error as e:
            self.conn.rollback()
            logger.error(f"✗ Failed to apply migration {migration_name}: {e}")
            return False

    def run_migrations(self):
        """Run all pending migrations"""
        self.ensure_migrations_table()

        applied_migrations = self.get_applied_migrations()
        migration_files = self.get_migration_files()

        if not migration_files:
            logger.warning("No migration files found")
            return

        logger.info(f"Found {len(migration_files)} migration file(s)")
        logger.info(f"Already applied: {len(applied_migrations)} migration(s)")

        pending_migrations = [
            f for f in migration_files if f.stem not in applied_migrations
        ]

        if not pending_migrations:
            logger.info("All migrations are up to date!")
            return

        logger.info(f"Pending migrations: {len(pending_migrations)}")
        print()

        success_count = 0
        for migration_file in pending_migrations:
            if self.apply_migration(migration_file):
                success_count += 1
            else:
                logger.error("Migration failed - stopping")
                break

        print()
        logger.info(f"Applied {success_count}/{len(pending_migrations)} migrations")

    def show_status(self):
        """Show migration status"""
        self.ensure_migrations_table()

        applied_migrations = self.get_applied_migrations()
        migration_files = self.get_migration_files()

        print("\n" + "=" * 70)
        print("MIGRATION STATUS")
        print("=" * 70 + "\n")

        if not migration_files:
            print("No migration files found")
            return

        for migration_file in migration_files:
            migration_name = migration_file.stem
            status = "✓ APPLIED" if migration_name in applied_migrations else "⏸ PENDING"
            print(f"{status:12} {migration_name}")

        print()
        print(f"Total: {len(migration_files)} migrations")
        print(f"Applied: {len(applied_migrations)}")
        print(f"Pending: {len(migration_files) - len(applied_migrations)}")
        print()


def main():
    parser = argparse.ArgumentParser(description="Database migration runner")
    parser.add_argument(
        "--status", action="store_true", help="Show migration status without applying"
    )
    parser.add_argument(
        "--rollback", action="store_true", help="Rollback last migration (not implemented)"
    )

    args = parser.parse_args()

    runner = MigrationRunner()

    try:
        runner.connect()

        if args.status:
            runner.show_status()
        elif args.rollback:
            logger.error("Rollback not implemented yet")
            sys.exit(1)
        else:
            runner.run_migrations()

    except Exception as e:
        logger.error(f"Migration failed: {e}")
        sys.exit(1)
    finally:
        runner.close()


if __name__ == "__main__":
    main()
