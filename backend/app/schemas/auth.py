from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.models.user import UserRole


# Requêtes

class RegisterRequest(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


# Réponses

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    role: UserRole
    agency_id: Optional[str] = None
    is_active: bool
    is_verified: bool
