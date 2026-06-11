from beanie import Document, Indexed
from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime, timezone
from enum import Enum


class UserRole(str, Enum):
    CLIENT = "client"
    AGENT = "agent"          # commercial en agence
    ADMIN = "admin"          # siège Y-Plaza
    SUPER_ADMIN = "super_admin"


class User(Document):
    # Identité
    first_name: str
    last_name: str
    email: Indexed(EmailStr, unique=True)  # type: ignore
    hashed_password: str

    # Rôle & agence
    role: UserRole = UserRole.CLIENT
    agency_id: Optional[str] = None       # référence vers Agency._id

    # Profil
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

    # Statut
    is_active: bool = True
    is_verified: bool = False

    # Timestamps
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
        use_state_management = True

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
