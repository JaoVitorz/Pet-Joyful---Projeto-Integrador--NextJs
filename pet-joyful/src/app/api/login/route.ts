// app/api/login/route.ts
import { NextResponse } from "next/server";

// Backend Principal Pet-Joyful (autenticação, mensagens, denúncias)
// URL de produção: https://pet-joyful-backend-1.onrender.com
const AUTH_API_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL ||
  "https://pet-joyful-backend-1.onrender.com";

export async function POST(request: Request) {
  try {
    // Log da URL do backend sendo usada
    console.log("[API Login] URL do backend:", AUTH_API_URL);
    console.log(
      "[API Login] Variável de ambiente:",
      process.env.NEXT_PUBLIC_AUTH_API_URL || "não definida (usando padrão)"
    );

    const { email, senha } = await request.json();
    console.log("[API Login] Dados recebidos:", { email }); // Não logar senha

    // Validação dos dados
    if (!email || !senha) {
      return NextResponse.json(
        { success: false, message: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Chama o backend principal - endpoint: /api/auth/login
    const backendUrl = `${AUTH_API_URL}/api/auth/login`;
    console.log("[API Login] Chamando backend:", backendUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }), // Backend usa "senha" (português)
        signal: controller.signal,
      });

      console.log(
        "[API Login] Status da resposta do backend:",
        response.status,
        response.statusText
      );

      clearTimeout(timeoutId);

      // Verifica se a resposta é JSON antes de tentar fazer parse
      const contentType = response.headers.get("content-type");
      console.log("[API Login] Content-Type da resposta:", contentType);

      let data;

      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
          console.log("[API Login] Dados recebidos do backend:", {
            ...data,
            token: data.token ? "***" : undefined,
          });
        } catch (jsonError) {
          console.error("[API Login] Erro ao fazer parse do JSON:", jsonError);
          const text = await response.text();
          console.error(
            "[API Login] Resposta recebida (texto):",
            text.substring(0, 500)
          );
          return NextResponse.json(
            {
              success: false,
              message: "Erro ao processar resposta do servidor de autenticação",
            },
            { status: 500 }
          );
        }
      } else {
        const text = await response.text();
        console.error(
          "[API Login] Resposta não é JSON. Content-Type:",
          contentType
        );
        console.error(
          "[API Login] Resposta recebida (primeiros 500 caracteres):",
          text.substring(0, 500)
        );

        // Se o backend retornou HTML (erro 500 comum no Render), tenta extrair informação útil
        let errorMessage = "Erro no servidor de autenticação";
        if (response.status === 500) {
          errorMessage =
            "O servidor de autenticação está temporariamente indisponível. Isso pode ser um cold start do Render (primeira requisição após inatividade leva ~30s). Aguarde alguns segundos e tente novamente.";
          console.warn(
            "[API Login] ⚠️ Backend retornou 500 com resposta não-JSON. Provável cold start do Render."
          );
        }

        return NextResponse.json(
          {
            success: false,
            message: errorMessage,
          },
          { status: response.status || 500 }
        );
      }

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        console.error("[API Login] Backend retornou erro:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        // Preserva a mensagem de erro do backend
        const errorMessage =
          data.error ||
          data.message ||
          (response.status === 500
            ? "Erro interno no servidor de autenticação. O backend pode estar em cold start (primeira requisição após inatividade). Aguarde alguns segundos e tente novamente."
            : response.status === 401
            ? "Credenciais inválidas"
            : `Erro ${response.status}: ${response.statusText}`);

        // Se for erro 500, adiciona informação sobre cold start do Render
        if (response.status === 500) {
          console.warn(
            "[API Login] ⚠️ Backend retornou 500. Isso pode ser um cold start do Render (primeira requisição após inatividade leva ~30s)."
          );
        }

        return NextResponse.json(
          { success: false, message: errorMessage },
          { status: response.status }
        );
      }

      // Retorna o token e dados do usuário
      return NextResponse.json({
        success: true,
        token: data.token,
        user: data.user || data.usuario,
        message: data.message || "Login bem-sucedido",
      });
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);

      const error = fetchError as Error & { name?: string };

      if (error.name === "AbortError") {
        console.error("[API Login] Timeout ao conectar com o backend");
        return NextResponse.json(
          {
            success: false,
            message: "Tempo de conexão esgotado. Tente novamente.",
          },
          { status: 504 }
        );
      }

      // Erro de rede ou conexão
      console.error("[API Login] Erro de rede:", error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Erro ao conectar com o servidor de autenticação. Verifique sua conexão.",
        },
        { status: 503 }
      );
    }
  } catch (error: unknown) {
    console.error("[API Login] Erro no servidor:", error);

    const err = error as Error;

    // Erro ao fazer parse do JSON da requisição
    if (error instanceof SyntaxError || err.message?.includes("JSON")) {
      return NextResponse.json(
        { success: false, message: "Dados inválidos na requisição" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: err.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
