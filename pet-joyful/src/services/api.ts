import axios from "axios";

const baseURL = 'http://localhost:3002';

const api = axios.create({
  baseURL,
  timeout: 10000, // Tempo limite para requisições
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Habilita envio de cookies cross-origin se necessário
});

// Interceptores (opcional)
api.interceptors.request.use(
  (config) => {
    // Adicione tokens ou headers aqui (ex: autenticação)
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
