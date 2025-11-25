"use client";

import "../globals.css";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { createPost } from "@/app/services/postService";
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
  const [userProfile, setUserProfile] = useState<{
    nome: string;
    foto_perfil?: string;
  } | null>(null);

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

  // Carregar dados do usuário do localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserProfile(user);
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      }
    }
  }, []);

  const handlePostSubmit = () => {
    if (!postText.trim() && !selectedImage) return;
    // build FormData to send to posts microservice
    const formData = new FormData();
    formData.append("titulo", postText || "");
    formData.append("descricao", postText || "");
    formData.append("categoria", "outros");
    formData.append("tags", "");
    if (selectedImage && selectedImage instanceof File) {
      formData.append("imagem", selectedImage);
    }

    // call posts microservice via postService
    (async () => {
      try {
        const resp = await createPost(formData);

        // try to extract created post from response
        const created = resp?.data || resp?.post || resp;

        const newPost = {
          id: created?._id || created?.id || Date.now(),
          text: created?.titulo || created?.descricao || postText,
          image:
            created?.imagem?.url ||
            (selectedImage ? URL.createObjectURL(selectedImage) : null),
          likes: Array.isArray(created?.likes)
            ? created.likes.length
            : created?.likes || 0,
          comments: (created?.comentarios || []).map((c: any) => ({
            id: c._id || Date.now(),
            user: c.nome || "Usuário",
            text: c.texto || c.text,
          })),
          user: {
            name: created?.autor?.nome || "Você",
            avatar: "/assets/imgPerfilM.png",
          },
          timestamp: created?.createdAt
            ? new Date(created.createdAt).toLocaleString()
            : new Date().toLocaleString(),
        };

        setPosts([newPost, ...posts]);
        setPostText("");
        setSelectedImage(null);
        setShowPostModal(false);
      } catch (err: any) {
        console.error("Erro ao criar postagem via Posts service:", err);
        alert("Erro ao publicar. Verifique o console.");
      }
    })();
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
      <main id="main-content" className="mt-4" tabIndex={-1}>
        <Container>
          <Row>
            <aside
              className="col-md-3 bg-white p-3 rounded shadow"
              aria-label="Eventos e atividades"
            >
              <h2>Eventos</h2>
              <ul className="list-unstyled">
                <li className="small mb-2">
                  27/10 - Mutirão no Shopping Iguatemi
                </li>
                <li className="small mb-2">30/10 - Evento Beneficente</li>
              </ul>
              <div className="d-flex flex-column gap-2">
                <button
                  onClick={() => router.push("/eventos")}
                  className="btn btn-outline-primary"
                  aria-label="Ver todos os eventos"
                >
                  Ver Eventos
                </button>
                <button
                  onClick={() => router.push("/eventos/criar")}
                  className="btn btn-primary"
                  aria-label="Criar novo evento"
                >
                  Criar Evento
                </button>
              </div>
            </aside>

            <Col md={6}>
              {/* Criar Postagem */}
              <section
                className="bg-white p-3 rounded shadow mb-4"
                aria-label="Criar nova postagem"
              >
                <button
                  className="border rounded-pill p-2 ps-3 d-flex align-items-center w-100 bg-transparent text-start"
                  onClick={() => setShowPostModal(true)}
                  aria-label="Abrir modal para criar nova postagem"
                >
                  <Image
                    src={userProfile?.foto_perfil || "/assets/imgPerfilM.png"}
                    width={40}
                    height={40}
                    className="rounded-circle me-2"
                    alt="Seu perfil"
                  />
                  <span className="text-muted">No que você está pensando?</span>
                  <div className="ms-auto">
                    <BiImage
                      size={24}
                      className="text-success me-2"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              </section>

              {/* Publicações */}
              <section aria-label="Feed de publicações">
                {posts.length === 0 ? (
                  <div className="bg-white p-4 rounded shadow text-center">
                    <p className="text-muted">
                      Nenhuma publicação ainda. Seja o primeiro a compartilhar!
                    </p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white p-3 rounded shadow mb-4 position-relative"
                      aria-label={`Publicação de ${post.user.name}`}
                    >
                      <header className="d-flex align-items-center gap-3">
                        <Image
                          src={post.user.avatar}
                          width={40}
                          height={40}
                          className="rounded-circle"
                          alt={`Avatar de ${post.user.name}`}
                        />
                        <div className="flex-grow-1">
                          <span className="fw-bold">{post.user.name}</span>
                          <time
                            className="text-muted ms-2"
                            style={{ fontSize: "0.9em" }}
                            dateTime={post.timestamp}
                          >
                            {post.timestamp}
                          </time>
                        </div>

                        {/* Menu de opções */}
                        <div className="ms-2 position-relative">
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() =>
                              setReportingPostId(
                                reportingPostId === post.id ? null : post.id
                              )
                            }
                            aria-label={`Opções da publicação de ${post.user.name}`}
                            aria-expanded={reportingPostId === post.id}
                            aria-haspopup="true"
                          >
                            <BiDotsVerticalRounded
                              size={20}
                              aria-hidden="true"
                            />
                          </Button>

                          {reportingPostId === post.id && (
                            <div
                              className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm p-2"
                              style={{ zIndex: 1000 }}
                              role="menu"
                              aria-label="Menu de opções da publicação"
                            >
                              <button
                                className="btn btn-sm text-danger w-100"
                                onClick={() => setReportText("")}
                                role="menuitem"
                                aria-label="Denunciar esta publicação"
                              >
                                Denunciar post
                              </button>

                              {reportingPostId === post.id &&
                                (reportText !== "" || reportText === "") && (
                                  <div className="mt-2">
                                    <label
                                      htmlFor={`report-text-${post.id}`}
                                      className="visually-hidden"
                                    >
                                      Descreva o motivo da denúncia
                                    </label>
                                    <Form.Control
                                      as="textarea"
                                      id={`report-text-${post.id}`}
                                      rows={2}
                                      placeholder="Descreva o motivo"
                                      value={reportText}
                                      onChange={(e) =>
                                        setReportText(e.target.value)
                                      }
                                      aria-label="Campo para descrever o motivo da denúncia"
                                    />
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="mt-2 w-100"
                                      onClick={() => {
                                        alert(
                                          `Post ${post.id} denunciado: ${reportText}`
                                        );
                                        setReportingPostId(null);
                                        setReportText("");
                                      }}
                                      disabled={!reportText.trim()}
                                      aria-label="Enviar denúncia"
                                    >
                                      Enviar
                                    </Button>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </header>

                      <div className="mt-3">
                        <p>{post.text}</p>
                      </div>
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
                          alt={`Imagem da publicação de ${
                            post.user.name
                          }: ${post.text.substring(0, 50)}...`}
                        />
                      )}
                      <div
                        className="d-flex gap-2"
                        role="group"
                        aria-label="Ações da publicação"
                      >
                        <Button
                          variant="light"
                          className="rounded-pill"
                          onClick={() => handleLike(post.id)}
                          aria-label={`Curtir publicação. Atualmente tem ${
                            post.likes
                          } curtida${post.likes !== 1 ? "s" : ""}`}
                        >
                          <BiHeart aria-hidden="true" /> {post.likes} Curtir
                        </Button>
                        <Button
                          variant="light"
                          className="rounded-pill"
                          aria-label="Comentar nesta publicação"
                        >
                          <BiMessageDetail aria-hidden="true" /> Comentar
                        </Button>
                        <Button
                          variant="light"
                          className="rounded-pill"
                          aria-label="Compartilhar esta publicação"
                        >
                          <BiShare aria-hidden="true" /> Compartilhar
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
                                ? {
                                    ...p,
                                    comments: [...p.comments, newComment],
                                  }
                                : p
                            )
                          );
                        }}
                      />
                    </article>
                  ))
                )}
              </section>
            </Col>

            <aside
              className="col-md-3 bg-white p-3 rounded shadow"
              aria-label="Pessoas que você segue"
            >
              <h2>Seguindo</h2>
              <ul className="list-unstyled d-flex flex-column gap-3">
                <li className="d-flex align-items-center gap-2">
                  <Image
                    src="/assets/imgPerfilM.png"
                    width={40}
                    height={40}
                    alt="Avatar de Elisabeth"
                  />
                  <span>Elisabeth</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <Image
                    src="/assets/imgPerfilH.png"
                    width={40}
                    height={40}
                    alt="Avatar de Roberto"
                  />
                  <span>Roberto</span>
                </li>
              </ul>
             
            </aside>
          </Row>
        </Container>
      </main>

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
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPostModal(false);
            }
          }}
        >
          <div
            className="bg-white p-4 rounded"
            style={{ width: "500px", maxWidth: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 id="modal-title">Criar publicação</h4>
              <button
                onClick={() => setShowPostModal(false)}
                className="btn btn-close"
                aria-label="Fechar modal de criação de publicação"
              ></button>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <Image
                src={userProfile?.foto_perfil || "/assets/imgPerfilM.png"}
                width={40}
                height={40}
                className="rounded-circle"
                alt="Seu perfil"
              />
              <span className="fw-bold">{userProfile?.nome || "Você"}</span>
            </div>

            <label htmlFor="post-text" className="visually-hidden">
              Digite sua publicação
            </label>
            <Form.Control
              as="textarea"
              id="post-text"
              rows={3}
              placeholder="No que você está pensando?"
              className="mb-3 border-0"
              style={{ resize: "none" }}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              aria-label="Campo de texto para criar publicação"
            />

            {selectedImage && (
              <div className="mb-3 position-relative">
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  width={500}
                  height={300}
                  className="rounded"
                  alt="Preview da imagem selecionada"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="position-absolute top-0 end-0 btn btn-danger btn-sm m-2 rounded-circle"
                  aria-label="Remover imagem"
                >
                  <BiX size={16} aria-hidden="true" />
                </button>
              </div>
            )}

            <div className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-light"
                  onClick={triggerFileInput}
                  aria-label="Adicionar foto à publicação"
                >
                  <BiImage
                    size={24}
                    className="text-success"
                    aria-hidden="true"
                  />{" "}
                  Foto
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                  aria-label="Selecionar imagem para publicação"
                />
                <button
                  className="btn btn-light"
                  aria-label="Mais opções"
                  disabled
                >
                  <BiPlusCircle
                    size={24}
                    className="text-primary"
                    aria-hidden="true"
                  />{" "}
                  Mais
                </button>
              </div>
            </div>

            <Button
              variant="success"
              className="w-100 rounded-pill"
              onClick={handlePostSubmit}
              disabled={!postText.trim() && !selectedImage}
              aria-label="Publicar postagem"
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
