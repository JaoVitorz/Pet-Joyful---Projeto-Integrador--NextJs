'use client';

import { useState } from 'react';
import Link from 'next/link';
import SocialButtons from './SocialButtons';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Lógica de autenticação aqui
      console.log('Logging in with:', { email, password });
      // Simulando uma requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-section">
      <h2>Entrar</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email ou nome de usuário"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <input
            type="password"
            placeholder="Digite sua senha..."
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-100 btn-login"
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Login'}
        </button>
      </form>
      
      <Link href="/recuperar-senha" className="forgot-password">
        Esqueceu sua senha?
      </Link>
      
      <p className="divider">ou</p>
      
      <SocialButtons />
      
      <div className="signup">
        <p>Não tem uma conta? <Link href="/registro">Cadastre-se</Link></p>
      </div>
    </div>
  );
}