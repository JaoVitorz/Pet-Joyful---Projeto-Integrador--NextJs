import axios from "axios";

// API de Eventos - Backend PET-JOYFUL-EVENTS-SERVICE
const eventsAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EVENTS_API_URL || "https://pet-joyful-events-service.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT
eventsAPI.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
eventsAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default eventsAPI;
