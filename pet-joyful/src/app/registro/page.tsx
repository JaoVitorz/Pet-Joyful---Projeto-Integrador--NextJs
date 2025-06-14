'use client';
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './registro.css';

export default function Registro() {
  const [tipoUsuario, setTipoUsuario] = useState<'adotante' | 'ong' | 'veterinario'>('adotante');
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnpj: '',
    crmv: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de senha
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Monta o payload conforme o tipo de usuário
      const payload = {
        tipo: tipoUsuario,
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        ...(tipoUsuario === 'adotante' && { cpf: formData.cpf }),
        ...(tipoUsuario === 'ong' && { cnpj: formData.cnpj }),
        ...(tipoUsuario === 'veterinario' && { cpf: formData.cpf, crmv: formData.crmv }),
      };

      // Envia para a API
      await axios.post('/api/registro', payload);
      
      setSuccess(true);
      // Redireciona após 2 segundos
      setTimeout(() => {
        window.location.href = '/Home';
      }, 2000);
      
    } catch (err) {
      console.error('Erro no registro:', err);
      setError('Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderCampos = () => {
    switch (tipoUsuario) {
      case 'adotante':
        return (
          <>
            <h4 className="text-center">Cadastro para Adotantes</h4>
            <div className="form-group">
              <label>Nome completo:</label>
              <input 
                type="text" 
                className="form-control" 
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome completo" 
                required
              />
            </div>
            <div className="form-group">
              <label>CPF:</label>
              <input 
                type="text" 
                className="form-control" 
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="CPF" 
                required
              />
            </div>
          </>
        );

      case 'ong':
        return (
          <>
            <h4 className="text-center">Cadastro para ONGs</h4>
            <div className="form-group">
              <label>Nome da ONG:</label>
              <input 
                type="text" 
                className="form-control" 
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome da ONG" 
                required
              />
            </div>
            <div className="form-group">
              <label>CNPJ:</label>
              <input 
                type="text" 
                className="form-control" 
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="CNPJ completo" 
                required
              />
            </div>
          </>
        );

      case 'veterinario':
        return (
          <>
            <h4 className="text-center">Cadastro para Veterinários</h4>
            <div className="form-group">
              <label>Nome completo:</label>
              <input 
                type="text" 
                className="form-control" 
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome completo" 
                required
              />
            </div>
            <div className="form-group">
              <label>CPF:</label>
              <input 
                type="text" 
                className="form-control" 
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="CPF" 
                required
              />
            </div>
            <div className="form-group">
              <label>CRMV:</label>
              <input 
                type="text" 
                className="form-control" 
                name="crmv"
                value={formData.crmv}
                onChange={handleChange}
                placeholder="CRMV" 
                required
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper d-flex align-items-center justify-content-center flex-column">
        <div className="form-column w-100">
          <form onSubmit={handleSubmit}>
            {renderCampos()}

            {/* Campo de email (comum a todos) */}
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                className="form-control" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={
                  tipoUsuario === 'ong' ? 'Email institucional' : 
                  tipoUsuario === 'veterinario' ? 'Email profissional' : 
                  'Email ou nome de usuário'
                } 
                required
              />
            </div>

            <div className="form-group mt-3">
              <label>Senha:</label>
              <input 
                type="password" 
                className="form-control" 
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Digite uma senha..." 
                required
              />
            </div>
            <div className="form-group">
              <label>Confirme a senha:</label>
              <input 
                type="password" 
                className="form-control" 
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Confirme a senha..." 
                required
              />
            </div>

            {/* Mensagens de feedback */}
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Cadastro realizado com sucesso!</div>}

            <p className="text-center mt-2">
              Já possui uma conta? <a href="/login">Faça login</a>
            </p>
            <button 
              type="submit" 
              className="form-btn mt-2"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar-se'}
            </button>
          </form>
        </div>

        {/* Botões de seleção de tipo de usuário */}
        <div className="user-type-switcher mt-4">
          <p className="text-center">Selecionar tipo de cadastro:</p>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className={`btn btn-outline-primary ${tipoUsuario === 'adotante' ? 'active' : ''}`}
              onClick={() => setTipoUsuario('adotante')}
            >
              Adotante
            </button>
            <button
              type="button"
              className={`btn btn-outline-success ${tipoUsuario === 'ong' ? 'active' : ''}`}
              onClick={() => setTipoUsuario('ong')}
            >
              ONG
            </button>
            <button
              type="button"
              className={`btn btn-outline-info ${tipoUsuario === 'veterinario' ? 'active' : ''}`}
              onClick={() => setTipoUsuario('veterinario')}
            >
              Veterinário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}