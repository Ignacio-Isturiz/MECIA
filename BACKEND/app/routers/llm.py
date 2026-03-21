"""Endpoints mock de LLM para integrar frontend mientras se define proveedor real."""

from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status
import logging

from app.services.llm_mock import LLMMockService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/llm", tags=["llm-mock"])


class SimulateChatRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=3000)
    model: str = Field(default="gpt-4o-mini-sim")


class SimulateRecommendationRequest(BaseModel):
    business_type: str = Field(min_length=2, max_length=120)
    comuna: str | None = Field(default=None)


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
