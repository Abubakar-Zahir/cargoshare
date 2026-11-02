import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import RoleRequiredError, UnauthorizedError
from app.models.profile import Profile
from app.repos import profiles as profiles_repo


async def get_active_profile(session: AsyncSession, user_id: uuid.UUID) -> Profile:
    profile = await profiles_repo.get_by_id(session, user_id)
    if profile is None or not profile.is_active:
        raise UnauthorizedError
    return profile


async def update_profile(
    session: AsyncSession, profile: Profile, changes: dict[str, Any]
) -> Profile:
    is_traveler = changes.get("is_traveler", profile.is_traveler)
    is_sender = changes.get("is_sender", profile.is_sender)
    if not (is_traveler or is_sender):
        raise RoleRequiredError
    profiles_repo.apply_changes(profile, changes)
    await session.commit()
    return profile
