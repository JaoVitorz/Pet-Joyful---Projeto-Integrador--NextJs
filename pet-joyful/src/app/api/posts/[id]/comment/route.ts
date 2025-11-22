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

    const body = await request.json();

    const response = await fetch(`${POSTS_API_URL}/api/posts/${id}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Posts] Erro ao comentar:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao comentar" },
      { status: 500 }
    );
  }
}
