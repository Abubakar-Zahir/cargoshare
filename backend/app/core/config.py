import os
from typing import Literal

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE_VARIABLE = "CARGOSHARE_ENV_FILE"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file_encoding="utf-8", extra="forbid", frozen=True)

    app_env: Literal["development", "test", "production"]
    database_url: SecretStr
    cors_origins: list[str]
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    @field_validator("database_url")
    @classmethod
    def database_url_is_postgres(cls, value: SecretStr) -> SecretStr:
        if not value.get_secret_value().startswith(("postgresql://", "postgres://")):
            raise ValueError("DATABASE_URL must start with postgresql://")
        return value

    @field_validator("cors_origins")
    @classmethod
    def cors_origins_are_explicit(cls, value: list[str]) -> list[str]:
        for origin in value:
            if origin == "*" or not origin.startswith(("http://", "https://")):
                raise ValueError("CORS_ORIGINS must list explicit http(s) origins, never '*'")
        return value


def get_settings() -> Settings:
    env_file = os.environ.get(ENV_FILE_VARIABLE, ".env")
    return Settings(_env_file=env_file)
