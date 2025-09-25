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

      await axios.post("/api/registro", payload);

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
      <div className="form-wrapper d-flex align-items-center justify-content-center flex-column">
        <div className="form-column w-100">
          <Formik
            initialValues={initialValues}
            validationSchema={getRegistroSchema(tipoUsuario)}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <h4 className="text-center">
                  {tipoUsuario === "adotante" && "Cadastro para Adotantes"}
                  {tipoUsuario === "ong" && "Cadastro para ONGs"}
                  {tipoUsuario === "veterinario" &&
                    "Cadastro para Veterinários"}
                </h4>

                {/* Campo Nome */}
                <div className="form-group">
                  <label>Nome completo:</label>
                  <Field
                    type="text"
                    name="nome"
                    className={`form-control ${
                      errors.nome && touched.nome ? "is-invalid" : ""
                    }`}
                    placeholder="Nome completo"
                  />
                  <ErrorMessage
                    name="nome"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Campo Documento */}
                <div className="form-group">
                  <label>{tipoUsuario === "ong" ? "CNPJ" : "CPF"}</label>
                  <Field
                    type="text"
                    name="documento"
                    className={`form-control ${
                      errors.documento && touched.documento ? "is-invalid" : ""
                    }`}
                    placeholder={tipoUsuario === "ong" ? "CNPJ" : "CPF"}
                  />
                  <ErrorMessage
                    name="documento"
                    component="div"
                    className="text-danger"
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
                  <label>Email:</label>
                  <Field
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
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
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
                  <div className="alert alert-danger">{serverError}</div>
                )}

                <p className="text-center mt-2">
                  Já possui uma conta? <a href="/login">Faça login</a>
                </p>

                <button
                  type="submit"
                  className="form-btn mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar-se"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Seletor de Tipo de Usuário */}
        <div className="user-type-switcher mt-4">
          <p className="text-center">Selecionar tipo de cadastro:</p>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className={`btn btn-outline-primary ${
                tipoUsuario === "adotante" ? "active" : ""
              }`}
              onClick={() => setTipoUsuario("adotante")}
            >
              Adotante
            </button>
            <button
              type="button"
              className={`btn btn-outline-success ${
                tipoUsuario === "ong" ? "active" : ""
              }`}
              onClick={() => setTipoUsuario("ong")}
            >
              ONG
            </button>
            <button
              type="button"
              className={`btn btn-outline-info ${
                tipoUsuario === "veterinario" ? "active" : ""
              }`}
              onClick={() => setTipoUsuario("veterinario")}
            >
              Veterinário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}