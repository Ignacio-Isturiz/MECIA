"""
Servicio de chatbot para emprendedores que usa LLM real (OpenAI o Gemini)
con datos de negocios, estructura empresarial y tarifas EPM como contexto.
"""

import csv
import json
import math
import os
import unicodedata
from typing import Dict, Any, List, Optional
from collections import defaultdict
from app.core.geo_data import get_coordinates

_BASE_PATH = os.path.join(os.path.dirname(__file__), "..", "..")

_NEGOCIOS_PATH = os.path.join(_BASE_PATH, "datasets", "negocios_medellin_full.csv")
_ESTRUCTURA_PATH = os.path.join(
    _BASE_PATH, "datasets", "Estructura_empresarial_Medellín_según_comunas_y_actividad_económica_20260320.csv"
)
_TARIFA_ENERGIA_PATH = os.path.join(_BASE_PATH, "datasets", "tarifas_servicio_energia_epm.csv")
_TARIFA_ACUEDUCTO_PATH = os.path.join(_BASE_PATH, "datasets", "tarifas_servicio_acueducto_epm.csv")
_TARIFA_GAS_PATH = os.path.join(_BASE_PATH, "datasets", "tarifas_servicio_gas_epm.csv")

# Mapping de comunas para búsqueda flexible
COMUNA_MAPPING = {
    "altavista": "ALTAVISTA",
    "aranjuez": "ARANJUEZ",
    "belen": "BELEN",
    "buenos aires": "BUENOS AIRES",
    "castilla": "CASTILLA",
    "doce de octubre": "DOCE DE OCTUBRE",
    "el poblado": "EL POBLADO",
    "guayabal": "GUAYABAL",
    "la america": "LA AMERICA",
    "la candelaria": "LA CANDELARIA",
    "laureles": "LAURELES-ESTADIO",
    "manrique": "MANRIQUE",
    "palmitas": "PALMITAS",
    "popular": "POPULAR",
    "robledo": "ROBLEDO",
    "san antonio": "SAN ANTONIO DE PRADO",
    "san cristobal": "SAN CRISTOBAL",
    "san javier": "SAN JAVIER",
    "santa cruz": "SANTA CRUZ",
    "santa elena": "SANTA ELENA",
    "villa hermosa": "VILLA HERMOSA",
}

COMUNA_NUMBER_TO_NAME = {
    "1": "POPULAR",
    "2": "SANTA CRUZ",
    "3": "MANRIQUE",
    "4": "ARANJUEZ",
    "5": "CASTILLA",
    "6": "DOCE DE OCTUBRE",
    "7": "ROBLEDO",
    "8": "VILLA HERMOSA",
    "9": "BUENOS AIRES",
    "10": "LA CANDELARIA",
    "11": "LAURELES-ESTADIO",
    "12": "LA AMERICA",
    "13": "SAN JAVIER",
    "14": "EL POBLADO",
    "15": "GUAYABAL",
    "16": "BELEN",
}

DEFAULT_MEDELLIN_COORDS = [6.244, -75.574]


def _normalize_text(value: str) -> str:
    normalized = unicodedata.normalize("NFD", (value or "").lower().strip())
    return "".join(c for c in normalized if unicodedata.category(c) != "Mn")


def _extract_relevant_types(prompt: str, negocios: Dict[str, Dict[str, Dict[str, int]]]) -> set[str]:
    prompt_norm = _normalize_text(prompt)
    relevant_types: set[str] = set()

    for barrios in negocios.values():
        for b_counts in barrios.values():
            for negocio_type in b_counts.keys():
                type_norm = _normalize_text(negocio_type)
                # Match flexible para capturar singular/plural y variaciones simples.
                if (
                    type_norm in prompt_norm
                    or (len(type_norm) > 4 and type_norm[:-1] in prompt_norm)
                    or (len(prompt_norm) > 4 and prompt_norm in type_norm)
                ):
                    relevant_types.add(negocio_type)

    return relevant_types


def _normalize_comuna_for_coordinates(comuna_value: str) -> str:
    comuna_clean = (comuna_value or "").strip().upper()
    if comuna_clean in COMUNA_NUMBER_TO_NAME:
        return COMUNA_NUMBER_TO_NAME[comuna_clean]
    return comuna_clean


