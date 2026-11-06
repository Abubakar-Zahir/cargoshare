import uuid
from datetime import datetime

from sqlalchemy import DateTime, FetchedValue, Text, Uuid
from sqlalchemy.dialects.postgresql import CITEXT
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Profile(Base):
    """Mirrors public.profiles. The table itself is defined in supabase/migrations/.

    FetchedValue leaves a column to the database default, so the safe starting values for
    the admin, verified and active flags are set in one place.
    """

    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, server_default=FetchedValue())
    username: Mapped[str] = mapped_column(CITEXT)
    display_name: Mapped[str | None] = mapped_column(Text)
    avatar_path: Mapped[str | None] = mapped_column(Text)
    is_traveler: Mapped[bool]
    is_sender: Mapped[bool]
    is_verified: Mapped[bool] = mapped_column(server_default=FetchedValue())
    is_admin: Mapped[bool] = mapped_column(server_default=FetchedValue())
    is_active: Mapped[bool] = mapped_column(server_default=FetchedValue())
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=FetchedValue()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=FetchedValue()
    )
