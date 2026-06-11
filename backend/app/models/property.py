from beanie import Document, Indexed
from pydantic import Field
from typing import Optional, List
from datetime import datetime, timezone
from enum import Enum


class PropertyType(str, Enum):
    APARTMENT = "apartment"      # Appartement
    HOUSE = "house"              # Maison
    COMMERCIAL = "commercial"    # Local commercial
    LAND = "land"                # Terrain
    PARKING = "parking"


class ListingType(str, Enum):
    SALE = "sale"
    RENTAL = "rental"


class PropertyStatus(str, Enum):
    AVAILABLE = "available"
    UNDER_OFFER = "under_offer"   
    SOLD = "sold"
    WITHDRAWN = "withdrawn"       


class Address(dict):
    street: str
    city: str
    postal_code: str
    department: str
    region: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class Property(Document):
    # Infos de base
    title: str
    description: str
    property_type: PropertyType
    listing_type: ListingType
    status: PropertyStatus = PropertyStatus.AVAILABLE

    # Loc
    address: dict  

    # Caractéristiques
    surface_m2: float
    rooms: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    floor: Optional[int] = None
    total_floors: Optional[int] = None
    has_parking: bool = False
    has_garden: bool = False
    has_balcony: bool = False
    is_furnished: bool = False
    energy_class: Optional[str] = None   # DPE : A → G
    ges_class: Optional[str] = None      # GES : A → G

    # Prix
    price: float
    price_per_m2: Optional[float] = None
    agency_fees_percent: Optional[float] = None

    # Médias
    photos: List[str] = Field(default_factory=list)  
    virtual_tour_url: Optional[str] = None

    # Relations
    agency_id: str
    agent_id: str         

    # Méta
    views_count: int = 0
    favorites_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "properties"
        indexes = [
            "status",
            "property_type",
            "listing_type",
            "agency_id",
            [("address.city", 1), ("price", 1)],
        ]
