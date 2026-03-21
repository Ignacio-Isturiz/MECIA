import { API_CONFIG } from "../config/api";

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
};
