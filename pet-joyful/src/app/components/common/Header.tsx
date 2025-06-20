'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  BiHome, 
  BiUser, 
  BiMessageDetail, 
  BiBell, 
  BiListUl,
  
  BiLogOut
} from 'react-icons/bi';
import { useState } from 'react';

interface HeaderProps {
  activeLink?: string;
}

export default function Header({ activeLink }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="bg-success text-white py-3 px-4 d-flex justify-content-between align-items-center position-relative">
      <Link href="/Home" className="fw-bold fs-4">
        <Image
          src="/assets/pet-joyful.logosmfundo.png"
          alt="Logo PetJoyful"
          width={230}
          height={110}
        />
      </Link>

      <input type="text" className="form-control w-50" placeholder="Busca" />

      <div className="d-flex align-items-center gap-3">
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
       
        <BiBell size={24} />
        <div className="position-relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="bg-transparent border-0 text-white"
          >
            <BiListUl size={24} />
          </button>
          
          {showSettings && (
            <div className="position-absolute end-0 mt-2 bg-white rounded shadow-sm py-2 z-3" style={{width: '200px'}}>
              <Link 
                href="/configuracoes" 
                className="d-flex align-items-center gap-2 px-3 py-2 text-dark text-decoration-none"
                onClick={() => setShowSettings(false)}
              >
                
              </Link>
              <Link 
                href="/login" 
                className="d-flex align-items-center gap-2 px-3 py-2 text-dark text-decoration-none"
                onClick={() => setShowSettings(false)}
              >
                <BiLogOut size={18} />
                <span>Sair</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, icon, label, active = false }: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  active?: boolean;
}) {
  return (
    <Link 
      href={href} 
      className={`text-white text-decoration-none d-flex flex-column align-items-center ${active ? 'active' : ''}`}
    >
      {icon}
      <span className="fs-6">{label}</span>
    </Link>
  );
}