import axios from 'axios';

// URL base do microserviço de perfil
const API_BASE_URL = process.env.NEXT_PUBLIC_PROFILE_API_URL || 'http://localhost:3004';

// Criar instância do axios com configurações padrão
const profileApi = axios.create({
  baseURL: `${API_BASE_URL}/api/profile`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT automaticamente
profileApi.interceptors.request.use(
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

// Interceptor para tratar erros de resposta
profileApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Trata erros de autenticação
    if (error.response) {
      const { status, data } = error.response;

      // Erro de autenticação (401 ou 403)
      if (status === 401 || status === 403) {
        const errorMessage = data?.message || 'Token inválido ou expirado';

        // Remove token inválido do localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Redireciona para login
          window.location.href = '/login';
        }

        // Retorna erro formatado
        return Promise.reject({
          message: errorMessage,
          status: status,
          data: data,
        });
      }

      // Outros erros HTTP
      const errorMessage = data?.message || data?.error || 'Erro ao processar requisição';
      return Promise.reject({
        message: errorMessage,
        status: status,
        data: data,
      });
    }

    // Erro de rede ou outros erros
    return Promise.reject({
      message: error.message || 'Erro de conexão. Verifique se o microserviço de perfil está rodando na porta 3004.',
      status: 0,
      data: null,
    });
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
      const response = await profileApi.get('/me');
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao buscar perfil:', error);
      // O erro já está formatado pelo interceptor
      const err = error as { message?: string; status?: number; data?: any };
      throw new Error(err.message || 'Erro ao buscar perfil');
    }
  },

  // Buscar perfil por ID
  async getProfileById(userId: string): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.get(`/${userId}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao buscar perfil:', error);
      const err = error as { message?: string; status?: number; data?: any };
      throw new Error(err.message || 'Erro ao buscar perfil');
    }
  },

  // Atualizar perfil do usuário autenticado
  async updateMyProfile(data: ProfileUpdateData): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.put('/me', data);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao atualizar perfil:', error);
      // O erro já está formatado pelo interceptor
      const err = error as { message?: string; status?: number; data?: any };
      throw new Error(err.message || 'Erro ao atualizar perfil');
    }
  },

  // Atualizar perfil por ID (apenas o próprio usuário)
  async updateProfileById(userId: string, data: ProfileUpdateData): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.put(`/${userId}`, data);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao atualizar perfil:', error);
      const err = error as { message?: string; status?: number; data?: any };
      throw new Error(err.message || 'Erro ao atualizar perfil');
    }
  },

  // Upload de foto de perfil
  async uploadProfilePhoto(file: File): Promise<ApiResponse<{ foto_perfil: string }>> {
    try {
      const formData = new FormData();
      formData.append('foto', file);

      const response = await profileApi.post('/me/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao fazer upload da foto:', error);
      const err = error as { message?: string; status?: number; data?: any };
      throw new Error(err.message || 'Erro ao fazer upload da foto');
    }
  },
};

export default profileService;
