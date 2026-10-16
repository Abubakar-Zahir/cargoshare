from typing import Annotated, Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session, ping
from app.core.errors import ErrorEnvelope

router = APIRouter(prefix="/health", tags=["health"])


class HealthResponse(BaseModel):
    model_config = ConfigDict(extra="forbid", json_schema_extra={"examples": [{"status": "ok"}]})

    status: Literal["ok"]


@router.get("", summary="Liveness: the API process is running")
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@router.get(
    "/ready",
    summary="Readiness: the API can reach the database",
    responses={503: {"model": ErrorEnvelope, "description": "Database not reachable"}},
)
async def ready(session: Annotated[AsyncSession, Depends(get_session)]) -> HealthResponse:
    await ping(session)
    return HealthResponse(status="ok")
