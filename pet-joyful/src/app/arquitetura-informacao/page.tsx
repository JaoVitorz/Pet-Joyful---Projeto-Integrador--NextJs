"use client";

import React, { useState } from "react";
import {
  Home,
  MessageCircle,
  Calendar,
  User,
  Heart,
  Image as ImageIcon,
  Bell,
  Menu,
  PawPrint,
  Users,
  FileText,
  Camera,
  UserPlus,
  LogIn,
  Settings,
  Share2,
  ThumbsUp,
  MapPin,
  Info,
  Shield,
  BookOpen,
} from "lucide-react";

const ArquiteturaInformacao = () => {
  const [currentView, setCurrentView] = useState("cardsorting");

  const cardSortingCategories = [
    {
      category: "Página Inicial (Home)",
      icon: <Home className="w-6 h-6" />,
      cards: [
        "Feed de publicações",
        "Criar nova publicação",
        "Posts de adoção",
        "Curtidas e comentários",
        "Compartilhar posts",
        "Filtros do feed",
      ],
    },
    {
      category: "Perfil do Usuário",
      icon: <User className="w-6 h-6" />,
      cards: [
        "Informações pessoais",
        "Foto de perfil",
        "Bio do usuário",
        "Meus pets",
        "Minhas publicações",
        "Editar perfil",
        "Configurações de conta",
      ],
    },
    {
      category: "Álbuns",
      icon: <ImageIcon className="w-6 h-6" />,
      cards: [
        "Listar álbuns",
        "Criar novo álbum",
        "Visualizar fotos",
        "Upload de imagens",
        "Gerenciar álbuns",
        "Compartilhar álbuns",
      ],
    },
    {
      category: "Eventos",
      icon: <Calendar className="w-6 h-6" />,
      cards: [
        "Lista de eventos",
        "Criar evento",
        "Detalhes do evento",
        "Campanhas de adoção",
        "Eventos de vacinação",
        "Participar/Confirmar presença",
      ],
    },
    {
      category: "Chat/Mensagens",
      icon: <MessageCircle className="w-6 h-6" />,
      cards: [
        "Lista de conversas",
        "Mensagens diretas",
        "Enviar mensagens",
        "Notificações de chat",
        "Histórico de conversas",
        "Buscar conversas",
      ],
    },
    {
      category: "Autenticação",
      icon: <LogIn className="w-6 h-6" />,
      cards: [
        "Login",
        "Registro de usuário",
        "Recuperação de senha",
        "Autenticação social",
        "Validação de formulários",
        "Gestão de sessão",
      ],
    },
    {
      category: "Institucional",
      icon: <Info className="w-6 h-6" />,
      cards: [
        "Sobre o Pet Joyful",
        "FAQ - Perguntas frequentes",
        "Termos de uso",
        "Política de privacidade",
        "Contato",
        "Missão e valores",
      ],
    },
  ];

  const navigation = {
    primary: [
      {
        name: "Início",
        icon: <Home className="w-5 h-5" />,
        path: "/Home",
        description: "Feed principal de publicações",
      },
      {
        name: "Perfil",
        icon: <User className="w-5 h-5" />,
        path: "/Perfil",
        description: "Visualizar e editar perfil",
      },
      {
        name: "Chat",
        icon: <MessageCircle className="w-5 h-5" />,
        path: "/Chat",
        description: "Mensagens diretas",
      },
      {
        name: "Eventos",
        icon: <Calendar className="w-5 h-5" />,
        path: "/eventos",
        description: "Campanhas e eventos",
      },
      {
        name: "Álbuns",
        icon: <ImageIcon className="w-5 h-5" />,
        path: "/albums",
        description: "Galeria de fotos",
      },
    ],
    secondary: [
      {
        name: "Notificações",
        icon: <Bell className="w-5 h-5" />,
        description: "Centro de notificações",
      },
      {
        name: "Configurações",
        icon: <Settings className="w-5 h-5" />,
        description: "Configurações da conta",
      },
      {
        name: "Sair",
        icon: <LogIn className="w-5 h-5" />,
        path: "/login",
        description: "Logout do sistema",
      },
    ],
    footer: [
      { name: "Sobre", icon: <Info className="w-5 h-5" />, path: "/sobre" },
      { name: "FAQ", icon: <BookOpen className="w-5 h-5" />, path: "/Faq" },
      {
        name: "Privacidade",
        icon: <Shield className="w-5 h-5" />,
        path: "/privacidade",
      },
      {
        name: "Termos",
        icon: <FileText className="w-5 h-5" />,
        path: "/termos",
      },
    ],
  };

  const wireframe = {
    header: {
      title: "Cabeçalho (Header)",
      elements: [
        "Logo Pet Joyful (esquerda)",
        "Barra de busca (centro)",
        "Menu principal: Início, Perfil, Chat (direita)",
        "Ícones: Notificações, Configurações",
      ],
    },
    hero: {
      title: "Seção Hero/Feed Principal",
      elements: [
        "Formulário de criação de post",
        "Upload de imagens",
        "Cards de publicações",
        "Botões de interação (curtir, comentar, compartilhar)",
      ],
    },
    sections: [
      {
        name: "Página de Perfil",
        layout: "3 colunas",
        content: [
          "Coluna 1: Foto de perfil, informações pessoais",
          "Coluna 2: Feed de posts do usuário",
          "Coluna 3: Álbuns, pets cadastrados",
        ],
      },
      {
        name: "Página de Eventos",
        layout: "Grid 2 colunas",
        content: [
          "Cards de eventos com imagem",
          "Título, data e local",
          "Botão de participação",
          "Filtros por tipo de evento",
        ],
      },
      {
        name: "Chat",
        layout: "2 colunas",
        content: [
          "Lista de conversas (esquerda)",
          "Janela de mensagens (direita)",
          "Input de mensagem (parte inferior)",
        ],
      },
    ],
    footer: {
      title: "Rodapé (Footer)",
      elements: [
        "Links institucionais",
        "Sobre, FAQ, Privacidade, Termos",
        "Redes sociais",
        "Copyright",
      ],
    },
  };

  const symbols = [
    {
      icon: <PawPrint className="w-8 h-8" />,
      name: "Pata",
      usage: "Logo principal, identidade da marca",
    },
    {
      icon: <Home className="w-8 h-8" />,
      name: "Casa",
      usage: "Página inicial/Home",
    },
    {
      icon: <User className="w-8 h-8" />,
      name: "Usuário",
      usage: "Perfil e conta do usuário",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      name: "Mensagem",
      usage: "Chat e comunicação",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      name: "Calendário",
      usage: "Eventos e campanhas",
    },
    {
      icon: <ImageIcon className="w-8 h-8" />,
      name: "Imagem",
      usage: "Álbuns e galeria de fotos",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      name: "Coração",
      usage: "Curtidas e favoritos",
    },
    { icon: <Bell className="w-8 h-8" />, name: "Sino", usage: "Notificações" },
    {
      icon: <Share2 className="w-8 h-8" />,
      name: "Compartilhar",
      usage: "Compartilhar publicações",
    },
    {
      icon: <ThumbsUp className="w-8 h-8" />,
      name: "Like",
      usage: "Curtir posts",
    },
    {
      icon: <Users className="w-8 h-8" />,
      name: "Comunidade",
      usage: "Rede social, conexões",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      name: "Câmera",
      usage: "Upload de fotos",
    },
  ];

  const colors = [
    {
      name: "Verde Primário",
      hex: "#198754",
      usage: "Cor principal, header, botões primários, links",
      rgb: "rgb(25, 135, 84)",
    },
    {
      name: "Verde Escuro",
      hex: "#157347",
      usage: "Hover de botões, links ativos, destaques",
      rgb: "rgb(21, 115, 71)",
    },
    {
      name: "Branco Base",
      hex: "#FFFFFF",
      usage: "Fundo principal, cards, elementos claros",
      rgb: "rgb(255, 255, 255)",
    },
    {
      name: "Cinza Neutro",
      hex: "#6B7280",
      usage: "Textos secundários, bordas, elementos desabilitados",
      rgb: "rgb(107, 114, 128)",
    },
    {
      name: "Cinza Claro",
      hex: "#F3F4F6",
      usage: "Fundo alternativo, separadores",
      rgb: "rgb(243, 244, 246)",
    },
    {
      name: "Azul Informativo",
      hex: "#3B82F6",
      usage: "Links, informações, badges",
      rgb: "rgb(59, 130, 246)",
    },
    {
      name: "Vermelho Alerta",
      hex: "#EF4444",
      usage: "Erros, alertas, exclusões",
      rgb: "rgb(239, 68, 68)",
    },
    {
      name: "Amarelo Atenção",
      hex: "#F59E0B",
      usage: "Avisos, alertas moderados",
      rgb: "rgb(245, 158, 11)",
    },
  ];

  const patterns = [
    {
      name: "Card de Publicação (Post)",
      elements: [
        "Avatar e nome do usuário (topo)",
        "Conteúdo do texto",
        "Imagem (se houver)",
        "Data de publicação",
        "Botões: Curtir, Comentar, Compartilhar",
        "Contador de curtidas e comentários",
      ],
    },
    {
      name: "Card de Evento",
      elements: [
        "Imagem de capa do evento",
        "Título do evento",
        "Data e horário",
        "Local (se aplicável)",
        "Descrição breve",
        "Botão 'Ver detalhes' ou 'Participar'",
      ],
    },
    {
      name: "Formulário de Criação de Post",
      elements: [
        "Textarea para texto",
        "Botão de upload de imagem",
        "Preview de imagem selecionada",
        "Contador de caracteres",
        "Botão 'Publicar'",
      ],
    },
    {
      name: "Header Principal",
      elements: [
        "Logo Pet Joyful (clicável - vai para Home)",
        "Barra de busca centralizada",
        "Menu de navegação: Início, Perfil, Chat",
        "Ícone de notificações (com badge de contagem)",
        "Menu dropdown de configurações",
      ],
    },
    {
      name: "Card de Perfil",
      elements: [
        "Foto de perfil (editável)",
        "Nome do usuário",
        "Bio/Descrição",
        "Localização",
        "Número de posts/seguidores",
        "Botão 'Editar Perfil'",
      ],
    },
    {
      name: "Item de Chat/Conversa",
      elements: [
        "Avatar do contato",
        "Nome do contato",
        "Última mensagem (preview)",
        "Timestamp",
        "Badge de mensagens não lidas",
      ],
    },
    {
      name: "Formulário de Login/Registro",
      elements: [
        "Logo centralizada",
        "Campos de input (email, senha)",
        "Validação em tempo real",
        "Mensagens de erro",
        "Botão de submit",
        "Links alternativos (esqueci senha, criar conta)",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-green-600">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-600 p-4 rounded-xl">
              <PawPrint className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Pet Joyful</h1>
              <p className="text-gray-600 text-lg">
                Arquitetura da Informação - Projeto Integrador
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Rede Social para Adoção e Cuidados com Animais
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              "cardsorting",
              "navigation",
              "wireframe",
              "symbols",
              "colors",
              "patterns",
            ].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-5 py-3 rounded-lg font-semibold transition-all ${
                  currentView === view
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }`}
              >
                {view === "cardsorting" && "1. Card Sorting"}
                {view === "navigation" && "2. Menus e Navegação"}
                {view === "wireframe" && "3. Protótipo Baixa Fidelidade"}
                {view === "symbols" && "4. Símbolos"}
                {view === "colors" && "5. Cores"}
                {view === "patterns" && "6. Padrões"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {currentView === "cardsorting" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                1. Estrutura da Informação (Card Sorting)
              </h2>
              <p className="text-gray-600 text-lg">
                Organização das funcionalidades e conteúdos da plataforma Pet
                Joyful
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  <strong>Objetivo:</strong> Apresentar a hierarquia de
                  informações e funcionalidades disponíveis na rede social,
                  facilitando a compreensão da estrutura do sistema e suas
                  principais áreas.
                </p>
              </div>
            </div>

            {cardSortingCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-green-200">
                  <div className="text-green-600 bg-green-50 p-3 rounded-lg">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {cat.category}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.cards.map((card, cardIdx) => (
                    <div
                      key={cardIdx}
                      className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all cursor-pointer"
                    >
                      <p className="text-gray-800 font-medium">{card}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === "navigation" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                2. Menus e Navegação
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                Sistema de navegação principal, secundária e rodapé
              </p>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  <strong>Princípio:</strong> Navegação intuitiva com no máximo
                  3 cliques para qualquer funcionalidade. Header fixo para
                  acesso rápido às principais seções.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Menu className="w-7 h-7 text-green-600" />
                Menu Principal (Header - Navegação Primária)
              </h3>
              <div className="space-y-3 mb-4">
                {navigation.primary.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all cursor-pointer"
                  >
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{item.name}</p>
                      <p className="text-sm text-green-50">
                        {item.description}
                      </p>
                      <p className="text-xs text-green-100 mt-1">
                        Rota: {item.path}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Menu Secundário (Ações Rápidas)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {navigation.secondary.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-green-600"
                  >
                    <div className="bg-green-600 text-white p-3 rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Menu do Rodapé (Links Institucionais)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {navigation.footer.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-all cursor-pointer"
                  >
                    <div className="text-green-600">{item.icon}</div>
                    <p className="font-medium text-gray-700 text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.path}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Hierarquia de Navegação
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-600 pl-4 p-3 bg-green-50 rounded-r-lg">
                  <p className="font-bold text-gray-800 text-lg">
                    Nível 1: Páginas Principais
                  </p>
                  <p className="text-gray-700 mt-1">
                    Home → Perfil → Chat → Eventos → Álbuns
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Acessíveis diretamente pelo header em qualquer momento
                  </p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4 p-3 bg-blue-50 rounded-r-lg">
                  <p className="font-bold text-gray-800 text-lg">
                    Nível 2: Subseções
                  </p>
                  <p className="text-gray-700 mt-1">
                    Perfil → (Editar, Meus Posts, Meus Pets, Álbuns)
                  </p>
                  <p className="text-gray-700">
                    Eventos → (Lista de Eventos, Criar Evento, Detalhes)
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Navegação contextual dentro de cada seção principal
                  </p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4 p-3 bg-purple-50 rounded-r-lg">
                  <p className="font-bold text-gray-800 text-lg">
                    Nível 3: Detalhes e Ações
                  </p>
                  <p className="text-gray-700 mt-1">
                    Post → (Ver comentários, Curtir, Compartilhar,
                    Editar/Excluir)
                  </p>
                  <p className="text-gray-700">
                    Evento → (Ver detalhes, Participar, Compartilhar)
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Ações específicas e visualização detalhada de itens
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === "wireframe" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                3. Protótipo de Baixa Fidelidade
              </h2>
              <p className="text-gray-600 text-lg">
                Wireframes das principais páginas da plataforma
              </p>
            </div>

            {/* Wireframe do Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Layout: Página Principal (Home/Feed)
              </h3>

              {/* Header */}
              <div className="border-4 border-green-600 rounded-lg p-4 mb-6 bg-green-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                      <PawPrint className="w-8 h-8 text-white" />
                    </div>
                    <div className="h-6 w-32 bg-green-300 rounded"></div>
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="h-10 bg-white border-2 border-gray-300 rounded-lg"></div>
                    <p className="text-xs text-center mt-1 text-gray-600">
                      Barra de Busca
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {["Início", "Perfil", "Chat"].map((label, i) => (
                      <div key={i} className="text-center">
                        <div className="h-10 w-20 bg-green-300 rounded mb-1"></div>
                        <p className="text-xs text-gray-600">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Create Post Section */}
              <div className="border-4 border-gray-300 rounded-lg p-6 mb-6 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 h-10 bg-gray-100 border-2 border-gray-300 rounded-lg"></div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Criar Publicação</p>
                <div className="flex gap-2">
                  <div className="h-8 w-32 bg-blue-200 rounded"></div>
                  <div className="h-8 w-32 bg-green-300 rounded"></div>
                </div>
              </div>

              {/* Feed Posts */}
              <div className="space-y-4">
                <p className="font-bold text-gray-700 mb-3">
                  Feed de Publicações
                </p>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border-4 border-gray-300 rounded-lg p-6 bg-gray-50"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div>
                        <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-4">
                      <div className="h-8 w-24 bg-red-200 rounded flex items-center justify-center">
                        <span className="text-xs">❤ Curtir</span>
                      </div>
                      <div className="h-8 w-32 bg-blue-200 rounded flex items-center justify-center">
                        <span className="text-xs">💬 Comentar</span>
                      </div>
                      <div className="h-8 w-32 bg-green-200 rounded flex items-center justify-center">
                        <span className="text-xs">↗ Compartilhar</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wireframe Perfil */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Layout: Página de Perfil
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 border-4 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-green-300 rounded mb-2"></div>
                  <div className="h-10 bg-blue-300 rounded"></div>
                  <p className="text-xs text-center mt-4 text-gray-600">
                    Info do Usuário
                  </p>
                </div>
                <div className="col-span-2 border-4 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex gap-4 mb-4">
                    <div className="h-8 w-24 bg-green-300 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="border-2 border-gray-300 rounded-lg p-4 bg-white"
                      >
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-32 bg-gray-200 rounded mb-2"></div>
                        <div className="flex gap-2">
                          <div className="h-6 w-20 bg-red-200 rounded"></div>
                          <div className="h-6 w-24 bg-blue-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-center mt-4 text-gray-600">
                    Posts do Usuário
                  </p>
                </div>
              </div>
            </div>

            {/* Wireframe Chat */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Layout: Página de Chat
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 border-4 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="h-10 bg-white border-2 border-gray-300 rounded mb-4"></div>
                  <p className="text-xs text-gray-600 mb-2">
                    Lista de Conversas
                  </p>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex gap-2 p-2 bg-white rounded mb-2 border-2 border-gray-200"
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-300 rounded mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-span-2 border-4 border-gray-300 rounded-lg bg-gray-50 flex flex-col">
                  <div className="flex items-center gap-3 p-4 bg-green-100 border-b-2 border-gray-300">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex-1 p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="bg-white p-3 rounded-lg border-2 border-gray-300 max-w-xs">
                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="bg-green-200 p-3 rounded-lg border-2 border-green-300 max-w-xs">
                        <div className="h-3 bg-green-400 rounded"></div>
                      </div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t-2 border-gray-300">
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 bg-gray-100 border-2 border-gray-300 rounded"></div>
                      <div className="h-10 w-20 bg-green-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Rodapé (Footer)
              </h3>
              <div className="border-4 border-gray-800 rounded-lg p-6 bg-gray-800 text-white">
                <div className="grid grid-cols-4 gap-6">
                  {["Sobre", "FAQ", "Privacidade", "Termos"].map(
                    (section, i) => (
                      <div key={i}>
                        <div className="h-6 bg-gray-600 rounded mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-700 rounded"></div>
                          <div className="h-4 bg-gray-700 rounded"></div>
                          <div className="h-4 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                  <div className="h-4 w-64 bg-gray-700 rounded mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === "symbols" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                4. Definição dos Símbolos
              </h2>
              <p className="text-gray-600 text-lg">
                Iconografia e elementos visuais utilizados no Pet Joyful
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  <strong>Biblioteca de ícones:</strong> Lucide React - ícones
                  modernos, acessíveis e consistentes. Todos os ícones possuem
                  atributo aria-hidden="true" para leitores de tela.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {symbols.map((symbol, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-green-600"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl shadow-md">
                      <div className="text-green-700">{symbol.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        {symbol.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {symbol.usage}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Tamanho padrão: 24px (w-6 h-6)
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Princípios de Uso dos Ícones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <h4 className="font-bold text-gray-800 mb-2">
                    ✓ Consistência
                  </h4>
                  <p className="text-sm text-gray-700">
                    Usar sempre o mesmo ícone para a mesma funcionalidade em
                    toda a plataforma
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                  <h4 className="font-bold text-gray-800 mb-2">✓ Clareza</h4>
                  <p className="text-sm text-gray-700">
                    Ícones devem ser reconhecíveis e intuitivos, complementados
                    por labels quando necessário
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                  <h4 className="font-bold text-gray-800 mb-2">
                    ✓ Acessibilidade
                  </h4>
                  <p className="text-sm text-gray-700">
                    Sempre incluir texto alternativo e aria-labels para
                    tecnologias assistivas
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
                  <h4 className="font-bold text-gray-800 mb-2">
                    ✓ Tamanho adequado
                  </h4>
                  <p className="text-sm text-gray-700">
                    Mínimo de 24px para áreas clicáveis (botões), 44px de área
                    de toque no mobile
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === "colors" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                5. Definição das Cores
              </h2>
              <p className="text-gray-600 text-lg">
                Paleta de cores oficial do Pet Joyful
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  <strong>Acessibilidade:</strong> Todas as combinações de cores
                  respeitam o contraste mínimo WCAG AA (4.5:1 para texto
                  normal). A cor verde primária é dominante, representando vida,
                  natureza e cuidado com os animais.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div
                    className="h-40 relative"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className="text-3xl font-bold mb-2"
                          style={{
                            color: idx <= 1 ? "#fff" : "#000",
                            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          }}
                        >
                          {color.hex}
                        </div>
                        <div
                          className="text-sm"
                          style={{
                            color: idx <= 1 ? "#fff" : "#000",
                            opacity: 0.9,
                          }}
                        >
                          {color.rgb}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {color.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {color.usage}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-mono">
                        {color.hex}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-mono">
                        {color.rgb}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Exemplos de Aplicação das Cores
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Botões</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all">
                      Botão Primário
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-green-600 px-6 py-3 rounded-lg font-medium shadow-md border-2 border-green-600 transition-all">
                      Botão Secundário
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all">
                      Informativo
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all">
                      Excluir/Cancelar
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Alertas e Notificações
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-100 border-l-4 border-green-600 rounded-lg">
                      <p className="text-green-800 font-medium">
                        ✓ Ação realizada com sucesso!
                      </p>
                    </div>
                    <div className="p-4 bg-blue-100 border-l-4 border-blue-600 rounded-lg">
                      <p className="text-blue-800 font-medium">
                        ℹ Informação importante
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-100 border-l-4 border-yellow-600 rounded-lg">
                      <p className="text-yellow-800 font-medium">
                        ⚠ Atenção necessária
                      </p>
                    </div>
                    <div className="p-4 bg-red-100 border-l-4 border-red-600 rounded-lg">
                      <p className="text-red-800 font-medium">
                        ✕ Erro ao processar
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Tipografia e Textos
                  </h4>
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 text-lg font-bold">
                      Título Principal - Gray 900
                    </p>
                    <p className="text-gray-800 font-semibold">
                      Subtítulo - Gray 800
                    </p>
                    <p className="text-gray-700">Texto normal - Gray 700</p>
                    <p className="text-gray-600">Texto secundário - Gray 600</p>
                    <p className="text-gray-500 text-sm">
                      Texto de apoio - Gray 500
                    </p>
                    <a
                      href="#"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Link clicável - Green 600
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Diretrizes de Contraste (WCAG)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-600 text-white rounded-lg">
                  <p className="font-bold mb-2">✓ Contraste Aprovado</p>
                  <p className="text-sm">Texto branco em fundo verde #198754</p>
                  <p className="text-xs mt-2 opacity-90">
                    Ratio: 4.8:1 (WCAG AA)
                  </p>
                </div>
                <div className="p-4 bg-white border-2 border-green-600 text-green-600 rounded-lg">
                  <p className="font-bold mb-2">✓ Contraste Aprovado</p>
                  <p className="text-sm">Texto verde em fundo branco</p>
                  <p className="text-xs mt-2 opacity-75">
                    Ratio: 4.8:1 (WCAG AA)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === "patterns" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                6. Definição dos Padrões
              </h2>
              <p className="text-gray-600 text-lg">
                Componentes e padrões de interface reutilizáveis
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  <strong>Design System:</strong> Componentes padronizados
                  garantem consistência visual e facilitam manutenção. Cada
                  padrão segue princípios de usabilidade e acessibilidade WCAG
                  2.1 AA.
                </p>
              </div>
            </div>

            {patterns.map((pattern, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {pattern.name}
                  </h3>
                </div>
                <div className="space-y-3">
                  {pattern.elements.map((element, elemIdx) => (
                    <div
                      key={elemIdx}
                      className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-600 hover:shadow-md transition-all"
                    >
                      <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                        {elemIdx + 1}
                      </div>
                      <p className="text-gray-800 font-medium">{element}</p>
                    </div>
                  ))}
                </div>

                {/* Exemplo visual do padrão */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-xs text-gray-600 mb-3 font-semibold">
                    Representação visual:
                  </p>

                  {pattern.name === "Card de Publicação (Post)" && (
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                          <div className="h-3 w-24 bg-gray-300 rounded mb-1"></div>
                          <div className="h-2 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                      <div className="h-32 bg-gray-200 rounded mb-3"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-20 bg-red-100 rounded text-xs flex items-center justify-center">
                          ❤ 15
                        </div>
                        <div className="h-8 w-20 bg-blue-100 rounded text-xs flex items-center justify-center">
                          💬 3
                        </div>
                        <div className="h-8 w-20 bg-green-100 rounded text-xs flex items-center justify-center">
                          ↗
                        </div>
                      </div>
                    </div>
                  )}

                  {pattern.name === "Card de Evento" && (
                    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                      <div className="h-32 bg-gradient-to-r from-green-200 to-green-300"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                        <div className="flex gap-2 mb-3">
                          <div className="h-3 w-24 bg-blue-100 rounded text-xs flex items-center justify-center">
                            📅 20/12
                          </div>
                          <div className="h-3 w-20 bg-green-100 rounded text-xs flex items-center justify-center">
                            📍 Local
                          </div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded mb-3 w-5/6"></div>
                        <div className="h-8 bg-green-600 rounded text-white text-xs flex items-center justify-center">
                          Ver Detalhes
                        </div>
                      </div>
                    </div>
                  )}

                  {pattern.name === "Formulário de Criação de Post" && (
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                      <div className="h-20 bg-gray-100 border-2 border-gray-300 rounded mb-3"></div>
                      <div className="flex gap-2 mb-2">
                        <div className="h-8 w-32 bg-blue-200 rounded text-xs flex items-center justify-center">
                          📷 Imagem
                        </div>
                        <div className="flex-1"></div>
                        <div className="h-8 w-20 bg-green-600 text-white rounded text-xs flex items-center justify-center">
                          Publicar
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        150/500 caracteres
                      </p>
                    </div>
                  )}

                  {pattern.name === "Header Principal" && (
                    <div className="bg-green-600 p-4 rounded-lg flex items-center gap-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg"></div>
                      <div className="flex-1 h-8 bg-white bg-opacity-20 rounded"></div>
                      <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-8 h-8 bg-white bg-opacity-20 rounded"
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Princípios de Design dos Padrões
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-bold text-gray-800 mb-2">Consistência</h4>
                  <p className="text-sm text-gray-700">
                    Padrões visuais e comportamentais repetidos criam
                    familiaridade e facilitam a navegação
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                  <div className="text-3xl mb-3">👁️</div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Hierarquia Visual
                  </h4>
                  <p className="text-sm text-gray-700">
                    Elementos mais importantes têm maior destaque visual
                    (tamanho, cor, posição)
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                  <div className="text-3xl mb-3">♿</div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Acessibilidade
                  </h4>
                  <p className="text-sm text-gray-700">
                    Todos os padrões seguem WCAG 2.1 AA: contraste, navegação
                    por teclado, labels descritivos
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                  <div className="text-3xl mb-3">📱</div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Responsividade
                  </h4>
                  <p className="text-sm text-gray-700">
                    Design adaptável a diferentes tamanhos de tela (mobile-first
                    approach)
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border-2 border-pink-200">
                  <div className="text-3xl mb-3">⚡</div>
                  <h4 className="font-bold text-gray-800 mb-2">Performance</h4>
                  <p className="text-sm text-gray-700">
                    Componentes otimizados com lazy loading e memoization onde
                    necessário
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
                  <div className="text-3xl mb-3">🔄</div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Feedback Visual
                  </h4>
                  <p className="text-sm text-gray-700">
                    Toda ação do usuário gera resposta visual clara (loading,
                    sucesso, erro)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer informativo */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 text-white mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Pet Joyful - Arquitetura da Informação
              </h3>
              <p className="text-green-100">
                Projeto Integrador | Fatec | 2024
              </p>
              <p className="text-sm text-green-200 mt-2">
                Conectando Corações e Patas 🐾
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <PawPrint className="w-16 h-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArquiteturaInformacao;

