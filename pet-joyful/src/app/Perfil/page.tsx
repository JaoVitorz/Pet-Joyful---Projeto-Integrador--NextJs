"use client";

import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {
  BiMessageDetail,
  BiPlusCircle,
  BiHeart,
  BiShare,
  BiEdit,
  BiSave,
  BiX,
} from "react-icons/bi";
import Image from "next/image";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import CreatePost from "../components/posts/CreatePost";
import ProfileHeader from "../components/profile/ProfileHeader";
import Comments from "../components/posts/Comments";
import { useState, ReactNode, useEffect } from "react";
import { authApi } from "../api/authapi";
import { profileService } from "@/services/profileApi";

// --- Tipos ---
// Compatível com Comments.tsx
type Comment = {
  id: number;
  user: string;
  text: string;
};

interface Post {
  id: number;
  text: string;
  image: string;
  user: {
    name: string;
    avatar: string;
  };
  time: string;
  likes: number;
  comments: number;
  isAdoption: boolean;
  commentsList?: Comment[];
  timestamp?: ReactNode;
}

interface NewPost {
  text: string;
  image: string | null;
  user: {
    name: string;
    avatar: string;
  };
}

interface Album {
  id: string | number;
  title: string;
  coverImage?: string;
}

// --- Interface de Perfil ---
interface ProfileData {
  nome: string;
  email: string;
  bio: string;
  avatar: string;
  telefone?: string;
  endereco?: string;
}

