'use client';

import { useState, useEffect } from 'react';
import { getPosts, Post } from '@/app/services/postService';
import PostCard from './PostCard';

interface PostsFeedProps {
  refreshKey?: number;
}

export default function PostsFeed({ refreshKey }: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUserId(userData.id || userData._id);
    }
    
    loadPosts();
  }, [page, refreshKey]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts({ page, limit: 10 });
      
      if (response.success) {
        setPosts(response.data);
        setTotalPages(response.pagination.pages);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {posts.map(post => (
        <PostCard 
          key={post._id}
          post={post}
          currentUserId={currentUserId}
          onUpdate={loadPosts}
        />
      ))}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 py-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition"
          >
            ← Anterior
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded-lg">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition"
          >
            Próxima →
          </button>
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          Nenhum post encontrado.
        </div>
      )}
    </div>
  );
}

