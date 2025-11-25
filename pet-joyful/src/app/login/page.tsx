"use client";

import { useState } from "react";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginSchema } from "@/schema/loginschema";
import "./login.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (values: { email: string; senha: string }) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/login", {
        email: values.email,
        senha: values.senha,
      });

      if (response.data.success) {
        // Salva o token no localStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          console.log("✅ Token salvo no localStorage");
        }

        // Salva dados do usuário (opcional)
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        router.push("/Home");
      } else {
        setError(response.data.message || "Credenciais inválidas");
      }
    } catch (err: unknown) {
      console.error("Erro no login:", err);

      // Type assertion para erro do axios
      const axiosError = err as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };

      console.error("Detalhes do erro:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

      // Mensagens de erro mais específicas
      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (axiosError.response?.status === 500) {
        errorMessage =
          axiosError.response?.data?.message ||
          "Erro no servidor. O backend pode estar temporariamente indisponível. Tente novamente em alguns instantes.";
      } else if (axiosError.response?.status === 401) {
        errorMessage =
          axiosError.response?.data?.message || "Email ou senha incorretos.";
      } else if (axiosError.response?.status === 400) {
        errorMessage =
          axiosError.response?.data?.message ||
          "Dados inválidos. Verifique os campos.";
      } else if (
        axiosError.response?.status === 503 ||
        axiosError.response?.status === 504
      ) {
        errorMessage =
          axiosError.response?.data?.message ||
          "Serviço temporariamente indisponível. Verifique sua conexão e tente novamente.";
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>PetNet</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Conecte-se com tutores, ONGs e veterinários. Encontre dicas, participe de campanhas e adote animais com segurança!"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
      </Head>

      <div className="container">
        <div className="left-section">
          <div className="titulo-bordao">
            <h1>PetJoyful</h1>
            <p>Conectando Corações e Patas</p>
          </div>
          <div className="pet-images">
            <Image
              src="/assets/pet-joyful.png"
              alt="Gato e Cachorro lado a lado"
              width={600}
              height={300}
              className="img-fluid"
              priority
            />
          </div>
        </div>

        <main className="login-section">
          <h1>Entrar</h1>

          <Formik
            initialValues={{ email: "", senha: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form aria-label="Formulário de login">
                <div className="form-group">
                  <label htmlFor="login-email" className="visually-hidden">
                    Email ou nome de usuário
                  </label>
                  <Field
                    id="login-email"
                    type="text"
                    name="email"
                    placeholder="Email ou nome de usuário"
                    className="form-control"
                    disabled={loading}
                    aria-required="true"
                    aria-describedby="email-error"
                  />
                  <ErrorMessage
                    name="email"
                    render={(msg) => (
                      <div
                        className="error-message"
                        id="email-error"
                        role="alert"
                      >
                        {msg}
                      </div>
                    )}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-senha" className="visually-hidden">
                    Senha
                  </label>
                  <Field
                    id="login-senha"
                    type="password"
                    name="senha"
                    placeholder="Digite sua senha..."
                    className="form-control"
                    disabled={loading}
                    aria-required="true"
                    aria-describedby="senha-error"
                  />
                  <ErrorMessage
                    name="senha"
                    render={(msg) => (
                      <div
                        className="error-message"
                        id="senha-error"
                        role="alert"
                      >
                        {msg}
                      </div>
                    )}
                  />
                </div>

                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                    aria-live="polite"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-login"
                  disabled={loading || isSubmitting}
                  aria-label="Fazer login na plataforma"
                >
                  {loading ? "Carregando..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="divider" role="separator" aria-label="ou">
            ou
          </p>
          <Link href="/Home">
            <button
              className="btn-google"
              disabled={loading}
              aria-label="Continuar com Google"
            >
              Continue com Google
            </button>
          </Link>
          <Link href="/Home">
            <button
              className="btn-apple"
              disabled={loading}
              aria-label="Continuar com Outlook"
            >
              Continue com Outlook
            </button>
          </Link>
          <div className="signup">
            <p>
              Não tem uma conta?{" "}
              <Link href="/registro" aria-label="Ir para página de cadastro">
                Cadastre-se
              </Link>
            </p>
          </div>
        </main>
      </div>

      <footer>
        <Link href="/sobre">Sobre</Link>
        <Link href="/Faq">Ajuda</Link>
        <Link href="/privacidade">Privacidade</Link>
        <Link href="/termos">Termos</Link>
      </footer>
    </>
  );
}
