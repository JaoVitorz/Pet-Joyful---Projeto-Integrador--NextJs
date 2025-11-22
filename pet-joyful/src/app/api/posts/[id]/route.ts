import { NextResponse } from "next/server";

const POSTS_API_URL =
  process.env.NEXT_PUBLIC_POSTS_API_URL || "http://localhost:3003";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const response = await fetch(`${POSTS_API_URL}/api/posts/${id}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Posts] Erro ao buscar:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar postagem" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const formData = await request.formData();

    const response = await fetch(`${POSTS_API_URL}/api/posts/${id}`, {
      method: "PUT",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Posts] Erro ao atualizar:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar postagem" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const response = await fetch(`${POSTS_API_URL}/api/posts/${id}`, {
      method: "DELETE",
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
    console.error("[API Posts] Erro ao deletar:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao deletar postagem" },
      { status: 500 }
    );
  }
}
