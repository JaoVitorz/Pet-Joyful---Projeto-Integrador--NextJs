'use client';
import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './login.css'; // Importando seu arquivo CSS

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', {
        email,
        senha
      });

      if (response.data.success) {
        router.push('/Home');
      } else {
        setError(response.data.message || 'Credenciais inválidas');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro ao fazer login. Tente novamente.');
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
            <h1>PetNet</h1>
            <p>Conectando Corações e Patas</p>
          </div>
          <div className="pet-images">
            <Image
              src="/assets/login-img.png"
              alt="Gato e Cachorro lado a lado"
              width={400}
              height={300}
              className="img-fluid"
            />
          </div>
        </div>

        <div className="login-section">
          <h2>Entrar</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Email ou nome de usuário" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Digite sua senha..." 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Login'}
            </button>
          </form>
          <p className="divider">ou</p>
          <Link href="/Home">
            <button className="btn-google">Continue com Google</button>
          </Link>
          <Link href="/Home">
            <button className="btn-apple">Continue com Apple</button>
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