import uuid
from collections.abc import AsyncIterator

from fastapi import Request
from sqlalchemy import text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.core.config import Settings
from app.core.constants import CONNECT_TIMEOUT_SECONDS
from app.core.errors import ServiceUnavailableError


def create_engine(settings: Settings) -> AsyncEngine:
    """Engine for the Supabase transaction pooler.

    The pooler hands each transaction to any server connection, so prepared statements
    cannot be cached or reused by name. SQLAlchemy's asyncpg docs recommend NullPool,
    no statement caches, and unique statement names behind a pooler like this.
    """
    url = make_url(settings.database_url.get_secret_value()).set(drivername="postgresql+asyncpg")
    return create_async_engine(
        url,
        poolclass=NullPool,
        connect_args={
            "statement_cache_size": 0,
            "prepared_statement_cache_size": 0,
            "prepared_statement_name_func": lambda: f"__asyncpg_{uuid.uuid4()}__",
            "timeout": CONNECT_TIMEOUT_SECONDS,
            "command_timeout": CONNECT_TIMEOUT_SECONDS,
        },
    )


def create_sessionmaker(engine: AsyncEngine) -> async_sessionmaker[AsyncSession]:
    return async_sessionmaker(engine, expire_on_commit=False)


async def get_session(request: Request) -> AsyncIterator[AsyncSession]:
    sessionmaker: async_sessionmaker[AsyncSession] = request.app.state.sessionmaker
    async with sessionmaker() as session:
        yield session


async def ping(session: AsyncSession) -> None:
    try:
        await session.execute(text("select 1"))
    except (SQLAlchemyError, OSError, TimeoutError) as exc:
        raise ServiceUnavailableError("The database is not reachable.") from exc
