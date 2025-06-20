// src/api/authApi.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const authApi = {
  register: (data: { name: string; email: string; password: string }) => 
    api.post('/register', data),

  login: (data: { email: string; password: string }) => 
    api.post('/login', data),

  getProfile: (token: string) => 
    api.get('/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }),
};