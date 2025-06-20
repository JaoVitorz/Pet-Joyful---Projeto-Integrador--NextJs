import axios from "axios";
// Update the path below to the correct relative path if needed
import { Comment, CreateCommentData } from "../types/comment";

// Configuração base do Axios
const api = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const commentApi = {
  // Obter comentários de uma postagem
  getComments: async (postId: string): Promise<Comment[]> => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      throw error;
    }
  },

  // Adicionar novo comentário
  createComment: async (
    postId: string,
    commentData: CreateCommentData
  ): Promise<Comment> => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      throw error;
    }
  },

  // Atualizar comentário
  updateComment: async (
    commentId: string,
    content: string
  ): Promise<Comment> => {
    try {
      const response = await api.put(`/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
      throw error;
    }
  },

  // Deletar comentário
  deleteComment: async (commentId: string): Promise<void> => {
    try {
      await api.delete(`/comments/${commentId}`);
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      throw error;
    }
  },

  // Curtir comentário
  likeComment: async (commentId: string): Promise<{ likes: number }> => {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error("Erro ao curtir comentário:", error);
      throw error;
    }
  },
};

// Example usage (uncomment and define variables if you want to use this in your code):
// const postId = "your-post-id";
// const commentContent = "your comment";
// const currentUser = { id: "your-user-id" };
// const newComment = await commentApi.createComment(
//   postId,
//   {
//     content: commentContent,
//     postId: postId,
//     userId: currentUser.id,
//   }
// );
