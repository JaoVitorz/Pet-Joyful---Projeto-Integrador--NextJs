'use client';

import Image from 'next/image';
import { Button } from 'react-bootstrap';
import { BiSearch, BiUserPlus, BiCog } from 'react-icons/bi';

interface ProfileSidebarProps {
  followersCount?: number;
  followingCount?: number;
  onFindPeople?: () => void;
  onSettingsClick?: () => void;
}

export default function ProfileSidebar({
  followersCount = 5200,
  followingCount = 705,
  onFindPeople = () => console.log('Procurar pessoas'),
  onSettingsClick = () => console.log('Abrir configurações')
}: ProfileSidebarProps) {
  const following = [
    { id: 1, name: 'Elisabeth', avatar: '/assets/imgPerfilM.png' },
    { id: 2, name: 'Roberto', avatar: '/assets/imgPerfilH.png' },
    { id: 3, name: 'Ana', avatar: '/assets/imgPerfilF.png' }
  ];

  return (
    <div className="profile-sidebar bg-white p-3 rounded shadow">
      {/* Seção de Estatísticas */}
      <div className="stats-section mb-4 p-3 border-bottom">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Seguidores</span>
          <strong>{followersCount.toLocaleString()}</strong>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted">Seguindo</span>
          <strong>{followingCount}</strong>
        </div>
      </div>

      {/* Seção "Seguindo" */}
      <div className="following-section mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Seguindo</h5>
          <BiSearch className="text-muted cursor-pointer" />
        </div>
        
        <div className="following-list">
          {following.map(user => (
            <div key={user.id} className="d-flex align-items-center mb-3">
              <Image
                src={user.avatar}
                width={40}
                height={40}
                alt={user.name}
                className="rounded-circle me-2"
              />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Ações */}
      <div className="actions-section">
        <Button 
          variant="light" 
          className="w-100 mb-3 d-flex align-items-center justify-content-center"
          onClick={onFindPeople}
        >
          <BiUserPlus className="me-2" />
          Encontrar pessoas
        </Button>
        
        <Button 
          variant="outline-secondary" 
          className="w-100 d-flex align-items-center justify-content-center"
          onClick={onSettingsClick}
        >
          <BiCog className="me-2" />
          Configurações
        </Button>
      </div>

      {/* Estilos (opcional - pode colocar no CSS global) */}
      <style jsx>{`
        .profile-sidebar {
          position: sticky;
          top: 20px;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .following-list {
          max-height: 300px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}