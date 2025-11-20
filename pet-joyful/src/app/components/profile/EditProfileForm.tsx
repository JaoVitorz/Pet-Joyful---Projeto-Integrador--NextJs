"use client";
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import { profileService, Profile, ProfileUpdateData } from '@/services/profileApi';

interface EditProfileFormProps {
  onSuccess?: (profile: Profile) => void;
  onCancel?: () => void;
}

// Schema de validação
const profileSchema = Yup.object().shape({
  nome: Yup.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .required('Nome é obrigatório'),
  telefone: Yup.string()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato inválido. Use (11) 99999-9999'),
  data_nascimento: Yup.date()
    .max(new Date(Date.now() - 13 * 365 * 24 * 60 * 60 * 1000), 'Idade mínima é 13 anos')
    .min(new Date(Date.now() - 120 * 365 * 24 * 60 * 60 * 1000), 'Idade máxima é 120 anos'),
  bio: Yup.string().max(1000, 'Bio deve ter no máximo 1000 caracteres'),
  cidade: Yup.string().max(100, 'Cidade deve ter no máximo 100 caracteres'),
  estado: Yup.string()
    .length(2, 'Estado deve ter 2 caracteres (UF)')
    .matches(/^[A-Z]{2}$/, 'Estado deve ser em maiúsculas (ex: SP)'),
  cep: Yup.string()
    .matches(/^\d{5}-?\d{3}$/, 'CEP deve ter formato 00000-000'),
  endereco: Yup.string().max(255, 'Endereço deve ter no máximo 255 caracteres'),
  numero: Yup.string().max(20, 'Número deve ter no máximo 20 caracteres'),
  complemento: Yup.string().max(100, 'Complemento deve ter no máximo 100 caracteres'),
});

export default function EditProfileForm({ onSuccess, onCancel }: EditProfileFormProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Carregar perfil atual
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getMyProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        setPhotoPreview(response.data.foto_perfil || '');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Formatar data para input
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  // Formatar CEP
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Lidar com seleção de foto
  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload de foto
  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    try {
      setUploadingPhoto(true);
      const response = await profileService.uploadProfilePhoto(photoFile);
      
      if (response.success && response.data) {
        setPhotoPreview(response.data.foto_perfil);
        setPhotoFile(null);
        
        // Atualizar perfil local
        if (profile) {
          setProfile({
            ...profile,
            foto_perfil: response.data.foto_perfil
          });
        }
        
        alert('Foto atualizada com sucesso!');
      }
    } catch (error: any) {
      alert('Erro ao fazer upload da foto: ' + error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Submeter formulário
  const handleSubmit = async (values: ProfileUpdateData) => {
    try {
      setError('');
      
      // Formatar dados antes de enviar
      const formattedData = {
        ...values,
        telefone: values.telefone ? values.telefone.replace(/\D/g, '') : undefined,
        cep: values.cep ? values.cep.replace(/\D/g, '') : undefined,
        estado: values.estado?.toUpperCase(),
      };

      const response = await profileService.updateMyProfile(formattedData);
      
      if (response.success && response.data) {
        alert('Perfil atualizado com sucesso!');
        setProfile(response.data);
        onSuccess?.(response.data);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Erro ao carregar perfil</p>
        <button 
          onClick={loadProfile}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const initialValues: ProfileUpdateData = {
    nome: profile.nome || '',
    telefone: profile.telefone ? formatPhone(profile.telefone) : '',
    data_nascimento: formatDateForInput(profile.data_nascimento),
    bio: profile.bio || '',
    cidade: profile.cidade || '',
    estado: profile.estado || '',
    cep: profile.cep ? formatCEP(profile.cep) : '',
    endereco: profile.endereco || '',
    numero: profile.numero || '',
    complemento: profile.complemento || '',
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Seção de foto */}
      <div className="mb-8 text-center">
        <div className="relative inline-block">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt="Foto de perfil"
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="w-30 h-30 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">Sem foto</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600 mr-2"
          >
            Escolher Foto
          </label>
          
          {photoFile && (
            <button
              onClick={handlePhotoUpload}
              disabled={uploadingPhoto}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {uploadingPhoto ? 'Enviando...' : 'Salvar Foto'}
            </button>
          )}
        </div>
      </div>

      {/* Formulário */}
      <Formik
        initialValues={initialValues}
        validationSchema={profileSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo *
              </label>
              <Field
                name="nome"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="nome" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <Field name="telefone">
                {({ field }: any) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setFieldValue('telefone', formatted);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="telefone" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Data de nascimento */}
            <div>
              <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700 mb-2">
                Data de nascimento
              </label>
              <Field
                name="data_nascimento"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="data_nascimento" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Biografia
              </label>
              <Field
                name="bio"
                as="textarea"
                rows={4}
                placeholder="Conte um pouco sobre você..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="bio" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <Field
                  name="cidade"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <ErrorMessage name="cidade" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado (UF)
                </label>
                <Field
                  name="estado"
                  type="text"
                  placeholder="SP"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <ErrorMessage name="estado" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                CEP
              </label>
              <Field name="cep">
                {({ field }: any) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="00000-000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={(e) => {
                      const formatted = formatCEP(e.target.value);
                      setFieldValue('cep', formatted);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="cep" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <Field
                  name="endereco"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <ErrorMessage name="endereco" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
                  Número
                </label>
                <Field
                  name="numero"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <ErrorMessage name="numero" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <div>
              <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-2">
                Complemento
              </label>
              <Field
                name="complemento"
                type="text"
                placeholder="Apto, bloco, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage name="complemento" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 disabled:opacity-50 font-semibold"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-md hover:bg-gray-600 font-semibold"
                >
                  Cancelar
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
