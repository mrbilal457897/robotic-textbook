"""
Postgres Database Connection Pool
Provides connection pooling and query execution for Neon Postgres
"""

import os
from typing import Any, Dict, List, Optional, Tuple
from contextlib import contextmanager
import psycopg2
from psycopg2 import pool, extras, Error as PsycopgError
from psycopg2.extensions import connection, cursor
import logging

logger = logging.getLogger(__name__)


class PostgresPool:
    """Manages Postgres connection pool and provides query execution methods"""

    def __init__(self):
        """Initialize connection pool from environment variables"""
        self.database_url = os.getenv("NEON_DATABASE_URL")

        if not self.database_url:
            raise ValueError("NEON_DATABASE_URL environment variable not set")

        # Pool configuration
        self.pool_size = int(os.getenv("DATABASE_POOL_SIZE", "20"))
        self.max_overflow = int(os.getenv("DATABASE_MAX_OVERFLOW", "10"))

        self._pool: Optional[pool.ThreadedConnectionPool] = None
        self._initialize_pool()

    def _initialize_pool(self):
        """Create the connection pool"""
        try:
            self._pool = psycopg2.pool.ThreadedConnectionPool(
                minconn=1,
                maxconn=self.pool_size + self.max_overflow,
                dsn=self.database_url,
            )
            logger.info(
                f"Postgres connection pool initialized (size: {self.pool_size}, max_overflow: {self.max_overflow})"
            )
        except PsycopgError as e:
            logger.error(f"Failed to initialize Postgres connection pool: {e}")
            raise

    @contextmanager
    def get_connection(self) -> connection:
        """
        Context manager for getting a connection from the pool

        Yields:
            connection: Postgres connection

        Example:
            with db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM conversations")
        """
        if not self._pool:
            raise RuntimeError("Connection pool not initialized")

        conn = None
        try:
            conn = self._pool.getconn()
            yield conn
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            if conn:
                self._pool.putconn(conn)

    def execute_query(
        self,
        query: str,
        params: Optional[Tuple] = None,
        fetch_one: bool = False,
        fetch_all: bool = False,
        return_dict: bool = True,
    ) -> Optional[Any]:
        """
        Execute a SELECT query

        Args:
            query: SQL query string
            params: Query parameters
            fetch_one: Return single row
            fetch_all: Return all rows
            return_dict: Return rows as dictionaries (default: True)

        Returns:
            Query results (dict, list of dicts, or None)
        """
        with self.get_connection() as conn:
            cursor_factory = extras.RealDictCursor if return_dict else None
            cur = conn.cursor(cursor_factory=cursor_factory)

            try:
                cur.execute(query, params)

                if fetch_one:
                    result = cur.fetchone()
                    return dict(result) if result and return_dict else result
                elif fetch_all:
                    results = cur.fetchall()
                    return [dict(row) for row in results] if return_dict else results
                else:
                    return None

            finally:
                cur.close()

    def execute_insert(
        self, query: str, params: Optional[Tuple] = None, return_id: bool = True
    ) -> Optional[Any]:
        """
        Execute an INSERT query

        Args:
            query: SQL INSERT query
            params: Query parameters
            return_id: Return the inserted row's ID (expects RETURNING clause)

        Returns:
            Inserted row ID or None
        """
        with self.get_connection() as conn:
            cur = conn.cursor()

            try:
                cur.execute(query, params)

                if return_id:
                    result = cur.fetchone()
                    return result[0] if result else None
                return None

            finally:
                cur.close()

    def execute_update(self, query: str, params: Optional[Tuple] = None) -> int:
        """
        Execute an UPDATE query

        Args:
            query: SQL UPDATE query
            params: Query parameters

        Returns:
            Number of rows affected
        """
        with self.get_connection() as conn:
            cur = conn.cursor()

            try:
                cur.execute(query, params)
                return cur.rowcount

            finally:
                cur.close()

    def execute_delete(self, query: str, params: Optional[Tuple] = None) -> int:
        """
        Execute a DELETE query

        Args:
            query: SQL DELETE query
            params: Query parameters

        Returns:
            Number of rows deleted
        """
        with self.get_connection() as conn:
            cur = conn.cursor()

            try:
                cur.execute(query, params)
                return cur.rowcount

            finally:
                cur.close()

    def execute_batch(self, query: str, params_list: List[Tuple]) -> None:
        """
        Execute batch INSERT/UPDATE

        Args:
            query: SQL query
            params_list: List of parameter tuples

        Example:
            db.execute_batch(
                "INSERT INTO table (a, b) VALUES (%s, %s)",
                [(1, 2), (3, 4), (5, 6)]
            )
        """
        with self.get_connection() as conn:
            cur = conn.cursor()

            try:
                extras.execute_batch(cur, query, params_list)

            finally:
                cur.close()

    def close_pool(self):
        """Close all connections in the pool"""
        if self._pool:
            self._pool.closeall()
            logger.info("Postgres connection pool closed")


# Global database instance
_db_instance: Optional[PostgresPool] = None


def get_db() -> PostgresPool:
    """Get or create the global database instance"""
    global _db_instance
    if _db_instance is None:
        _db_instance = PostgresPool()
    return _db_instance


def close_db():
    """Close the global database instance"""
    global _db_instance
    if _db_instance:
        _db_instance.close_pool()
        _db_instance = None
