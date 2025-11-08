'use client';

import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { LoginSchema } from '@/schema/loginschema';
import './login.css';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (values: { email: string; senha: string }) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', {
        email: values.email,
        senha: values.senha
      });

      if (response.data.success) {
        // Salva o token no localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          console.log('✅ Token salvo no localStorage');
        }
        
        // Salva dados do usuário (opcional)
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        router.push('/Home');
      } else {
        setError(response.data.message || 'Credenciais inválidas');
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Erro ao fazer login. Tente novamente.';
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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

        <div className="login-section">
          <h2>Entrar</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Formik
            initialValues={{ email: '', senha: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <Field
                    type="text"
                    name="email"
                    placeholder="Email ou nome de usuário"
                    className="form-control"
                    disabled={loading}
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>
                
                <div className="form-group">
                  <Field
                    type="password"
                    name="senha"
                    placeholder="Digite sua senha..."
                    className="form-control"
                    disabled={loading}
                  />
                  <ErrorMessage name="senha" component="div" className="error-message" />
                </div>
                
                <button 
                  type="submit" 
                  className="btn-login"
                  disabled={loading || isSubmitting}
                >
                  {loading ? 'Carregando...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>
          
          <p className="divider">ou</p>
          <Link href="/Home">
            <button className="btn-google" disabled={loading}>
              Continue com Google
            </button>
          </Link>
          <Link href="/Home">
            <button className="btn-apple" disabled={loading}>
              Continue com Outlook
            </button>
          </Link>
          <Link href="#" className="forgot-password">
            Esqueceu sua senha?
          </Link>
          <div className="signup">
            <p>Não tem uma conta? <Link href="/registro">Cadastre-se</Link></p>
          </div>
        </div>
      </div>
      
      <footer>
        <Link href="#">Sobre</Link>
        <Link href="#">Ajuda</Link>
        <Link href="https://www.gov.br/esporte/pt-br/acesso-a-informacao/lgpd" target="_blank">Privacidade</Link>
        <Link href="#">Termos</Link>
      </footer>
    </>
  );
}