import asyncio
import uuid

import jwt
import structlog
from jwt import PyJWKClient
from jwt.exceptions import PyJWKClientConnectionError, PyJWTError

from app.core.constants import (
    JWKS_CACHE_SECONDS,
    JWKS_TIMEOUT_SECONDS,
    JWT_ALGORITHMS,
    JWT_AUDIENCE,
    JWT_CLOCK_SKEW_SECONDS,
    JWT_REQUIRED_CLAIMS,
    JWT_ROLE,
)
from app.core.errors import ServiceUnavailableError, UnauthorizedError

logger = structlog.get_logger(__name__)


class TokenVerifier:
    """Checks Supabase access tokens against the project's public signing keys."""

    def __init__(self, supabase_url: str) -> None:
        self.issuer = f"{supabase_url}/auth/v1"
        self.keys = PyJWKClient(
            f"{self.issuer}/.well-known/jwks.json",
            lifespan=JWKS_CACHE_SECONDS,
            timeout=JWKS_TIMEOUT_SECONDS,
        )

    async def user_id_from(self, token: str) -> uuid.UUID:
        try:
            # Fetching keys can use the network, so it must not block other requests.
            key = await asyncio.to_thread(self.keys.get_signing_key_from_jwt, token)
            claims = jwt.decode(
                token,
                key.key,
                algorithms=JWT_ALGORITHMS,
                audience=JWT_AUDIENCE,
                issuer=self.issuer,
                leeway=JWT_CLOCK_SKEW_SECONDS,
                options={"require": JWT_REQUIRED_CLAIMS},
            )
            if claims.get("role") != JWT_ROLE:
                raise UnauthorizedError
            return uuid.UUID(claims["sub"])
        except PyJWKClientConnectionError as exc:
            raise ServiceUnavailableError("Sign-in could not be checked right now.") from exc
        except (PyJWTError, ValueError) as exc:
            logger.info("token_rejected", reason=type(exc).__name__)
            raise UnauthorizedError from exc
