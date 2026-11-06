import asyncio
import hashlib
import secrets
import uuid
from datetime import UTC, datetime, timedelta

import jwt
import structlog
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError
from jwt.exceptions import PyJWTError

from app.core.constants import (
    ACCESS_TOKEN_LIFETIME_SECONDS,
    JWT_ALGORITHM,
    JWT_AUDIENCE,
    JWT_CLOCK_SKEW_SECONDS,
    JWT_ISSUER,
    JWT_REQUIRED_CLAIMS,
    REFRESH_TOKEN_BYTES,
)
from app.core.errors import UnauthorizedError

logger = structlog.get_logger(__name__)

password_hasher = PasswordHasher()

# Checked when an email is unknown. It matches no password, because nobody knows this random one.
DUMMY_PASSWORD_HASH = password_hasher.hash(secrets.token_urlsafe(REFRESH_TOKEN_BYTES))


# Argon2 is slow on purpose, so it runs in a thread and other requests are not held up.
async def hash_password(password: str) -> str:
    return await asyncio.to_thread(password_hasher.hash, password)


async def password_matches(password: str, password_hash: str) -> bool:
    try:
        return await asyncio.to_thread(password_hasher.verify, password_hash, password)
    except VerificationError, InvalidHashError:
        return False


def new_refresh_token() -> str:
    return secrets.token_urlsafe(REFRESH_TOKEN_BYTES)


# SHA-256 is enough here because the token is long and random, unlike a password.
def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


class AccessTokens:
    """Creates and checks our access tokens. Only this backend holds the secret."""

    def __init__(self, secret: str) -> None:
        self.secret = secret

    def create(self, user_id: uuid.UUID) -> str:
        now = datetime.now(UTC)
        return jwt.encode(
            {
                "sub": str(user_id),
                "iss": JWT_ISSUER,
                "aud": JWT_AUDIENCE,
                "iat": now,
                "exp": now + timedelta(seconds=ACCESS_TOKEN_LIFETIME_SECONDS),
            },
            self.secret,
            algorithm=JWT_ALGORITHM,
        )

    def user_id_from(self, token: str) -> uuid.UUID:
        try:
            claims = jwt.decode(
                token,
                self.secret,
                algorithms=[JWT_ALGORITHM],
                audience=JWT_AUDIENCE,
                issuer=JWT_ISSUER,
                leeway=JWT_CLOCK_SKEW_SECONDS,
                options={"require": JWT_REQUIRED_CLAIMS},
            )
            return uuid.UUID(claims["sub"])
        except (PyJWTError, ValueError) as exc:
            logger.info("token_rejected", reason=type(exc).__name__)
            raise UnauthorizedError from exc
