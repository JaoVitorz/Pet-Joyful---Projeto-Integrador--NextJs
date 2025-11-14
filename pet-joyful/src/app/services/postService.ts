const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export interface Post {
  _id: string;
  titulo: string;
  descricao?: string;
  imagem?: {
    url: string;
    width: number;
    height: number;
    public_id: string;
  };
  categoria: string;
  tags: string[];
  autor: {
    userId: string;
    nome: string;
    email: string;
  };
  likes: string[];
  comentarios: Array<{
    _id: string;
    userId: string;
    nome: string;
    texto: string;
    data: string;
  }>;
  visualizacoes: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Criar postagem
 */
export const createPost = async (formData: FormData) => {
  const token = getToken();
  const user = getUser();
  
  if (!token) {
    throw new Error('Usuário não autenticado');
  }
  
  if (user?.nome) {
    formData.append('autorNome', user.nome);
  }
  
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao criar postagem');
  }
  
  return data;
};

/**
 * Listar postagens
 */
export const getPosts = async (filters: Record<string, any> = {}) => {
  const params = new URLSearchParams(filters);
  
  const response = await fetch(`/api/posts?${params}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao listar postagens');
  }
  
  return data as PostsResponse;
};

/**
 * Buscar postagem por ID
 */
export const getPostById = async (id: string) => {
  const response = await fetch(`/api/posts/${id}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao buscar postagem');
  }
  
  return data;
};

/**
 * Atualizar postagem
 */
export const updatePost = async (id: string, formData: FormData) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Usuário não autenticado');
  }
  
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao atualizar postagem');
  }
  
  return data;
};

/**
 * Deletar postagem
 */
export const deletePost = async (id: string) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Usuário não autenticado');
  }
  
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao deletar postagem');
  }
  
  return data;
};

/**
 * Curtir/Descurtir postagem
 */
export const toggleLike = async (id: string) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Usuário não autenticado');
  }
  
  const response = await fetch(`/api/posts/${id}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao curtir postagem');
  }
  
  return data;
};

/**
 * Comentar postagem
 */
export const addComment = async (id: string, texto: string) => {
  const token = getToken();
  const user = getUser();
  
  if (!token) {
    throw new Error('Usuário não autenticado');
  }
  
  const response = await fetch(`/api/posts/${id}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ 
      texto,
      autorNome: user?.nome || 'Usuário'
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao comentar');
  }
  
  return data;
};