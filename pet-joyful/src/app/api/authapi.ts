// src/api/authApi.ts
import axios from 'axios';

// Backend Principal Pet-Joyful (autenticação, mensagens, denúncias)
// URL de produção: https://pet-joyful-backend-1.onrender.com
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://pet-joyful-backend-1.onrender.com';

const api = axios.create({
  baseURL: `${AUTH_API_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
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

export const authApi = {
  register: (data: { nome: string; email: string; senha: string; tipo?: string }) => 
    api.post('/register', data),

  login: (data: { email: string; senha: string }) => 
    api.post('/login', data),

  getProfile: () => 
    api.get('/me'), // Endpoint: /api/auth/me com Bearer Token
};