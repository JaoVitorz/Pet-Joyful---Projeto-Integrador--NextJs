"use client";
import "../globals.css";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { createPost } from "@/app/services/postService";
import PostsFeed from "../components/PostsFeed";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {
  BiImage,
  BiX,
  BiStar,
} from "react-icons/bi";
import { useRouter } from "next/navigation";

// ─── Static data (defined once, reused in modal UI and handler) ───────────────

const TEMAS = [
  { id: "vacinacao", label: "💉 Vacinação" },
  { id: "comportamento", label: "🐕 Comportamento" },
  { id: "adocao", label: "❤️ Adoção Responsável" },
  { id: "nutricao", label: "🥕 Nutrição e Saúde" },
  { id: "treinamento", label: "🎓 Treinamento" },
  { id: "higiene", label: "🛁 Higiene e Cuidados" },
  { id: "emergencia", label: "🚨 Primeiros Socorros" },
  { id: "bem-estar", label: "😊 Bem-estar Mental" },
];

const TIPOS = [
  { id: "dica-rapida", label: "⚡ Dica Rápida" },
  { id: "guia", label: "📖 Guia Completo" },
  { id: "historia", label: "📚 História de Sucesso" },
  { id: "infografico", label: "📊 Infográfico" },
];

const AUDIENCIAS = [
  { id: "iniciantes", label: "👶 Donos Iniciantes" },
  { id: "experientes", label: "👴 Donos Experientes" },
  { id: "protetores", label: "🛡️ Protetores" },
  { id: "veterinarios", label: "⚕️ Veterinários" },
];

// ─── Helper: derive word count range from tipo ────────────────────────────────

const getWordRange = (tipo: string) => {
  if (tipo === "dica-rapida") return "50-100";
  if (tipo === "historia") return "150-250";
  return "100-200";
};

// ─── Reusable sub-components ──────────────────────────────────────────────────

type FeatureCardProps = {
  emoji: string;
  title: string;
  description: string;
  buttonLabel: string;
  borderColor: string;
  shadowColor: string;
  buttonStyle?: React.CSSProperties;
  buttonClassName: string;
  route: string;
};

