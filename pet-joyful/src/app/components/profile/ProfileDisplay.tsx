"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BiEdit, BiMapPin, BiPhone, BiCalendar, BiUser } from 'react-icons/bi';
import { profileService, Profile } from '@/services/profileApi';

interface ProfileDisplayProps {
  userId?: string; // Se não fornecido, mostra perfil do usuário logado
  showEditButton?: boolean;
}

export default function ProfileDisplay({ userId, showEditButton = true }: ProfileDisplayProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (userId) {
        response = await profileService.getProfileById(userId);
      } else {
        response = await profileService.getMyProfile();
      }
      
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '';
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tutor':
        return 'Tutor de Pet';
      case 'instituicao':
        return 'Instituição/ONG';
      case 'clinica':
        return 'Clínica Veterinária';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro ao carregar perfil: {error}</p>
          <button 
            onClick={loadProfile}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <BiUser className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Perfil não encontrado</p>
          {showEditButton && (
            <Link 
              href="/perfil-edit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
            >
              Criar Perfil
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header do perfil */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Foto do perfil */}
            <div className="relative">
              {profile.foto_perfil ? (
                <Image
                  src={profile.foto_perfil}
                  alt={profile.nome}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <BiUser className="text-4xl text-gray-400" />
                </div>
              )}
            </div>

            {/* Informações básicas */}
            <div className="text-white">
              <h1 className="text-2xl font-bold">{profile.nome}</h1>
              <p className="text-green-100">{profile.email}</p>
              <span className="inline-block bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm mt-2">
                {getTypeLabel(profile.tipo_usuario)}
              </span>
            </div>
          </div>

          {/* Botão de editar */}
          {showEditButton && (
            <Link 
              href="/perfil-edit"
              className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2 font-semibold"
            >
              <BiEdit />
              <span>Editar Perfil</span>
            </Link>
          )}
        </div>
      </div>

      {/* Conteúdo do perfil */}
      <div className="p-6">
        {/* Bio */}
        {profile.bio && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sobre</h3>
            <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Informações de contato e localização */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Contato</h3>
            <div className="space-y-2">
              {profile.telefone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <BiPhone className="text-green-500" />
                  <span>{formatPhone(profile.telefone)}</span>
                </div>
              )}
              
              {profile.data_nascimento && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <BiCalendar className="text-green-500" />
                  <span>Nascimento: {formatDate(profile.data_nascimento)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Localização */}
          {(profile.cidade || profile.endereco) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Localização</h3>
              <div className="space-y-2">
                {profile.cidade && profile.estado && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BiMapPin className="text-green-500" />
                    <span>{profile.cidade}, {profile.estado}</span>
                  </div>
                )}
                
                {profile.endereco && (
                  <div className="text-gray-600 ml-6">
                    <p>
                      {profile.endereco}
                      {profile.numero && `, ${profile.numero}`}
                      {profile.complemento && ` - ${profile.complemento}`}
                    </p>
                    {profile.cep && (
                      <p className="text-sm text-gray-500">CEP: {profile.cep}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Informações de cadastro */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              Membro desde: {formatDate(profile.createdAt)}
            </span>
            {profile.updatedAt && profile.updatedAt !== profile.createdAt && (
              <span>
                Atualizado em: {formatDate(profile.updatedAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
