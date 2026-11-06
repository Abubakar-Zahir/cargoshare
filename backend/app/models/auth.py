import uuid
from datetime import date, datetime

from sqlalchemy import DateTime, FetchedValue, ForeignKey, Text, Uuid
from sqlalchemy.dialects.postgresql import CITEXT
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Credential(Base):
    """Mirrors public.credentials. The table itself is defined in supabase/migrations/."""

    __tablename__ = "credentials"

    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("profiles.id"), primary_key=True)
    email: Mapped[str] = mapped_column(CITEXT)
    password_hash: Mapped[str] = mapped_column(Text)
    date_of_birth: Mapped[date]
    failed_attempts: Mapped[int] = mapped_column(default=0)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class RefreshToken(Base):
    """Mirrors public.refresh_tokens. The table itself is defined in supabase/migrations/."""

    __tablename__ = "refresh_tokens"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, server_default=FetchedValue())
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("profiles.id"))
    token_hash: Mapped[str] = mapped_column(Text)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
