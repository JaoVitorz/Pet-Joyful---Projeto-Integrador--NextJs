import axios from 'axios';

// URL base do microserviço de perfil
const PROFILE_API_BASE_URL = process.env.NEXT_PUBLIC_PROFILE_API_URL || 'http://localhost:3001';

// Criar instância do axios para o microserviço de perfil
const profileApi = axios.create({
  baseURL: PROFILE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT automaticamente
profileApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
profileApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API de perfil:', error);
    
    // Se token expirou, redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Tipos TypeScript para o perfil
export interface Profile {
  _id?: string;
  userId: string;
  nome: string;
  email: string;
  telefone?: string;
  data_nascimento?: string;
  tipo_usuario: 'tutor' | 'instituicao' | 'clinica';
  foto_perfil?: string;
  bio?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileUpdateData {
  nome?: string;
  telefone?: string;
  data_nascimento?: string;
  bio?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Funções da API de perfil
export const profileService = {
  // Verificar saúde do serviço
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await profileApi.get('/health');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao verificar saúde do serviço');
    }
  },

  // Buscar perfil do usuário autenticado
  async getMyProfile(): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.get('/api/profile/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar perfil');
    }
  },

  // Buscar perfil por ID
  async getProfileById(userId: string): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.get(`/api/profile/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar perfil');
    }
  },

  // Atualizar perfil do usuário autenticado
  async updateMyProfile(data: ProfileUpdateData): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.put('/api/profile/me', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  },

  // Atualizar perfil por ID (apenas o próprio usuário)
  async updateProfileById(userId: string, data: ProfileUpdateData): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.put(`/api/profile/${userId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  },

  // Upload de foto de perfil
  async uploadProfilePhoto(file: File): Promise<ApiResponse<{ foto_perfil: string }>> {
    try {
      const formData = new FormData();
      formData.append('foto', file);

      const response = await profileApi.post('/api/profile/me/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer upload da foto');
    }
  },
};

export default profileService;
