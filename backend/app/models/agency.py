from beanie import Document, Indexed
from pydantic import EmailStr, Field
from typing import Optional, List
from datetime import datetime, timezone
from enum import Enum


class Agency(Document):
    name: str
    code: Indexed(str, unique=True)   # ex: "AIX-001", "PAR-002"  # type: ignore Code unique pour chaque agence

    # Localisation
    address: dict       
    phone: str
    email: EmailStr

    # Responsable
    director_id: Optional[str] = None

    # Stats (dénormalisées pour perf)
    agents_count: int = 0
    active_listings_count: int = 0

    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "agencies"
