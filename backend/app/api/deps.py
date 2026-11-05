from typing import Annotated

from fastapi import Depends, Request, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import NO_STORE_HEADERS
from app.core.db import get_session
from app.core.errors import UnauthorizedError
from app.core.security import AccessTokens
from app.models.profile import Profile
from app.services import profiles as profiles_service

bearer_scheme = HTTPBearer(auto_error=False)

SessionDep = Annotated[AsyncSession, Depends(get_session)]


def get_access_tokens(request: Request) -> AccessTokens:
    tokens: AccessTokens = request.app.state.access_tokens
    return tokens


AccessTokensDep = Annotated[AccessTokens, Depends(get_access_tokens)]


async def get_current_user(
    response: Response,
    tokens: AccessTokensDep,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    session: SessionDep,
) -> Profile:
    if credentials is None:
        raise UnauthorizedError
    user_id = tokens.user_id_from(credentials.credentials)
    profile = await profiles_service.get_active_profile(session, user_id)
    # Personal data must not be stored by browsers or proxies.
    response.headers.update(NO_STORE_HEADERS)
    return profile


CurrentUser = Annotated[Profile, Depends(get_current_user)]
