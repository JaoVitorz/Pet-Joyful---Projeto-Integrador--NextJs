import { io, type Socket } from "socket.io-client";

export interface ChatUser {
  id: string;
  name: string;
  nome?: string;
  tipo?: string;
}

export interface DirectConversation {
  id: string;
  user: ChatUser;
  lastMessage: string;
  lastMessageAt: string | null;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface DirectMessageEvent {
  conversationId: string;
  message: DirectMessage;
}

export function connectDirectChat(token: string): Socket {
  const url = process.env.NEXT_PUBLIC_AUTH_API_URL || "https://pet-joyful-backend.onrender.com";
  return io(url, { auth: { token }, transports: ["websocket", "polling"] });
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) throw new Error("Entre na sua conta para usar o chat.");

  const response = await fetch(`/api/direct-chat/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || data.message || "Erro ao acessar o chat");
  return data as T;
}

export const directChatService = {
  async listUsers(query = "") {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    const suffix = params.size ? `?${params.toString()}` : "";
    const result = await request<{ users: ChatUser[] }>(`users${suffix}`);
    return result.users;
  },
  async listConversations() {
    const result = await request<{ conversations: DirectConversation[] }>("conversations");
    return result.conversations;
  },
  async createConversation(userId: string) {
    const result = await request<{ conversation: DirectConversation }>("conversations", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    return result.conversation;
  },
  async listMessages(conversationId: string) {
    const result = await request<{ messages: DirectMessage[] }>(
      `conversations/${conversationId}/messages?limit=100`,
    );
    return result.messages;
  },
  async sendMessage(conversationId: string, text: string) {
    const result = await request<{ message: DirectMessage }>(
      `conversations/${conversationId}/messages`,
      { method: "POST", body: JSON.stringify({ text }) },
    );
    return result.message;
  },
};
