'use client';

import { useState } from 'react';
import { createPost } from '@/app/services/postService';
import Image from 'next/image';

export default function CreatePostForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData(e.currentTarget);
      
      await createPost(formData);
      alert('✅ Postagem criada com sucesso!');
      
      // Reset form
      e.currentTarget.reset();
      setPreview(null);
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Criar Postagem</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-2">Título *</label>
        <input
          type="text"
          name="titulo"
          required
          maxLength={200}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite um título..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Descrição</label>
        <textarea
          name="descricao"
          maxLength={2000}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Conte mais sobre sua postagem..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Categoria</label>
        <select name="categoria" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="outros">Outros</option>
          <option value="foto">Foto</option>
          <option value="adocao">Adoção</option>
          <option value="perdido">Perdido</option>
          <option value="encontrado">Encontrado</option>
          <option value="dica">Dica</option>
          <option value="evento">Evento</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Tags (separadas por vírgula)</label>
        <input
          type="text"
          name="tags"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="cachorro, filhote, fofo"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Imagem (opcional)</label>
        <input
          type="file"
          name="imagem"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {preview && (
          <div className="mt-4 relative w-full h-64">
            <Image 
              src={preview} 
              alt="Preview" 
              fill
              className="object-contain rounded-lg"
            />
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">Máximo 5MB - Formatos: JPG, PNG, GIF, WebP</p>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 transition"
      >
        {loading ? 'Publicando...' : '📝 Publicar'}
      </button>
    </form>
  );
}