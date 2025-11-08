import axios from "axios";

// URL do backend PET-JOYFUL-EVENTS-SERVICE
// Use NEXT_PUBLIC_ para variáveis acessíveis no cliente
const baseURL = process.env.NEXT_PUBLIC_EVENTS_API_URL || 'http://localhost:3002';

const api = axios.create({
  baseURL,
  timeout: 10000, // Tempo limite para requisições
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Habilita envio de cookies cross-origin se necessário
});

// Interceptores para adicionar token JWT
api.interceptors.request.use(
  (config) => {
    // Adicione tokens ou headers aqui (ex: autenticação)
    // Verifica se está no ambiente do cliente (browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[API] Token JWT adicionado ao header para: ${config.method?.toUpperCase()} ${config.url}`);
      } else {
        console.warn(`[API] ⚠️ Nenhum token encontrado no localStorage para: ${config.method?.toUpperCase()} ${config.url}`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Trata erros 401 (não autorizado)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        // Redireciona para login se necessário
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
