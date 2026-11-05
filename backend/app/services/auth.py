import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import (
    ACCESS_TOKEN_LIFETIME_SECONDS,
    LOCK_MINUTES,
    MAX_FAILED_ATTEMPTS,
    REFRESH_TOKEN_LIFETIME_SECONDS,
    USERNAME_UNIQUE_CONSTRAINT,
)
from app.core.errors import (
    EmailTakenError,
    InvalidCredentialsError,
    ResetRefusedError,
    RoleRequiredError,
    UnauthorizedError,
    UsernameTakenError,
)
from app.core.security import (
    DUMMY_PASSWORD_HASH,
    AccessTokens,
    hash_password,
    hash_refresh_token,
    new_refresh_token,
    password_matches,
)
from app.models.auth import Credential, RefreshToken
from app.models.profile import Profile
from app.repos import auth as auth_repo
from app.repos import profiles as profiles_repo
from app.schemas.auth import (
    AccessTokenResponse,
    LoginRequest,
    ResetPasswordRequest,
    SignupRequest,
    TokenPairResponse,
)
from app.services import profiles as profiles_service


def _now() -> datetime:
    return datetime.now(UTC)


def _is_locked(credential: Credential) -> bool:
    return credential.locked_until is not None and credential.locked_until > _now()


async def _record_failure(session: AsyncSession, credential: Credential) -> None:
    credential.failed_attempts += 1
    if credential.failed_attempts >= MAX_FAILED_ATTEMPTS:
        credential.failed_attempts = 0
        credential.locked_until = _now() + timedelta(minutes=LOCK_MINUTES)
    await session.commit()


def _clear_failures(credential: Credential) -> None:
    credential.failed_attempts = 0
    credential.locked_until = None


def _issue_tokens(
    session: AsyncSession, tokens: AccessTokens, user_id: uuid.UUID
) -> TokenPairResponse:
    refresh_token = new_refresh_token()
    session.add(
        RefreshToken(
            user_id=user_id,
            token_hash=hash_refresh_token(refresh_token),
            expires_at=_now() + timedelta(seconds=REFRESH_TOKEN_LIFETIME_SECONDS),
        )
    )
    return TokenPairResponse(
        access_token=tokens.create(user_id),
        access_expires_in=ACCESS_TOKEN_LIFETIME_SECONDS,
        refresh_token=refresh_token,
        refresh_expires_in=REFRESH_TOKEN_LIFETIME_SECONDS,
    )


async def sign_up(
    session: AsyncSession, tokens: AccessTokens, details: SignupRequest
) -> TokenPairResponse:
    if not (details.is_traveler or details.is_sender):
        raise RoleRequiredError
    password_hash = await hash_password(details.password)
    try:
        profile = Profile(
            username=details.username,
            is_traveler=details.is_traveler,
            is_sender=details.is_sender,
        )
        session.add(profile)
        await session.flush()
        session.add(
            Credential(
                user_id=profile.id,
                email=details.email,
                password_hash=password_hash,
                date_of_birth=details.date_of_birth,
            )
        )
        pair = _issue_tokens(session, tokens, profile.id)
        await session.commit()
    except IntegrityError as exc:
        # The database decides, so two people signing up at once cannot get the same name.
        await session.rollback()
        if USERNAME_UNIQUE_CONSTRAINT in str(exc.orig):
            raise UsernameTakenError from exc
        raise EmailTakenError from exc
    return pair


async def log_in(
    session: AsyncSession, tokens: AccessTokens, details: LoginRequest
) -> TokenPairResponse:
    credential = await auth_repo.get_credential_for_update(session, details.email)
    if credential is None:
        # Takes as long as a real check, so timing does not reveal which emails have accounts.
        await password_matches(details.password, DUMMY_PASSWORD_HASH)
        raise InvalidCredentialsError

    is_correct = await password_matches(details.password, credential.password_hash)
    if _is_locked(credential):
        raise InvalidCredentialsError
    if not is_correct:
        await _record_failure(session, credential)
        raise InvalidCredentialsError

    profile = await profiles_repo.get_by_id(session, credential.user_id)
    if profile is None or not profile.is_active:
        raise InvalidCredentialsError

    _clear_failures(credential)
    await auth_repo.delete_expired_refresh_tokens(session, credential.user_id, _now())
    pair = _issue_tokens(session, tokens, credential.user_id)
    await session.commit()
    return pair


async def refresh(
    session: AsyncSession, tokens: AccessTokens, refresh_token: str
) -> AccessTokenResponse:
    stored = await auth_repo.get_refresh_token(session, hash_refresh_token(refresh_token))
    if stored is None or stored.expires_at <= _now():
        raise UnauthorizedError
    await profiles_service.get_active_profile(session, stored.user_id)
    return AccessTokenResponse(
        access_token=tokens.create(stored.user_id),
        access_expires_in=ACCESS_TOKEN_LIFETIME_SECONDS,
    )


async def log_out(session: AsyncSession, refresh_token: str) -> None:
    await auth_repo.delete_refresh_token(session, hash_refresh_token(refresh_token))
    await session.commit()


async def reset_password(session: AsyncSession, details: ResetPasswordRequest) -> None:
    credential = await auth_repo.get_credential_for_update(session, details.email)
    if credential is None or _is_locked(credential):
        raise ResetRefusedError
    if credential.date_of_birth != details.date_of_birth:
        await _record_failure(session, credential)
        raise ResetRefusedError

    credential.password_hash = await hash_password(details.new_password)
    _clear_failures(credential)
    # Signs out every device: whoever had the old password can no longer stay logged in.
    await auth_repo.delete_all_refresh_tokens(session, credential.user_id)
    await session.commit()
