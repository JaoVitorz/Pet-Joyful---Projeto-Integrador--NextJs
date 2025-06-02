'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './registro.css';

export default function Registro() {
  return (
    <div className="container">
      <div className="form-wrapper">
        {/* Formulário Tutores */}
        <div className="form-section">
          <div className="form-column w-100">
            <h4 className="text-center">Para Tutores</h4>
            <div className="form-group">
              <label htmlFor="nomeTutor">Nome completo:</label>
              <input type="text" className="form-control" placeholder="Nome completo" />
            </div>
            <div className="form-group">
              <label htmlFor="emailTutor">Insira um email:</label>
              <input type="email" className="form-control" placeholder="Email ou nome de usuário" />
            </div>
            <div className="form-group">
              <label htmlFor="senhaTutor">Digite senha de no mínimo 6 caracteres:</label>
              <input type="password" className="form-control" placeholder="Digite uma senha..." />
            </div>
            <div className="form-group">
              <label htmlFor="confirmaSenhaTutor">Confirme a senha:</label>
              <input type="password" className="form-control" placeholder="Confirme a senha..." />
            </div>
            <a href="/login">
            </a>
            <p className="text-center">Já possui uma conta? Faça login</p>
            <a href="/login"> </a>
              <a href="/login"><button className="form-btn">Cadastrar-se</button></a>

          </div>
        </div>

        {/* Imagem central */}
        <div className="form-image">
          <img
            src="/assets/pet-registro.png"
            alt="Registro PetNet"
            className="img-fluid"
          />
        </div>

        {/* Formulário ONGs */}
        <div className="form-section">
          <div className="form-column w-100">
            <h4 className="text-center">Para ONG's</h4>
            <div className="form-group">
              <label htmlFor="cnpjONG">Insira o CNPJ:</label>
              <input type="text" id="cnpjONG" className="form-control" placeholder="CNPJ completo" />
            </div>
            <div className="form-group">
              <label htmlFor="emailONG">Insira o email institucional:</label>
              <input type="email" id="emailONG" className="form-control" placeholder="Email ou nome de usuário..." />
            </div>
            <div className="form-group">
              <label htmlFor="senhaONG">Digite senha de no mínimo 6 caracteres:</label>
              <input type="password" id="senhaONG" className="form-control" placeholder="Digite uma senha..." />
            </div>
            <div className="form-group">
              <label htmlFor="confirmaSenhaONG">Confirme a senha:</label>
              <input type="password" id="confirmaSenhaONG" className="form-control" placeholder="Confirme a senha..." />
            </div>
            <a href="/login">
              <button className="form-btn">Cadastrar-se</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
