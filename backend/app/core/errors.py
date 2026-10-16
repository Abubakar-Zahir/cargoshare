from http import HTTPStatus
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict
from starlette.exceptions import HTTPException as StarletteHTTPException


class ErrorBody(BaseModel):
    model_config = ConfigDict(extra="forbid")

    code: str
    message: str
    details: dict[str, Any]
    request_id: str


class ErrorEnvelope(BaseModel):
    model_config = ConfigDict(extra="forbid")

    error: ErrorBody


class AppError(Exception):
    status_code = HTTPStatus.INTERNAL_SERVER_ERROR
    code = "INTERNAL_ERROR"
    message = "Something went wrong on our side."

    def __init__(self, message: str | None = None, details: dict[str, Any] | None = None) -> None:
        super().__init__(message or self.message)
        self.message = message or self.message
        self.details = details or {}


class ServiceUnavailableError(AppError):
    status_code = HTTPStatus.SERVICE_UNAVAILABLE
    code = "SERVICE_UNAVAILABLE"
    message = "The service is temporarily unavailable."


def error_response(
    status_code: int,
    code: str,
    message: str,
    request_id: str,
    details: dict[str, Any] | None = None,
) -> JSONResponse:
    envelope = ErrorEnvelope(
        error=ErrorBody(code=code, message=message, details=details or {}, request_id=request_id)
    )
    return JSONResponse(status_code=status_code, content=envelope.model_dump())


def _request_id(request: Request) -> str:
    return str(getattr(request.state, "request_id", ""))


async def _handle_app_error(request: Request, exc: AppError) -> JSONResponse:
    return error_response(exc.status_code, exc.code, exc.message, _request_id(request), exc.details)


async def _handle_http_error(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    status = HTTPStatus(exc.status_code)
    response = error_response(
        exc.status_code, status.name, status.phrase + ".", _request_id(request)
    )
    if exc.headers:
        response.headers.update(exc.headers)
    return response


async def _handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    fields = [
        {"loc": list(error["loc"]), "msg": error["msg"], "type": error["type"]}
        for error in exc.errors()
    ]
    return error_response(
        HTTPStatus.UNPROCESSABLE_CONTENT,
        "VALIDATION_ERROR",
        "Some fields are missing or invalid.",
        _request_id(request),
        {"fields": fields},
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.exception_handler(AppError)(_handle_app_error)
    app.exception_handler(StarletteHTTPException)(_handle_http_error)
    app.exception_handler(RequestValidationError)(_handle_validation_error)
