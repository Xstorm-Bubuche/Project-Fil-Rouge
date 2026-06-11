from fastapi import HTTPException, status
from datetime import datetime, timezone

from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token


class AuthService:

    async def register(self, data: RegisterRequest) -> UserResponse:
        # Vérification email
        existing = await User.find_one(User.email == data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Un compte existe déjà avec cet email",
            )

        user = User(
            first_name=data.first_name,
            last_name=data.last_name,
            email=data.email,
            hashed_password=hash_password(data.password),
            phone=data.phone,
            role=UserRole.CLIENT,
        )
        await user.insert()

        return self._to_response(user)

    async def login(self, data: LoginRequest) -> TokenResponse:
        user = await User.find_one(User.email == data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou mot de passe incorrect",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Compte désactivé",
            )

        payload = {"sub": str(user.id), "role": user.role}
        return TokenResponse(
            access_token=create_access_token(payload),
            refresh_token=create_refresh_token(payload),
        )

    async def get_current_user(self, user_id: str) -> User:
        user = await User.get(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur introuvable",
            )
        return user

    # Helpers

    @staticmethod
    def _to_response(user: User) -> UserResponse:
        return UserResponse(
            id=str(user.id),
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            role=user.role,
            agency_id=user.agency_id,
            is_active=user.is_active,
            is_verified=user.is_verified,
        )


auth_service = AuthService()
