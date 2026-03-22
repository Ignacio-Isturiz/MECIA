"""
Configuración de base de datos con SQLAlchemy
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import get_settings

settings = get_settings()

# Crear engine de SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL,
    # Para SQLite, necesitamos conectar_args
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

# Crear SessionLocal para obtener sesiones
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db() -> Session:
    """
    Dependencia para obtener sesión de base de datos.
    Se usa con FastAPI Depends().
    
    Yields:
        Sesión de SQLAlchemy
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Inicializa la base de datos creando todas las tablas.
    Se llama una sola vez al arrancar la aplicación.
    """
    from app.models.user import Base
    from app.models.conversation import Conversation, Message  # Ensure models are imported
    Base.metadata.create_all(bind=engine)
