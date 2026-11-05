import uuid
from datetime import datetime

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth import Credential, RefreshToken


async def get_credential_for_update(session: AsyncSession, email: str) -> Credential | None:
    # The row stays locked until commit, so parallel guesses for one account wait in line
    # and cannot get past the limit on wrong tries.
    result = await session.execute(
        select(Credential).where(Credential.email == email).with_for_update()
    )
    return result.scalar_one_or_none()


async def get_refresh_token(session: AsyncSession, token_hash: str) -> RefreshToken | None:
    result = await session.execute(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    )
    return result.scalar_one_or_none()


async def delete_refresh_token(session: AsyncSession, token_hash: str) -> None:
    await session.execute(delete(RefreshToken).where(RefreshToken.token_hash == token_hash))


async def delete_expired_refresh_tokens(
    session: AsyncSession, user_id: uuid.UUID, now: datetime
) -> None:
    await session.execute(
        delete(RefreshToken).where(RefreshToken.user_id == user_id, RefreshToken.expires_at <= now)
    )


async def delete_all_refresh_tokens(session: AsyncSession, user_id: uuid.UUID) -> None:
    await session.execute(delete(RefreshToken).where(RefreshToken.user_id == user_id))
