import api from "./api";

// Prefixo da API - pode ser configurado via variável de ambiente
// O backend PET-JOYFUL-EVENTS-SERVICE usa /api/events (inglês)
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || "/api";
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "events"; // Backend usa "events" (inglês)

const eventService = {
  // Método esperado pela página de criação: eventService.create(data)
  async create(eventData) {
    // O backend usa /api/events, mas tenta ambos para compatibilidade
    const endpoints =
      API_PREFIX === "/api"
        ? [`/api/${API_ENDPOINT}`, `/api/events`, `/api/eventos`] // Tenta o configurado, depois events, depois eventos
        : [`${API_PREFIX}/${API_ENDPOINT}`];

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        if (typeof window !== "undefined") {
          console.log("Criando evento com dados:", eventData);
          const fullUrl = `${api.defaults.baseURL}${endpoint}`;
          console.log(`[eventService] POST ${endpoint}`);
          console.log(`[eventService] URL completa: ${fullUrl}`);
          console.log(`[eventService] Base URL: ${api.defaults.baseURL}`);
        }

        const response = await api.post(endpoint, eventData);

        if (typeof window !== "undefined") {
          console.log("✅ Resposta da API:", response.data);
          console.log(`✅ Endpoint funcionou: ${endpoint}`);
        }

        return response.data;
      } catch (error) {
        lastError = error;

        // Se for 404 e ainda há outros endpoints para tentar, continua
        if (
          error.response?.status === 404 &&
          endpoints.indexOf(endpoint) < endpoints.length - 1
        ) {
          if (typeof window !== "undefined") {
            console.warn(
              `⚠️ Endpoint ${endpoint} retornou 404, tentando próximo...`
            );
          }
          continue;
        }

        // Se não for 404 ou foi o último endpoint, para e lança o erro
        break;
      }
    }

    // Se chegou aqui, todos os endpoints falharam
    const error = lastError;

    if (typeof window !== "undefined") {
      console.error("Erro ao criar evento:", error);

      // Extrai detalhes do erro de forma segura
      let errorDetails = {};

      if (error) {
        if (error.message) {
          errorDetails.message = error.message;
        }
        if (error.response) {
          if (error.response.data) {
            errorDetails.response = error.response.data;
          }
          if (error.response.status) {
            errorDetails.status = error.response.status;
          }
        }
        if (error.code) {
          errorDetails.code = error.code;
        }
      }

      // Se não houver detalhes, adiciona uma mensagem padrão
      if (Object.keys(errorDetails).length === 0) {
        errorDetails.message = "Erro desconhecido ao criar evento";
        errorDetails.rawError = String(error);
      }

      console.error("Detalhes do erro:", errorDetails);

      // Se for erro 404, pode ser que o endpoint esteja errado
      if (error.response && error.response.status === 404) {
        const attemptedUrls = endpoints.map(
          (e) => `${api.defaults.baseURL}${e}`
        );
        console.error(
          "═══════════════════════════════════════════════════════"
        );
        console.error("[eventService] ❌ ERRO 404 - ROTA NÃO ENCONTRADA!");
        console.error(
          "═══════════════════════════════════════════════════════"
        );
        console.error(`URLs tentadas:`);
        attemptedUrls.forEach((url) => console.error(`   - ${url}`));
        console.error(`Método: POST`);
        console.error(`Status: ${error.response.status}`);
        console.error(`Resposta do servidor:`, error.response.data);
        console.error(
          "═══════════════════════════════════════════════════════"
        );
        console.error("💡 POSSÍVEIS SOLUÇÕES:");
        console.error(
          "1. Verifique se o backend PET-JOYFUL-EVENTS-SERVICE está rodando"
        );
        console.error("2. Verifique se a porta está correta (padrão: 3002)");
        console.error("3. Verifique se o endpoint existe no backend:");
        attemptedUrls.forEach((url) => console.error(`   → POST ${url}`));
        console.error(
          "4. Verifique a documentação do backend para o endpoint correto"
        );
        console.error(
          "═══════════════════════════════════════════════════════"
        );
        errorDetails.suggestedFix = `Tentamos os seguintes endpoints: ${attemptedUrls.join(
          ", "
        )}. Nenhum funcionou. Verifique qual endpoint o backend realmente usa.`;
      } else if (
        error.code === "ECONNREFUSED" ||
        error.code === "ERR_NETWORK"
      ) {
        console.error(
          "═══════════════════════════════════════════════════════"
        );
        console.error("[eventService] ❌ ERRO DE CONEXÃO!");
        console.error(
          "═══════════════════════════════════════════════════════"
        );
        console.error(
          `Não foi possível conectar ao backend em: ${api.defaults.baseURL}`
        );
        console.error(
          "💡 Verifique se o backend PET-JOYFUL-EVENTS-SERVICE está rodando"
        );
        console.error(
          "═══════════════════════════════════════════════════════"
        );
      }
    }

    throw error;
  },

  async getEvents(query = {}) {
    try {
      const { status, eventType, city, page = 1, limit = 9 } = query;
      const params = {
        status,
        eventType,
        city,
        page,
        limit,
      };

      // Remove empty params
      Object.keys(params).forEach(
        (key) =>
          (params[key] === undefined || params[key] === "") &&
          delete params[key]
      );

      // Endpoint do backend PET-JOYFUL-EVENTS-SERVICE (usa /api/events)
      const endpoint = `${API_PREFIX}/${API_ENDPOINT}`;

      if (typeof window !== "undefined") {
        console.log(`[eventService] GET ${endpoint}`, params);
        console.log(`[eventService] Base URL: ${api.defaults.baseURL}`);
      }

      const response = await api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      if (typeof window !== "undefined") {
        console.error("[eventService] Erro ao carregar eventos:", error);
        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Dados:", error.response.data);
        } else if (
          error.code === "ERR_NETWORK" ||
          error.code === "ECONNREFUSED"
        ) {
          console.error("Erro de conexão com o backend de eventos");
        }
      }
      throw error;
    }
  },

  async getEventById(id) {
    try {
      // Endpoint do backend PET-JOYFUL-EVENTS-SERVICE (usa /api/events)
      const endpoint = `${API_PREFIX}/${API_ENDPOINT}/${id}`;

      if (typeof window !== "undefined") {
        console.log(`[eventService] GET ${endpoint}`);
      }

      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      if (typeof window !== "undefined") {
        console.error("[eventService] Erro ao buscar evento:", error);
      }
      throw error;
    }
  },

  // Compatibilidade com código existente
  async getById(id) {
    return await eventService.getEventById(id);
  },

  async getAll(query) {
    // query pode conter page/limit/filters
    // Mapeia para getEvents
    return await eventService.getEvents(query);
  },

  async updateEvent(id, eventData) {
    try {
      // Endpoint do backend PET-JOYFUL-EVENTS-SERVICE (usa /api/events)
      const endpoint = `${API_PREFIX}/${API_ENDPOINT}/${id}`;
      const response = await api.put(endpoint, eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteEvent(id) {
    try {
      // Endpoint do backend PET-JOYFUL-EVENTS-SERVICE (usa /api/events)
      const endpoint = `${API_PREFIX}/${API_ENDPOINT}/${id}`;
      await api.delete(endpoint);
    } catch (error) {
      throw error;
    }
  },
};

export default eventService;
