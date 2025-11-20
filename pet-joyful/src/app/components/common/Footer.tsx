'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaPaw, FaHeart, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    
    // Simulação de envio - substitua pela sua API
    setTimeout(() => {
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <footer className="bg-dark text-white py-5" role="contentinfo">
      <div className="container">
        <div className="row g-4">
          
          {/* Logo e Sobre */}
          <div className="col-md-4">
            <div className="d-flex align-items-center mb-3">
              <FaPaw className="text-success me-2" size={24} aria-hidden="true" />
              <span className="fs-4 fw-bold">PetJoyful</span>
            </div>
            <p className="text-white">
              Conectando animais a lares amorosos desde {currentYear}. 
              Nosso objetivo é reduzir o número de animais abandonados.
            </p>
            <div className="d-flex gap-3 mt-3" role="list">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                aria-label="Seguir PetJoyful no Instagram"
              >
                <FaInstagram size={20} aria-hidden="true" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                aria-label="Seguir PetJoyful no Facebook"
              >
                <FaFacebook size={20} aria-hidden="true" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                aria-label="Seguir PetJoyful no Twitter"
              >
                <FaTwitter size={20} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Ajuda */}
          <nav className="col-md-2" aria-label="Links de ajuda">
            <h5 className="mb-3">Ajuda</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link 
                  href="/Faq" 
                  className="text-white text-decoration-none hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded px-1"
                >
                  FAQ
                </Link>
              </li>
              
              <li className="mb-2">
                <Link 
                  href="/termos" 
                  className="text-white text-decoration-none hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded px-1"
                >
                  Termos
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  href="/privacidade" 
                  className="text-white text-decoration-none hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded px-1"
                >
                  Privacidade
                </Link>
              </li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="col-md-4">
            <h5 className="mb-3">Receba Novidades</h5>
            <form className="mb-3" onSubmit={handleNewsletterSubmit} aria-label="Formulário de newsletter">
              <div className="input-group">
                <label htmlFor="newsletter-email" className="visually-hidden">
                  Seu endereço de email
                </label>
                <input 
                  type="email" 
                  id="newsletter-email"
                  className="form-control bg-dark border-secondary text-white" 
                  placeholder="Seu email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby="newsletter-status"
                  disabled={newsletterStatus === 'loading'}
                />
                <button 
                  className="btn btn-success" 
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  aria-label="Inscrever-se na newsletter"
                >
                  {newsletterStatus === 'loading' ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
              {newsletterStatus === 'success' && (
                <div id="newsletter-status" className="text-success small mt-2" role="status" aria-live="polite">
                  ✓ Email cadastrado com sucesso!
                </div>
              )}
              {newsletterStatus === 'error' && (
                <div id="newsletter-status" className="text-danger small mt-2" role="alert" aria-live="polite">
                  Erro ao cadastrar email. Tente novamente.
                </div>
              )}
            </form>
            <div className="d-flex align-items-center text-white">
              <FaHeart className="text-danger me-2" aria-hidden="true" />
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