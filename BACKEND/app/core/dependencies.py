"""
Dependencias de FastAPI: inyección de dependencias
Aplica Dependency Inversion Principle de SOLID
"""
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.repositories.user import UserRepository
from app.services.auth import AuthService
from app.core.security import security_manager
from app.models.user import User
from app.core.exceptions import InvalidTokenException


def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    """
    Proporciona una instancia del repositorio de usuarios.
    
    Args:
        db: Sesión de BD inyectada
        
    Returns:
        Instancia del repositorio
    """
    return UserRepository(db)


def get_auth_service(
    user_repository: UserRepository = Depends(get_user_repository)
) -> AuthService:
    """
    Proporciona una instancia del servicio de autenticación.
    
    Args:
        user_repository: Repositorio inyectado
        
    Returns:
        Instancia del servicio
    """
    return AuthService(
        user_repository=user_repository,
        security_manager=security_manager
    )


async def get_current_user(
    token: str = None,
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    """
    Obtiene el usuario actual desde el token en Authorization header.
    Esta es una dependencia que puede usarse en los routers.
    
    Args:
        token: Token extraído del header
        auth_service: Servicio de autenticación inyectado
        
    Returns:
        Usuario autenticado
        
    Raises:
        InvalidTokenException: Si el token es inválido
    """
    if not token:
        raise InvalidTokenException()
    
    user = await auth_service.get_user_by_token(token)
    
    if not user:
        raise InvalidTokenException()
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    
    return user


# Extractor de token del header (helper)
async def get_token_from_header(
    authorization: Optional[str] = None,
) -> Optional[str]:
    """
    Extrae el token JWT del header Authorization.
    
    Args:
        authorization: Header de autorización
        
    Returns:
        Token sin el prefijo "Bearer " o None
    """
    if not authorization:
        return None
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    
    return parts[1]