def _build_map_data_from_dataset(
    prompt: str,
    negocios: Dict[str, Dict[str, Dict[str, int]]],
) -> Optional[Dict[str, Any]]:
    relevant_types = _extract_relevant_types(prompt, negocios)
    if not relevant_types:
        return None

    area_counts = defaultdict(int)
    for comm, barrios in negocios.items():
        for barrio, barrio_counts in barrios.items():
            total = sum(barrio_counts.get(negocio_type, 0) for negocio_type in relevant_types)
            if total > 0:
                area_counts[(comm, barrio)] += total

    if not area_counts:
        return None

    sorted_rows = sorted(area_counts.items(), key=lambda item: (-item[1], item[0][0], item[0][1]))
    locations = [
        {
            "name": barrio,
            "comuna": _normalize_comuna_for_coordinates(comuna),
            "count": count,
        }
        for (comuna, barrio), count in sorted_rows
    ]

    return {
        "type": "markers",
        "locations": locations,
    }


def _load_negocios_data() -> Dict[str, Dict[str, Dict[str, int]]]:
    """
    Carga negocios_medellin_full.csv y estructura por comuna → barrio → tipo_negocio.
    Retorna: {comuna: {barrio: {tipo_negocio: cantidad}}}
    """
    data = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    try:
        with open(_NEGOCIOS_PATH, encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter=",")
            for row in reader:
                if not row.get("tipo_negocio"):
                    continue
                Comuna = row.get("comuna", "").strip().upper()
                barrio = row.get("barrio", "").strip()
                tipo = row.get("tipo_negocio", "").strip().lower()
                cantidad = int(row.get("cantidad_actual", "0") or "0")
                if Comuna and barrio and tipo and cantidad > 0:
                    data[Comuna][barrio][tipo] += cantidad
    except Exception as e:
        print(f"Error loading negocios data: {e}")
    return dict(data)


def _load_estructura_empresarial() -> Dict[str, Dict[str, int]]:
    """
    Carga Estructura_empresarial por comuna y actividad (año 2022).
    Retorna: {comuna: {actividad_descripcion: count}}
    """
    data = defaultdict(lambda: defaultdict(int))
    try:
        with open(_ESTRUCTURA_PATH, encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter=",")
            for row in reader:
                year = row.get("AÑO", "").strip()
                if year != "2022":  # Solo datos más recientes
                    continue
                descripcion = row.get("Descripción", "").strip()
                if not descripcion or descripcion == "Sin CIIU":
                    continue
                # Sumar los valores de cada comuna
                for comuna_key in COMUNA_MAPPING.values():
                    val_str = row.get(comuna_key, "").strip()
                    if val_str and val_str.isdigit():
                        data[comuna_key][descripcion] += int(val_str)
    except Exception as e:
        print(f"Error loading estructura empresarial: {e}")
    return dict(data)


def _load_epm_tariffs() -> Dict[str, Dict[str, Dict[str, float]]]:
    """
    Carga tarifas EPM para energía, acueducto y gas.
    Retorna: {servicio: {estrato: {campo: valor}}}
    """
    tariffs = {}
    try:
        # Energía
        tariffs["energia"] = _parse_energia_tariffs()
        # Acueducto
        tariffs["acueducto"] = _parse_acueducto_tariffs()
        # Gas
        tariffs["gas"] = _parse_gas_tariffs()
    except Exception as e:
        print(f"Error loading EPM tariffs: {e}")
    return tariffs


def _parse_energia_tariffs() -> Dict[str, Dict[str, float]]:
    """Parse tarifas_servicio_energia_epm.csv - retorna estimates por estrato."""
    result = {}
    try:
        with open(_TARIFA_ENERGIA_PATH, encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter=",")
            for row in reader:
                nivel = row.get("nivel", "").strip()
                if nivel in ["I", "II", "III", "IV", "V", "VI"]:
                    estrato_map = {"I": "1", "II": "2", "III": "3", "IV": "4", "V": "5", "VI": "6"}
                    estrato = estrato_map.get(nivel)
                    if estrato:
                        # Promediar valores para este estrato
                        try:
                            val = float(row.get("propiedadepm", "0") or "0")
                            if estrato not in result:
                                result[estrato] = []
                            result[estrato].append(val)
                        except:
                            pass
        # Calcular promedio por estrato (estimada para 100 kWh/mes)
        for estrato in result:
            result[estrato] = {"cargo_promedio": sum(result[estrato]) / len(result[estrato]) if result[estrato] else 0}
    except Exception as e:
        print(f"Error parsing energia tariffs: {e}")
    return result


