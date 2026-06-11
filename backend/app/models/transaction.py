from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime, timezone
from enum import Enum


class TransactionType(str, Enum):
    SALE = "sale"
    RENTAL = "rental"


class TransactionStatus(str, Enum):
    PENDING = "pending"           # Offre en cours
    COMPROMIS = "compromis"       # Compromis signé
    ACTE_FINAL = "acte_final"     # Acte authentique signé
    CANCELLED = "cancelled"


class Transaction(Document):
    # Parties
    property_id: str
    buyer_id: str           # ou locataire
    seller_id: str          # ou propriétaire
    agent_id: str
    agency_id: str

    # Type & statut
    transaction_type: TransactionType
    status: TransactionStatus = TransactionStatus.PENDING

    # Financier
    offered_price: float
    final_price: Optional[float] = None
    agency_commission: Optional[float] = None

    # Dates clés
    offer_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    compromis_date: Optional[datetime] = None
    final_date: Optional[datetime] = None

    # Notes
    notes: Optional[str] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "transactions"
        indexes = ["property_id", "buyer_id", "agent_id", "agency_id", "status"]
