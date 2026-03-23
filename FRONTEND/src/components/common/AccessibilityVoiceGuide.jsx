import { useEffect, useRef, useState } from "react";
import { llmService } from "@/services/llmService";

const STORAGE_KEY = "mecia_voice_guide_enabled";
const COOLDOWN_MS = 1200;

function getElementLabel(element) {
  if (!element) return "";

  const explicit =
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.getAttribute("placeholder") ||
    element.getAttribute("alt");

  if (explicit && explicit.trim()) return explicit.trim();

  if (element.id) {
    const label = document.querySelector(`label[for=\"${element.id}\"]`);
    if (label?.textContent?.trim()) return label.textContent.trim();
  }

  const text = element.textContent?.replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 120);

  return element.tagName?.toLowerCase() || "elemento";
}

export default function AccessibilityVoiceGuide() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY) !== "false");
  const [status, setStatus] = useState("Guia de voz activa");
  
  // Voz predeterminada - Nova es clara y natural para usuarios ciegos
  const voice = "nova";
  const language = "es-CO";

  const lastTextRef = useRef("");
  const lastAtRef = useRef(0);
  const audioRef = useRef(null);
  const urlRef = useRef("");
  const cacheRef = useRef(new Map());
  const focusTimerRef = useRef(null);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = "";
    }
  };

  const speak = async (message) => {
    const text = `${message || ""}`.trim();
    if (!enabled || !text) return;

    const now = Date.now();
    if (text === lastTextRef.current && now - lastAtRef.current < COOLDOWN_MS) return;

    lastTextRef.current = text;
    lastAtRef.current = now;
    setStatus(`Leyendo: ${text}`);

    try {
      const cacheKey = `${voice}:${language}:${text}`;
      let objectUrl = cacheRef.current.get(cacheKey);

      if (!objectUrl) {
        const blob = await llmService.textToSpeech({ text, voice, language });
        objectUrl = URL.createObjectURL(blob);
        cacheRef.current.set(cacheKey, objectUrl);
      }

      cleanupAudio();
      urlRef.current = objectUrl;
      const audio = new Audio(objectUrl);
      audioRef.current = audio;
      await audio.play();
    } catch (error) {
      setStatus("Guia de voz disponible, pero TTS no responde");
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setStatus("Guia de voz desactivada");
      cleanupAudio();
      return undefined;
    }

    setStatus("Guia de voz activa");

    const onFocusIn = (event) => {
      clearTimeout(focusTimerRef.current);
      focusTimerRef.current = setTimeout(() => {
        const label = getElementLabel(event.target);
        if (label) void speak(label);
      }, 120);
    };

    document.addEventListener("focusin", onFocusIn, true);
    return () => {
      clearTimeout(focusTimerRef.current);
      document.removeEventListener("focusin", onFocusIn, true);
    };
  }, [enabled, voice]);

  useEffect(() => {
    return () => {
      cleanupAudio();
      cacheRef.current.forEach((url) => URL.revokeObjectURL(url));
      cacheRef.current.clear();
    };
  }, []);

  // Exponer función global para alternar la voz
  useEffect(() => {
    window.toggleVoiceGuide = () => {
      setEnabled((prev) => !prev);
    };
    return () => {
      delete window.toggleVoiceGuide;
    };
  }, []);

  return (
    <div style={{ position: "fixed", right: "1rem", bottom: "1rem", zIndex: 9999, display: "flex", gap: "0.5rem" }}>
      <button
        type="button"
        onClick={() => setEnabled((prev) => !prev)}
        aria-pressed={enabled}
        aria-label={enabled ? "Desactivar guia de voz" : "Activar guia de voz"}
        style={{ borderRadius: 8, border: "1px solid #0f766e", background: enabled ? "#0d9488" : "#1f2937", color: "#fff", padding: "0.5rem 0.75rem", fontWeight: 600 }}
      >
        {enabled ? "Voz ON" : "Voz OFF"}
      </button>

      <span className="sr-only" aria-live="polite">{status}</span>
    </div>
  );
}