def _parse_acueducto_tariffs() -> Dict[str, Dict[str, float]]:
    """Parse tarifas_servicio_acueducto_epm.csv."""
    result = {}
    try:
        with open(_TARIFA_ACUEDUCTO_PATH, encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter=",")
            for row in reader:
                if row.get("municipio", "").upper() == "MEDELLIN":
                    estrato = row.get("estrato", "").strip()
                    if estrato.startswith("Residencial"):
                        # Extraer número de estrato de texto como "Residencial,3"
                        parts = row.get("estrato", ",").split(",")
                        if len(parts) > 1:
                            est_num = parts[-1].strip()
                            if est_num.isdigit():
                                try:
                                    cargo = float(row.get("cargoporconsumo", "0") or "0")
                                    if est_num not in result:
                                        result[est_num] = []
                                    result[est_num].append(cargo)
                                except:
                                    pass
        # Promediar
        for est in result:
            result[est] = {"cargo_promedio": sum(result[est]) / len(result[est]) if result[est] else 0}
    except Exception as e:
        print(f"Error parsing acueducto tariffs: {e}")
    return result


def _parse_gas_tariffs() -> Dict[str, Dict[str, float]]:
    """Parse tarifas_servicio_gas_epm.csv."""
    result = {}
    try:
        with open(_TARIFA_GAS_PATH, encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter=",")
            for row in reader:
                sector = row.get("sector", "").strip()
                estrato = row.get("estrato", "").strip()
                if sector.lower() == "residencial" and estrato.isdigit():
                    try:
                        cargo = float(row.get("cargo_por_consumo_mayor", "0") or "0")
                        if estrato not in result:
                            result[estrato] = []
                        result[estrato].append(cargo)
                    except:
                        pass
        # Promediar
        for est in result:
            result[est] = {"cargo_promedio": sum(result[est]) / len(result[est]) if result[est] else 0}
    except Exception as e:
        print(f"Error parsing gas tariffs: {e}")
    return result


def _normalize_commune_name(name: str) -> Optional[str]:
    """Normaliza un nombre de comuna para búsqueda."""
    if not name:
        return None
    normalized = name.lower().strip()
    return COMUNA_MAPPING.get(normalized)


