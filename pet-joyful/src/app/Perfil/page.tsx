'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { 
  BiHome, 
  BiUser, 
  BiMessageDetail, 
  BiBell, 
  BiListUl,
  BiPlusCircle
} from 'react-icons/bi';

import ProfileSidebar from '../components/profile/ProfileSidebar';  
import CreatePost from '../components/posts/CreatePost';
import PostComponent from '../components/posts/PostComponent';
import ProfileHeader from '../components/profile/ProfileHeader';  

export default function Perfil() {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([
    {
      id: 1,
      text: 'Se você é como nós, os identifica através do olhar.',
      image: '/assets/post-aatan.jpg',
      user: {
        name: 'AATAN - Sorocaba',
        avatar: '/assets/aatan-logo.jpg'
      },
      time: '2 horas atrás',
      likes: 42,
      comments: 8,
      isAdoption: true
    }
  ]);
  
  const [albums] = useState([
    {
      id: 1,
      title: 'Animais para adoção',
      cover: '/assets/post-aatan.jpg',
      photos: [
        '/assets/post-aatan.jpg',
        '/assets/imgPerfilM.png',
        '/assets/imgPerfilH.png'
      ],
      date: '2023-10-15'
    },
    {
      id: 2,
      title: 'Eventos 2023',
      cover: '/assets/imgPerfilM.png',
      photos: [
        '/assets/imgPerfilM.png',
        '/assets/imgPerfilH.png'
      ],
      date: '2023-09-20'
    }
  ]);

  interface NewPost {
    text: string;
    image: string | null;
    user: {
      name: string;
      avatar: string;
    };
  }

  const handleCreatePost = (newPost: NewPost) => {
    const post = {
      id: posts.length + 1,
      ...newPost,
      image: newPost.image ?? '', // Ensure image is always a string
      time: 'Agora mesmo',
      likes: 0,
      comments: 0,
      isAdoption: false
    };
    setPosts([post, ...posts]);
  };

  const handleLike = (postId: string | number, liked: boolean) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: liked ? post.likes + 1 : post.likes - 1 } : post
    ));
  };

  const handleComment = (postId: string | number) => {
    // Lógica para comentários
    console.log(`Comentar no post ${postId}`);
  };

  const handleShare = (postId: string | number) => {
    // Lógica para compartilhar
    console.log(`Compartilhar post ${postId}`);
  };

  return (
    <>
      <Head>
        <title>PetJoyful - Perfil</title>
        <meta name="description" content="Perfil do usuário no PetJoyful" />
      </Head>

      <header className="bg-success text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <Link href="/" className="fw-bold fs-4">
          <Image
            src="/assets/logo.png"
            alt="Logo PetJoyful"
            width={140}
            height={110}
          />
        </Link>

        <input 
          type="text" 
          className="form-control w-50" 
          placeholder="Busca" 
        />

        <div className="d-flex align-items-center gap-3">
          <Link
            href="/Home"
            className="text-white text-decoration-none d-flex flex-column align-items-center"
          >
            <BiHome size={24} />
            <span className="fs-6">Início</span>
          </Link>
          
          <Link
            href="/Perfil"
            className="text-white text-decoration-none d-flex flex-column align-items-center active"
          >
            <BiUser size={24} />
            <span className="fs-6">Perfil</span>
          </Link>
          
          <BiMessageDetail size={24} />
          <BiBell size={24} />
          <BiListUl size={24} />
        </div>
      </header>

      <Container className="my-4">
        <Row>
          {/* Sidebar à esquerda */}
          <Col md={4}>
            <ProfileSidebar />
          </Col>

          {/* Conteúdo principal */}
          <Col md={8}>
            <ProfileHeader />

            {/* Navegação de abas */}
            <div className="mb-3 d-flex gap-2">
              <Button
                variant={activeTab === 'posts' ? 'success' : 'outline-success'}
                onClick={() => setActiveTab('posts')}
                size="sm"
              >
                Publicações
              </Button>
              <Button
                variant={activeTab === 'albums' ? 'success' : 'outline-success'}
                onClick={() => setActiveTab('albums')}
                size="sm"
              >
                Álbuns
              </Button>
              <Button
                variant={activeTab === 'about' ? 'success' : 'outline-success'}
                onClick={() => setActiveTab('about')}
                size="sm"
              >
                Sobre
              </Button>
              <Button
                variant={activeTab === 'contact' ? 'success' : 'outline-success'}
                onClick={() => setActiveTab('contact')}
                size="sm"
              >
                Contato
              </Button>
            </div>

            {/* Conteúdo das abas */}
            {activeTab === 'posts' && (
              <>
                <CreatePost 
                  user={{
                    name: 'AATAN - Sorocaba',
                    avatar: '/assets/aatan-logo.jpg'
                  }}
                  onSubmit={handleCreatePost}
                />
                
                {posts.map(post => (
                  <PostComponent
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                  />
                ))}
              </>
            )}
            {activeTab === 'albums' && (
              <div className="bg-white p-3 rounded shadow">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Álbuns</h4>
                  <Button variant="success" size="sm">
                    <BiPlusCircle size={16} className="me-1" />
                    Novo Álbum
                  </Button>
                </div>
                
                <div className="row">
                  {albums.map(album => (
                    <div key={album.id} className="col-md-6 mb-4">
                      {/* Album content here */}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'about' && (
              <div className="bg-white p-3 rounded shadow">
                <h4>Sobre</h4>
                <p>
                  Associação de proteção animal oferecendo abrigo e cuidados para 
                  animais em situação de vulnerabilidade.
                </p>
              </div>
            )}
            {activeTab === 'contact' && (
              <div className="bg-white p-3 rounded shadow">
                <h4>Contato</h4>
                <p>
                  Email: contato@aatansorocaba.org.br<br />
                  Telefone: (15) 1234-5678
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )};