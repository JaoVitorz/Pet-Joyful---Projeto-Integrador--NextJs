# 🐾 Pet-Joyful — Projeto Integrador Fatec

**Pet-Joyful** é uma rede social voltada à conexão entre instituições de adoção, adotantes e clínicas veterinárias. Nosso foco é a conscientização sobre cuidados com animais, vacinação e o incentivo à adoção responsável.

A plataforma facilita o acesso a informações, promove campanhas e eventos como forma de publicação para adoção, criando uma comunidade engajada com a causa animal.

---

## 🏗️ Arquitetura do Sistema

O projeto utiliza uma **arquitetura de microsserviços** com múltiplos backends independentes:

### Frontend

- **Repositório:** [Pet-Joyful---Projeto-Integrador--NextJs](https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs)
- **Tecnologia:** Next.js 15, React 19, TypeScript
- **Deploy:** Vercel (produção)

### Microsserviços Backend

#### 1. Backend Principal (Autenticação e Mensagens)

- **Repositório:** [Pet-Joyful-Backend](https://github.com/JaoVitorz/Pet-Joyful-Backend)
- **URL Produção:** `https://pet-joyful-backend-1.onrender.com`
- **Funcionalidades:** Autenticação (login/registro), mensagens, denúncias
- **Porta Local:** `3001`

#### 2. Microserviço de Eventos

- **Repositório:** [PET-JOYFUL-EVENTS-SERVICE](https://github.com/JaoVitorz/PET-JOYFUL-EVENTS-SERVICE)
- **URL Produção:** `https://pet-joyful-events-service.onrender.com`
- **Funcionalidades:** CRUD de eventos, campanhas de adoção
- **Porta Local:** `3002`

#### 3. Microserviço de Perfil e Álbuns

- **Repositório:** [EDICAO-PERFIL-MICROSERVICE](https://github.com/JaoVitorz/EDICAO-PERFIL-MICROSERVICE)
- **URL Produção:** `https://edicao-perfil-microservice.onrender.com`
- **Funcionalidades:** Edição de perfil, upload de fotos, gerenciamento de álbuns
- **Porta Local:** `3001`

---

## 🚀 Tecnologias Utilizadas

### Frontend

- [Next.js 15](https://nextjs.org/) - Framework React
- [React 19](https://reactjs.org/) - Biblioteca UI
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS 4](https://tailwindcss.com/) - Framework CSS
- [Bootstrap 5](https://getbootstrap.com/) - Componentes UI
- [Formik](https://formik.org/) - Gerenciamento de formulários
- [Yup](https://www.npmjs.com/package/yup) - Validação de schemas
- [Axios](https://axios-http.com/) - Cliente HTTP
- [Lucide React](https://lucide.dev/) - Ícones

### Backend

- [Node.js](https://nodejs.org/) - Runtime JavaScript
- [Express](https://expressjs.com/) - Framework web
- [JWT](https://jwt.io/) - Autenticação
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Hash de senhas
- [CORS](https://www.npmjs.com/package/cors) - Políticas de origem cruzada

### DevOps

- [Vercel](https://vercel.com/) - Deploy frontend
- [Render](https://render.com/) - Deploy backends
- [Git](https://git-scm.com/) - Controle de versão
- [npm](https://www.npmjs.com/) - Gerenciador de pacotes

---

## 🛠️ Como executar o projeto localmente

### 1. Pré-requisitos

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** (vem junto com o Node.js)
- **Git** (opcional, mas recomendado) - [Download](https://git-scm.com/)

### 2. Clone o repositório

```bash
git clone https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs.git
cd Pet-Joyful---Projeto-Integrador--NextJs
cd pet-joyful
```

### 3. Instale as dependências

```bash
npm install
```

**Dependências principais que serão instaladas:**

- next, react, react-dom
- axios, formik, yup
- bootstrap, react-icons, lucide-react
- express, jsonwebtoken, bcryptjs
- tailwindcss, concurrently

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na pasta `pet-joyful/`:

```env
# Backend Principal (Autenticação)
NEXT_PUBLIC_AUTH_API_URL=https://pet-joyful-backend-1.onrender.com

# Backend de Eventos
NEXT_PUBLIC_EVENTS_API_URL=https://pet-joyful-events-service.onrender.com
EVENTOS_API_URL=https://pet-joyful-events-service.onrender.com

# Backend de Perfil e Álbuns
NEXT_PUBLIC_PROFILE_API_URL=https://edicao-perfil-microservice.onrender.com

# Configurações opcionais
NEXT_PUBLIC_API_PREFIX=/api
NEXT_PUBLIC_API_ENDPOINT=events
NODE_ENV=development
```

**💡 Para desenvolvimento local com backends rodando localmente:**

```env
NEXT_PUBLIC_AUTH_API_URL=http://localhost:3001
NEXT_PUBLIC_EVENTS_API_URL=http://localhost:3002
NEXT_PUBLIC_PROFILE_API_URL=http://localhost:3001
```

### 5. Execute o projeto

#### Opção 1: Apenas Frontend (usando backends em produção)

```bash
npm run dev
```

#### Opção 2: Frontend + Backend de Autenticação Local

```bash
npm run dev:all
```

Isso iniciará:

- Frontend Next.js em `http://localhost:3000`
- Backend de autenticação local em `http://localhost:3001`

### 6. Acesse no navegador

Abra [http://localhost:3000](http://localhost:3000) para visualizar o site.

### 7. Páginas principais disponíveis

- `/` - Redireciona para registro
- `/registro` - Cadastro de usuários
- `/login` - Login
- `/Home` - Feed principal
- `/Perfil` - Perfil do usuário
- `/perfil-edit` - Edição de perfil
- `/Chat` - Mensagens
- `/eventos` - Lista de eventos
- `/eventos/criar` - Criar novo evento
- `/albums` - Galeria de álbuns
- `/Faq` - Perguntas frequentes
- `/sobre` - Sobre o projeto
- `/privacidade` - Política de privacidade
- `/termos` - Termos de uso
- `/arquitetura-informacao` - Documentação da arquitetura da informação

---

## 📡 API Endpoints

### Backend Principal (Autenticação)

```
POST   /api/auth/register  - Registrar novo usuário
POST   /api/auth/login     - Fazer login
GET    /api/auth/me        - Obter perfil autenticado (requer token)
POST   /api/messages       - Enviar mensagem
GET    /api/messages       - Listar mensagens
POST   /api/denuncia       - Criar denúncia
```

### Backend de Eventos

```
GET    /api/events         - Listar todos os eventos
GET    /api/events/:id     - Obter evento específico
POST   /api/events         - Criar novo evento
PUT    /api/events/:id     - Atualizar evento
DELETE /api/events/:id     - Deletar evento
```

### Backend de Perfil

```
GET    /api/profile/me           - Obter perfil autenticado
PUT    /api/profile/me           - Atualizar perfil
POST   /api/profile/me/photo     - Upload foto de perfil
GET    /api/profile/:userId      - Obter perfil por ID
GET    /api/albums               - Listar álbuns
POST   /api/albums               - Criar álbum
GET    /api/albums/:id           - Obter álbum específico
DELETE /api/albums/:id           - Deletar álbum
```

---

## 🎨 Funcionalidades Implementadas

### ✅ Autenticação e Autorização

- Registro de usuários com validação
- Login com JWT token
- Proteção de rotas privadas
- Logout e gerenciamento de sessão

### ✅ Feed Social

- Publicação de posts com texto e imagens
- Sistema de curtidas e comentários
- Compartilhamento de publicações
- Feed personalizado

### ✅ Perfil de Usuário

- Visualização de perfil próprio e de outros usuários
- Edição de informações pessoais
- Upload de foto de perfil
- Bio, localização, contatos
- Lista de pets cadastrados

### ✅ Álbuns de Fotos

- Criação de álbuns temáticos
- Upload múltiplo de fotos
- Visualização em galeria
- Gerenciamento (editar/excluir)

### ✅ Eventos e Campanhas

- Listagem de eventos
- Criação de eventos de adoção
- Detalhes completos de eventos
- Sistema de participação

### ✅ Chat e Mensagens

- Mensagens diretas entre usuários
- Lista de conversas
- Histórico de mensagens
- Notificações

### ✅ Acessibilidade (WCAG 2.1 AA)

- Skip links para navegação
- Contraste de cores adequado
- Navegação por teclado
- ARIA labels e roles
- Textos alternativos em imagens
- Responsividade mobile-first

### ✅ Documentação

- Arquitetura da Informação (Card Sorting, Wireframes, etc)
- README completo
- Documentação de integração de microsserviços

---

## 📁 Estrutura do Projeto

```
pet-joyful/
├── public/
│   └── assets/              # Imagens e recursos estáticos
├── src/
│   ├── app/
│   │   ├── api/             # API Routes do Next.js
│   │   │   ├── login/
│   │   │   ├── registro/
│   │   │   ├── eventos/
│   │   │   └── posts/
│   │   ├── components/      # Componentes React
│   │   │   ├── auth/        # Login, Registro
│   │   │   ├── common/      # Header, Footer
│   │   │   ├── posts/       # Posts, Comments
│   │   │   ├── profile/     # Perfil, Edição
│   │   │   ├── albums/      # Álbuns
│   │   │   └── chat/        # Chat
│   │   ├── Home/            # Página inicial
│   │   ├── Perfil/          # Perfil do usuário
│   │   ├── perfil-edit/     # Edição de perfil
│   │   ├── Chat/            # Mensagens
│   │   ├── eventos/         # Eventos
│   │   ├── albums/          # Álbuns
│   │   ├── login/           # Login
│   │   ├── registro/        # Registro
│   │   ├── arquitetura-informacao/  # Documentação AI
│   │   ├── Faq/             # FAQ
│   │   ├── sobre/           # Sobre
│   │   ├── privacidade/     # Privacidade
│   │   ├── termos/          # Termos de uso
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Página raiz
│   │   └── globals.css      # Estilos globais
│   ├── services/            # Serviços de API
│   │   ├── api.ts           # API de eventos
│   │   ├── profileApi.ts    # API de perfil
│   │   ├── albumApi.ts      # API de álbuns
│   │   └── postService.ts   # API de posts
│   ├── schema/              # Schemas de validação
│   │   ├── loginschema.ts
│   │   └── registroschema.ts
│   └── types/               # Tipos TypeScript
│       ├── index.ts
│       └── album.types.ts
├── authserver.js            # Servidor de autenticação local
├── package.json             # Dependências
├── next.config.ts           # Configuração Next.js
├── tsconfig.json            # Configuração TypeScript
├── tailwind.config.ts       # Configuração Tailwind
└── .env.local              # Variáveis de ambiente (criar)
```

---

## 🔒 Segurança

- ✅ JWT tokens para autenticação
- ✅ Hash de senhas com bcrypt
- ✅ Validação de inputs (Formik + Yup)
- ✅ Proteção CORS configurada
- ✅ Sanitização de dados
- ✅ Tokens armazenados em localStorage (considerar cookies HTTP-only para produção)

---

## 🐛 Troubleshooting

### Erro: "Module not found"

```bash
npm install
```

### Erro: "Cannot connect to backend"

Verifique se as URLs dos backends em `.env.local` estão corretas:

```bash
# Teste as URLs no navegador ou Postman
https://pet-joyful-backend-1.onrender.com/health
https://pet-joyful-events-service.onrender.com/api/events
```

### Erro: "Port 3000 already in use"

```bash
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou use outra porta
npm run dev -- -p 3001
```

### Problemas com autenticação

Limpe o localStorage e faça login novamente:

```javascript
// No console do navegador
localStorage.clear();
```

---

## 👥 Equipe de Desenvolvimento

**Fatec - Projeto Integrador 2024/2025**

- **Repositório Principal:** [Pet-Joyful---Projeto-Integrador--NextJs](https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs)
- **Organização:** Fatec São Paulo

---

## 📝 Documentação Adicional

- [Integração de Backends](./pet-joyful/INTEGRACAO_BACKENDS.md)
- [Microserviço de Perfil](./pet-joyful/PROFILE_MICROSERVICE_INTEGRATION.md)
- [Sistema de Álbuns](./SISTEMA_ALBUNS.md)
- [Análise de Acessibilidade](./ANALISE_ACESSIBILIDADE_USABILIDADE.md)
- [Fluxo de Registro](./pet-joyful/FLUXO_REGISTRO.md)
- [Solução de Autenticação](./pet-joyful/SOLUCAO_AUTENTICACAO.md)

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do Projeto Integrador da Fatec.

---

## 🐾 Conectando Corações e Patas

**Pet-Joyful** - Promovendo adoção responsável e cuidados com animais através da tecnologia.

---
