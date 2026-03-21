"""Endpoints de LLM: mock, seguridad y análisis de facturas."""

from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status, UploadFile, File
import logging

from app.services.llm_mock import LLMMockService
from app.services.security_llm_service import security_chat_real
from app.services.bill_analysis_service import analyze_bill
from app.core.config import get_settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/llm", tags=["llm-mock"])


class SimulateChatRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=3000)
    model: str = Field(default="gpt-4o-mini-sim")


class SimulateRecommendationRequest(BaseModel):
    business_type: str = Field(min_length=2, max_length=120)
    comuna: str | None = Field(default=None)


class SecurityChatRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=2000)


@router.get(
    "/models",
    status_code=status.HTTP_200_OK,
    summary="Listar modelos LLM simulados"
)
async def list_mock_models():
    try:
        service = LLMMockService()
        return {"success": True, "data": service.list_models(), "count": len(service.list_models())}
    except Exception as e:
        logger.error(f"Error listando modelos simulados: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error listando modelos simulados")


@router.post(
    "/simulate/chat",
    status_code=status.HTTP_200_OK,
    summary="Simular respuesta de chat LLM"
)
async def simulate_chat(payload: SimulateChatRequest):
    try:
        service = LLMMockService()
        result = service.simulate_chat(prompt=payload.prompt, model=payload.model)
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"Error simulando chat LLM: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error simulando chat LLM")


@router.post(
    "/simulate/recommendation",
    status_code=status.HTTP_200_OK,
    summary="Simular recomendacion de zona con LLM"
)
async def simulate_recommendation(payload: SimulateRecommendationRequest):
    try:
        service = LLMMockService()
        result = service.simulate_zone_recommendation(
            business_type=payload.business_type,
            comuna=payload.comuna,
        )
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"Error simulando recomendacion LLM: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error simulando recomendacion LLM")


@router.post(
    "/facturas/analizar",
    status_code=status.HTTP_200_OK,
    summary="Analizar factura EPM (1 o varias imágenes) con visión IA y tarifas reales",
)
async def analizar_factura(files: list[UploadFile] = File(...)):
    _ALLOWED = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if not files:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Debes subir al menos una imagen.")
    if len(files) > 6:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Máximo 6 imágenes por factura.")
    try:
        images = []
        for file in files:
            if file.content_type not in _ALLOWED:
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Archivo '{file.filename}' no es una imagen válida (JPG, PNG, WEBP).")
            image_bytes = await file.read()
            if len(image_bytes) > 10 * 1024 * 1024:
                raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=f"'{file.filename}' supera el límite de 10 MB.")
            images.append((image_bytes, file.content_type))

        settings = get_settings()
        result = await analyze_bill(images=images, api_key=settings.OPENAI_API_KEY)
        return {"success": True, "data": result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analizando factura: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error procesando la factura.")


@router.post(
    "/seguridad/chat",
    status_code=status.HTTP_200_OK,
    summary="Chatbot de seguridad basado en datos de criminalidad"
)
async def security_chat(payload: SecurityChatRequest):
    try:
        settings = get_settings()
        result = await security_chat_real(
            prompt=payload.prompt,
            provider=settings.LLM_PROVIDER,
            openai_key=settings.OPENAI_API_KEY,
            gemini_key=settings.GEMINI_API_KEY,
        )
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"Error en chatbot de seguridad: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error procesando consulta de seguridad")