// --- Componente ---
export default function Perfil() {
  const [activeTab, setActiveTab] = useState<
    "posts" | "albums" | "about" | "contact"
  >("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    nome: "AATAN - Sorocaba",
    email: "contato@aatansorocaba.org.br",
    bio: "Associação de proteção animal oferecendo abrigo e cuidados para animais em situação de vulnerabilidade.",
    avatar: "/assets/aatan-logo.jpg",
    telefone: "(15) 1234-5678",
    endereco: "",
  });

  const [editFormData, setEditFormData] = useState<ProfileData>(profileData);

  // Carregar dados do perfil ao montar o componente
  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      // Tentar carregar do microserviço de perfil primeiro
      try {
        const profileResponse = await profileService.getMyProfile();
        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data;
          const updatedProfile: ProfileData = {
            nome: profile.nome || profileData.nome,
            email: profile.email || profileData.email,
            bio: profile.bio || profileData.bio,
            avatar: profile.foto_perfil || profileData.avatar,
            telefone: profile.telefone || profileData.telefone,
            endereco: profile.endereco || profileData.endereco,
          };
          setProfileData(updatedProfile);
          setEditFormData(updatedProfile);
          return;
        }
      } catch {
        console.log(
          "Microserviço de perfil não disponível, tentando backend principal"
        );
      }

      // Fallback para o backend principal
      const response = await authApi.getProfile();
      if (response.data && response.data.user) {
        const userData = response.data.user;
        const updatedProfile: ProfileData = {
          nome: userData.nome || userData.name || profileData.nome,
          email: userData.email || profileData.email,
          bio: userData.bio || profileData.bio,
          avatar: userData.avatar || profileData.avatar,
          telefone: userData.telefone || profileData.telefone,
          endereco: userData.endereco || profileData.endereco,
        };
        setProfileData(updatedProfile);
        setEditFormData(updatedProfile);
      }
    } catch {
      console.log("Usando dados locais do perfil");
    }
  };

  const handleEdit = () => {
    setEditFormData(profileData);
    setIsEditing(true);
    setSaveMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditFormData(profileData);
    setSaveMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Verificar se o token existe
      const token = localStorage.getItem("token");
      if (!token) {
        setSaveMessage({
          type: "error",
          text: "Você precisa estar logado para salvar o perfil. Redirecionando para login...",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      // Preparar dados para o microserviço de perfil
      const updateData = {
        nome: editFormData.nome,
        bio: editFormData.bio,
        telefone: editFormData.telefone || undefined,
        endereco: editFormData.endereco || undefined,
      };

      console.log("[Perfil] Atualizando perfil via microserviço:", updateData);
      console.log("[Perfil] Token presente:", token ? "Sim" : "Não");

      // Usar o microserviço de perfil (porta 3004)
      const response = await profileService.updateMyProfile(updateData);

      if (response.success && response.data) {
        // Atualizar dados locais com a resposta do servidor
        const updatedProfile: ProfileData = {
          ...editFormData,
          nome: response.data.nome || editFormData.nome,
          bio: response.data.bio || editFormData.bio,
          telefone: response.data.telefone || editFormData.telefone,
          endereco: response.data.endereco || editFormData.endereco,
        };

        setProfileData(updatedProfile);
        setIsEditing(false);
        setSaveMessage({
          type: "success",
          text: "Perfil atualizado com sucesso!",
        });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        throw new Error(response.message || "Erro ao atualizar perfil");
      }
    } catch (error: unknown) {
      const err = error as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string };
        };
        message?: string;
      };

      console.error("Erro ao salvar perfil:", error);

      let errorMessage = "Erro ao salvar perfil. Tente novamente.";

      // Tratar erro 401 (token inválido/expirado)
      if (err.response?.status === 401) {
        errorMessage = "Token inválido ou expirado. Faça login novamente.";
        // O interceptor já vai redirecionar, mas vamos limpar o estado
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }, 2000);
      } else if (err.response?.data?.message) {
        // Limpar "undefined:" se presente
        errorMessage = String(err.response.data.message).replace(
          /^undefined:\s*/,
          ""
        );
      } else if (err.response?.data?.error) {
        // Limpar "undefined:" se presente
        errorMessage = String(err.response.data.error).replace(
          /^undefined:\s*/,
          ""
        );
      } else if (err.message) {
        // Limpar "undefined:" se presente
        errorMessage = String(err.message).replace(/^undefined:\s*/, "");
      }

      setSaveMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      text: "Se você é como nós, os identifica através do olhar.",
      image: "/assets/post-aatan.jpg",
      user: {
        name: "AATAN - Sorocaba",
        avatar: "/assets/aatan-logo.jpg",
      },
      time: "2 horas atrás",
      likes: 42,
      comments: 8,
      isAdoption: true,
      commentsList: [],
      timestamp: undefined,
    },
  ]);

  const [albums] = useState<Album[]>([]);

  // --- Handlers ---
  const handleCreatePost = (newPost: NewPost) => {
    const post: Post = {
      id: posts.length + 1,
      ...newPost,
      image: newPost.image ?? "",
      time: "Agora mesmo",
      likes: 0,
      comments: 0,
      isAdoption: false,
      commentsList: [],
      timestamp: undefined,
    };
    setPosts([post, ...posts]);
  };

  const handleLike = (postId: number, liked: boolean) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: liked ? post.likes + 1 : post.likes - 1 }
          : post
      )
    );
  };

  const handleComment = (postId: number) => {
    console.log(`Comentar no post ${postId}`);
  };

  const handleShare = (postId: number) => {
    console.log(`Compartilhar post ${postId}`);
  };

  return (
    <>
      <Header />
      <Container className="my-4">
        <Row>
          {/* Sidebar */}
          <Col md={4}>
            <ProfileSidebar />
          </Col>

          {/* Conteúdo */}
          <Col md={8}>
            <ProfileHeader
              nome={profileData.nome}
              bio={profileData.bio}
              avatar={profileData.avatar}
            />

            {/* Navegação */}
            <div className="mb-3 d-flex gap-2">
              {["posts", "albums", "about", "contact"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "success" : "outline-success"}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  size="sm"
                >
                  {tab === "posts"
                    ? "Publicações"
                    : tab === "albums"
                    ? "Álbuns"
                    : tab === "about"
                    ? "Sobre"
                    : "Contato"}
                </Button>
              ))}
            </div>

            {/* Conteúdo das abas */}
            {activeTab === "posts" && (
              <>
                <CreatePost
                  user={{
                    name: "AATAN - Sorocaba",
                    avatar: "/assets/aatan-logo.jpg",
                  }}
                  onSubmit={handleCreatePost}
                />

                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white p-3 rounded shadow mb-4"
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
                        src={post.image}
                        width={500}
                        height={300}
                        className="rounded my-3"
                        alt="Post content"
                      />
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <Button
                          variant="light"
                          className="rounded-pill"
                          onClick={() => handleLike(post.id, true)}
                        >
                          <BiHeart /> {post.likes} Curtir
                        </Button>
                        <Button
                          variant="light"
                          className="rounded-pill"
                          onClick={() => handleComment(post.id)}
                        >
                          <BiMessageDetail /> Comentar
                        </Button>
                        <Button
                          variant="light"
                          className="rounded-pill"
                          onClick={() => handleShare(post.id)}
                        >
                          <BiShare /> Compartilhar
                        </Button>
                      </div>
                    </div>

                    <Comments
                      comments={post.commentsList || []}
                      onAddComment={(text: string) => {
                        const newComment: Comment = {
                          id: Date.now(),
                          user: "Usuário Atual",
                          text,
                        };
                        setPosts((posts) =>
                          posts.map((p) =>
                            p.id === post.id
                              ? {
                                  ...p,
                                  commentsList: [
                                    ...(p.commentsList || []),
                                    newComment,
                                  ],
                                }
                              : p
                          )
                        );
                      }}
                    />
                  </div>
                ))}
              </>
            )}

            {activeTab === "albums" && (
              <div className="bg-white p-3 rounded shadow">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Álbuns</h4>
                  <Button variant="success" size="sm">
                    <BiPlusCircle size={16} className="me-1" /> Novo Álbum
                  </Button>
                </div>
                <div className="row">
                  {albums.map((album) => (
                    <div key={album.id} className="col-md-6 mb-4">
                      <div className="bg-light rounded p-3">
                        <h5>{album.title}</h5>
                        {album.coverImage && (
                          <Image
                            src={album.coverImage}
                            width={250}
                            height={150}
                            alt={album.title}
                            className="rounded"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="bg-white p-3 rounded shadow">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4>Sobre</h4>
                  {!isEditing ? (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleEdit}
                      aria-label="Editar informações do perfil"
                    >
                      <BiEdit className="me-1" /> Editar
                    </Button>
                  ) : (
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        aria-label="Salvar alterações"
                      >
                        <BiSave className="me-1" />{" "}
                        {isSaving ? "Salvando..." : "Salvar"}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                        aria-label="Cancelar edição"
                      >
                        <BiX className="me-1" /> Cancelar
                      </Button>
                    </div>
                  )}
                </div>

                {saveMessage && (
                  <div
                    className={`alert alert-${
                      saveMessage.type === "success" ? "success" : "danger"
                    } mb-3`}
                    role="alert"
                  >
                    {saveMessage.text}
                  </div>
                )}

                {!isEditing ? (
                  <div>
                    <div className="mb-3">
                      <strong>Nome:</strong>
                      <p>{profileData.nome}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong>
                      <p>{profileData.email}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Biografia:</strong>
                      <p>
                        {profileData.bio || "Nenhuma biografia adicionada."}
                      </p>
                    </div>
                    {profileData.telefone && (
                      <div className="mb-3">
                        <strong>Telefone:</strong>
                        <p>{profileData.telefone}</p>
                      </div>
                    )}
                    {profileData.endereco && (
                      <div className="mb-3">
                        <strong>Endereço:</strong>
                        <p>{profileData.endereco}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Form>
                    <div className="mb-3">
                      <Form.Label htmlFor="edit-nome">
                        <strong>Nome *</strong>
                      </Form.Label>
                      <Form.Control
                        id="edit-nome"
                        type="text"
                        value={editFormData.nome}
                        onChange={(e) =>
                          handleInputChange("nome", e.target.value)
                        }
                        required
                        aria-required="true"
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Label htmlFor="edit-email">
                        <strong>Email *</strong>
                      </Form.Label>
                      <Form.Control
                        id="edit-email"
                        type="email"
                        value={editFormData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        aria-required="true"
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Label htmlFor="edit-bio">
                        <strong>Biografia</strong>
                      </Form.Label>
                      <Form.Control
                        id="edit-bio"
                        as="textarea"
                        rows={4}
                        value={editFormData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        placeholder="Conte um pouco sobre você ou sua organização..."
                        aria-label="Campo de biografia"
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Label htmlFor="edit-telefone">
                        <strong>Telefone</strong>
                      </Form.Label>
                      <Form.Control
                        id="edit-telefone"
                        type="tel"
                        value={editFormData.telefone || ""}
                        onChange={(e) =>
                          handleInputChange("telefone", e.target.value)
                        }
                        placeholder="(00) 0000-0000"
                        aria-label="Campo de telefone"
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Label htmlFor="edit-endereco">
                        <strong>Endereço</strong>
                      </Form.Label>
                      <Form.Control
                        id="edit-endereco"
                        type="text"
                        value={editFormData.endereco || ""}
                        onChange={(e) =>
                          handleInputChange("endereco", e.target.value)
                        }
                        placeholder="Endereço completo"
                        aria-label="Campo de endereço"
                      />
                    </div>
                  </Form>
                )}
              </div>
            )}

            {activeTab === "contact" && (
              <div className="bg-white p-3 rounded shadow">
                <h4>Contato</h4>
                <div>
                  <p>
                    <strong>Email:</strong> {profileData.email}
                  </p>
                  {profileData.telefone && (
                    <p>
                      <strong>Telefone:</strong> {profileData.telefone}
                    </p>
                  )}
                  {profileData.endereco && (
                    <p>
                      <strong>Endereço:</strong> {profileData.endereco}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
