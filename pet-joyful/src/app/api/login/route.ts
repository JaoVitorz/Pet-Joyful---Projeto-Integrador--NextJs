// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();
    console.log('Dados recebidos:', { email, senha }); // Para debug

    // Validação simulada - substitua por sua lógica real
    if (email === 'jv.jvsantos10@gmail.com' && senha === '123456') {
      return NextResponse.json({ 
        success: true,
        user: { nome: "Admin", tipo: "admin" }
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Credenciais inválidas" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json(
      { success: false, message: "Erro no servidor" },
      { status: 500 }
    );
  }
}