import { API_CONFIG, getAuthHeaders } from "../config/api";

export const llmService = {
  async getMockModels() {
    const response = await fetch(`${API_CONFIG.baseURL}/api/llm/models`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async simulateChat({ prompt, model = "gpt-4o-mini-sim" }) {
    const response = await fetch(`${API_CONFIG.baseURL}/api/llm/simulate/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model }),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async simulateRecommendation({ business_type, comuna = null }) {
    const response = await fetch(`${API_CONFIG.baseURL}/api/llm/simulate/recommendation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_type, comuna }),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async securityChat({ prompt }) {
    const response = await fetch(`${API_CONFIG.baseURL}/api/llm/seguridad/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async entrepreneurChat({ prompt, conversation_id }) {
    const body = { prompt };
    if (conversation_id) body.conversation_id = conversation_id;

    const response = await fetch(`${API_CONFIG.baseURL}/api/llm/emprendedor/consulta`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Sesión expirada o no autorizada. Por favor inicia sesión de nuevo.");
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  // ══════════════════════════════════════════════════════════
  // CONVERSATION HISTORY METHODS
  // ══════════════════════════════════════════════════════════

  async getConversations() {
    const response = await fetch(`${API_CONFIG.baseURL}/api/llm/emprendedor/conversations`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async getConversation(conversationId) {
    const response = await fetch(`${API_CONFIG.baseURL}/api/llm/emprendedor/conversations/${conversationId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async deleteConversation(conversationId) {
    const response = await fetch(`${API_CONFIG.baseURL}/api/llm/emprendedor/conversations/${conversationId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async analyzeFactura(imageFiles) {
    const formData = new FormData();
    const files = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
    files.forEach((file) => formData.append("files", file));
    const response = await fetch(`${API_CONFIG.baseURL}/api/llm/facturas/analizar`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async textToSpeech({ text, voice = "alloy" }) {
    const response = await fetch(`${API_CONFIG.baseURL}/api/llm/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.blob();
  },
};
