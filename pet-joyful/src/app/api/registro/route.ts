// app/api/registro/route.ts
import { NextResponse } from 'next/server';

// Backend Principal Pet-Joyful (autenticação, mensagens, denúncias)
// URL de produção: https://pet-joyful-backend-1.onrender.com
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://pet-joyful-backend-1.onrender.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[API Registro] Dados recebidos:', { ...body, senha: '***' }); // Não logar senha

    // Validação dos dados
    if (!body.email || !body.senha || !body.nome) {
      return NextResponse.json(
        { success: false, message: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Chama o backend principal - endpoint: /api/auth/register
    // Formato esperado: { nome, email, senha, tipo }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

    try {
      const response = await fetch(`${AUTH_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Verifica se a resposta é JSON antes de tentar fazer parse
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('[API Registro] Resposta não é JSON:', text);
        return NextResponse.json(
          { success: false, message: 'Resposta inválida do servidor de autenticação' },
          { status: 500 }
        );
      }

      if (!response.ok) {
        return NextResponse.json(
          { success: false, message: data.error || data.message || 'Erro ao registrar usuário' },
          { status: response.status }
        );
      }

      // Retorna o token e dados do usuário
      return NextResponse.json({
        success: true,
        token: data.token,
        user: data.user || data.usuario,
        message: data.message || 'Usuário registrado com sucesso'
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('[API Registro] Timeout ao conectar com o backend');
        return NextResponse.json(
          { success: false, message: 'Tempo de conexão esgotado. Tente novamente.' },
          { status: 504 }
        );
      }

      // Erro de rede ou conexão
      console.error('[API Registro] Erro de rede:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Erro ao conectar com o servidor de autenticação. Verifique sua conexão.' },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error('[API Registro] Erro no servidor:', error);
    
    // Erro ao fazer parse do JSON da requisição
    if (error instanceof SyntaxError || error.message?.includes('JSON')) {
      return NextResponse.json(
        { success: false, message: 'Dados inválidos na requisição' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}