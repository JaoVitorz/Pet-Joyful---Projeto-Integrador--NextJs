"use client";

import "../globals.css";
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
  BiDotsVerticalRounded,
} from "react-icons/bi";
import Comments from "../components/posts/Comments";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  const [postText, setPostText] = useState("");
  const [reportingPostId, setReportingPostId] = useState<number | null>(null);
  const [reportText, setReportText] = useState("");

  type PostType = {
    id: number;
    text: string;
    image: File | string | null;
    likes: number;
    comments: {
      id: number;
      user: string;
      text: string;
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

  const handleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container className="mt-4">
        <Row>
          <Col md={3} className="bg-white p-3 rounded shadow">
            <h3>Eventos</h3>
            <p className="small">27/10 - Mutirão no Shopping Iguatemi</p>
            <p className="small">30/10 - Evento Beneficente</p>
            <button onClick={() => router.push('/eventos/criar')} className="btn btn-primary">
              Criar Evento
            </button>
          </Col>

          <Col md={6}>
            {/* Criar Postagem */}
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
            </div>

            {/* Publicações */}
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-3 rounded shadow mb-4 position-relative"
              >
                <div className="d-flex align-items-center gap-3">
                  <Image
                    src={post.user.avatar}
                    width={40}
                    height={40}
                    className="rounded-circle"
                    alt="Avatar"
                  />
                  <span className="fw-bold">{post.user.name}</span>
                  <span className="text-muted ms-auto" style={{ fontSize: "0.9em" }}>
                    {post.timestamp}
                  </span>

                  {/* 3 Pontos */}
                  <div className="ms-2 position-relative">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() =>
                        setReportingPostId(
                          reportingPostId === post.id ? null : post.id
                        )
                      }
                    >
                      <BiDotsVerticalRounded size={20} />
                    </Button>

                    {reportingPostId === post.id && (
                      <div
                        className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm p-2"
                        style={{ zIndex: 1000 }}
                      >
                        <button
                          className="btn btn-sm text-danger w-100"
                          onClick={() => setReportText("")}
                        >
                          Denunciar post
                        </button>

                        {(
                          reportingPostId === post.id &&
                          (reportText !== "" || reportText === "")
                        ) && (
                          <div className="mt-2">
                            <Form.Control
                              as="textarea"
                              rows={2}
                              placeholder="Descreva o motivo"
                              value={reportText}
                              onChange={(e) => setReportText(e.target.value)}
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="mt-2 w-100"
                              onClick={() => {
                                alert(`Post ${post.id} denunciado: ${reportText}`);
                                setReportingPostId(null);
                                setReportText("");
                              }}
                              disabled={!reportText.trim()}
                            >
                              Enviar
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
                <div className="d-flex gap-2">
                  <Button
                    variant="light"
                    className="rounded-pill"
                    onClick={() => handleLike(post.id)}
                  >
                    <BiHeart /> {post.likes} Curtir
                  </Button>
                  <Button variant="light" className="rounded-pill">
                    <BiMessageDetail /> Comentar
                  </Button>
                  <Button variant="light" className="rounded-pill">
                    <BiShare /> Compartilhar
                  </Button>
                </div>

                <Comments
                  comments={post.comments}
                  onAddComment={(content: string) => {
                    const newComment = {
                      id: Date.now(),
                      user: "Usuário Atual",
                      text: content,
                    };
                    setPosts((posts) =>
                      posts.map((p) =>
                        p.id === post.id
                          ? { ...p, comments: [...p.comments, newComment] }
                          : p
                      )
                    );
                  }}
                />
              </div>
            ))}
          </Col>

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

      <Footer />
    </div>
  );
}