def _build_context_for_llm(prompt: str, negocios: Dict, estructura: Dict, tariffs: Dict) -> str:
    """Extrae contexto relevante del prompt y datasets para el LLM de forma dinámica."""
    context_lines = []

    # 1. Identificar Comuna mencionada
    mentioned_commune = None
    for key, formal_name in COMUNA_MAPPING.items():
        if key.replace("_", " ") in prompt.lower():
            mentioned_commune = formal_name
            break

    # 2. Identificar tipos de negocio mencionados DINÁMICAMENTE
    relevant_types = _extract_relevant_types(prompt, negocios)

    # Sección 1: Competencia por tipo de negocio detectado
    if relevant_types:
        context_lines.append(f"=== DATOS DE NEGOCIOS PARA: {', '.join(relevant_types).upper()} en Medellín ===")
        # Agregamos por (comuna, barrio)
        area_counts = defaultdict(int) 
        for comm, barrios in negocios.items():
            for barrio, barrio_counts in barrios.items():
                for t in relevant_types:
                    count = barrio_counts.get(t, 0)
                    if count > 0:
                        area_counts[(comm, barrio)] += count
        
        # Mostrar todos los barrios con conteo positivo
        # Formato: [BARRIO] ([COMUNA]): [COUNT]
        for (comm, barrio), count in sorted(area_counts.items(), key=lambda x: -x[1]):
            context_lines.append(f"  - {barrio} ({comm}): {count} negocios aprox.")
        context_lines.append("")

    # Sección 2: Detalle por comuna si se menciona o si hay tipos relevantes
    if mentioned_commune and mentioned_commune in negocios:
        context_lines.append(f"=== DETALLE EN {mentioned_commune} ===")
        barrios_data = negocios[mentioned_commune]
        
        if relevant_types:
            for t in relevant_types:
                context_lines.append(f"Negocios de {t} por barrio:")
                for barrio, tipos in sorted(barrios_data.items(), key=lambda x: -x[1].get(t, 0))[:8]:
                    count = tipos.get(t, 0)
                    if count > 0:
                        context_lines.append(f"  - {barrio}: {count}")
        else:
            context_lines.append("Top barrios por total de negocios:")
            for barrio, tipos in sorted(barrios_data.items(), key=lambda x: -sum(x[1].values()))[:5]:
                context_lines.append(f"  - {barrio}: {sum(tipos.values())} negocios")
        context_lines.append("")

    # Sección 3: Estructura empresarial
    if mentioned_commune and mentioned_commune in estructura:
        context_lines.append(f"=== ESTRUCTURA EMPRESARIAL EN {mentioned_commune} ===")
        top_activities = sorted(estructura[mentioned_commune].items(), key=lambda x: -x[1])[:5]
        for activity, count in top_activities:
            context_lines.append(f"  - {activity}: {count} empresas")
        context_lines.append("")

    # Sección 4: Costos EPM
    if tariffs:
        context_lines.append("=== COSTOS ESTIMADOS DE SERVICIOS PÚBLICOS (EPM) ===")
        for estrato in ["3", "4", "5"]:
            total_est = 0
            if estrato in tariffs.get("energia", {}):
                total_est += tariffs["energia"][estrato].get("cargo_promedio", 0) * 100
            if estrato in tariffs.get("acueducto", {}):
                total_est += tariffs["acueducto"][estrato].get("cargo_promedio", 0) * 20
            if estrato in tariffs.get("gas", {}):
                total_est += tariffs["gas"][estrato].get("cargo_promedio", 0) * 10
            context_lines.append(f"  Estrato {estrato}: ~${total_est:,.0f}/mes")
        context_lines.append("")

    return "\n".join(context_lines)


_SYSTEM_PROMPT_TEMPLATE = """Eres MECIA Emprendedor, un asistente especializado en asesorar emprendedores de Medellín, Colombia.
Tu rol es conversar naturalmente sobre emprendimiento, negocios, ubicaciones, costos y estrategias de mercado.

CONTEXTO DE DATOS DISPONIBLES DE MEDELLÍN:
{datos_contexto}

INSTRUCCIONES DE RESPUESTA:
- Responde en español natural, amigable y motivador.
- Si el usuario pregunta por ubicaciones o cantidades de negocios en Medellín (ej: cuántas panaderías hay), DEBES incluir un campo "map_data" en el JSON.
- El campo "map_data" debe tener el tipo "markers" y una lista de "locations".
- CADA location debe tener: "name" (Nombre del Barrio), "comuna" (Nombre de la Comuna) y "count" (cantidad de negocios).
- IMPORTANTE: Incluye TODOS los barrios que el contexto indique que tienen ese tipo de negocio. No omitas ninguno. Queremos ver la densidad total en el mapa.

FORMATO DE RESPUESTA — responde ÚNICAMENTE con este JSON:
{{
  "texto": "Respuesta conversacional...",
  "recomendaciones_especificas": ["Rec 1", "Rec 2"],
  "prediccion_costo_mensual": {{ ... }},
  "map_data": {{
    "type": "markers",
    "locations": [
      {{"name": "Nombre Barrio 1", "comuna": "POBLADO", "count": 10}},
      {{"name": "Nombre Barrio 2", "comuna": "LAURELES-ESTADIO", "count": 15}}
    ]
  }}
}}

NOTAS:
- "map_data" es opcional.
- El nombre de la "comuna" debe coincidir EXACTAMENTE con los nombres en mayúsculas (ej: EL POBLADO, BELEN, ARANJUEZ).
"""


def _build_system_prompt(prompt: str, negocios: Dict, estructura: Dict, tariffs: Dict) -> str:
    contexto = _build_context_for_llm(prompt, negocios, estructura, tariffs)
    return _SYSTEM_PROMPT_TEMPLATE.format(datos_contexto=contexto)


