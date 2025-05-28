'use client';

import Image from 'next/image';

import { BiCheckCircle } from 'react-icons/bi';

export default function ProfileHeader() {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="d-flex align-items-start">
        <Image
          src="/assets/aatan-logo.jpg"
          alt="Foto do perfil"
          width={120}
          height={120}
          className="rounded-circle  border-3 border-success"
        />
        
        <div className="ms-4 flex-grow-1">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">AATAN - Sorocaba</h2>
            <BiCheckCircle className="ms-2 text-success" size={20} />
          </div>
          
          <div className="d-flex gap-4 my-2">
            <div><strong>5.2k</strong> seguidores</div>
            <div><strong>705</strong> seguindo</div>
            <div className="text-warning">★★★★☆ (4.2)</div>
          </div>
          
          <p className="text-muted">
            Associação de proteção animal oferecendo abrigo e cuidados para 
            animais em situação de vulnerabilidade.
          </p>
          
         
        </div>
      </div>
    </div>
  );
}