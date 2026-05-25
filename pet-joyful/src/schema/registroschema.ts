import * as Yup from "yup";

export type TipoRegistro = "adotante" | "ong" | "veterinario";

export const getRegistroSchema = (tipo: TipoRegistro) => {
  return Yup.object().shape({
    nome: Yup.string()
      .required(tipo === "ong" ? "Nome da ONG e obrigatorio" : "Nome e obrigatorio")
      .min(2, "Minimo 2 caracteres")
      .max(80, "Maximo 80 caracteres"),

    sobrenome: Yup.string()
      .required(tipo === "ong" ? "Responsavel e obrigatorio" : "Sobrenome e obrigatorio")
      .min(2, "Minimo 2 caracteres")
      .max(80, "Maximo 80 caracteres"),

    documento: Yup.string()
      .required(tipo === "ong" ? "CNPJ e obrigatorio" : "CPF e obrigatorio")
      .test(
        "valid-document",
        tipo === "ong" ? "CNPJ invalido" : "CPF invalido",
        (value) => {
          if (!value) return false;
          const cleanedValue = value.replace(/\D/g, "");
          return tipo === "ong"
            ? cleanedValue.length === 14
            : cleanedValue.length === 11;
        }
      ),

    email: Yup.string()
      .required("E-mail e obrigatorio")
      .email("Digite um e-mail valido")
      .max(100, "Maximo 100 caracteres"),

    ...(tipo === "veterinario" && {
      crmv: Yup.string()
        .required("CRMV e obrigatorio")
        .matches(/^[A-Z]{2}[0-9]{4,6}$/i, "Formato invalido (Ex: SP12345 ou SP123456)"),
    }),

    senha: Yup.string()
      .required("Senha e obrigatoria")
      .min(8, "Minimo 8 caracteres")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Deve conter pelo menos: 1 letra maiuscula, 1 minuscula e 1 numero"
      )
      .max(50, "Maximo 50 caracteres"),

    confirmarSenha: Yup.string()
      .required("Confirme sua senha")
      .oneOf([Yup.ref("senha")], "As senhas nao coincidem"),
  });
};

export type RegistroFormValues = {
  nome: string;
  sobrenome: string;
  documento: string;
  email: string;
  crmv?: string;
  senha: string;
  confirmarSenha: string;
};
