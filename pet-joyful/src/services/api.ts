import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 10000, // Tempo limite para requisições
  headers: {
    "Content-Type": "application/json",
  },
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
