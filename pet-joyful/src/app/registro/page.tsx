"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { Building2, PawPrint, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  getRegistroSchema,
  type RegistroFormValues,
  type TipoRegistro,
} from "@/schema/registroschema";

const profileOptions: Array<{
  value: TipoRegistro;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "adotante", label: "Adotante", icon: PawPrint },
  { value: "ong", label: "ONG", icon: Building2 },
  { value: "veterinario", label: "Veterinario", icon: Stethoscope },
];

const fieldCopy = {
  adotante: {
    nome: "Nome",
    sobrenome: "Sobrenome",
    documento: "CPF",
    documentoPlaceholder: "000.000.000-00",
    emailPlaceholder: "seu@email.com",
  },
  ong: {
    nome: "Nome da ONG",
    sobrenome: "Responsavel",
    documento: "CNPJ",
    documentoPlaceholder: "00.000.000/0000-00",
    emailPlaceholder: "contato@ong.org",
  },
  veterinario: {
    nome: "Nome",
    sobrenome: "Sobrenome",
    documento: "CPF",
    documentoPlaceholder: "000.000.000-00",
    emailPlaceholder: "profissional@email.com",
  },
};

const initialValues: RegistroFormValues = {
  nome: "",
  sobrenome: "",
  documento: "",
  email: "",
  crmv: "",
  senha: "",
  confirmarSenha: "",
};

