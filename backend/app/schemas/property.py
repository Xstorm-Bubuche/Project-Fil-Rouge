from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.property import PropertyType, ListingType, PropertyStatus


class AddressSchema(BaseModel):
    street: str
    city: str
    postal_code: str
    department: str
    region: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


# Création

class PropertyCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=150)
    description: str = Field(..., min_length=20)
    property_type: PropertyType
    listing_type: ListingType
    address: AddressSchema
    surface_m2: float = Field(..., gt=0)
    rooms: Optional[int] = Field(None, ge=1)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    floor: Optional[int] = None
    total_floors: Optional[int] = None
    has_parking: bool = False
    has_garden: bool = False
    has_balcony: bool = False
    is_furnished: bool = False
    energy_class: Optional[str] = None
    ges_class: Optional[str] = None
    price: float = Field(..., gt=0)
    agency_fees_percent: Optional[float] = None


# Mise à jour (partielle)

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[PropertyStatus] = None
    price: Optional[float] = Field(None, gt=0)
    photos: Optional[List[str]] = None
    virtual_tour_url: Optional[str] = None


# Réponse

class PropertyResponse(BaseModel):
    id: str
    title: str
    description: str
    property_type: PropertyType
    listing_type: ListingType
    status: PropertyStatus
    address: AddressSchema
    surface_m2: float
    rooms: Optional[int]
    bedrooms: Optional[int]
    price: float
    price_per_m2: Optional[float]
    photos: List[str]
    agency_id: str
    agent_id: str
    views_count: int
    created_at: datetime


class PropertyListResponse(BaseModel):
    items: List[PropertyResponse]
    total: int
    page: int
    per_page: int
    pages: int


# Filtres de recherche

class PropertyFilters(BaseModel):
    property_type: Optional[PropertyType] = None
    listing_type: Optional[ListingType] = None
    city: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_surface: Optional[float] = None
    max_surface: Optional[float] = None
    min_rooms: Optional[int] = None
    agency_id: Optional[str] = None
    page: int = Field(1, ge=1)
    per_page: int = Field(20, ge=1, le=100)
