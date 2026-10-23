import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.AUTH_API_URL ||
  process.env.NEXT_PUBLIC_AUTH_API_URL ||
  "https://pet-joyful-backend.onrender.com";

const VALID_PATH = /^(users|conversations(?:\/[a-f\d]{24}(?:\/messages)?)?)$/i;

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const token = request.headers.get("authorization");
  if (!token?.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Usuário não autenticado" }, { status: 401 });
  }

  const { path } = await context.params;
  const endpoint = path.join("/");
  if (!VALID_PATH.test(endpoint)) {
    return NextResponse.json({ success: false, error: "Rota de chat inválida" }, { status: 404 });
  }

  const target = new URL(`/api/chat/${endpoint}`, BACKEND_URL);
  target.search = request.nextUrl.search;

  try {
    const response = await fetch(target, {
      method: request.method,
      headers: {
        Authorization: token,
        ...(request.method === "POST" ? { "Content-Type": "application/json" } : {}),
      },
      ...(request.method === "POST" ? { body: await request.text() } : {}),
      cache: "no-store",
    });

    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" },
    });
  } catch (error) {
    console.error("[Direct Chat] Erro ao conectar ao backend:", error);
    return NextResponse.json(
      { success: false, error: "Não foi possível conectar ao serviço de chat" },
      { status: 502 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