export default function Registro() {
  const [tipoUsuario, setTipoUsuario] = useState<TipoRegistro>("adotante");
  const [serverError, setServerError] = useState<string | null>(null);

  const copy = fieldCopy[tipoUsuario];

  const handleSubmit = async (values: RegistroFormValues) => {
    try {
      setServerError(null);

      const nomeCompleto =
        tipoUsuario === "ong"
          ? `${values.nome} - ${values.sobrenome}`.trim()
          : `${values.nome} ${values.sobrenome}`.trim();

      const payload = {
        tipo: tipoUsuario,
        nome: nomeCompleto,
        email: values.email,
        senha: values.senha,
        ...(tipoUsuario === "ong"
          ? { cnpj: values.documento.replace(/\D/g, "") }
          : { cpf: values.documento.replace(/\D/g, "") }),
        ...(tipoUsuario === "veterinario" && { crmv: values.crmv }),
      };

      const response = await axios.post<{
        success: boolean;
        token?: string;
        user?: any;
        message?: string;
      }>("/api/registro", payload);

      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);

        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      }

      alert("Cadastro realizado com sucesso!");
      setTimeout(() => {
        window.location.href = "/Home";
      }, 2000);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };

      setServerError(
        axiosError.response?.data?.message ||
          "Erro ao cadastrar. Tente novamente.",
      );
    }
  };

  return (
    <main className="registro-page">
      <section className="registro-brand-panel" aria-label="Sobre a PetJoyful">
        <div className="brand-mark">
          <span className="brand-dot" aria-hidden="true" />
          <span>PetJoyful</span>
        </div>

        <div className="brand-copy">
          <h1>A comunidade que conecta pets a lares amorosos</h1>
          <p>
            Adote, ajude e compartilhe historias reais de animais que
            encontraram sua familia.
          </p>

          <ul>
            <li>Perfil completo para tutores e ONGs</li>
            <li>Feed de pets disponiveis para adocao</li>
            <li>Historias de adocao inspiradoras</li>
            <li>Conexao com veterinarios confiaveis</li>
          </ul>
        </div>

        <p className="brand-stat">
          +2.400 familias ja encontraram seu pet aqui
        </p>
      </section>

      <section
        className="registro-form-panel"
        aria-label="Formulario de cadastro"
      >
        <div className="registro-form-card">
          <div className="form-heading">
            <h2>Criar sua conta</h2>
            <p>Escolha seu perfil e comece agora</p>
          </div>

          <div
            className="profile-tabs"
            role="tablist"
            aria-label="Selecionar tipo de cadastro"
          >
            {profileOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                className={tipoUsuario === value ? "active" : ""}
                onClick={() => {
                  setTipoUsuario(value);
                  setServerError(null);
                }}
                role="tab"
                aria-selected={tipoUsuario === value}
              >
                <Icon size={14} strokeWidth={2.2} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={getRegistroSchema(tipoUsuario)}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="registro-form" noValidate>
                <div className="field-grid two-columns">
                  <div className="form-field">
                    <label htmlFor="registro-nome">{copy.nome}</label>
                    <Field
                      id="registro-nome"
                      type="text"
                      name="nome"
                      className={
                        errors.nome && touched.nome ? "is-invalid" : ""
                      }
                      placeholder={copy.nome}
                      aria-describedby={
                        errors.nome && touched.nome ? "nome-error" : undefined
                      }
                    />
                    <ErrorMessage
                      name="nome"
                      component="span"
                      id="nome-error"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="registro-sobrenome">{copy.sobrenome}</label>
                    <Field
                      id="registro-sobrenome"
                      type="text"
                      name="sobrenome"
                      className={
                        errors.sobrenome && touched.sobrenome
                          ? "is-invalid"
                          : ""
                      }
                      placeholder={copy.sobrenome}
                      aria-describedby={
                        errors.sobrenome && touched.sobrenome
                          ? "sobrenome-error"
                          : undefined
                      }
                    />
                    <ErrorMessage
                      name="sobrenome"
                      component="span"
                      id="sobrenome-error"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="registro-documento">{copy.documento}</label>
                  <Field
                    id="registro-documento"
                    type="text"
                    name="documento"
                    className={
                      errors.documento && touched.documento ? "is-invalid" : ""
                    }
                    placeholder={copy.documentoPlaceholder}
                    aria-describedby={
                      errors.documento && touched.documento
                        ? "documento-error"
                        : undefined
                    }
                  />
                  <ErrorMessage
                    name="documento"
                    component="span"
                    id="documento-error"
                  />
                </div>

                {tipoUsuario === "veterinario" && (
                  <div className="form-field">
                    <label htmlFor="registro-crmv">CRMV</label>
                    <Field
                      id="registro-crmv"
                      type="text"
                      name="crmv"
                      className={
                        errors.crmv && touched.crmv ? "is-invalid" : ""
                      }
                      placeholder="SP12345"
                      aria-describedby={
                        errors.crmv && touched.crmv ? "crmv-error" : undefined
                      }
                    />
                    <ErrorMessage
                      name="crmv"
                      component="span"
                      id="crmv-error"
                    />
                  </div>
                )}

                <div className="form-field">
                  <label htmlFor="registro-email">E-mail</label>
                  <Field
                    id="registro-email"
                    type="email"
                    name="email"
                    className={
                      errors.email && touched.email ? "is-invalid" : ""
                    }
                    placeholder={copy.emailPlaceholder}
                    aria-describedby={
                      errors.email && touched.email ? "email-error" : undefined
                    }
                  />
                  <ErrorMessage
                    name="email"
                    component="span"
                    id="email-error"
                  />
                </div>

                <div className="field-grid two-columns">
                  <div className="form-field">
                    <label htmlFor="registro-senha">Senha</label>
                    <Field
                      id="registro-senha"
                      type="password"
                      name="senha"
                      className={
                        errors.senha && touched.senha ? "is-invalid" : ""
                      }
                      placeholder="********"
                      aria-describedby={
                        errors.senha && touched.senha
                          ? "senha-error"
                          : undefined
                      }
                    />
                    <ErrorMessage
                      name="senha"
                      component="span"
                      id="senha-error"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="registro-confirmar-senha">
                      Confirmar senha
                    </label>
                    <Field
                      id="registro-confirmar-senha"
                      type="password"
                      name="confirmarSenha"
                      className={
                        errors.confirmarSenha && touched.confirmarSenha
                          ? "is-invalid"
                          : ""
                      }
                      placeholder="********"
                      aria-describedby={
                        errors.confirmarSenha && touched.confirmarSenha
                          ? "confirmar-senha-error"
                          : undefined
                      }
                    />
                    <ErrorMessage
                      name="confirmarSenha"
                      component="span"
                      id="confirmar-senha-error"
                    />
                  </div>
                </div>

                {serverError && (
                  <div className="server-error" role="alert" aria-live="polite">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Criando conta..."
                    : "Criar conta no PetJoyful"}
                </button>

                <p className="login-link">
                  Ja tem uma conta? <Link href="/login">Fazer login</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </main>
  );
}