const FeatureCard = ({
  emoji,
  title,
  description,
  buttonLabel,
  borderColor,
  shadowColor,
  buttonStyle,
  buttonClassName,
  route,
}: FeatureCardProps) => {
  const router = useRouter();

  return (
  <button
      type="button"
      className="bg-white p-4 rounded-3 shadow-sm h-100 text-center w-100"
      style={{
        border: `2px solid ${borderColor}`,
        transition: "all 0.3s ease",
        cursor: "pointer",
        background: "white",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 10px 30px ${shadowColor}`;
        e.currentTarget.style.transform = "translateY(-5px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onClick={() => router.push(route)}
    >
      <div style={{ fontSize: "48px", marginBottom: "1rem" }}>{emoji}</div>
      <h3 className="fw-bold mb-3">{title}</h3>
      <p className="text-muted mb-3">{description}</p>
      <span
        className={`btn rounded-pill ${buttonClassName}`}
        style={buttonStyle}
      >
        {buttonLabel}
      </span>
    </button>
   
  );
};

type SelectionGroupProps = {
  label: string;
  options: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string) => void;
  variant: string;
};

const SelectionGroup = ({
  label,
  options,
  selected,
  onSelect,
  variant,
}: SelectionGroupProps) => (
  <div className="mb-3">
    <label className="form-label fw-bold">{label}</label>
    <div className="d-grid gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={`btn ${
            selected === opt.id ? `btn-${variant}` : `btn-outline-${variant}`
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

type SidebarCardProps = {
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
};

const SidebarCard = ({ title, ariaLabel, children }: SidebarCardProps) => (
  <aside
    className="bg-white p-3 rounded shadow mb-4 mb-md-0"
    aria-label={ariaLabel}
  >
    <h3 className="fw-bold mb-3">{title}</h3>
    {children}
  </aside>
);

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Main component ───────────────────────────────────────────────────────────

export default function App() {
  const router = useRouter();

  const [postText, setPostText] = useState("");
  const [userProfile, setUserProfile] = useState<{
    nome: string;
    foto_perfil?: string;
  } | null>(null);

  const [feedRefreshKey, setFeedRefreshKey] = useState(0);

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
    if (typeof window === "undefined") return;
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    try {
      setUserProfile(JSON.parse(userStr));
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handlePostSubmit = async () => {
    if (!postText.trim() && !selectedImage) return;

    const formData = new FormData();
    const linhas = postText.trim().split("\n").filter(Boolean);
    const titulo = linhas[0]?.substring(0, 200) || "Publicação";
    const hashtags = postText.match(/#\w+/g) || [];

    formData.append("titulo", titulo);
    formData.append("descricao", postText.trim());
    formData.append("categoria", "outros");
    hashtags.forEach((tag) => formData.append("tags", tag.replace("#", "")));
    if (selectedImage instanceof File) formData.append("imagem", selectedImage);

    try {
      await createPost(formData);
      setFeedRefreshKey((key) => key + 1);
      setPostText("");
      setSelectedImage(null);
      setShowPostModal(false);
    } catch (err: unknown) {
      console.error("Erro ao criar postagem:", err);
      alert("Erro ao publicar. Verifique sua conexão e tente novamente.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedImage(file);
  };

  const resetGenerador = () => {
    setGeneradorStep("selection");
    setGeneradorTema("");
    setGeneradorTipo("");
    setGeneradorAudiencia("");
  };

  const handleGenerarContenido = async () => {
    if (!generadorTema || !generadorTipo || !generadorAudiencia) return;

    setGeneradorLoading(true);
    setGeneradorStep("generating");

    // Build label maps from the shared constants (no duplication)
    const temaLabel = TEMAS.find((t) => t.id === generadorTema)?.label ?? generadorTema;
    const tipoLabel = TIPOS.find((t) => t.id === generadorTipo)?.label ?? generadorTipo;
    const audienciaLabel =
      AUDIENCIAS.find((a) => a.id === generadorAudiencia)?.label ?? generadorAudiencia;

    const prompt = `Gere um post educativo para rede social Pet Joyful com as seguintes especificações:

TEMA: ${temaLabel}
TIPO DE CONTEÚDO: ${tipoLabel}
PÚBLICO-ALVO: ${audienciaLabel}

Por favor, crie:
1. Um título atrativo e relevante (máximo 150 caracteres)
2. Um conteúdo engajante (${getWordRange(generadorTipo)} palavras)
3. 3-5 hashtags relevantes (#petjoyful, etc)

Responda em JSON com este formato:
{
  "title": "Título do Post",
  "content": "Conteúdo completo aqui",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();

      if (data.reply) {
        const start = data.reply.indexOf("{");
        const end = data.reply.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          try {
            const parsed = JSON.parse(data.reply.slice(start, end + 1));
            setPostText(
              `${parsed.title}\n\n${parsed.content}\n\n${parsed.hashtags.join(" ")}`,
            );
            setShowGeneradorModal(false);
            resetGenerador();
          } catch (e) {
            console.error("Erro ao parsear resposta:", e);
            alert("Erro ao processar resposta da LLM");
          }
        }
      }
    } catch (error) {
      console.error("Erro na geração:", error);
      alert("Erro ao conectar com a LLM");
    } finally {
      setGeneradorLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <main id="main-content" tabIndex={-1}>

        {/* Hero Section */}
        <section
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
                <div style={{ fontSize: "120px", animation: "bounce 2s infinite" }}>
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
                <FeatureCard
                  emoji="🤖"
                  title="Chat com IA"
                  description="Faça perguntas sobre saúde, comportamento e cuidados com pets. Nossa IA responde 24/7 com informações confiáveis."
                  buttonLabel="Explorar →"
                  buttonClassName="btn-outline-success"
                  borderColor="rgba(34, 197, 94, 0.2)"
                  shadowColor="rgba(34, 197, 94, 0.2)"
                  route="/ia-chat"
                />
              </Col>
              <Col md={4}>
                <FeatureCard
                  emoji="💕"
                  title="Compatibilidade"
                  description="Descubra se você e o pet são compatíveis! Análise inteligente de perfil para garantir uma adoção bem-sucedida."
                  buttonLabel="Testar →"
                  buttonClassName="btn-outline-primary"
                  borderColor="rgba(59, 130, 246, 0.2)"
                  shadowColor="rgba(59, 130, 246, 0.2)"
                  route="/compatibilidade"
                />
              </Col>
              <Col md={4}>
                <FeatureCard
                  emoji="🎉"
                  title="Eventos"
                  description="Participe de mutirões, campanhas de adoção e eventos da comunidade. Conecte com outros amantes de pets."
                  buttonLabel="Descobrir →"
                  buttonClassName=""
                  buttonStyle={{ color: "#a855f7", borderColor: "#a855f7", border: "1px solid" }}
                  borderColor="rgba(168, 85, 247, 0.2)"
                  shadowColor="rgba(168, 85, 247, 0.2)"
                  route="/eventos"
                />
              </Col>
            </Row>

            <Row className="g-4">
              <Col md={6}>
                <div
                  className="bg-white p-4 rounded-3 shadow-sm h-100"
                  style={{ border: "2px solid rgba(249, 115, 22, 0.2)" }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "1rem" }}>📸</div>
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
                  <div style={{ fontSize: "36px", marginBottom: "1rem" }}>👥</div>
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
              {/* Sidebar: Events */}
              <Col md={3}>
                <SidebarCard title="📅 Próximos Eventos" ariaLabel="Eventos e atividades">
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
                </SidebarCard>
              </Col>

              {/* Main feed */}
              <Col md={6}>
                {/* Create post trigger */}
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
                      <BiImage size={24} className="text-success me-2" aria-hidden="true" />
                    </div>
                  </button>
                </section>

                  <section aria-label="Feed de publicações">
                    <PostsFeed refreshKey={feedRefreshKey} />
                  </section>
              </Col>
              {/* Sidebar: Following */}
              <Col md={3}>
                <SidebarCard title="👥 Seguindo" ariaLabel="Pessoas que você segue">
                  <ul className="list-unstyled d-flex flex-column gap-3">
                    {[
                      { src: "/assets/imgPerfilM.png", name: "Elisabeth" },
                      { src: "/assets/imgPerfilH.png", name: "Roberto" },
                    ].map(({ src, name }) => (
                      <li key={name} className="d-flex align-items-center gap-2">
                        <Image src={src} width={40} height={40} alt={`Avatar de ${name}`} />
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                </SidebarCard>
              </Col>
            </Row>
          </Container>
        </section>
      </main>

      {/* ── Modal: Create post ───────────────────────────────────────────────── */}
      {showPostModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            inset: 0,
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
           onKeyDown={(e) => {
      if (e.key === "Escape") setShowPostModal(false);
    }}
        >
          <div
            className="bg-white p-4 rounded"
            style={{ width: "500px", maxWidth: "90%" }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 id="modal-title">Criar publicação</h4>
              <button
                onClick={() => setShowPostModal(false)}
                className="btn btn-close"
                aria-label="Fechar modal"
              />
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
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Adicionar foto"
                >
                  <BiImage size={24} className="text-success" aria-hidden="true" /> Foto
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
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
              onClick={() => { void handlePostSubmit(); }}
              disabled={!postText.trim() && !selectedImage}
            >
              Publicar
            </Button>
          </div>
        </div>
      )}

      {/* ── Modal: Content generator ─────────────────────────────────────────── */}
      {showGeneradorModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            inset: 0,
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
            if (e.target === e.currentTarget) {
              setShowGeneradorModal(false);
              resetGenerador();
            }
          }}
           onKeyDown={(e) => {
      if (e.key === "Escape") {
        setShowGeneradorModal(false);
        resetGenerador();
      }
    }}
        >
          <div
            className="bg-white p-4 rounded"
            style={{ width: "500px", maxWidth: "90%", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>✨ Gerar Conteúdo com IA</h4>
              <button
                onClick={() => {
                  setShowGeneradorModal(false);
                  resetGenerador();
                }}
                className="btn btn-close"
              />
            </div>

            {generadorStep === "selection" && !generadorLoading && (
              <>
                <SelectionGroup
                  label="🎯 Escolha um Tema"
                  options={TEMAS}
                  selected={generadorTema}
                  onSelect={setGeneradorTema}
                  variant="primary"
                />
                <SelectionGroup
                  label="📋 Tipo de Conteúdo"
                  options={TIPOS}
                  selected={generadorTipo}
                  onSelect={setGeneradorTipo}
                  variant="success"
                />
                <SelectionGroup
                  label="👥 Público-Alvo"
                  options={AUDIENCIAS}
                  selected={generadorAudiencia}
                  onSelect={setGeneradorAudiencia}
                  variant="info"
                />

                <div className="d-flex gap-2 mt-2">
                  <button
                    onClick={() => setShowGeneradorModal(false)}
                    className="btn btn-secondary flex-grow-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => { void handleGenerarContenido(); }}
                    disabled={!generadorTema || !generadorTipo || !generadorAudiencia}
                    className="btn btn-primary flex-grow-1"
                  >
                    <BiStar size={16} /> Gerar
                  </button>
                </div>
              </>
            )}

            {generadorStep === "generating" && (
              <div className="text-center py-5">
                <div style={{ fontSize: "48px", animation: "bounce 2s infinite" }}>✨</div>
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
