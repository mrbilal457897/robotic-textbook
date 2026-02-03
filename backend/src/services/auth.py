"""
Authentication Service
Handles OAuth (GitHub, Google), session management, and anonymous sessions
"""

import os
import secrets
import httpx
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from uuid import uuid4
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """Manages OAuth authentication and session creation"""

    def __init__(self):
        # GitHub OAuth configuration
        self.github_client_id = os.getenv("GITHUB_CLIENT_ID")
        self.github_client_secret = os.getenv("GITHUB_CLIENT_SECRET")
        self.github_redirect_uri = os.getenv("GITHUB_REDIRECT_URI")

        # Google OAuth configuration
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID")
        self.google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        self.google_redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")

        # Session configuration
        self.session_secret = os.getenv("SESSION_SECRET_KEY")
        self.session_max_age = int(os.getenv("SESSION_MAX_AGE", "2592000"))  # 30 days
        self.anonymous_expiry_hours = int(
            os.getenv("ANONYMOUS_SESSION_EXPIRY_HOURS", "24")
        )

        if not self.session_secret:
            logger.warning("SESSION_SECRET_KEY not set - using random secret")
            self.session_secret = secrets.token_urlsafe(32)

    # ============================================
    # GitHub OAuth
    # ============================================

    def get_github_oauth_url(self, state: str) -> str:
        """
        Generate GitHub OAuth authorization URL

        Args:
            state: CSRF protection state token

        Returns:
            Authorization URL
        """
        params = {
            "client_id": self.github_client_id,
            "redirect_uri": self.github_redirect_uri,
            "state": state,
            "scope": "user:email",
        }

        query = "&".join(f"{k}={v}" for k, v in params.items())
        return f"https://github.com/login/oauth/authorize?{query}"

    async def exchange_github_code(self, code: str) -> Optional[Dict[str, Any]]:
        """
        Exchange GitHub OAuth code for access token

        Args:
            code: Authorization code from GitHub callback

        Returns:
            User info dict or None if failed
        """
        if not self.github_client_id or not self.github_client_secret:
            logger.error("GitHub OAuth not configured")
            return None

        try:
            # Exchange code for access token
            async with httpx.AsyncClient() as client:
                token_response = await client.post(
                    "https://github.com/login/oauth/access_token",
                    data={
                        "client_id": self.github_client_id,
                        "client_secret": self.github_client_secret,
                        "code": code,
                        "redirect_uri": self.github_redirect_uri,
                    },
                    headers={"Accept": "application/json"},
                )

                token_data = token_response.json()
                access_token = token_data.get("access_token")

                if not access_token:
                    logger.error(f"GitHub token exchange failed: {token_data}")
                    return None

                # Fetch user info
                user_response = await client.get(
                    "https://api.github.com/user",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Accept": "application/json",
                    },
                )

                user_data = user_response.json()

                # Fetch user email (primary verified email)
                email_response = await client.get(
                    "https://api.github.com/user/emails",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Accept": "application/json",
                    },
                )

                emails = email_response.json()
                primary_email = next(
                    (e["email"] for e in emails if e["primary"] and e["verified"]),
                    None,
                )

                return {
                    "provider": "github",
                    "provider_user_id": str(user_data["id"]),
                    "email": primary_email or user_data.get("email"),
                    "name": user_data.get("name") or user_data.get("login"),
                    "avatar_url": user_data.get("avatar_url"),
                }

        except Exception as e:
            logger.error(f"GitHub OAuth failed: {e}")
            return None

    # ============================================
    # Google OAuth
    # ============================================

    def get_google_oauth_url(self, state: str) -> str:
        """
        Generate Google OAuth authorization URL

        Args:
            state: CSRF protection state token

        Returns:
            Authorization URL
        """
        params = {
            "client_id": self.google_client_id,
            "redirect_uri": self.google_redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",
        }

        query = "&".join(f"{k}={v}" for k, v in params.items())
        return f"https://accounts.google.com/o/oauth2/v2/auth?{query}"

    async def exchange_google_code(self, code: str) -> Optional[Dict[str, Any]]:
        """
        Exchange Google OAuth code for access token

        Args:
            code: Authorization code from Google callback

        Returns:
            User info dict or None if failed
        """
        if not self.google_client_id or not self.google_client_secret:
            logger.error("Google OAuth not configured")
            return None

        try:
            async with httpx.AsyncClient() as client:
                # Exchange code for access token
                token_response = await client.post(
                    "https://oauth2.googleapis.com/token",
                    data={
                        "client_id": self.google_client_id,
                        "client_secret": self.google_client_secret,
                        "code": code,
                        "grant_type": "authorization_code",
                        "redirect_uri": self.google_redirect_uri,
                    },
                )

                token_data = token_response.json()
                access_token = token_data.get("access_token")

                if not access_token:
                    logger.error(f"Google token exchange failed: {token_data}")
                    return None

                # Fetch user info
                user_response = await client.get(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"},
                )

                user_data = user_response.json()

                return {
                    "provider": "google",
                    "provider_user_id": user_data["id"],
                    "email": user_data.get("email"),
                    "name": user_data.get("name"),
                    "avatar_url": user_data.get("picture"),
                }

        except Exception as e:
            logger.error(f"Google OAuth failed: {e}")
            return None

    # ============================================
    # Session Management
    # ============================================

    def create_session_token(self) -> str:
        """
        Generate a secure session token

        Returns:
            URL-safe session token
        """
        return secrets.token_urlsafe(32)

    def create_anonymous_session(self) -> Dict[str, Any]:
        """
        Create an anonymous session for unauthenticated users

        Returns:
            Session data dict
        """
        session_id = str(uuid4())
        user_id = str(uuid4())
        expires_at = datetime.utcnow() + timedelta(hours=self.anonymous_expiry_hours)

        return {
            "session_id": session_id,
            "user_id": user_id,
            "is_anonymous": True,
            "expires_at": expires_at,
            "created_at": datetime.utcnow(),
        }

    def create_authenticated_session(
        self, user_id: str, provider: str
    ) -> Dict[str, Any]:
        """
        Create a session for authenticated users

        Args:
            user_id: User ID from database
            provider: OAuth provider (github, google)

        Returns:
            Session data dict
        """
        session_id = str(uuid4())

        return {
            "session_id": session_id,
            "user_id": user_id,
            "is_anonymous": False,
            "provider": provider,
            "expires_at": None,  # Authenticated sessions don't expire
            "created_at": datetime.utcnow(),
        }

    def generate_csrf_token(self) -> str:
        """
        Generate CSRF token for OAuth state parameter

        Returns:
            CSRF token
        """
        return secrets.token_urlsafe(32)

    def validate_csrf_token(self, token: str, stored_token: str) -> bool:
        """
        Validate CSRF token

        Args:
            token: Token from callback
            stored_token: Token stored in session/cookie

        Returns:
            True if valid
        """
        return secrets.compare_digest(token, stored_token)


# Global auth service instance
_auth_service: Optional[AuthService] = None


def get_auth_service() -> AuthService:
    """Get or create the global auth service instance"""
    global _auth_service
    if _auth_service is None:
        _auth_service = AuthService()
    return _auth_service
