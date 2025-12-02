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

- Node.js (versão 18 ou superior)
- npm (vem junto com o Node.js)
- Git (opcional, mas recomendado)

### 2. Clone o repositório

```bash
git clone https://github.com/davidagj/Pet-Joyful---Projeto-Integrador--NextJs

cd Pet-Joyful---Projeto-Integrador--NextJs
cd pet-joyful
```

### 3. **Instale as dependências principais**:

```bash
npm install
npm install next react react-dom axios formik yup bootstrap react-icons express typescript
npm install concurrently --save-dev

```

### 4. **Execute o projeto em modo de desenvolvimento** :

```bash
npm run dev
npm run dev:all #para executar o projeto em modo de desenvolvimento e com servidor express com as APIs e retorno estatico
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

### 5. **Acesse no navegador**

Abra [http://localhost:3000](http://localhost:3000) para visualizar o site.

---

**Dicas:**

- Se aparecer algum erro de dependência, rode novamente `npm install`.
- Para parar o servidor, pressione `Ctrl + C` no terminal.

```

```
