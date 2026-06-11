from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from loguru import logger

from app.core.config import settings

# Client global réutilisé sur toute la durée de vie de l'app
_client: AsyncIOMotorClient | None = None


async def connect_db() -> None:
    """Ouvre la connexion MongoDB et initialise Beanie ODM."""
    global _client
    logger.info(f"Connexion MongoDB → {settings.MONGODB_URL}")
    _client = AsyncIOMotorClient(settings.MONGODB_URL)

    # Import ici pour éviter les circular imports
    from app.models.user import User
    from app.models.property import Property
    from app.models.agency import Agency
    from app.models.transaction import Transaction

    await init_beanie(
        database=_client[settings.MONGODB_DB_NAME],
        document_models=[User, Property, Agency, Transaction],
    )
    logger.success("MongoDB connecté ✓")


async def close_db() -> None:
    """Ferme proprement la connexion."""
    global _client
    if _client:
        _client.close()
        logger.info("Connexion MongoDB fermée")


def get_client() -> AsyncIOMotorClient:
    if _client is None:
        raise RuntimeError("La base de données n'est pas initialisée")
    return _client
