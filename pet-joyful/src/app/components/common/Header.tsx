'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  BiHome, 
  BiUser, 
  BiMessageDetail, 
  BiBell, 
  BiListUl 
} from 'react-icons/bi';

interface HeaderProps {
  activeLink?: string;
}

export default function Header({ activeLink }: HeaderProps) {
  return (
    <header className="bg-success text-white py-3 px-4 d-flex justify-content-between align-items-center">
      <Link href="/Home" className="fw-bold fs-4">
        <Image
          src="/assets/logo.png"
          alt="Logo PetJoyful"
          width={140}
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
        <Navlink  
        href="/Chat"
        icon={<BiMessageDetail size={24} />} 
          label="Chat"
          active={activeLink === 'chat'}/>
       
        <BiBell size={24} />
        <BiListUl size={24} />
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