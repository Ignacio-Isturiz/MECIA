"""Servicio mock para simular consumo de modelos LLM sin proveedor real."""

from typing import Dict, Any, List
import time


class LLMMockService:
    """Simula respuestas de uno o dos modelos para desarrollo inicial de frontend."""

    def __init__(self) -> None:
        self._models: List[Dict[str, Any]] = [
            {
                "id": "gpt-4o-mini-sim",
                "provider": "openai-mock",
                "status": "simulado",
                "latency_ms": 450,
            },
            {
                "id": "llama-3.1-8b-sim",
                "provider": "meta-mock",
                "status": "simulado",
                "latency_ms": 620,
            },
        ]

    def list_models(self) -> List[Dict[str, Any]]:
        return self._models

    def simulate_chat(self, prompt: str, model: str) -> Dict[str, Any]:
        selected = next((m for m in self._models if m["id"] == model), self._models[0])
        latency = selected["latency_ms"]

        time.sleep(min(latency / 1000.0, 0.9))

        reply = (
            "Respuesta simulada para desarrollo: "
            f"analizamos tu prompt y sugerimos validar demanda, competencia y costos. "
            f"Prompt recibido: {prompt[:120]}"
        )

        return {
            "model": selected["id"],
            "provider": selected["provider"],
            "latency_ms": latency,
            "output": reply,
            "tokens": {
                "input_est": max(6, len(prompt.split()) * 2),
                "output_est": 58,
                "total_est": max(6, len(prompt.split()) * 2) + 58,
            },
            "mock": True,
        }

    def simulate_zone_recommendation(self, business_type: str, comuna: str | None = None) -> Dict[str, Any]:
        comuna_target = comuna or "11"
        time.sleep(0.4)

        return {
            "model": "llama-3.1-8b-sim",
            "business_type": business_type,
            "recommended_comuna": comuna_target,
            "confidence": 0.78,
            "rationale": [
                "Alta densidad comercial para categorias similares.",
                "Flujo peatonal estimado favorable segun historicos del dataset.",
                "Competencia moderada en negocios del mismo tipo.",
            ],
            "mock": True,
        }
