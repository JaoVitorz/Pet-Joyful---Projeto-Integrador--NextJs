'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function login() {
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
          <input type="text" placeholder="Email ou nome de usuário" />
          <input type="password" placeholder="Digite sua senha..." />
          <Link href="/Home">
            <button className="btn-login">Login</button>
          </Link>
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

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Roboto', sans-serif;
        }

        body {
          background-color: #eaf5e5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          color: #333;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          width: 90%;
          max-width: 1200px;
          padding: 20px;
        }

        .left-section {
          background-color: #4caf50;
          color: #fff;
          border-radius: 10px;
          padding: 40px;
          width: 100%;
          max-width: 600px;
          text-align: center;
          margin-bottom: 20px;
        }

        .left-section h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .left-section p {
          font-size: 1.2rem;
        }

        .pet-images {
          margin-top: 30px;
        }

        .pet-images img {
          max-width: 100%;
          height: auto;
        }

        .login-section {
          background-color: #4caf50;
          border-radius: 10px;
          padding: 30px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          color: #fff;
        }

        .login-section h2 {
          font-size: 1.8rem;
          margin-bottom: 20px;
        }

        .login-section input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border-radius: 5px;
          border: none;
          font-size: 1rem;
        }

        .btn-login,
        .btn-google,
        .btn-apple {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border-radius: 5px;
          border: none;
          font-weight: bold;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .btn-login {
          background-color: #fff;
          color: #4caf50;
        }

        .btn-google {
          background-color: #fff;
          color: #4caf50;
          border: 1px solid #4caf50;
        }

        .btn-apple {
          background-color: #fff;
          color: #000;
          border: 1px solid #000;
        }

        .divider {
          margin: 15px 0;
          position: relative;
        }

        .divider::before,
        .divider::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 45%;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.3);
        }

        .divider::before {
          left: 0;
        }

        .divider::after {
          right: 0;
        }

        .forgot-password {
          color: #fff;
          text-decoration: underline;
          font-size: 0.9rem;
          display: inline-block;
          margin-top: 10px;
        }

        .signup {
          margin-top: 20px;
          color: #fff;
        }

        .signup a {
          color: #fff;
          font-weight: bold;
          text-decoration: underline;
        }

        footer {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        footer a {
          color: #333;
          text-decoration: none;
          font-size: 0.9rem;
        }

        @media (min-width: 992px) {
          .container {
            flex-direction: row;
            align-items: center;
          }

          .left-section {
            margin-bottom: 0;
            margin-right: 20px;
          }
        }

        @media (max-width: 768px) {
          .left-section {
            padding: 30px 20px;
          }

          .left-section h1 {
            font-size: 2rem;
          }

          .login-section {
            padding: 25px 20px;
          }

          .login-section h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}