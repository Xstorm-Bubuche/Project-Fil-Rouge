from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_token
from app.models.user import User, UserRole
from app.services.auth_service import auth_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Injecte l'utilisateur connecté dans les routes protégées."""
    payload = decode_token(token)
    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")
    return await auth_service.get_current_user(user_id)


async def require_agent(current_user: User = Depends(get_current_user)) -> User:
    """Requiert le rôle agent ou supérieur."""
    if current_user.role not in (UserRole.AGENT, UserRole.ADMIN, UserRole.SUPER_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Réservé aux agents")
    return current_user


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Requiert le rôle admin ou super_admin."""
    if current_user.role not in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Réservé aux admins")
    return current_user
