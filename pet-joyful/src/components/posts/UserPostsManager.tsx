"use client";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { BiDotsVerticalRounded } from "react-icons/bi";
import PostComponent from "./PostComponent";

type Post = {
  id: number;
  text: string;
  image?: string;
  user: {
    name: string;
    avatar: string;
  };
  time: string;
  likes: number;
  comments: number;
  isAdoption?: boolean;
};

interface UserPostsManagerProps {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

export default function UserPostsManager({
  posts,
  setPosts,
}: UserPostsManagerProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleDelete = (id: number) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
  };

  const handleEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSave = (id: number) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, text: editText } : post
    );
    setPosts(updatedPosts);
    setEditingId(null);
    setEditText("");
  };

  const handleLike = (id: number) => {
    console.log("Curtir post:", id);
  };

  const handleComment = (id: number) => {
    console.log("Comentar post:", id);
  };

  const handleShare = (id: number) => {
    console.log("Compartilhar post:", id);
  };

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="mb-3 position-relative">
          {editingId === post.id ? (
            <div>
              <textarea
                className="form-control mb-2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => handleSave(post.id)}
              >
                Salvar
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setEditingId(null)}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <>
              {/* Ícone de três pontos no canto direito */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                }}
              >
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    size="sm"
                    style={{
                      border: "none",
                      background: "transparent",
                      boxShadow: "none",
                    }}
                    id={`dropdown-${post.id}`}
                  >
                    <BiDotsVerticalRounded size={22} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleEdit(post.id, post.text)}
                    >
                      Editar
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(post.id)}>
                      Excluir
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <PostComponent
                post={post}
                onLike={() => handleLike(post.id)}
                onComment={() => handleComment(post.id)}
                onShare={() => handleShare(post.id)}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
