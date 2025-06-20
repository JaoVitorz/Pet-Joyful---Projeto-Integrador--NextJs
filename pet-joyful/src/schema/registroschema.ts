import * as Yup from 'yup';

export const getRegistroSchema = (tipo: 'adotante' | 'ong' | 'veterinario') => {
  return Yup.object().shape({
    nome: Yup.string()
      .required('Nome completo é obrigatório')
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres'),
      
    documento: Yup.string()
      .required(tipo === 'ong' ? 'CNPJ é obrigatório' : 'CPF é obrigatório')
      .test(
        'valid-document',
        tipo === 'ong' ? 'CNPJ inválido' : 'CPF inválido',
        value => {
          if (!value) return false;
          // Remove caracteres não numéricos
          const cleanedValue = value.replace(/\D/g, '');
          return tipo === 'ong' 
            ? cleanedValue.length === 14  // CNPJ tem 14 dígitos
            : cleanedValue.length === 11; // CPF tem 11 dígitos
        }
      ),

    email: Yup.string()
      .required('E-mail é obrigatório')
      .email('Digite um e-mail válido')
      .max(100, 'Máximo 100 caracteres'),
      
    ...(tipo === 'veterinario' && {
      crmv: Yup.string()
        .required('CRMV é obrigatório')
        .matches(
          /^[A-Z]{2}[0-9]{4,6}$/i, 
          'Formato inválido (Ex: SP12345 ou SP123456)'
        )
    }),
    
    senha: Yup.string()
      .required('Senha é obrigatória')
      .min(8, 'Mínimo 8 caracteres')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Deve conter pelo menos: 1 letra maiúscula, 1 minúscula e 1 número'
      )
      .max(50, 'Máximo 50 caracteres'),
      
    confirmarSenha: Yup.string()
      .required('Confirme sua senha')
      .oneOf([Yup.ref('senha')], 'As senhas não coincidem')
  });
};

// Tipagem TypeScript para os valores do formulário
export type RegistroFormValues = {
  nome: string;
  documento: string;
  email: string;
  crmv?: string;
  senha: string;
  confirmarSenha: string;
};