"use client";

import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Container, Row, Col, Button } from "react-bootstrap";
import { BiMessageDetail, BiPlusCircle, BiHeart, BiShare } from "react-icons/bi";
import Image from "next/image";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import CreatePost from "../components/posts/CreatePost";
import ProfileHeader from "../components/profile/ProfileHeader";
import Comments from "../components/posts/Comments";
import { useState, ReactNode } from "react";

// --- Tipos ---
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

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

// --- Componente ---
export default function Perfil() {
  const [activeTab, setActiveTab] = useState<"posts" | "albums" | "about" | "contact">("posts");

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

  const [albums, setAlbums] = useState<Album[]>([]);

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
        post.id === postId ? { ...post, likes: liked ? post.likes + 1 : post.likes - 1 } : post
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
            <ProfileHeader />

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
                  <div key={post.id} className="bg-white p-3 rounded shadow mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <Image src={post.user.avatar} width={40} height={40} className="rounded-circle" alt="Avatar" />
                      <span className="fw-bold">{post.user.name}</span>
                      <span className="text-muted ms-auto" style={{ fontSize: "0.9em" }}>
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
                        <Button variant="light" className="rounded-pill" onClick={() => handleLike(post.id, true)}>
                          <BiHeart /> {post.likes} Curtir
                        </Button>
                        <Button variant="light" className="rounded-pill" onClick={() => handleComment(post.id)}>
                          <BiMessageDetail /> Comentar
                        </Button>
                        <Button variant="light" className="rounded-pill" onClick={() => handleShare(post.id)}>
                          <BiShare /> Compartilhar
                        </Button>
                      </div>
                    </div>

                    <Comments
                      comments={post.commentsList || []}
                      onAddComment={(content: string) => {
                        const newComment: Comment = {
                          id: Date.now().toString(),
                          content,
                          createdAt: new Date().toISOString(),
                          author: {
                            id: "current",
                            name: "Usuário Atual",
                          },
                        };
                        setPosts((posts) =>
                          posts.map((p) =>
                            p.id === post.id
                              ? { ...p, commentsList: [...(p.commentsList || []), newComment] }
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
                          <Image src={album.coverImage} width={250} height={150} alt={album.title} className="rounded" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="bg-white p-3 rounded shadow">
                <h4>Sobre</h4>
                <p>Associação de proteção animal oferecendo abrigo e cuidados para animais em situação de vulnerabilidade.</p>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="bg-white p-3 rounded shadow">
                <h4>Contato</h4>
                <p>
                  Email: contato@aatansorocaba.org.br
                  <br />
                  Telefone: (15) 1234-5678
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
