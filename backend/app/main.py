from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import health, me
from app.core.config import Settings, get_settings
from app.core.constants import (
    API_PREFIX,
    APP_TITLE,
    APP_VERSION,
    CORS_ALLOWED_HEADERS,
    CORS_ALLOWED_METHODS,
    REQUEST_ID_HEADER,
)
from app.core.db import create_engine, create_sessionmaker
from app.core.errors import register_exception_handlers
from app.core.logging import configure_logging
from app.core.middleware import RequestContextMiddleware
from app.core.security import TokenVerifier


def create_app(settings: Settings) -> FastAPI:
    configure_logging(settings.log_level)

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        engine = create_engine(settings)
        app.state.sessionmaker = create_sessionmaker(engine)
        yield
        await engine.dispose()

    app = FastAPI(
        title=APP_TITLE,
        version=APP_VERSION,
        openapi_url=f"{API_PREFIX}/openapi.json",
        redoc_url=None,
        lifespan=lifespan,
    )
    app.state.token_verifier = TokenVerifier(settings.supabase_url)
    register_exception_handlers(app)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=CORS_ALLOWED_METHODS,
        allow_headers=CORS_ALLOWED_HEADERS,
        expose_headers=[REQUEST_ID_HEADER],
    )
    app.add_middleware(RequestContextMiddleware, hsts=settings.app_env == "production")
    app.include_router(health.router, prefix=API_PREFIX)
    app.include_router(me.router, prefix=API_PREFIX)
    return app


app = create_app(get_settings())
