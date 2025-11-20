"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import EditProfileForm from "../components/profile/EditProfileForm";
import { profileService, Profile } from '@/services/profileApi';

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário está logado
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Tentar carregar perfil existente
      const response = await profileService.getMyProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (error: any) {
      // Se perfil não existe, será criado na primeira atualização
      console.log('Perfil não encontrado, será criado na primeira atualização');
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    // Opcional: redirecionar para página de perfil
    // router.push('/perfil');
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header activeLink="perfil" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeLink="perfil" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <button 
                  onClick={() => router.push('/perfil')}
                  className="hover:text-green-600"
                >
                  Perfil
                </button>
              </li>
              <li>/</li>
              <li className="text-gray-900">Editar Perfil</li>
            </ol>
          </nav>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold">Erro ao carregar perfil</p>
              <p>{error}</p>
              <button 
                onClick={loadProfile}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Formulário de edição */}
          <EditProfileForm 
            onSuccess={handleProfileUpdate}
            onCancel={handleCancel}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
