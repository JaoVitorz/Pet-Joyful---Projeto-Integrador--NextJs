"use client";

// Importações

import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef } from "react";
import Image from "next/image";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {
  BiMessageDetail,
  BiImage,
  BiPlusCircle,
  BiHeart,
  BiShare,
  BiX,
} from "react-icons/bi";

export default function App() {
  // Estados
  const [postText, setPostText] = useState("");
  type PostType = {
    id: number;
    text: string;
    image: File | string | null;
    likes: number;
    comments: {
      text: string;
      user: { name: string; avatar: string };
      timestamp: string;
    }[];
    user: {
      name: string;
      avatar: string;
    };
    timestamp: string;
  };

  const [posts, setPosts] = useState<PostType[]>([
    {
      id: 1,
      text: "Venha conhecer alguns dos nossos peludinhos.",
      image: "/assets/post-aatan.jpg",
      likes: 42,
      comments: [],
      user: {
        name: "AATAN - Sorocaba",
        avatar: "/assets/aatan-logo.jpg",
      },
      timestamp: "10/05/2024, 15:30",
    },
  ]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Funções
  const handlePostSubmit = () => {
    if (!postText.trim() && !selectedImage) return;

    const newPost = {
      id: Date.now(),
      text: postText,
      image: selectedImage,
      likes: 0,
      comments: [],
      user: {
        name: "Você",
        avatar: "/assets/imgPerfilM.png",
      },
      timestamp: new Date().toLocaleString(),
    };

    setPosts([newPost, ...posts]);
    setPostText("");
    setSelectedImage(null);
    setShowPostModal(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <Header />

      {/* Conteúdo Principal */}
      <Container className="mt-4">
        <Row>
          {/* Coluna Esquerda - Eventos */}
          <Col md={3} className="bg-white p-3 rounded shadow">
            <h3>Eventos</h3>
            <p className="small">27/10 - Mutirão no Shopping Iguatemi</p>
            <p className="small">30/10 - Evento Beneficente</p>
            <Button variant="light" className="w-100 mt-3">
              Criar evento +
            </Button>
          </Col>

          {/* Coluna Central - Feed */}
          <Col md={6}>
            {/* Área de Criação de Publicação */}
            <div className="bg-white p-3 rounded shadow mb-4">
              <div
                className="border rounded-pill p-2 ps-3 d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPostModal(true)}
              >
                <Image
                  src="/assets/imgPerfilM.png"
                  width={40}
                  height={40}
                  className="rounded-circle me-2"
                  alt="Profile"
                />
                <span className="text-muted">No que você está pensando?</span>
                <div className="ms-auto">
                  <BiImage size={24} className="text-success me-2" />
                </div>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-around">
                <button
                  className="btn btn-light d-flex align-items-center gap-1"
                  onClick={() => setShowPostModal(true)}
                >
                  <BiImage size={20} className="text-success" />
                  <span>Foto</span>
                </button>
                <button className="btn btn-light d-flex align-items-center gap-1">
                  <BiPlusCircle size={20} className="text-primary" />
                  <span>Mais</span>
                </button>
              </div>
            </div>

            {/* Lista de Publicações */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-3 rounded shadow mb-4">
                <div className="d-flex align-items-center gap-3">
                  <Image
                    src={post.user.avatar}
                    width={40}
                    height={40}
                    className="rounded-circle"
                    alt="Avatar"
                  />
                  <span className="fw-bold">{post.user.name}</span>
                  <span
                    className="text-muted ms-auto"
                    style={{ fontSize: "0.9em" }}
                  >
                    {post.timestamp}
                  </span>
                </div>
                <div className="mt-3">{post.text}</div>
                {post.image && (
                  <Image
                    src={
                      typeof post.image === "string"
                        ? post.image
                        : URL.createObjectURL(post.image)
                    }
                    width={500}
                    height={300}
                    className="rounded my-3"
                    alt="Post content"
                  />
                )}
                {!post.image && post.id === 1 && (
                  <Image
                    src="/assets/post-aatan.jpg"
                    width={500}
                    height={300}
                    className="rounded my-3"
                    alt="Gato"
                  />
                )}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2">
                    <Button variant="light" className="rounded-pill">
                      <BiHeart /> {post.likes > 0 ? post.likes : ""} Curtir
                    </Button>
                    <Button variant="light" className="rounded-pill">
                      <BiMessageDetail /> Comentar
                    </Button>
                    <Button variant="light" className="rounded-pill">
                      <BiShare /> Compartilhar
                    </Button>
                  </div>
                  {post.id === 1 && (
                    <Button variant="success" className="rounded-pill">
                      Adotar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </Col>

          {/* Coluna Direita - Seguindo */}
          <Col md={3} className="bg-white p-3 rounded shadow">
            <h4>Seguindo</h4>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-2">
                <Image
                  src="/assets/imgPerfilM.png"
                  width={40}
                  height={40}
                  alt="Elisabeth"
                />
                <span>Elisabeth</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Image
                  src="/assets/imgPerfilH.png"
                  width={40}
                  height={40}
                  alt="Roberto"
                />
                <span>Roberto</span>
              </div>
            </div>

            <Button variant="light" className="w-100 mt-3">
              Encontrar pessoas
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Modal de Publicação */}
      {showPostModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="bg-white p-4 rounded"
            style={{ width: "500px", maxWidth: "90%" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Criar publicação</h4>
              <button
                onClick={() => setShowPostModal(false)}
                className="btn btn-close"
              ></button>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <Image
                src="/assets/imgPerfilM.png"
                width={40}
                height={40}
                className="rounded-circle"
                alt="Profile"
              />
              <span className="fw-bold">Você</span>
            </div>

            <Form.Control
              as="textarea"
              rows={3}
              placeholder="No que você está pensando?"
              className="mb-3 border-0"
              style={{ resize: "none" }}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />

            {selectedImage && (
              <div className="mb-3 position-relative">
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  width={500}
                  height={300}
                  className="rounded"
                  alt="Preview"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="position-absolute top-0 end-0 btn btn-danger btn-sm m-2 rounded-circle"
                >
                  <BiX size={16} />
                </button>
              </div>
            )}

            <div className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between">
                <button className="btn btn-light" onClick={triggerFileInput}>
                  <BiImage size={24} className="text-success" /> Foto
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

                <button className="btn btn-light">
                  <BiPlusCircle size={24} className="text-primary" /> Mais
                </button>
              </div>
            </div>

            <Button
              variant="success"
              className="w-100 rounded-pill"
              onClick={handlePostSubmit}
              disabled={!postText.trim() && !selectedImage}
            >
              Publicar
            </Button>
          </div>
        </div>
      )}

      {/* Footer fixo no final da página */}
      
    </div>
  );
}
