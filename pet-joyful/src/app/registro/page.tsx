"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getRegistroSchema } from "@/schema/registroschema";
import "bootstrap/dist/css/bootstrap.min.css";
import "./registro.css";
import axios from "axios";

export default function Registro() {
  const [tipoUsuario, setTipoUsuario] = useState<
    "adotante" | "ong" | "veterinario"
  >("adotante");
  const [serverError, setServerError] = useState<string | null>(null);

  const initialValues = {
    nome: "",
    documento: "",
    email: "",
    crmv: "",
    senha: "",
    confirmarSenha: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setServerError(null);

      const payload = {
        tipo: tipoUsuario,
        nome: values.nome,
        email: values.email,
        senha: values.senha,
        ...(tipoUsuario === "ong"
          ? { cnpj: values.documento.replace(/\D/g, "") }
          : { cpf: values.documento.replace(/\D/g, "") }),
        ...(tipoUsuario === "veterinario" && { crmv: values.crmv }),
      };

      const response = await axios.post("/api/registro", payload);

      // Salva o token no localStorage se retornado
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('✅ Token salvo no localStorage após registro');
        
        // Salva dados do usuário (opcional)
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      alert("Cadastro realizado com sucesso!");
      setTimeout(() => {
        window.location.href = "/Home";
      }, 2000);
    } catch (error: unknown) {
      console.error("Erro no cadastro:", error);
      setServerError(
        // @ts-expect-error: pode ser axios error
        error?.response?.data?.message || "Erro ao cadastrar. Tente novamente."
      );
    }
  };

  return (
    <div className="container">
      <main className="form-wrapper d-flex align-items-center justify-content-center flex-column">
        <div className="form-column w-100">
          <Formik
            initialValues={initialValues}
            validationSchema={getRegistroSchema(tipoUsuario)}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form aria-label="Formulário de cadastro">
                <h1 className="text-center">
                  {tipoUsuario === "adotante" && "Cadastro para Adotantes"}
                  {tipoUsuario === "ong" && "Cadastro para ONGs"}
                  {tipoUsuario === "veterinario" &&
                    "Cadastro para Veterinários"}
                </h1>

                {/* Campo Nome */}
                <div className="form-group">
                  <label htmlFor="registro-nome">Nome completo:</label>
                  <Field
                    id="registro-nome"
                    type="text"
                    name="nome"
                    className={`form-control ${
                      errors.nome && touched.nome ? "is-invalid" : ""
                    }`}
                    placeholder="Nome completo"
                    aria-required="true"
                    aria-describedby={errors.nome && touched.nome ? "nome-error" : undefined}
                  />
                  <ErrorMessage
                    name="nome"
                    component="div"
                    className="text-danger"
                    id="nome-error"
                    role="alert"
                  />
                </div>

                {/* Campo Documento */}
                <div className="form-group">
                  <label htmlFor="registro-documento">{tipoUsuario === "ong" ? "CNPJ" : "CPF"}</label>
                  <Field
                    id="registro-documento"
                    type="text"
                    name="documento"
                    className={`form-control ${
                      errors.documento && touched.documento ? "is-invalid" : ""
                    }`}
                    placeholder={tipoUsuario === "ong" ? "CNPJ" : "CPF"}
                    aria-required="true"
                    aria-describedby={errors.documento && touched.documento ? "documento-error" : undefined}
                  />
                  <ErrorMessage
                    name="documento"
                    component="div"
                    className="text-danger"
                    id="documento-error"
                    role="alert"
                  />
                </div>

                {/* Campo CRMV (condicional) */}
                {tipoUsuario === "veterinario" && (
                  <div className="form-group">
                    <label>CRMV</label>
                    <Field
                      type="text"
                      name="crmv"
                      className={`form-control ${
                        errors.crmv && touched.crmv ? "is-invalid" : ""
                      }`}
                      placeholder="CRMV"
                    />
                    <ErrorMessage
                      name="crmv"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                )}

                {/* Campo Email */}
                <div className="form-group">
                  <label htmlFor="registro-email">Email:</label>
                  <Field
                    id="registro-email"
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email && touched.email ? "is-invalid" : ""
                    }`}
                    placeholder={
                      tipoUsuario === "ong"
                        ? "Email institucional"
                        : tipoUsuario === "veterinario"
                        ? "Email profissional"
                        : "Email"
                    }
                    aria-required="true"
                    aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                    id="email-error"
                    role="alert"
                  />
                </div>

                {/* Campos Senha */}
                <div className="form-group mt-3">
                  <label>Senha:</label>
                  <Field
                    type="password"
                    name="senha"
                    className={`form-control ${
                      errors.senha && touched.senha ? "is-invalid" : ""
                    }`}
                    placeholder="Digite uma senha..."
                  />
                  <ErrorMessage
                    name="senha"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="form-group">
                  <label>Confirme a senha:</label>
                  <Field
                    type="password"
                    name="confirmarSenha"
                    className={`form-control ${
                      errors.confirmarSenha && touched.confirmarSenha
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Confirme a senha..."
                  />
                  <ErrorMessage
                    name="confirmarSenha"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Mensagens de feedback */}
                {serverError && (
                  <div className="alert alert-danger" role="alert" aria-live="polite">
                    {serverError}
                  </div>
                )}

                <p className="text-center mt-2">
                  Já possui uma conta? <a href="/login" aria-label="Ir para página de login">Faça login</a>
                </p>

                <button
                  type="submit"
                  className="form-btn mt-2"
                  disabled={isSubmitting}
                  aria-label="Finalizar cadastro"
                >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar-se"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Seletor de Tipo de Usuário */}
        <div className="user-type-switcher mt-4" role="group" aria-label="Selecionar tipo de cadastro">
          <p className="text-center">Selecionar tipo de cadastro:</p>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className={`btn btn-outline-primary ${
                tipoUsuario === "adotante" ? "active" : ""
              }`}
              onClick={() => setTipoUsuario("adotante")}
              aria-pressed={tipoUsuario === "adotante"}
              aria-label="Cadastro como adotante"
            >
              Adotante
            </button>
            <button
              type="button"
              className={`btn btn-outline-success ${
                tipoUsuario === "ong" ? "active" : ""
              }`}
              onClick={() => setTipoUsuario("ong")}
              aria-pressed={tipoUsuario === "ong"}
              aria-label="Cadastro como ONG"
            >
              ONG
            </button>
            <button
              type="button"
              className={`btn btn-outline-info ${
                tipoUsuario === "veterinario" ? "active" : ""
              }`}
              onClick={() => setTipoUsuario("veterinario")}
              aria-pressed={tipoUsuario === "veterinario"}
              aria-label="Cadastro como veterinário"
            >
              Veterinário
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}