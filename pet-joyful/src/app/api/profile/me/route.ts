import { NextResponse } from "next/server";

// URL do microserviço de perfil
const PROFILE_API_URL =
  process.env.NEXT_PUBLIC_PROFILE_API_URL ||
  "https://edicao-perfil-microservice.onrender.com";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token não fornecido" },
        { status: 401 }
      );
    }

    const response = await fetch(`${PROFILE_API_URL}/api/profile/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Profile] Erro ao buscar perfil:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token não fornecido" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${PROFILE_API_URL}/api/profile/me`, {
      method: "PUT",
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
    console.error("[API Profile] Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
