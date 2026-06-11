from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.property import (
    PropertyCreate, PropertyUpdate, PropertyResponse,
    PropertyListResponse, PropertyFilters
)
from app.models.property import PropertyType, ListingType
from app.services.property_service import property_service
from app.utils.dependencies import get_current_user, require_agent
from app.models.user import User

router = APIRouter(prefix="/properties", tags=["Biens immobiliers"])


@router.get("/", response_model=PropertyListResponse)
async def search_properties(
    property_type: Optional[PropertyType] = None,
    listing_type: Optional[ListingType] = None,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_surface: Optional[float] = None,
    max_surface: Optional[float] = None,
    min_rooms: Optional[int] = None,
    agency_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """Recherche publique de biens avec filtres."""
    filters = PropertyFilters(
        property_type=property_type,
        listing_type=listing_type,
        city=city,
        min_price=min_price,
        max_price=max_price,
        min_surface=min_surface,
        max_surface=max_surface,
        min_rooms=min_rooms,
        agency_id=agency_id,
        page=page,
        per_page=per_page,
    )
    return await property_service.search(filters)


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: str):
    """Détail d'un bien (incrémente le compteur de vues)."""
    return await property_service.get_by_id(property_id)


@router.post("/", response_model=PropertyResponse, status_code=201)
async def create_property(
    data: PropertyCreate,
    agent: User = Depends(require_agent),
):
    """Création d'un bien — réservé aux agents."""
    return await property_service.create(data, agent)


@router.patch("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: str,
    data: PropertyUpdate,
    agent: User = Depends(require_agent),
):
    """Mise à jour partielle d'un bien."""
    return await property_service.update(property_id, data, agent)


@router.delete("/{property_id}", status_code=204)
async def delete_property(
    property_id: str,
    agent: User = Depends(require_agent),
):
    """Suppression d'un bien — réservé aux admins."""
    await property_service.delete(property_id, agent)


# Dev helpers
from app.core.config import settings
from typing import List
from app.models.property import Property
from fastapi import HTTPException


@router.post("/public", response_model=PropertyResponse)
async def public_create(data: PropertyCreate):
    """Création publique d'un bien (mode development only)."""
    if settings.ENVIRONMENT != "development":
        raise HTTPException(status_code=403, detail="Disponible en mode development uniquement")

    prop = Property(
        **data.model_dump(),
        agency_id="",
        agent_id="",
    )
    await prop.insert()
    return property_service._to_response(prop)


@router.post("/seed", response_model=List[PropertyResponse])
async def seed_properties(count: int = 5):
    """Ajoute `count` annonces factices dans la base (dev only)."""
    if settings.ENVIRONMENT != "development":
        raise HTTPException(status_code=403, detail="Disponible en mode development uniquement")

    samples: List[PropertyResponse] = []
    cities = [
        ("Aix-en-Provence", "13100"),
        ("Marseille", "13008"),
        ("Lyon", "69003"),
        ("Toulouse", "31000"),
        ("Nice", "06000"),
    ]

    for i in range(count):
        city, postal = cities[i % len(cities)]
        title = f"Appartement {2 + (i%3)} pièces - {city}"
        desc = "Bel appartement situé au coeur de la ville, à proximité des commerces et transports. Rénové, lumineux et bien agencé."
        data = {
            "title": title,
            "description": desc,
            "property_type": "apartment",
            "listing_type": "sale",
            "address": {
                "street": f"{10 + i} Rue de Test",
                "city": city,
                "postal_code": postal,
                "department": "",
                "region": "",
            },
            "surface_m2": 45.0 + i * 10,
            "rooms": 2 + (i % 3),
            "bedrooms": 1 + (i % 2),
            "bathrooms": 1,
            "price": 120000 + i * 50000,
        }
        prop = Property(**data, agency_id="", agent_id="")
        await prop.insert()
        samples.append(property_service._to_response(prop))

    return samples
