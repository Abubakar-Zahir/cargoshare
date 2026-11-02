from typing import Any

from fastapi import APIRouter

from app.api.deps import CurrentUser, SessionDep
from app.core.errors import ErrorEnvelope
from app.schemas.profile import ProfileResponse, ProfileUpdate
from app.services import profiles as profiles_service

UNAUTHORIZED: dict[int | str, dict[str, Any]] = {
    401: {"model": ErrorEnvelope, "description": "Missing or invalid sign-in"}
}

router = APIRouter(prefix="/me", tags=["me"], responses=UNAUTHORIZED)


@router.get("", summary="The signed-in user's profile")
async def read_me(user: CurrentUser) -> ProfileResponse:
    return ProfileResponse.model_validate(user)


@router.patch(
    "",
    summary="Change the signed-in user's display name or roles",
    responses={422: {"model": ErrorEnvelope, "description": "Invalid fields"}},
)
async def update_me(
    changes: ProfileUpdate, user: CurrentUser, session: SessionDep
) -> ProfileResponse:
    profile = await profiles_service.update_profile(
        session, user, changes.model_dump(exclude_unset=True)
    )
    return ProfileResponse.model_validate(profile)
