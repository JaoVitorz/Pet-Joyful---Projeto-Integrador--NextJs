'use client';

import { useState } from 'react';
import { Post, toggleLike, addComment, deletePost } from '@/app/services/postService';
import Image from 'next/image';

interface PostCardProps {
  post: Post;
  currentUserId: string | null;
  onUpdate: () => void;
}

export default function PostCard({ post, currentUserId, onUpdate }: PostCardProps) {
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isLiked = currentUserId && post.likes.includes(currentUserId);
  const isAuthor = currentUserId === post.autor.userId;

  const handleLike = async () => {
    try {
      await toggleLike(post._id);
      onUpdate();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      setCommenting(true);
      await addComment(post._id, commentText);
      setCommentText('');
      onUpdate();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta postagem?')) return;

    try {
      await deletePost(post._id);
      onUpdate();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {post.autor.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{post.autor.nome}</p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        
        {isAuthor && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-xl"
            title="Deletar postagem"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Conteúdo */}
      <div className="px-4 pb-3">
        <h3 className="text-xl font-bold mb-2">{post.titulo}</h3>
        {post.descricao && (
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">{post.descricao}</p>
        )}
        
        {/* Categoria */}
        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mb-2">
          {post.categoria}
        </span>
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Imagem */}
      {post.imagem && (
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <Image
            src={post.imagem.url}
            alt={post.titulo}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Ações */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-6 mb-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 ${
              isLiked ? 'text-red-500' : 'text-gray-500'
            } hover:text-red-500 transition`}
          >
            <span className="text-2xl">{isLiked ? '❤️' : '🤍'}</span>
            <span className="font-semibold">{post.likes.length}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition"
          >
            <span className="text-2xl">💬</span>
            <span className="font-semibold">{post.comentarios.length}</span>
          </button>
          
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-xl">👁️</span>
            <span className="text-sm">{post.visualizacoes}</span>
          </div>
        </div>

        {/* Comentários */}
        {showComments && (
          <div className="space-y-3">
            {post.comentarios.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {post.comentarios.map(comment => (
                  <div key={comment._id} className="bg-gray-50 p-3 rounded">
                    <p className="font-semibold text-sm">{comment.nome}</p>
                    <p className="text-sm text-gray-700">{comment.texto}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(comment.data).toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar comentário */}
            <div className="flex space-x-2 pt-2 border-t">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Adicione um comentário..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !commenting) {
                    handleComment();
                  }
                }}
                disabled={commenting}
              />
              <button
                onClick={handleComment}
                disabled={commenting || !commentText.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
              >
                {commenting ? '...' : 'Enviar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}