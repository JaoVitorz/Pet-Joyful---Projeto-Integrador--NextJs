import { NextResponse } from "next/server";

// URL do microserviço de perfil
const PROFILE_API_URL =
  process.env.NEXT_PUBLIC_PROFILE_API_URL ||
  "https://edicao-perfil-microservice.onrender.com";

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token não fornecido" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const response = await fetch(`${PROFILE_API_URL}/api/profile/me/photo`, {
      method: "POST",
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
    console.error("[API Profile] Erro ao fazer upload de foto:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao fazer upload de foto" },
      { status: 500 }
    );
  }
}
