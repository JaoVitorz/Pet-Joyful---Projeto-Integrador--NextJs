// src/types/index.ts (melhor separar)
export interface AppComment {
  id: string;
  text: string;       // antes era "content"
  createdAt?: string; // opcional
  user: {
    id?: string;
    name: string;
    avatar?: string;
  };
}

export interface User {
  id: number;
  name: string;
  avatar: string;
}
export interface Message {
  id: string;
  text: string;
  createdAt: string;
  senderId: number;
  receiverId: number;
}
export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
}
export interface NewMessage {
  text: string;
  receiverId: number;
}
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface RegistroData {
  nome: string;
  email: string;
  senha: string;
} 
export interface LoginData {
  email: string;
  senha: string;
} 
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
} 
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
}
export interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}
export interface UpdateProfileResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
}
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}