import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Mensagem não pode estar vazia." },
        { status: 400 },
      );
    }

    // URL do backend com LLM integrada
    const backendUrl = "https://pet-joyful-backend.onrender.com";

    console.log(`[CHAT] Enviando para backend: ${backendUrl}/api/chat`);
    console.log(`[CHAT] Mensagem: ${message}`);

    // Chama o endpoint /api/chat do backend
    const response = await fetch(`${backendUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(15000), // Timeout de 15s
    });

    console.log(`[CHAT] Status do backend: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[CHAT] Erro do backend: ${errorText}`);
      return NextResponse.json(
        {
          success: false,
          error: `Erro do servidor (${response.status}). Tente novamente.`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log(`[CHAT] Resposta recebida:`, data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[CHAT] Erro:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: `Erro ao processar: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}
