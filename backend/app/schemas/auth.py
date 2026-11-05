from datetime import UTC, date, datetime, timedelta
from typing import Annotated

from pydantic import (
    AfterValidator,
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    StrictBool,
    StringConstraints,
)

from app.core.constants import (
    DATE_OF_BIRTH_MAX_AGE_YEARS,
    DAYS_PER_YEAR,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    USERNAME_PATTERN,
)


def _is_believable_birth_date(value: date) -> date:
    today = datetime.now(UTC).date()
    oldest = today - timedelta(days=DATE_OF_BIRTH_MAX_AGE_YEARS * DAYS_PER_YEAR)
    if not oldest <= value <= today:
        raise ValueError("Enter your real date of birth.")
    return value


Username = Annotated[
    str, StringConstraints(strip_whitespace=True, to_lower=True, pattern=USERNAME_PATTERN)
]
NewPassword = Annotated[str, Field(min_length=PASSWORD_MIN_LENGTH, max_length=PASSWORD_MAX_LENGTH)]


class SignupRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    username: Username
    email: EmailStr
    password: NewPassword
    date_of_birth: Annotated[date, AfterValidator(_is_believable_birth_date)]
    is_traveler: StrictBool
    is_sender: StrictBool


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str = Field(min_length=1, max_length=PASSWORD_MAX_LENGTH)


class RefreshRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    refresh_token: str


class ResetPasswordRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    date_of_birth: date
    new_password: NewPassword


class AccessTokenResponse(BaseModel):
    access_token: str
    access_expires_in: int


class TokenPairResponse(AccessTokenResponse):
    refresh_token: str
    refresh_expires_in: int
