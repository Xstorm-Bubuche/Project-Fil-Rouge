from fastapi import APIRouter, Depends
from app.utils.dependencies import require_agent

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/")
async def list_transactions(agent=Depends(require_agent)):
    """Liste des transactions de l'agence de l'agent."""
    # TODO: implémenter TransactionService
    return {"message": "À implémenter — TransactionService"}


@router.post("/", status_code=201)
async def create_transaction(agent=Depends(require_agent)):
    return {"message": "Création transaction — À implémenter"}


@router.patch("/{transaction_id}/status")
async def update_transaction_status(transaction_id: str, agent=Depends(require_agent)):
    return {"message": f"Mise à jour statut {transaction_id} — À implémenter"}
