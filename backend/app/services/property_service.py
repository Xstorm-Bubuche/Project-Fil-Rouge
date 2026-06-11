import math
from fastapi import HTTPException, status
from datetime import datetime, timezone

from app.models.property import Property, PropertyStatus
from app.models.user import User, UserRole
from app.schemas.property import (
    PropertyCreate, PropertyUpdate, PropertyResponse,
    PropertyListResponse, PropertyFilters
)


class PropertyService:

    async def create(self, data: PropertyCreate, agent: User) -> PropertyResponse:
        if agent.role not in (UserRole.AGENT, UserRole.ADMIN, UserRole.SUPER_ADMIN):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")

        price_per_m2 = round(data.price / data.surface_m2, 2) if data.surface_m2 else None

        prop = Property(
            **data.model_dump(),
            price_per_m2=price_per_m2,
            agency_id=agent.agency_id or "",
            agent_id=str(agent.id),
        )
        await prop.insert()
        return self._to_response(prop)

    async def get_by_id(self, property_id: str) -> PropertyResponse:
        prop = await Property.get(property_id)
        if not prop:
            raise HTTPException(status_code=404, detail="Bien introuvable")

        await prop.set({Property.views_count: prop.views_count + 1})
        return self._to_response(prop)

    async def search(self, filters: PropertyFilters) -> PropertyListResponse:
        query = {}

        if filters.property_type:
            query["property_type"] = filters.property_type
        if filters.listing_type:
            query["listing_type"] = filters.listing_type
        if filters.city:
            query["address.city"] = {"$regex": filters.city, "$options": "i"}
        if filters.agency_id:
            query["agency_id"] = filters.agency_id
        if filters.min_price or filters.max_price:
            query["price"] = {}
            if filters.min_price:
                query["price"]["$gte"] = filters.min_price
            if filters.max_price:
                query["price"]["$lte"] = filters.max_price
        if filters.min_surface:
            query["surface_m2"] = {"$gte": filters.min_surface}
        if filters.max_surface:
            query.setdefault("surface_m2", {})["$lte"] = filters.max_surface
        if filters.min_rooms:
            query["rooms"] = {"$gte": filters.min_rooms}

        # Biens disponibles par défaut
        query["status"] = PropertyStatus.AVAILABLE

        skip = (filters.page - 1) * filters.per_page
        total = await Property.find(query).count()
        items = await Property.find(query).skip(skip).limit(filters.per_page).to_list()

        return PropertyListResponse(
            items=[self._to_response(p) for p in items],
            total=total,
            page=filters.page,
            per_page=filters.per_page,
            pages=math.ceil(total / filters.per_page),
        )

    async def update(self, property_id: str, data: PropertyUpdate, agent: User) -> PropertyResponse:
        prop = await Property.get(property_id)
        if not prop:
            raise HTTPException(status_code=404, detail="Bien introuvable")
        if str(prop.agent_id) != str(agent.id) and agent.role not in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
            raise HTTPException(status_code=403, detail="Vous n'êtes pas responsable de ce bien")

        update_data = data.model_dump(exclude_none=True)
        update_data["updated_at"] = datetime.now(timezone.utc)
        await prop.set(update_data)
        return self._to_response(prop)

    async def delete(self, property_id: str, agent: User) -> None:
        prop = await Property.get(property_id)
        if not prop:
            raise HTTPException(status_code=404, detail="Bien introuvable")
        if agent.role not in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
            raise HTTPException(status_code=403, detail="Accès refusé")
        await prop.delete()

    # Helpers

    @staticmethod
    def _to_response(prop: Property) -> PropertyResponse:
        from app.schemas.property import AddressSchema
        return PropertyResponse(
            id=str(prop.id),
            title=prop.title,
            description=prop.description,
            property_type=prop.property_type,
            listing_type=prop.listing_type,
            status=prop.status,
            address=AddressSchema(**prop.address),
            surface_m2=prop.surface_m2,
            rooms=prop.rooms,
            bedrooms=prop.bedrooms,
            price=prop.price,
            price_per_m2=prop.price_per_m2,
            photos=prop.photos,
            agency_id=prop.agency_id,
            agent_id=prop.agent_id,
            views_count=prop.views_count,
            created_at=prop.created_at,
        )


property_service = PropertyService()
