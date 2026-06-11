from fastapi import APIRouter, Depends
from app.utils.dependencies import require_admin

router = APIRouter(prefix="/agencies", tags=["Agences"])


@router.get("/")
async def list_agencies():
    """Liste des 12 agences Y-Plaza."""
    # TODO: implémenter AgencyService
    return {"message": "À implémenter — AgencyService"}


@router.get("/{agency_id}")
async def get_agency(agency_id: str):
    return {"message": f"Agence {agency_id} — À implémenter"}


@router.post("/", status_code=201, dependencies=[Depends(require_admin)])
async def create_agency():
    return {"message": "Création agence — À implémenter"}
