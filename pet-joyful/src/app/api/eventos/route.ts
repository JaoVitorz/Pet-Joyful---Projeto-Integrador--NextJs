import { NextResponse } from 'next/server';

const EVENTOS_API_URL = process.env.EVENTOS_API_URL || 'http://localhost:3002'; // URL do microserviço

export async function GET() {
  try {
    const response = await fetch(`${EVENTOS_API_URL}/api/eventos`, {
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('[API Route] Dados recebidos:', body);
    
    const url = `${EVENTOS_API_URL}/eventos`;
    console.log('[API Route] Fazendo requisição para:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('[API Route] Resposta do microserviço:', {
      status: response.status,
      data: data
    });

    if (!response.ok) {
      throw new Error(data.message || `Erro ao criar evento. Status: ${response.status}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Route] Erro ao processar requisição:', error);
    
    // Se for um erro de rede ou conexão com o microserviço
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Erro ao conectar com o serviço de eventos. Verifique se o microserviço está rodando.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: error.message || 'Erro ao criar evento',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}