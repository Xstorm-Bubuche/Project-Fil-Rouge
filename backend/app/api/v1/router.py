from fastapi import APIRouter

from app.api.v1.endpoints import auth, properties, agencies, transactions, stats

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(properties.router)
api_router.include_router(agencies.router)
api_router.include_router(transactions.router)
api_router.include_router(stats.router)
