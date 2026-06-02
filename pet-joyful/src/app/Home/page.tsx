"use client";

import "../globals.css";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
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
  BiStar,
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

  const [showGeneradorModal, setShowGeneradorModal] = useState(false);
  const [generadorStep, setGeneradorStep] = useState<"selection" | "generating">("selection");
  const [generadorTema, setGeneradorTema] = useState("");
  const [generadorTipo, setGeneradorTipo] = useState("");
  const [generadorAudiencia, setGeneradorAudiencia] = useState("");
  const [generadorLoading, setGeneradorLoading] = useState(false);

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

    const formData = new FormData();

    // Extrai primeira linha como título (máx 200 chars)
    const linhas = postText.trim().split("\n").filter(Boolean);
    const titulo = linhas[0]?.substring(0, 200) || "Publicação";
    const descricao = postText.trim();

    // Extrai hashtags do texto gerado pela IA
    const hashtags = postText.match(/#\w+/g) || [];

    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("categoria", "outros");
    hashtags.forEach((tag) => formData.append("tags", tag.replace("#", "")));

    if (selectedImage && selectedImage instanceof File) {
      formData.append("imagem", selectedImage);
    }

    (async () => {
      try {
        const resp = await createPost(formData);
        const created = resp?.data || resp?.post || resp;

        const newPost: PostType = {
          id: created?._id || created?.id || Date.now(),
          text: created?.descricao || created?.titulo || postText,
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
            name: created?.autor?.nome || userProfile?.nome || "Você",
            avatar: userProfile?.foto_perfil || "/assets/imgPerfilM.png",
          },
          timestamp: created?.createdAt
            ? new Date(created.createdAt).toLocaleString()
            : new Date().toLocaleString(),
        };

        setPosts((prev) => [newPost, ...prev]);
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
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const handleGenerarContenido = async () => {
    if (!generadorTema || !generadorTipo || !generadorAudiencia) return;

    setGeneradorLoading(true);
    setGeneradorStep("generating");

    try {
      const temas: { [key: string]: string } = {
        vacinacao: "💉 Vacinação",
        comportamento: "🐕 Comportamento",
        adocao: "❤️ Adoção Responsável",
        nutricao: "🥕 Nutrição e Saúde",
        treinamento: "🎓 Treinamento",
        higiene: "🛁 Higiene e Cuidados",
        emergencia: "🚨 Primeiros Socorros",
        "bem-estar": "😊 Bem-estar Mental",
      };

      const tipos: { [key: string]: string } = {
        "dica-rapida": "⚡ Dica Rápida",
        guia: "📖 Guia Completo",
        historia: "📚 História de Sucesso",
        infografico: "📊 Infográfico",
      };

      const audiencias: { [key: string]: string } = {
        iniciantes: "👶 Donos Iniciantes",
        experientes: "👴 Donos Experientes",
        protetores: "🛡️ Protetores",
        veterinarios: "⚕️ Veterinários",
      };

      const prompt = `Gere um post educativo para rede social Pet Joyful com as seguintes especificações:

TEMA: ${temas[generadorTema]}
TIPO DE CONTEÚDO: ${tipos[generadorTipo]}
PÚBLICO-ALVO: ${audiencias[generadorAudiencia]}

Por favor, crie:
1. Um título atrativo e relevante (máximo 150 caracteres)
2. Um conteúdo engajante (${generadorTipo === "dica-rapida" ? "50-100" : generadorTipo === "historia" ? "150-250" : "100-200"} palavras)
3. 3-5 hashtags relevantes (#petjoyful, etc)

Responda em JSON com este formato:
{
  "title": "Título do Post",
  "content": "Conteúdo completo aqui",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();

      if (data.reply) {
        try {
         const start = data.reply.indexOf("{");
const end = data.reply.lastIndexOf("}");
if (start !== -1 && end !== -1 && end > start) {
  const parsed = JSON.parse(data.reply.slice(start, end + 1));
            const textoFinal = `${parsed.title}\n\n${parsed.content}\n\n${parsed.hashtags.join(" ")}`;
            setPostText(textoFinal);
            setShowGeneradorModal(false);
            setGeneradorStep("selection");
            setGeneradorTema("");
            setGeneradorTipo("");
            setGeneradorAudiencia("");
          }
        } catch (e) {
          console.error("Erro ao parsear resposta:", e);
          alert("Erro ao processar resposta da LLM");
        }
      }
    } catch (error) {
      console.error("Erro na geração:", error);
      alert("Erro ao conectar com a LLM");
    } finally {
      setGeneradorLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="bg-linear-to-r"
          style={{
            background:
              "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
            paddingTop: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          <Container>
            <Row className="align-items-center">
              <Col md={7} className="mb-4 mb-md-0">
                <h1 className="display-5 fw-bold mb-3">
                  🐾 Bem-vindo ao{" "}
                  <span style={{ color: "#22c55e" }}>Pet Joyful</span>
                </h1>
                <p className="lead text-muted mb-4">
                  A rede social que conecta corações e patas. Compartilhe, cuide
                  e encontre o pet perfeito para sua família com inteligência
                  artificial.
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    onClick={() => router.push("/ia-chat")}
                    className="btn btn-success btn-lg"
                    style={{ borderRadius: "25px" }}
                  >
                    💬 Chat IA
                  </button>
                  <button
                    onClick={() => router.push("/compatibilidade")}
                    className="btn btn-outline-success btn-lg"
                    style={{ borderRadius: "25px" }}
                  >
                    ❤️ Compatibilidade
                  </button>
                </div>
              </Col>
              <Col md={5} className="text-center">
                <div
                  style={{
                    fontSize: "120px",
                    animation: "bounce 2s infinite",
                  }}
                >
                  🐕
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Features Section */}
        <section style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
          <Container>
            <h2 className="text-center fw-bold mb-5">
              Descubra os Poderes do Pet Joyful
            </h2>
            <Row className="g-4 mb-5">
              <Col md={4}>
                <div
                  className="bg-white p-4 rounded-3 shadow-sm h-100 text-center"
                  style={{
                    border: "2px solid rgba(34, 197, 94, 0.2)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(34, 197, 94, 0.2)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 1px 3px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onClick={() => router.push("/ia-chat")}
                >
                  <div style={{ fontSize: "48px", marginBottom: "1rem" }}>
                    🤖
                  </div>
                  <h3 className="fw-bold mb-3">Chat com IA</h3>
                  <p className="text-muted mb-3">
                    Faça perguntas sobre saúde, comportamento e cuidados com
                    pets. Nossa IA responde 24/7 com informações confiáveis.
                  </p>
                  <button
                    className="btn btn-outline-success rounded-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/ia-chat");
                    }}
                  >
                    Explorar →
                  </button>
                </div>
              </Col>

              <Col md={4}>
                <div
                  className="bg-white p-4 rounded-3 shadow-sm h-100 text-center"
                  style={{
                    border: "2px solid rgba(59, 130, 246, 0.2)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(59, 130, 246, 0.2)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 1px 3px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onClick={() => router.push("/compatibilidade")}
                >
                  <div style={{ fontSize: "48px", marginBottom: "1rem" }}>
                    💕
                  </div>
                  <h3 className="fw-bold mb-3">Compatibilidade</h3>
                  <p className="text-muted mb-3">
                    Descubra se você e o pet são compatíveis! Análise
                    inteligente de perfil para garantir uma adoção bem-sucedida.
                  </p>
                  <button
                    className="btn btn-outline-primary rounded-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/compatibilidade");
                    }}
                  >
                    Testar →
                  </button>
                </div>
              </Col>

              <Col md={4}>
                <div
                  className="bg-white p-4 rounded-3 shadow-sm h-100 text-center"
                  style={{
                    border: "2px solid rgba(168, 85, 247, 0.2)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(168, 85, 247, 0.2)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 1px 3px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onClick={() => router.push("/eventos")}
                >
                  <div style={{ fontSize: "48px", marginBottom: "1rem" }}>
                    🎉
                  </div>
                  <h3 className="fw-bold mb-3">Eventos</h3>
                  <p className="text-muted mb-3">
                    Participe de mutirões, campanhas de adoção e eventos da
                    comunidade. Conecte com outros amantes de pets.
                  </p>
                  <button
                    className="btn btn-outline-purple rounded-pill"
                    style={{ color: "#a855f7", borderColor: "#a855f7" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/eventos");
                    }}
                  >
                    Descobrir →
                  </button>
                </div>
              </Col>
            </Row>

            <Row className="g-4">
              <Col md={6}>
                <div
                  className="bg-white p-4 rounded-3 shadow-sm h-100"
                  style={{ border: "2px solid rgba(249, 115, 22, 0.2)" }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "1rem" }}>
                    📸
                  </div>
                  <h3 className="fw-bold mb-3">Compartilhe Momentos</h3>
                  <p className="text-muted">
                    Poste fotos e vídeos dos seus pets, histórias de adoção e
                    dicas de cuidados. Inspire a comunidade!
                  </p>
                </div>
              </Col>

              <Col md={6}>
                <div
                  className="bg-white p-4 rounded-3 shadow-sm h-100"
                  style={{ border: "2px solid rgba(14, 165, 233, 0.2)" }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "1rem" }}>
                    👥
                  </div>
                  <h3 className="fw-bold mb-3">Comunidade</h3>
                  <p className="text-muted">
                    Conecte com protetores, veterinários e amantes de pets.
                    Troque experiências e faça amizades.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Feed Section */}
        <section
          style={{
            paddingTop: "2rem",
            paddingBottom: "2rem",
            backgroundColor: "#f9fafb",
            borderTop: "1px solid rgba(34, 197, 94, 0.1)",
          }}
        >
          <Container>
            <h2 className="fw-bold mb-4">Feed da Comunidade</h2>
            <Row>
              <Col md={3}>
                <aside
                  className="bg-white p-3 rounded shadow mb-4 mb-md-0"
                  aria-label="Eventos e atividades"
                >
                  <h3 className="fw-bold mb-3">📅 Próximos Eventos</h3>
                  <ul className="list-unstyled">
                    <li className="small mb-2">
                      <strong>27/10</strong> - Mutirão no Shopping Iguatemi
                    </li>
                    <li className="small mb-2">
                      <strong>30/10</strong> - Evento Beneficente
                    </li>
                  </ul>
                  <div className="d-flex flex-column gap-2">
                    <button
                      onClick={() => router.push("/eventos")}
                      className="btn btn-outline-success"
                      aria-label="Ver todos os eventos"
                    >
                      Ver Eventos
                    </button>
                    <button
                      onClick={() => router.push("/eventos/criar")}
                      className="btn btn-success"
                      aria-label="Criar novo evento"
                    >
                      Criar Evento
                    </button>
                  </div>
                </aside>
              </Col>

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
                    <span className="text-muted">
                      No que você está pensando?
                    </span>
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
                        Nenhuma publicação ainda. Seja o primeiro a
                        compartilhar!
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

                          <div className="ms-2 position-relative">
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() =>
                                setReportingPostId(
                                  reportingPostId === post.id ? null : post.id,
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

                                {reportingPostId === post.id && (
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
                                          `Post ${post.id} denunciado: ${reportText}`,
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
                            alt={`Imagem da publicação de ${post.user.name}: ${post.text.substring(0, 50)}...`}
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
                            aria-label={`Curtir publicação. Atualmente tem ${post.likes} curtida${post.likes !== 1 ? "s" : ""}`}
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
                                  : p,
                              ),
                            );
                          }}
                        />
                      </article>
                    ))
                  )}
                </section>
              </Col>

              <Col md={3}>
                <aside
                  className="bg-white p-3 rounded shadow"
                  aria-label="Pessoas que você segue"
                >
                  <h3 className="fw-bold mb-3">👥 Seguindo</h3>
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
              </Col>
            </Row>
          </Container>
        </section>
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
            if (e.target === e.currentTarget) setShowPostModal(false);
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
                  onClick={() => setShowGeneradorModal(true)}
                  aria-label="Gerar conteúdo com IA"
                  style={{ color: "#a855f7" }}
                >
                  <BiStar size={24} aria-hidden="true" /> IA
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

      {/* Modal Gerador de Conteúdo */}
      {showGeneradorModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1051,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGeneradorModal(false);
          }}
        >
          <div
            className="bg-white p-4 rounded"
            style={{
              width: "500px",
              maxWidth: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>✨ Gerar Conteúdo com IA</h4>
              <button
                onClick={() => {
                  setShowGeneradorModal(false);
                  setGeneradorStep("selection");
                }}
                className="btn btn-close"
              ></button>
            </div>

            {generadorStep === "selection" && !generadorLoading && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    🎯 Escolha um Tema
                  </label>
                  <div className="d-grid gap-2">
                    {[
                      { id: "vacinacao", label: "💉 Vacinação" },
                      { id: "comportamento", label: "🐕 Comportamento" },
                      { id: "adocao", label: "❤️ Adoção Responsável" },
                      { id: "nutricao", label: "🥕 Nutrição e Saúde" },
                      { id: "treinamento", label: "🎓 Treinamento" },
                      { id: "higiene", label: "🛁 Higiene e Cuidados" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setGeneradorTema(t.id)}
                        className={`btn ${
                          generadorTema === t.id
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    📋 Tipo de Conteúdo
                  </label>
                  <div className="d-grid gap-2">
                    {[
                      { id: "dica-rapida", label: "⚡ Dica Rápida" },
                      { id: "guia", label: "📖 Guia Completo" },
                      { id: "historia", label: "📚 História de Sucesso" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setGeneradorTipo(t.id)}
                        className={`btn ${
                          generadorTipo === t.id
                            ? "btn-success"
                            : "btn-outline-success"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">👥 Público-Alvo</label>
                  <div className="d-grid gap-2">
                    {[
                      { id: "iniciantes", label: "👶 Donos Iniciantes" },
                      { id: "experientes", label: "👴 Donos Experientes" },
                      { id: "protetores", label: "🛡️ Protetores" },
                    ].map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setGeneradorAudiencia(a.id)}
                        className={`btn ${
                          generadorAudiencia === a.id
                            ? "btn-info"
                            : "btn-outline-info"
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    onClick={() => setShowGeneradorModal(false)}
                    className="btn btn-secondary flex-grow-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGenerarContenido}
                    disabled={
                      !generadorTema || !generadorTipo || !generadorAudiencia
                    }
                    className="btn btn-primary flex-grow-1"
                  >
                    <BiStar size={16} /> Gerar
                  </button>
                </div>
              </>
            )}

            {generadorStep === "generating" && (
              <div className="text-center py-5">
                <div
                  className="mb-3"
                  style={{ fontSize: "48px", animation: "bounce 2s infinite" }}
                >
                  ✨
                </div>
                <p className="text-muted">Gerando conteúdo incrível...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}