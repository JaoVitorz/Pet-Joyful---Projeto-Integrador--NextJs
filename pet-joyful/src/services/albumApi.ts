import axios from "axios";

// MODO: 'mock' ou 'api'
// Altere para 'api' quando o backend estiver pronto
const MODE = "mock";

const API_URL =
  process.env.NEXT_PUBLIC_PROFILE_API_URL ||
  "https://edicao-perfil-microservice.onrender.com/api";

console.log("[albumApi] Configuração:", {
  MODE,
  API_URL,
  env: process.env.NEXT_PUBLIC_PROFILE_API_URL,
});

// Importar mock se necessário
if (MODE === "mock") {
  console.warn(
    "[albumApi] ⚠️ MODO MOCK ATIVO - Os álbuns são salvos apenas no localStorage.\n" +
      "Para usar o backend real, altere MODE para 'api' em albumApi.ts"
  );
}

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// Usar mock ou API real
const useMock = MODE === "mock";

// Criar álbum
export const createAlbum = async (data: {
  titulo: string;
  descricao?: string;
  privacidade?: "publico" | "privado" | "amigos";
}) => {
  if (useMock) {
    const { createAlbum: mockCreate } = await import("./albumApi.mock");
    return mockCreate(data);
  }

  try {
    console.log("[albumApi] Criando álbum:", {
      data,
      url: `${API_URL}/albums`,
    });
    const token = getToken();
    console.log("[albumApi] Token disponível:", !!token);

    const response = await axios.post(`${API_URL}/albums`, data, {
      headers: getAuthHeaders(),
    });
    console.log("[albumApi] Álbum criado com sucesso:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "[albumApi] Erro ao criar álbum:",
      error.response?.data || error.message || error
    );
    console.error("[albumApi] Status:", error.response?.status);
    console.error("[albumApi] Headers enviados:", error.config?.headers);
    throw error;
  }
};

// Listar meus álbuns
export const getMyAlbums = async () => {
  if (useMock) {
    const { getMyAlbums: mockGet } = await import("./albumApi.mock");
    return mockGet();
  }

  try {
    const response = await axios.get(`${API_URL}/albums`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "[albumApi] Erro ao buscar álbuns:",
      error.response?.data || error
    );
    throw error;
  }
};

// Buscar álbum específico
export const getAlbum = async (albumId: string) => {
  if (useMock) {
    const { getAlbum: mockGet } = await import("./albumApi.mock");
    return mockGet(albumId);
  }

  try {
    const response = await axios.get(`${API_URL}/albums/${albumId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "[albumApi] Erro ao buscar álbum:",
      error.response?.data || error
    );
    throw error;
  }
};

// Atualizar álbum
export const updateAlbum = async (
  albumId: string,
  data: {
    titulo?: string;
    descricao?: string;
    privacidade?: "publico" | "privado" | "amigos";
    capa?: string;
  }
) => {
  if (useMock) {
    const { updateAlbum: mockUpdate } = await import("./albumApi.mock");
    return mockUpdate(albumId, data);
  }

  try {
    const response = await axios.put(`${API_URL}/albums/${albumId}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "[albumApi] Erro ao atualizar álbum:",
      error.response?.data || error
    );
    throw error;
  }
};

// Adicionar foto ao álbum
export const addPhotoToAlbum = async (
  albumId: string,
  file: File,
  legenda?: string
) => {
  if (useMock) {
    const { addPhotoToAlbum: mockAdd } = await import("./albumApi.mock");
    return mockAdd(albumId, file, legenda);
  }

  try {
    const formData = new FormData();
    formData.append("foto", file);
    if (legenda) formData.append("legenda", legenda);

    const response = await axios.post(
      `${API_URL}/albums/${albumId}/photos`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "[albumApi] Erro ao adicionar foto:",
      error.response?.data || error
    );
    throw error;
  }
};

// Remover foto do álbum
export const removePhotoFromAlbum = async (albumId: string, fotoId: string) => {
  if (useMock) {
    const { removePhotoFromAlbum: mockRemove } = await import(
      "./albumApi.mock"
    );
    return mockRemove(albumId, fotoId);
  }

  try {
    const response = await axios.delete(
      `${API_URL}/albums/${albumId}/photos/${fotoId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "[albumApi] Erro ao remover foto:",
      error.response?.data || error
    );
    throw error;
  }
};

// Deletar álbum
export const deleteAlbum = async (albumId: string) => {
  if (useMock) {
    const { deleteAlbum: mockDelete } = await import("./albumApi.mock");
    return mockDelete(albumId);
  }

  try {
    const response = await axios.delete(`${API_URL}/albums/${albumId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "[albumApi] Erro ao deletar álbum:",
      error.response?.data || error
    );
    throw error;
  }
};
