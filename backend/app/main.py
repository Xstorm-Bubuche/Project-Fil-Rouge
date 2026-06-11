from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.core.config import settings
from app.db.mongodb import connect_db, close_db
from app.api.v1.router import api_router


# Lifespan (startup / shutdown)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Démarrage {settings.APP_NAME} v{settings.APP_VERSION}")
    await connect_db()
    yield
    await close_db()
    logger.info("Arrêt de l'application")


# App

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API backend de la plateforme immobilière Y-Plaza",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# autorise le frontend React/Vite en dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(api_router)


# Health check

@app.get("/health", tags=["Système"])
async def health():
    return {"status": "ok", "version": settings.APP_VERSION}
