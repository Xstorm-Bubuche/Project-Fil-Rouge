import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi import HTTPException

from app.services.auth_service import AuthService
from app.schemas.auth import RegisterRequest, LoginRequest
from app.models.user import UserRole


@pytest.fixture
def auth_service():
    return AuthService()


@pytest.fixture
def register_data():
    return RegisterRequest(
        first_name="Jean",
        last_name="Dupont",
        email="jean.dupont@test.fr",
        password="motdepasse123",
    )


class TestAuthServiceRegister:

    @pytest.mark.asyncio
    async def test_register_new_user(self, auth_service, register_data):
        """Un nouvel utilisateur peut s'enregistrer."""
        with patch("app.services.auth_service.User") as MockUser:
            MockUser.find_one = AsyncMock(return_value=None)
            mock_user = MagicMock()
            mock_user.id = "abc123"
            mock_user.first_name = register_data.first_name
            mock_user.last_name = register_data.last_name
            mock_user.email = register_data.email
            mock_user.role = UserRole.CLIENT
            mock_user.agency_id = None
            mock_user.is_active = True
            mock_user.is_verified = False
            MockUser.return_value = mock_user
            mock_user.insert = AsyncMock()

            result = await auth_service.register(register_data)

            assert result.email == register_data.email
            assert result.role == UserRole.CLIENT

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, auth_service, register_data):
        """L'inscription échoue si l'email existe déjà."""
        with patch("app.services.auth_service.User") as MockUser:
            MockUser.find_one = AsyncMock(return_value=MagicMock())  # email déjà pris

            with pytest.raises(HTTPException) as exc_info:
                await auth_service.register(register_data)

            assert exc_info.value.status_code == 409


class TestAuthServiceLogin:

    @pytest.mark.asyncio
    async def test_login_wrong_password(self, auth_service):
        """Login échoue avec un mauvais mot de passe."""
        with patch("app.services.auth_service.User") as MockUser:
            mock_user = MagicMock()
            mock_user.hashed_password = "hashed_other"
            MockUser.find_one = AsyncMock(return_value=mock_user)

            with patch("app.services.auth_service.verify_password", return_value=False):
                with pytest.raises(HTTPException) as exc_info:
                    await auth_service.login(
                        LoginRequest(email="jean@test.fr", password="mauvais")
                    )
                assert exc_info.value.status_code == 401
