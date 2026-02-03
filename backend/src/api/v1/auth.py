"""
Authentication API Endpoints
OAuth callbacks and session management
"""

from fastapi import APIRouter, Request, Response, HTTPException, status, Cookie
from fastapi.responses import RedirectResponse
from typing import Optional
import logging

from ...services.auth import get_auth_service
from ...db.postgres import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.get("/github/login")
async def github_login(request: Request, response: Response):
    """
    Initiate GitHub OAuth flow

    Returns:
        Redirect to GitHub authorization page
    """
    auth_service = get_auth_service()

    # Generate and store CSRF token
    csrf_token = auth_service.generate_csrf_token()

    # Store CSRF token in HTTPOnly cookie
    response = RedirectResponse(url=auth_service.get_github_oauth_url(csrf_token))
    response.set_cookie(
        key="oauth_state",
        value=csrf_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=600,  # 10 minutes
    )

    return response


@router.get("/github/callback")
async def github_callback(
    request: Request,
    code: str,
    state: str,
    oauth_state: Optional[str] = Cookie(None),
):
    """
    GitHub OAuth callback handler

    Args:
        code: Authorization code from GitHub
        state: CSRF protection token
        oauth_state: Stored CSRF token from cookie

    Returns:
        Redirect to frontend with session
    """
    auth_service = get_auth_service()

    # Validate CSRF token
    if not oauth_state or not auth_service.validate_csrf_token(state, oauth_state):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid state parameter"
        )

    # Exchange code for user info
    user_info = await auth_service.exchange_github_code(code)

    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="GitHub authentication failed",
        )

    # Create or get user from database
    db = get_db()
    user_id = await _get_or_create_user(db, user_info)

    # Create authenticated session
    session_data = auth_service.create_authenticated_session(user_id, "github")

    # Store session in database
    await _store_session(db, session_data)

    # Create response with session cookie
    frontend_url = request.url_for("root")
    response = RedirectResponse(url=str(frontend_url))

    response.set_cookie(
        key="session_id",
        value=session_data["session_id"],
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=auth_service.session_max_age,
    )

    # Clear OAuth state cookie
    response.delete_cookie("oauth_state")

    return response


@router.get("/google/login")
async def google_login(request: Request, response: Response):
    """
    Initiate Google OAuth flow

    Returns:
        Redirect to Google authorization page
    """
    auth_service = get_auth_service()

    # Generate and store CSRF token
    csrf_token = auth_service.generate_csrf_token()

    # Store CSRF token in HTTPOnly cookie
    response = RedirectResponse(url=auth_service.get_google_oauth_url(csrf_token))
    response.set_cookie(
        key="oauth_state",
        value=csrf_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=600,  # 10 minutes
    )

    return response


@router.get("/google/callback")
async def google_callback(
    request: Request,
    code: str,
    state: str,
    oauth_state: Optional[str] = Cookie(None),
):
    """
    Google OAuth callback handler

    Args:
        code: Authorization code from Google
        state: CSRF protection token
        oauth_state: Stored CSRF token from cookie

    Returns:
        Redirect to frontend with session
    """
    auth_service = get_auth_service()

    # Validate CSRF token
    if not oauth_state or not auth_service.validate_csrf_token(state, oauth_state):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid state parameter"
        )

    # Exchange code for user info
    user_info = await auth_service.exchange_google_code(code)

    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google authentication failed",
        )

    # Create or get user from database
    db = get_db()
    user_id = await _get_or_create_user(db, user_info)

    # Create authenticated session
    session_data = auth_service.create_authenticated_session(user_id, "google")

    # Store session in database
    await _store_session(db, session_data)

    # Create response with session cookie
    frontend_url = request.url_for("root")
    response = RedirectResponse(url=str(frontend_url))

    response.set_cookie(
        key="session_id",
        value=session_data["session_id"],
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=auth_service.session_max_age,
    )

    # Clear OAuth state cookie
    response.delete_cookie("oauth_state")

    return response


@router.post("/anonymous")
async def create_anonymous_session(response: Response):
    """
    Create anonymous session for unauthenticated users

    Returns:
        Session data
    """
    auth_service = get_auth_service()

    # Create anonymous session
    session_data = auth_service.create_anonymous_session()

    # Store session in database
    db = get_db()
    await _store_session(db, session_data)

    # Set session cookie
    response.set_cookie(
        key="session_id",
        value=session_data["session_id"],
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=auth_service.anonymous_expiry_hours * 3600,
    )

    return {
        "session_id": session_data["session_id"],
        "user_id": session_data["user_id"],
        "is_anonymous": True,
        "expires_at": session_data["expires_at"].isoformat(),
    }


@router.post("/logout")
async def logout(request: Request, response: Response):
    """
    Logout user and clear session

    Returns:
        Success message
    """
    session_id = request.cookies.get("session_id")

    if session_id:
        # Delete session from database
        db = get_db()
        await _delete_session(db, session_id)

    # Clear session cookie
    response.delete_cookie("session_id")

    return {"message": "Logged out successfully"}


# ============================================
# Helper Functions
# ============================================


async def _get_or_create_user(db, user_info: dict) -> str:
    """
    Get existing user or create new user

    Args:
        db: Database instance
        user_info: User info from OAuth provider

    Returns:
        User ID
    """
    # Check if user exists
    query = """
        SELECT id FROM users
        WHERE provider = %s AND provider_user_id = %s
    """
    existing_user = db.execute_query(
        query,
        (user_info["provider"], user_info["provider_user_id"]),
        fetch_one=True,
    )

    if existing_user:
        return str(existing_user["id"])

    # Create new user
    insert_query = """
        INSERT INTO users (provider, provider_user_id, email, name, avatar_url)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    """
    user_id = db.execute_insert(
        insert_query,
        (
            user_info["provider"],
            user_info["provider_user_id"],
            user_info.get("email"),
            user_info.get("name"),
            user_info.get("avatar_url"),
        ),
    )

    logger.info(f"Created new user: {user_id} via {user_info['provider']}")
    return str(user_id)


async def _store_session(db, session_data: dict):
    """
    Store session in database

    Args:
        db: Database instance
        session_data: Session data dict
    """
    query = """
        INSERT INTO sessions (session_id, user_id, is_anonymous, expires_at, created_at)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (session_id) DO UPDATE
        SET user_id = EXCLUDED.user_id,
            is_anonymous = EXCLUDED.is_anonymous,
            expires_at = EXCLUDED.expires_at
    """

    db.execute_insert(
        query,
        (
            session_data["session_id"],
            session_data["user_id"],
            session_data["is_anonymous"],
            session_data.get("expires_at"),
            session_data["created_at"],
        ),
        return_id=False,
    )


async def _delete_session(db, session_id: str):
    """
    Delete session from database

    Args:
        db: Database instance
        session_id: Session ID to delete
    """
    query = "DELETE FROM sessions WHERE session_id = %s"
    db.execute_delete(query, (session_id,))
