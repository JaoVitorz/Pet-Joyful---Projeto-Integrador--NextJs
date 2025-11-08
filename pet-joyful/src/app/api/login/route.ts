// app/api/login/route.ts
import { NextResponse } from 'next/server';

// Backend Principal Pet-Joyful (autenticação, mensagens, denúncias)
// URL de produção: https://pet-joyful-backend-1.onrender.com
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://pet-joyful-backend-1.onrender.com';

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();
    console.log('[API Login] Dados recebidos:', { email }); // Não logar senha

    // Chama o backend principal - endpoint: /api/auth/login
    const response = await fetch(`${AUTH_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }), // Backend usa "senha" (português)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.error || data.message || 'Credenciais inválidas' },
        { status: response.status }
      );
    }

    // Retorna o token e dados do usuário
    return NextResponse.json({
      success: true,
      token: data.token,
      user: data.user || data.usuario,
      message: data.message || 'Login bem-sucedido'
    });
  } catch (error) {
    console.error('[API Login] Erro no servidor:', error);
    return NextResponse.json(
      { success: false, message: "Erro ao conectar com o servidor de autenticação" },
      { status: 500 }
    );
  }
}