import axios from "axios";

// Criar instância do axios com configurações padrão
// Usa rotas locais da API Next.js que atuam como proxy para o microserviço
const profileApi = axios.create({
  baseURL: "/api/profile",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT automaticamente
profileApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Se for FormData, remove o Content-Type para o axios definir automaticamente com boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
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
        const errorMessage = data?.message || "Token inválido ou expirado";

        // Remove token inválido do localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Redireciona para login
          window.location.href = "/login";
        }

        // Retorna erro formatado
        return Promise.reject({
          message: errorMessage,
          status: status,
          data: data,
        });
      }

      // Outros erros HTTP
      const errorMessage =
        data?.message || data?.error || "Erro ao processar requisição";
      return Promise.reject({
        message: errorMessage,
        status: status,
        data: data,
      });
    }

    // Erro de rede ou outros erros
    return Promise.reject({
      message:
        error.message ||
        "Erro de conexão. Verifique se o microserviço de perfil está rodando na porta 3001.",
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
  tipo_usuario: "tutor" | "instituicao" | "clinica";
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
  async healthCheck(): Promise<ApiResponse<unknown>> {
    try {
      const response = await profileApi.get("/health");
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(
        err.response?.data?.message || "Erro ao verificar saúde do serviço"
      );
    }
  },

  // Buscar perfil do usuário autenticado
  async getMyProfile(): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.get("/me");
      return response.data;
    } catch (error: unknown) {
      console.error("Erro ao buscar perfil:", error);
      // O erro já está formatado pelo interceptor
      const err = error as {
        message?: string;
        status?: number;
        data?: unknown;
      };
      throw new Error(err.message || "Erro ao buscar perfil");
    }
  },

  // Buscar perfil por ID
  async getProfileById(userId: string): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.get(`/${userId}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Erro ao buscar perfil:", error);
      const err = error as {
        message?: string;
        status?: number;
        data?: unknown;
      };
      throw new Error(err.message || "Erro ao buscar perfil");
    }
  },

  // Atualizar perfil do usuário autenticado
  async updateMyProfile(
    data: ProfileUpdateData
  ): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.put("/me", data);
      return response.data;
    } catch (error: unknown) {
      console.error("Erro ao atualizar perfil:", error);
      // O erro já está formatado pelo interceptor
      const err = error as {
        message?: string;
        status?: number;
        data?: unknown;
      };
      throw new Error(err.message || "Erro ao atualizar perfil");
    }
  },

  // Atualizar perfil por ID (apenas o próprio usuário)
  async updateProfileById(
    userId: string,
    data: ProfileUpdateData
  ): Promise<ApiResponse<Profile>> {
    try {
      const response = await profileApi.put(`/${userId}`, data);
      return response.data;
    } catch (error: unknown) {
      console.error("Erro ao atualizar perfil:", error);
      const err = error as {
        message?: string;
        status?: number;
        data?: unknown;
      };
      throw new Error(err.message || "Erro ao atualizar perfil");
    }
  },

  // Upload de foto de perfil
  async uploadProfilePhoto(
    file: File
  ): Promise<ApiResponse<{ foto_perfil: string }>> {
    try {
      // Validar tipo de arquivo
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      console.log("[profileApi] Arquivo selecionado:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (!validTypes.includes(file.type)) {
        throw new Error(
          "Tipo de arquivo inválido. Use apenas imagens (JPEG, PNG, GIF ou WebP)."
        );
      }

      // Validar tamanho (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB em bytes
      if (file.size > maxSize) {
        throw new Error("Arquivo muito grande. O tamanho máximo é 5MB.");
      }

      const formData = new FormData();
      formData.append("foto", file);

      // Log para debug
      console.log(
        "[profileApi] Enviando para:",
        "/api/profile/me/photo"
      );
      console.log(
        "[profileApi] Arquivo:",
        file.name,
        "Tipo:",
        file.type,
        "Tamanho:",
        file.size
      );
      console.log("[profileApi] FormData tem arquivo:", formData.has("foto"));
      console.log("[profileApi] Arquivo no FormData:", formData.get("foto"));

      // Não setar manualmente 'Content-Type' aqui. O browser/axios
      // definem o boundary correto para multipart/form-data.
      const response = await profileApi.post("/me/photo", formData);

      console.log("[profileApi] Resposta do servidor:", response.data);

      return response.data;
    } catch (error: unknown) {
      console.error("[profileApi] Erro completo ao fazer upload:", error);

      // Se for erro do axios com resposta do servidor
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string; error?: string };
          };
          message?: string;
        };

        const serverMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error;

        if (serverMessage) {
          throw new Error(serverMessage);
        }
      }

      // Se for erro personalizado (validação)
      const err = error as { message?: string };
      throw new Error(err.message || "Erro ao fazer upload da foto");
    }
  },
};

export default profileService;
