from typing import Any

from fastapi import APIRouter, Depends, Response, status

from app.api.deps import AccessTokensDep, SessionDep
from app.core.constants import NO_STORE_HEADERS
from app.core.errors import ErrorEnvelope
from app.schemas.auth import (
    AccessTokenResponse,
    LoginRequest,
    RefreshRequest,
    ResetPasswordRequest,
    SignupRequest,
    TokenPairResponse,
)
from app.services import auth as auth_service


def _no_store(response: Response) -> None:
    # Tokens must not be stored by browsers or proxies.
    response.headers.update(NO_STORE_HEADERS)


INVALID: dict[int | str, dict[str, Any]] = {
    422: {"model": ErrorEnvelope, "description": "Invalid fields"}
}

router = APIRouter(
    prefix="/auth", tags=["auth"], responses=INVALID, dependencies=[Depends(_no_store)]
)


@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
    summary="Create an account and sign in",
    responses={409: {"model": ErrorEnvelope, "description": "Username or email already used"}},
)
async def sign_up(
    details: SignupRequest, session: SessionDep, tokens: AccessTokensDep
) -> TokenPairResponse:
    return await auth_service.sign_up(session, tokens, details)


@router.post(
    "/login",
    summary="Sign in with email and password",
    responses={401: {"model": ErrorEnvelope, "description": "Wrong email or password"}},
)
async def log_in(
    details: LoginRequest, session: SessionDep, tokens: AccessTokensDep
) -> TokenPairResponse:
    return await auth_service.log_in(session, tokens, details)


@router.post(
    "/refresh",
    summary="Get a new access token",
    responses={401: {"model": ErrorEnvelope, "description": "Refresh token not valid"}},
)
async def refresh(
    details: RefreshRequest, session: SessionDep, tokens: AccessTokensDep
) -> AccessTokenResponse:
    return await auth_service.refresh(session, tokens, details.refresh_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT, summary="End this device's sign-in")
async def log_out(details: RefreshRequest, session: SessionDep) -> None:
    await auth_service.log_out(session, details.refresh_token)


@router.post(
    "/reset-password",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Set a new password using the email and date of birth",
    responses={400: {"model": ErrorEnvelope, "description": "Details do not match"}},
)
async def reset_password(details: ResetPasswordRequest, session: SessionDep) -> None:
    await auth_service.reset_password(session, details)
