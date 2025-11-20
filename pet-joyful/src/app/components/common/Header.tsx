'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  BiHome,
  BiUser,
  BiMessageDetail,
  BiBell,
  BiListUl,
  BiLogOut,
} from 'react-icons/bi';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  activeLink?: string;
}

export default function Header({ activeLink }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);

  const notifications = [
    {
      id: 1,
      user: 'Elisabeth',
      type: 'curtiu sua publicação.',
      avatar: '/assets/imgPerfilM.png',
    },
    {
      id: 2,
      user: 'Roberto',
      type: 'comentou: "Lindo pet!"',
      avatar: '/assets/imgPerfilH.png',
    },
    {
      id: 3,
      user: 'Clínica Vet+',
      type: 'respondeu sua pergunta.',
      avatar: '/assets/imgPerfilM.png',
    },
  ];

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        notificationsButtonRef.current &&
        !notificationsButtonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fechar menus com ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSettings(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <header 
      className="bg-success text-white py-3 px-4 d-flex justify-content-between align-items-center position-relative"
      role="banner"
    >
      <Link 
        href="/Home" 
        className="fw-bold fs-4"
        aria-label="PetJoyful - Ir para página inicial"
      >
        <Image
          src="/assets/pet-joyful.logosmfundo.png"
          alt="Logo PetJoyful - Conectando Corações e Patas"
          width={230}
          height={110}
          priority
        />
      </Link>

      <label htmlFor="header-search" className="visually-hidden">
        Buscar na plataforma
      </label>
      <input 
        type="search" 
        id="header-search"
        className="form-control w-50" 
        placeholder="Buscar posts, usuários, eventos..."
        aria-label="Campo de busca"
      />

      <nav className="d-flex align-items-center gap-3" aria-label="Navegação principal">
        <NavLink
          href="/Home"
          icon={<BiHome size={24} />}
          label="Início"
          active={activeLink === 'home'}
        />
        <NavLink
          href="/Perfil"
          icon={<BiUser size={24} />}
          label="Perfil"
          active={activeLink === 'perfil'}
        />
        <NavLink
          href="/Chat"
          icon={<BiMessageDetail size={24} />}
          label="Chat"
          active={activeLink === 'chat'}
        />

        {/* Notificações */}
        <div className="position-relative" ref={notificationsRef}>
          <button
            ref={notificationsButtonRef}
            className="bg-transparent border-0 text-white p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificações"
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <BiBell size={24} aria-hidden="true" />
            {notifications.length > 0 && (
              <span className="visually-hidden">
                {notifications.length} notificação{notifications.length > 1 ? 'ões' : ''}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded shadow-sm p-2 z-3"
              style={{ width: '300px' }}
              role="menu"
              aria-label="Lista de notificações"
            >
              <h6 className="px-2 mb-2 text-dark">Notificações</h6>
              {notifications.length === 0 ? (
                <p className="px-3 py-2 text-muted small">Nenhuma notificação</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="d-flex align-items-center gap-2 px-3 py-2 border-bottom"
                    role="menuitem"
                  >
                    <Image
                      src={notif.avatar}
                      width={30}
                      height={30}
                      className="rounded-circle"
                      alt={`Avatar de ${notif.user}`}
                    />
                    <div className="text-dark small">
                      <strong>{notif.user}</strong> {notif.type}
                    </div>
                  </div>
                ))
              )}
              <div className="text-center mt-2">
                <button
                  className="btn btn-link text-secondary small"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Fechar notificações"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Configurações */}
        <div className="position-relative" ref={settingsRef}>
          <button
            ref={settingsButtonRef}
            onClick={() => setShowSettings(!showSettings)}
            className="bg-transparent border-0 text-white p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            aria-label="Menu de configurações"
            aria-expanded={showSettings}
            aria-haspopup="true"
          >
            <BiListUl size={24} aria-hidden="true" />
          </button>

          {showSettings && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded shadow-sm py-2 z-3"
              style={{ width: '200px' }}
              role="menu"
              aria-label="Menu de configurações"
            >
              <Link
                href="/configuracoes"
                className="d-flex align-items-center gap-2 px-3 py-2 text-dark text-decoration-none"
                onClick={() => setShowSettings(false)}
                role="menuitem"
              >
                <span>Configurações</span>
              </Link>
              <Link
                href="/login"
                className="d-flex align-items-center gap-2 px-3 py-2 text-dark text-decoration-none"
                onClick={() => setShowSettings(false)}
                role="menuitem"
              >
                <BiLogOut size={18} aria-hidden="true" />
                <span>Sair</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-white text-decoration-none d-flex flex-column align-items-center p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${active ? 'active' : ''
        }`}
      aria-label={`Ir para ${label}`}
      aria-current={active ? 'page' : undefined}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="fs-6">{label}</span>
    </Link>
  );
}
