from fastapi import APIRouter, Depends
from app.utils.dependencies import require_admin

router = APIRouter(prefix="/stats", tags=["Statistiques & Data"])


@router.get("/sales-report")
async def sales_report(admin=Depends(require_admin)):
    """
    Rapport des ventes — données nettoyées pour le module Python Data.
    Retourne les transactions finalisées avec enrichissement géographique.
    """
    # TODO: brancher sur le pipeline ETL du module data/
    return {"message": "Rapport ventes — À implémenter avec module data/"}


@router.get("/market-trends")
async def market_trends():
    """Tendances du marché (prix moyens par ville, évolution)."""
    return {"message": "Tendances marché — À implémenter"}


@router.get("/predictions")
async def predictions(admin=Depends(require_admin)):
    """
    Prédictions ML : biens populaires, zones attractives, prévisions de prix.
    Consomme les modèles entraînés dans data/models/.
    """
    return {"message": "Prédictions ML — À implémenter avec data/models/"}
