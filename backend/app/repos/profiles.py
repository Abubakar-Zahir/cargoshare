import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile


async def get_by_id(session: AsyncSession, user_id: uuid.UUID) -> Profile | None:
    return await session.get(Profile, user_id)


def apply_changes(profile: Profile, changes: dict[str, Any]) -> None:
    for field, value in changes.items():
        setattr(profile, field, value)
