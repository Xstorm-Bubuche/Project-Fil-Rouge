from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.core.config import settings
from app.db.mongodb import connect_db, close_db
from app.api.v1.router import api_router
from app.models.user import User, UserRole
from app.core.security import hash_password
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os


# Lifespan (startup / shutdown)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Démarrage {settings.APP_NAME} v{settings.APP_VERSION}")
    await connect_db()
    # Crée un compte de test permanent si configuré via les variables d'environnement
    if settings.TEST_USER_EMAIL and settings.TEST_USER_PASSWORD:
        try:
            existing = await User.find_one(User.email == settings.TEST_USER_EMAIL)
            if not existing:
                # bcrypt has a 72-byte limit; truncate if necessary
                raw_pw = settings.TEST_USER_PASSWORD
                pw_bytes = raw_pw.encode("utf-8")
                if len(pw_bytes) > 72:
                    truncated = pw_bytes[:72].decode("utf-8", errors="ignore")
                    logger.warning("TEST_USER_PASSWORD trop long, tronqué à 72 octets pour bcrypt")
                    raw_pw = truncated

                user = User(
                    first_name=settings.TEST_USER_FIRST_NAME,
                    last_name=settings.TEST_USER_LAST_NAME,
                    email=settings.TEST_USER_EMAIL,
                    hashed_password=hash_password(raw_pw),
                    role=UserRole.ADMIN,
                    is_active=True,
                    is_verified=True,
                )
                await user.insert()
                logger.info(f"Compte de test créé: {settings.TEST_USER_EMAIL}")
            else:
                logger.info(f"Compte de test déjà présent: {settings.TEST_USER_EMAIL}")
        except Exception as e:
            logger.warning(f"Impossible de créer compte de test: {e}")

    # Compte agent de test
    if settings.TEST_AGENT_EMAIL and settings.TEST_AGENT_PASSWORD:
        try:
            existing = await User.find_one(User.email == settings.TEST_AGENT_EMAIL)
            if not existing:
                user = User(
                    first_name=settings.TEST_AGENT_FIRST_NAME,
                    last_name=settings.TEST_AGENT_LAST_NAME,
                    email=settings.TEST_AGENT_EMAIL,
                    hashed_password=hash_password(settings.TEST_AGENT_PASSWORD),
                    role=UserRole.AGENT,
                    is_active=True,
                    is_verified=True,
                )
                await user.insert()
                logger.info(f"Compte agent créé: {settings.TEST_AGENT_EMAIL}")
            else:
                logger.info(f"Compte agent déjà présent: {settings.TEST_AGENT_EMAIL}")
        except Exception as e:
            logger.warning(f"Impossible de créer compte agent: {e}")

    # Compte client de test
    if settings.TEST_CLIENT_EMAIL and settings.TEST_CLIENT_PASSWORD:
        try:
            existing = await User.find_one(User.email == settings.TEST_CLIENT_EMAIL)
            if not existing:
                user = User(
                    first_name=settings.TEST_CLIENT_FIRST_NAME,
                    last_name=settings.TEST_CLIENT_LAST_NAME,
                    email=settings.TEST_CLIENT_EMAIL,
                    hashed_password=hash_password(settings.TEST_CLIENT_PASSWORD),
                    role=UserRole.CLIENT,
                    is_active=True,
                    is_verified=True,
                )
                await user.insert()
                logger.info(f"Compte client créé: {settings.TEST_CLIENT_EMAIL}")
            else:
                logger.info(f"Compte client déjà présent: {settings.TEST_CLIENT_EMAIL}")
        except Exception as e:
            logger.warning(f"Impossible de créer compte client: {e}")

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

# Serve frontend static files if present in /app/frontend
frontend_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")
frontend_dir = os.path.abspath(frontend_dir)
if os.path.isdir(frontend_dir):
    app.mount("/static", StaticFiles(directory=os.path.join(frontend_dir, "css")), name="static_css")
    app.mount("/js", StaticFiles(directory=os.path.join(frontend_dir, "js")), name="static_js")
    # serve index and html files at root
    @app.get("/", include_in_schema=False)
    async def serve_index():
        index_path = os.path.join(frontend_dir, "index.html")
        return FileResponse(index_path)
    @app.get("/{page}.html", include_in_schema=False)
    async def serve_page(page: str):
        page_path = os.path.join(frontend_dir, f"{page}.html")
        if os.path.isfile(page_path):
            return FileResponse(page_path)
        return FileResponse(os.path.join(frontend_dir, "index.html"))


# Health check

@app.get("/health", tags=["Système"])
async def health():
    return {"status": "ok", "version": settings.APP_VERSION}