async def _call_openai(prompt: str, system_prompt: str, api_key: str) -> Dict:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=api_key)
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        max_tokens=15000,
        temperature=0.7,
        response_format={"type": "json_object"},
    )
    raw = response.choices[0].message.content.strip()
    return json.loads(raw)


async def _call_gemini(prompt: str, system_prompt: str, api_key: str) -> Dict:
    import google.generativeai as genai

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=system_prompt,
    )
    response = await model.generate_content_async(prompt)
    raw = response.text.strip()
    
    # Limpiar posibles bloques de código triple backtick
    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].split("```")[0].strip()
        
    return json.loads(raw.strip())


async def entrepreneur_chat_real(
    prompt: str, provider: str, openai_key: str, gemini_key: str
) -> Dict[str, Any]:
    """
    Chatbot de emprendedor con contexto de negocios, estructura empresarial y tarifas.
    Retorna recomendaciones específicas basadas en datos reales.
    """
    negocios = _load_negocios_data()
    estructura = _load_estructura_empresarial()
    tariffs = _load_epm_tariffs()

    system_prompt = _build_system_prompt(prompt, negocios, estructura, tariffs)

    try:
        if provider == "openai" and openai_key:
            llm_result = await _call_openai(prompt, system_prompt, openai_key)
            model_used = "gpt-4o-mini"
        elif provider == "gemini" and gemini_key:
            llm_result = await _call_gemini(prompt, system_prompt, gemini_key)
            model_used = "gemini-1.5-flash"
        elif openai_key:
            llm_result = await _call_openai(prompt, system_prompt, openai_key)
            model_used = "gpt-4o-mini"
        elif gemini_key:
            llm_result = await _call_gemini(prompt, system_prompt, gemini_key)
            model_used = "gemini-1.5-flash"
        else:
            raise ValueError("No hay API key configurada para ningún proveedor LLM.")

        # Blindaje: construir map_data de forma determinística desde el dataset.
        deterministic_map_data = _build_map_data_from_dataset(prompt, negocios)

        # Enriquecer map_data con coordenadas
        map_data = deterministic_map_data or llm_result.get("map_data")
        if map_data and map_data.get("type") == "markers":
            locations = map_data.get("locations", [])
            enriched_locations = []
            index_by_comuna = defaultdict(int)
            for loc in locations:
                barrio = loc.get("name", "")
                comuna = _normalize_comuna_for_coordinates(loc.get("comuna", ""))
                # Priorizar buscar por comuna para obtener el centro
                coords = get_coordinates(comuna) or get_coordinates(barrio)
                if not coords:
                    # Nunca descartamos puntos del mapa; fallback al centro de Medellin.
                    coords = DEFAULT_MEDELLIN_COORDS

                # Distribuye barrios por comuna en una espiral para evitar solapes.
                idx = index_by_comuna[comuna]
                index_by_comuna[comuna] += 1

                slots_per_ring = 8
                ring = (idx // slots_per_ring) + 1
                slot = idx % slots_per_ring
                angle = (2 * math.pi * slot / slots_per_ring) + (ring * 0.35)
                radius = 0.0035 * ring

                lat_offset = radius * math.sin(angle)
                lng_offset = radius * math.cos(angle)

                loc["lat"] = coords[0] + lat_offset
                loc["lng"] = coords[1] + lng_offset
                # El nombre para el popup será "Barrio, Comuna"
                loc["comuna"] = comuna
                loc["name"] = f"{barrio} ({comuna})" if comuna else barrio
                enriched_locations.append(loc)
            map_data["locations"] = enriched_locations

        return {
            "output": llm_result.get("texto", ""),
            "recomendaciones_especificas": llm_result.get("recomendaciones_especificas", []),
            "prediccion_costo_mensual": llm_result.get("prediccion_costo_mensual", {}),
            "map_data": map_data,
            "model": model_used,
            "provider": provider,
            "mock": False,
        }

    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error in entrepreneur_chat_real: {e}")
        print(error_trace)
        
        from app.services.llm_mock import LLMMockService
        mock = LLMMockService()
        result = mock.simulate_entrepreneur_chat(prompt)
        result["error_llm"] = str(e)
        result["error_trace"] = error_trace
        result["fallback_mock"] = True
        return result
