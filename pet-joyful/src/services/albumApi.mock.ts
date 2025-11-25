// Mock temporário para sistema de álbuns (até backend estar pronto)
import { Album, Foto } from "@/types/album.types";

const STORAGE_KEY = "petjoyful_albums";
const PHOTOS_STORAGE_KEY = "petjoyful_album_photos";

// Simula delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Obter user ID do token
const getUserId = (): string => {
  if (typeof window === "undefined") return "mock-user";
  const token = localStorage.getItem("token");
  if (!token) return "mock-user";

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.id || "mock-user";
  } catch {
    return "mock-user";
  }
};

// Carregar álbuns do localStorage
const loadAlbumsFromStorage = (): Album[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Salvar álbuns no localStorage
const saveAlbumsToStorage = (albums: Album[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
  }
};

// Carregar fotos do localStorage
const loadPhotosFromStorage = (): Record<string, Foto[]> => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(PHOTOS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Salvar fotos no localStorage
const savePhotosToStorage = (photos: Record<string, Foto[]>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));
  }
};

// Gerar ID único
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

// Criar álbum (MOCK)
export const createAlbum = async (data: {
  titulo: string;
  descricao?: string;
  privacidade?: "publico" | "privado" | "amigos";
}) => {
  console.log("[albumApi.mock] Criando álbum:", data);
  await delay(500);

  const albums = loadAlbumsFromStorage();
  const userId = getUserId();

  const newAlbum: Album = {
    _id: generateId(),
    userId,
    titulo: data.titulo,
    descricao: data.descricao || "",
    fotos: [],
    privacidade: data.privacidade || "publico",
    total_fotos: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  albums.push(newAlbum);
  saveAlbumsToStorage(albums);

  return { success: true, data: newAlbum };
};

// Listar meus álbuns (MOCK)
export const getMyAlbums = async () => {
  console.log("[albumApi.mock] Listando álbuns");
  await delay(300);

  const albums = loadAlbumsFromStorage();
  const userId = getUserId();
  const myAlbums = albums.filter((album) => album.userId === userId);

  // Atualizar total de fotos
  const photos = loadPhotosFromStorage();
  myAlbums.forEach((album) => {
    album.fotos = photos[album._id] || [];
    album.total_fotos = album.fotos.length;
    album.capa = album.fotos[0]?.url;
  });

  return { success: true, data: myAlbums };
};

// Buscar álbum específico (MOCK)
export const getAlbum = async (albumId: string) => {
  console.log("[albumApi.mock] Buscando álbum:", albumId);
  await delay(300);

  const albums = loadAlbumsFromStorage();
  const album = albums.find((a) => a._id === albumId);

  if (!album) {
    throw new Error("Álbum não encontrado");
  }

  const photos = loadPhotosFromStorage();
  album.fotos = photos[albumId] || [];
  album.total_fotos = album.fotos.length;
  album.capa = album.fotos[0]?.url;

  return { success: true, data: album };
};

// Atualizar álbum (MOCK)
export const updateAlbum = async (
  albumId: string,
  data: {
    titulo?: string;
    descricao?: string;
    privacidade?: "publico" | "privado" | "amigos";
    capa?: string;
  }
) => {
  console.log("[albumApi.mock] Atualizando álbum:", albumId, data);
  await delay(500);

  const albums = loadAlbumsFromStorage();
  const albumIndex = albums.findIndex((a) => a._id === albumId);

  if (albumIndex === -1) {
    throw new Error("Álbum não encontrado");
  }

  albums[albumIndex] = {
    ...albums[albumIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  saveAlbumsToStorage(albums);

  return { success: true, data: albums[albumIndex] };
};

// Adicionar foto ao álbum (MOCK)
export const addPhotoToAlbum = async (
  albumId: string,
  file: File,
  legenda?: string
) => {
  console.log("[albumApi.mock] Adicionando foto ao álbum:", albumId);
  await delay(1000);

  // Converter arquivo para base64
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  const photos = loadPhotosFromStorage();
  const albumPhotos = photos[albumId] || [];

  const newPhoto: Foto = {
    _id: generateId(),
    url: base64,
    public_id: `mock_${generateId()}`,
    legenda: legenda || "",
    ordem: albumPhotos.length,
    data_upload: new Date().toISOString(),
  };

  albumPhotos.push(newPhoto);
  photos[albumId] = albumPhotos;
  savePhotosToStorage(photos);

  // Atualizar capa do álbum
  if (albumPhotos.length === 1) {
    await updateAlbum(albumId, { capa: base64 });
  }

  return { success: true, data: newPhoto };
};

// Remover foto do álbum (MOCK)
export const removePhotoFromAlbum = async (albumId: string, fotoId: string) => {
  console.log("[albumApi.mock] Removendo foto:", albumId, fotoId);
  await delay(500);

  const photos = loadPhotosFromStorage();
  const albumPhotos = photos[albumId] || [];

  const updatedPhotos = albumPhotos.filter((photo) => photo._id !== fotoId);
  photos[albumId] = updatedPhotos;
  savePhotosToStorage(photos);

  // Atualizar capa se necessário
  if (updatedPhotos.length > 0 && updatedPhotos[0].url) {
    await updateAlbum(albumId, { capa: updatedPhotos[0].url });
  } else {
    await updateAlbum(albumId, { capa: undefined });
  }

  return { success: true, message: "Foto removida" };
};

// Deletar álbum (MOCK)
export const deleteAlbum = async (albumId: string) => {
  console.log("[albumApi.mock] Deletando álbum:", albumId);
  await delay(500);

  const albums = loadAlbumsFromStorage();
  const filteredAlbums = albums.filter((a) => a._id !== albumId);
  saveAlbumsToStorage(filteredAlbums);

  // Remover fotos do álbum
  const photos = loadPhotosFromStorage();
  delete photos[albumId];
  savePhotosToStorage(photos);

  return { success: true, message: "Álbum deletado" };
};
