'use client';

import Image from 'next/image';
import { BiCheckCircle } from 'react-icons/bi';

interface ProfileHeaderProps {
  nome?: string;
  bio?: string;
  avatar?: string;
}

export default function ProfileHeader({ 
  nome = "AATAN - Sorocaba",
  bio = "Associação de proteção animal oferecendo abrigo e cuidados para animais em situação de vulnerabilidade.",
  avatar = "/assets/aatan-logo.jpg"
}: ProfileHeaderProps) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="d-flex align-items-start">
        <Image
          src={avatar}
          alt={`Foto do perfil de ${nome}`}
          width={120}
          height={120}
          className="rounded-circle border-3 border-success"
        />
        
        <div className="ms-4 flex-grow-1">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">{nome}</h2>
            <BiCheckCircle className="ms-2 text-success" size={20} aria-label="Conta verificada" />
          </div>
          
          <div className="d-flex gap-4 my-2">
            <div><strong>5.2k</strong> seguidores</div>
            <div><strong>705</strong> seguindo</div>
          </div>
          
          <p className="text-muted">
            {bio}
          </p>
        </div>
      </div>
    </div>
  );
}