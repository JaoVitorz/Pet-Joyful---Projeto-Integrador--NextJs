'use client';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './registro.css';

export default function Registro() {
  const [tipoUsuario, setTipoUsuario] = useState<'adotante' | 'ong' | 'veterinario'>('adotante');

  const renderCampos = () => {
    switch (tipoUsuario) {
      case 'adotante':
        return (
          <>
            <h4 className="text-center">Cadastro para Adotantes</h4>
            <div className="form-group">
              <label>Nome completo:</label>
              <input type="text" className="form-control" placeholder="Nome completo" />
            </div>
            <div className="form-group">
              <label>CPF:</label>
              <input type="text" className="form-control" placeholder="CPF" />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" className="form-control" placeholder="Email ou nome de usuário" />
            </div>
          </>
        );

      case 'ong':
        return (
          <>
            <h4 className="text-center">Cadastro para ONGs</h4>
            <div className="form-group">
              <label>Nome da ONG:</label>
              <input type="text" className="form-control" placeholder="Nome da ONG" />
            </div>
            <div className="form-group">
              <label>CNPJ:</label>
              <input type="text" className="form-control" placeholder="CNPJ completo" />
            </div>
            <div className="form-group">
              <label>Email institucional:</label>
              <input type="email" className="form-control" placeholder="Email institucional" />
            </div>
          </>
        );

      case 'veterinario':
        return (
          <>
            <h4 className="text-center">Cadastro para Veterinários</h4>
            <div className="form-group">
              <label>Nome completo:</label>
              <input type="text" className="form-control" placeholder="Nome completo" />
            </div>
            <div className="form-group">
              <label>CPF:</label>
              <input type="text" className="form-control" placeholder="CPF" />
            </div>
            <div className="form-group">
              <label>CRMV:</label>
              <input type="text" className="form-control" placeholder="CRMV" />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" className="form-control" placeholder="Email profissional" />
            </div>
          </>
        );
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper d-flex align-items-center justify-content-center flex-column">
        <div className="form-column w-100">
          {renderCampos()}

          <div className="form-group mt-3">
            <label>Senha:</label>
            <input type="password" className="form-control" placeholder="Digite uma senha..." />
          </div>
          <div className="form-group">
            <label>Confirme a senha:</label>
            <input type="password" className="form-control" placeholder="Confirme a senha..." />
          </div>

          <p className="text-center mt-2">
            Já possui uma conta? <a href="/login">Faça login</a>
          </p>
          <a href="/Home">
            <button className="form-btn mt-2">Cadastrar-se</button>
          </a>
        </div>

        {/* Botões de seleção de tipo de usuário */}
        <div className="user-type-switcher mt-4">
          <p className="text-center">Selecionar tipo de cadastro:</p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className={`btn btn-outline-primary ${tipoUsuario === 'adotante' ? 'active' : ''}`}
              onClick={() => setTipoUsuario('adotante')}
            >
              Adotante
            </button>
            <button
              className={`btn btn-outline-success ${tipoUsuario === 'ong' ? 'active' : ''}`}
              onClick={() => setTipoUsuario('ong')}
            >
              ONG
            </button>
            <button
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
