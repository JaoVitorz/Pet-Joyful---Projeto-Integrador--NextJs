import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .required('O email é obrigatório')
    .email('Por favor, insira um email válido')
    .max(100, 'O email deve ter no máximo 100 caracteres'),
    
  senha: yup
    .string()
    .required('A senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(50, 'A senha deve ter no máximo 50 caracteres')
});

export type LoginFormValues = yup.InferType<typeof LoginSchema>;