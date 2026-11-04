from typing import Annotated

from fastapi import Depends, Request, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import NO_STORE_HEADERS
from app.core.db import get_session
from app.core.errors import UnauthorizedError
from app.models.profile import Profile
from app.services import profiles as profiles_service

bearer_scheme = HTTPBearer(auto_error=False)

SessionDep = Annotated[AsyncSession, Depends(get_session)]


async def get_current_user(
    request: Request,
    response: Response,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    session: SessionDep,
) -> Profile:
    if credentials is None:
        raise UnauthorizedError
    user_id = await request.app.state.token_verifier.user_id_from(credentials.credentials)
    profile = await profiles_service.get_active_profile(session, user_id)
    # Personal data must not be stored by browsers or proxies.
    response.headers.update(NO_STORE_HEADERS)
    return profile


CurrentUser = Annotated[Profile, Depends(get_current_user)]
