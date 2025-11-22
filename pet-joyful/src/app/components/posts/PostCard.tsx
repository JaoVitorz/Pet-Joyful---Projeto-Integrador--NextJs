"use client";

import Image from "next/image";
import { useState } from "react";
import { BiLike, BiChat, BiTrash } from "react-icons/bi";
import {
  toggleLike,
  deletePost,
  addComment,
  Post,
} from "@/app/services/postService";

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
  onRefresh?: () => void;
}

export default function PostCard({ post, onDelete, onRefresh }: PostCardProps) {
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [commentCount, setCommentCount] = useState(
    post.comentarios?.length || 0
  );
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  const handleLike = async () => {
    try {
      setLoading(true);
      await toggleLike(post._id);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Erro ao curtir");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar esta postagem?")) return;
    try {
      setLoading(true);
      await deletePost(post._id);
      onDelete?.();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Erro ao deletar");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await addComment(post._id, newComment);
      setCommentCount(commentCount + 1);
      setNewComment("");
      onRefresh?.();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Erro ao comentar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow-sm mb-4 overflow-hidden border">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <Image
            src={
              post.autor?.nome
                ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    post.autor.nome
                  )}`
                : "https://via.placeholder.com/40"
            }
            width={40}
            height={40}
            className="rounded-circle"
            alt="Profile"
          />
          <div>
            <h6 className="mb-0 fw-bold">{post.autor?.nome || "Usuário"}</h6>
            <small className="text-muted">
              {new Date(post.createdAt).toLocaleDateString("pt-BR")}
            </small>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="btn btn-sm btn-light"
          title="Deletar postagem"
        >
          <BiTrash />
        </button>
      </div>

      {/* Body */}
      <div className="p-3">
        <h5 className="fw-bold mb-2">{post.titulo}</h5>
        {post.descricao && (
          <p className="text-muted small mb-3">{post.descricao}</p>
        )}
        {post.categoria && (
          <span className="badge bg-info mb-3">{post.categoria}</span>
        )}
      </div>

      {/* Image */}
      {post.imagem?.url && (
        <div
          className="position-relative"
          style={{ height: "300px", width: "100%" }}
        >
          <Image
            src={post.imagem.url}
            alt={post.titulo}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="d-flex justify-content-between align-items-center p-3">
        <div className="d-flex gap-2">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`btn btn-sm ${isLiked ? "btn-danger" : "btn-light"}`}
          >
            <BiLike /> ({likeCount})
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="btn btn-sm btn-light"
          >
            <BiChat /> ({commentCount})
          </button>
        </div>
        <span className="text-muted small">👁️ {post.visualizacoes || 0}</span>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-top p-3">
          {comments.length > 0 && (
            <div
              className="mb-3"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-light p-2 rounded mb-2 small"
                >
                  <strong>{comment.nome}</strong>
                  <p className="mb-0">{comment.texto}</p>
                  <small className="text-muted">
                    {new Date(comment.data).toLocaleDateString("pt-BR")}
                  </small>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Adicionar comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={loading || !newComment.trim()}
            >
              {loading ? "..." : "💬"}
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="alert alert-danger m-3 mb-0 small">{error}</div>
      )}
    </div>
  );
}
