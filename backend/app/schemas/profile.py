import uuid

from pydantic import BaseModel, ConfigDict, Field, StrictBool

from app.core.constants import DISPLAY_NAME_MAX_LENGTH


class ProfileResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "examples": [
                {
                    "id": "ddc1a995-44a3-4e91-b483-91b282af9649",
                    "username": "sana_99",
                    "display_name": "Sana",
                    "avatar_path": None,
                    "is_traveler": True,
                    "is_sender": True,
                    "is_verified": False,
                    "is_admin": False,
                }
            ]
        },
    )

    id: uuid.UUID
    username: str
    display_name: str | None
    avatar_path: str | None
    is_traveler: bool
    is_sender: bool
    is_verified: bool
    is_admin: bool


class ProfileUpdate(BaseModel):
    """Only these fields can be changed. Anything else, like is_admin, is refused with 422."""

    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
        json_schema_extra={"examples": [{"display_name": "Sana", "is_sender": False}]},
    )

    display_name: str | None = Field(default=None, min_length=1, max_length=DISPLAY_NAME_MAX_LENGTH)
    is_traveler: StrictBool = True
    is_sender: StrictBool = True
