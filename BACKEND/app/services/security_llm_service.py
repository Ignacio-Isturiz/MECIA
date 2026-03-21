"""
Servicio de chatbot de seguridad que usa LLM real (OpenAI o Gemini)
con los datos de criminalidad por comuna como contexto.
"""

import csv
import os
from typing import Dict, Any, List

_CRIMINALIDAD_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "datasets", "Criminalidad_por_Comuna_data.csv"
)

_SYSTEM_PROMPT_TEMPLATE = """Eres MECIA Seguridad, un asistente ciudadano para Medellín, Colombia. \
Tu rol es ayudar a los ciudadanos a tomar decisiones informadas sobre seguridad en la ciudad, \
basándote en datos reales de criminalidad.

DATOS DE CRIMINALIDAD POR COMUNA (tasa por cada 100,000 habitantes — a mayor tasa, más riesgo):
{datos_comunas}

INSTRUCCIONES:
- Responde en español natural, amigable y empático, como si fuera un vecino bien informado.
- Basa tus respuestas únicamente en los datos anteriores. No inventes zonas ni cifras.
- Si una zona es peligrosa, siempre sugiere alternativas más seguras del dataset.
- Adapta el consejo a la actividad que mencione el usuario (trotar, ir de compras, salir de noche, etc.).
- Sé conciso: máximo 3-4 oraciones por respuesta.
- No uses términos técnicos; habla de "zona segura", "zona peligrosa", "tasa de criminalidad", etc.
- Si preguntan algo fuera de seguridad en Medellín, recuerda amablemente tu función.
"""


def _load_criminalidad_text() -> str:
    """Carga el CSV y lo convierte en texto legible para el system prompt."""
    lines: List[str] = []
    try:
        with open(_CRIMINALIDAD_PATH, encoding="utf-8-sig") as f:
            reader = csv.DictReader(f, delimiter=";")
            rows = sorted(
                list(reader),
                key=lambda r: float(r["TasaCriminalidad"].replace(",", ".")),
            )
            for row in rows:
                nombre = row["Nombre"].strip()
                tasa = float(row["TasaCriminalidad"].strip().replace(",", "."))
                total = row["([TotalCasos])"].strip()
                lines.append(f"  - {nombre}: tasa {tasa:.2f} ({total} casos)")
    except Exception as e:
        lines.append(f"  (Error cargando datos: {e})")
    return "\n".join(lines)


def _build_system_prompt() -> str:
    datos = _load_criminalidad_text()
    return _SYSTEM_PROMPT_TEMPLATE.format(datos_comunas=datos)


async def _call_openai(prompt: str, api_key: str) -> str:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=api_key)
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": _build_system_prompt()},
            {"role": "user", "content": prompt},
        ],
        max_tokens=400,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()


async def _call_gemini(prompt: str, api_key: str) -> str:
    import google.generativeai as genai

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=_build_system_prompt(),
    )
    response = await model.generate_content_async(prompt)
    return response.text.strip()


async def security_chat_real(prompt: str, provider: str, openai_key: str, gemini_key: str) -> Dict[str, Any]:
    """
    Llama al LLM real con el contexto de criminalidad y retorna la respuesta.
    Fallback automático al mock si no hay API key configurada.
    """
    try:
        if provider == "openai" and openai_key:
            output = await _call_openai(prompt, openai_key)
            model_used = "gpt-4o-mini"
        elif provider == "gemini" and gemini_key:
            output = await _call_gemini(prompt, gemini_key)
            model_used = "gemini-1.5-flash"
        elif openai_key:
            # Fallback: si el provider configurado no tiene key, intentar con OpenAI
            output = await _call_openai(prompt, openai_key)
            model_used = "gpt-4o-mini"
        elif gemini_key:
            output = await _call_gemini(prompt, gemini_key)
            model_used = "gemini-1.5-flash"
        else:
            raise ValueError("No hay API key configurada para ningún proveedor LLM.")

        return {
            "output": output,
            "model": model_used,
            "provider": provider,
            "data_source": "Criminalidad_por_Comuna_data.csv",
            "mock": False,
        }

    except Exception as e:
        # Fallback al mock si falla la API
        from app.services.llm_mock import LLMMockService
        mock = LLMMockService()
        result = mock.simulate_security_chat(prompt)
        result["error_llm"] = str(e)
        result["fallback_mock"] = True
        return result
