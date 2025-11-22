import { NextResponse } from "next/server";

const POSTS_API_URL =
  process.env.NEXT_PUBLIC_POSTS_API_URL || "http://localhost:3003";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token não fornecido" },
        { status: 401 }
      );
    }

    const response = await fetch(`${POSTS_API_URL}/api/posts/${id}/like`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Posts] Erro ao curtir:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao curtir postagem" },
      { status: 500 }
    );
  }
}
