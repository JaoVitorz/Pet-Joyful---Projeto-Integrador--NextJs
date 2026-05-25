// app/components/chatbot/chatService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pet-joyful-backend.onrender.com" || "https://pet-joyful-backend-hml.onrender.com";

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  success: boolean;
  reply?: string;
  error?: string;
}

export async function sendMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: "Não foi possível conectar ao servidor. Tente novamente.",
    };
  }
}

const STORAGE_KEY = "petjoyful_chat_history";

export function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // silently fail
  }
}

export function clearMessages(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}