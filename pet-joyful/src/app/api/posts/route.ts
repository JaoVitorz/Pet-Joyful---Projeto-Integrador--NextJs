import { NextResponse } from "next/server";

const POSTS_API_URL =
  process.env.NEXT_PUBLIC_POSTS_API_URL ||
  "https://pet-joyful-posts-service.onrender.com";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const response = await fetch(`${POSTS_API_URL}/api/posts?${queryString}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Posts] Erro ao listar:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao listar postagens" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token não fornecido" },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    // Reenvia o arquivo como multipart com o nome esperado pelo serviço de posts.
    const forwardedFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        forwardedFormData.append(key, value, value.name);
      } else {
        forwardedFormData.append(key, value);
      }
    }

    const response = await fetch(POSTS_API_URL + "/api/posts", {
      method: "POST",
      headers: { Authorization: token },
      body: forwardedFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[API Posts] Erro do backend:", data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[API Posts] Erro ao criar:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Erro ao criar postagem: ${error instanceof Error ? error.message : "erro desconhecido"}`,
      },
      { status: 500 },
    );
  }
}
