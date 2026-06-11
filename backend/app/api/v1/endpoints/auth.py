from fastapi import APIRouter, Depends

from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.services.auth_service import auth_service
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentification"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(data: RegisterRequest):
    """Création d'un compte client."""
    return await auth_service.register(data)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    """Connexion — retourne access_token + refresh_token."""
    return await auth_service.login(data)


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    """Retourne le profil de l'utilisateur connecté."""
    from app.services.auth_service import AuthService
    return AuthService._to_response(current_user)
