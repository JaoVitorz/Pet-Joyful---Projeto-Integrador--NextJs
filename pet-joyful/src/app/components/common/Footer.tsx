'use client';

import Link from 'next/link';

import { FaPaw, FaHeart, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4">
          
          {/* Logo e Sobre */}
          <div className="col-md-4">
            <div className="d-flex align-items-center mb-3">
              <FaPaw className="text-success me-2" size={24} />
              <span className="fs-4 fw-bold">PetJoyful</span>
            </div>
            <p className="text-white">
              Conectando animais a lares amorosos desde {currentYear}. 
              Nosso objetivo é reduzir o número de animais abandonados.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-white"><FaInstagram size={20} /></a>
              <a href="#" className="text-white"><FaFacebook size={20} /></a>
              <a href="#" className="text-white"><FaTwitter size={20} /></a>
            </div>
          </div>

          

          {/* Ajuda */}
          <div className="col-md-2">
            <h5 className="mb-3">Ajuda</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/Faq" className=" text-decoration-none hover:text-white">
                  FAQ
                </Link>
              </li>
              
              <li className="mb-2">
                <Link href="/termos" className=" text-decoration-none hover:text-white">
                  Termos
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/privacidade" className=" text-decoration-none hover:text-white">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-4">
            <h5 className="mb-3">Receba Novidades</h5>
            <form className="mb-3">
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control bg-dark border-secondary text-white" 
                  placeholder="Seu email" 
                  required
                />
                <button className="btn btn-success" type="submit">
                  Enviar
                </button>
              </div>
            </form>
            <div className="d-flex align-items-center text-white">
              <FaHeart className="text-danger me-2" />
              <small>Ajude um animal a encontrar um lar hoje</small>
            </div>
          </div>
        </div>

        {/* Direitos Autorais */}
        <div className="row mt-4 pt-3 border-top border-secondary">
          <div className="col-12 text-center text-white">
            <small>
              &copy; {currentYear} PetJoyful. Todos os direitos reservados.
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
}