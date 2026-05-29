# 🐾 Pet-Joyful — Projeto Integrador Fatec

**Pet-Joyful** é uma rede social voltada à conexão entre instituições de adoção, adotantes e clínicas veterinárias. Nosso foco é a conscientização sobre cuidados com animais, vacinação e o incentivo à adoção responsável.

A plataforma facilita o acesso a informações, promove campanhas e eventos como forma de publicação para adoção, criando uma comunidade engajada com a causa animal.

---

## 🌐 Ambientes

| Ambiente | Frontend | Backend |
|---|---|---|
| 🟢 **Produção** | [pet-joyful-projeto-integrador-nextjs.onrender.com](https://pet-joyful-projeto-integrador-nextjs.onrender.com) | [pet-joyful-backend.onrender.com](https://pet-joyful-backend.onrender.com) |
| 🟡 **Homologação** | [pet-joyful-projeto-integrador-nextjs-1.onrender.com](https://pet-joyful-projeto-integrador-nextjs-1.onrender.com) | [pet-joyful-backend-hml.onrender.com](https://pet-joyful-backend-hml.onrender.com) |

---

## 📦 Repositórios & Docker Hub

| Recurso | Link |
|---|---|
| 🖥️ Repositório Frontend | [github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs](https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs) |
| ⚙️ Repositório Backend | [github.com/JaoVitorz/Pet-Joyful-Backend](https://github.com/JaoVitorz/Pet-Joyful-Backend) |
| 🐳 Docker Hub Frontend | [hub.docker.com — joaovitorjesus/pet-joyful-frontend](https://hub.docker.com/r/joaovitorjesus/pet-joyful-frontend) |
| 🐳 Docker Hub Backend | [hub.docker.com — joaovitorjesus/pet-joyful-backend](https://hub.docker.com/r/joaovitorjesus/pet-joyful-backend) |

---

## 🚀 Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Descrição |
|---|---|---|
| [Next.js](https://nextjs.org/) | 14+ | Framework React com SSR e SSG |
| [React](https://reactjs.org/) | 18+ | Biblioteca para interfaces de usuário |
| [Bootstrap](https://getbootstrap.com/) | 5+ | Framework de estilos responsivos |
| [React-Bootstrap](https://react-bootstrap.github.io/) | — | Componentes Bootstrap para React |
| [React Icons](https://react-icons.github.io/react-icons/) | — | Ícones para React |
| [Formik](https://formik.org/) | — | Gerenciamento de formulários |
| [Yup](https://www.npmjs.com/package/yup) | — | Validação de schemas |
| [Axios](https://axios-http.com/) | — | Cliente HTTP |

### Backend
| Tecnologia | Versão | Descrição |
|---|---|---|
| [Node.js](https://nodejs.org/) | 20 | Runtime JavaScript |
| [Express](https://expressjs.com/) | — | Framework web minimalista |
| [TypeScript](https://www.typescriptlang.org/) | — | Superset tipado do JavaScript |

### Infraestrutura & DevOps
| Tecnologia | Descrição |
|---|---|
| [Docker](https://www.docker.com/) | Containerização da aplicação (Multi-stage Build) |
| [Docker Hub](https://hub.docker.com/) | Registro de imagens Docker |
| [GitHub Actions](https://github.com/features/actions) | CI/CD automatizado |
| [Render](https://render.com/) | Plataforma de deploy em nuvem (HML e PROD) |
| [SonarCloud](https://sonarcloud.io/) | Análise de qualidade e segurança de código |
| [BetterStack](https://betterstack.com/) | Logs, métricas e monitoramento |
| [npm](https://www.npmjs.com/) | Gerenciador de pacotes |
| [semver](https://semver.org/) | Versionamento semântico automático via Actions |

---

## 🛠️ Como executar o projeto localmente

### 1. Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (vem junto com o Node.js)
- Git

### 2. Clone o repositório

```bash
git clone https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs
cd Pet-Joyful---Projeto-Integrador--NextJs/pet-joyful
```

### 3. Instale as dependências

```bash
npm install
npm install next react react-dom axios formik yup bootstrap react-icons express typescript
npm install concurrently --save-dev
```

### 4. Execute o projeto em modo de desenvolvimento

```bash
npm run dev
# ou para rodar com o servidor Express (APIs estáticas):
npm run dev:all
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

> **Dicas:**
> - Se aparecer algum erro de dependência, rode novamente `npm install`.
> - Para parar o servidor, pressione `Ctrl + C` no terminal.

---

## 🐳 Docker

Este projeto utiliza Docker com **Multi-stage Build** (Node.js 20 Alpine), gerando uma imagem otimizada e leve via modo `standalone` do Next.js.

### Build da imagem

```bash
docker build -t pet-joyful-frontend:latest ./pet-joyful
```

### Executar o container

```bash
docker run -p 3000:3000 --name pet-joyful-app pet-joyful-frontend:latest
```

Acesse em: [http://localhost:3000](http://localhost:3000)

### Parar e remover o container

```bash
docker stop pet-joyful-app
docker rm pet-joyful-app
```

### Verificar imagens

```bash
docker images
```

### Vantagens do modo Standalone (Next.js)

- Imagem final extremamente leve (apenas o essencial)
- Não depende de todas as `node_modules`
- Arquivos estáticos servidos por um servidor Node otimizado

---

## 🤖 CI/CD — GitHub Actions

O pipeline está definido em `.github/workflows/ci.yml` e é acionado a cada push nas branches `main` e `develop`.

### Etapas automatizadas

```
Push → Build → Testes → Versionamento Semântico (semver)
     → Criação de Tag → SonarCloud → Build Docker → Push Docker Hub
     → Deploy HML (develop/main) → Deploy PROD (main)
     → Notificação por e-mail (sucesso ou falha)
```

### Estratégia de versionamento

O pipeline calcula automaticamente a versão com base nos commits seguindo [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo do commit | Bump |
|---|---|
| `feat!:` / `BREAKING CHANGE` | `major` |
| `feat:` | `minor` |
| qualquer outro | `patch` |

### Secrets necessários

| Secret | Descrição |
|---|---|
| `DOCKERHUB_USERNAME` | Usuário do Docker Hub |
| `DOCKER_PASSWORD` | Senha do Docker Hub |
| `RENDER_API_KEY` | Chave da API do Render |
| `SONAR_TOKEN` | Token do SonarCloud |
| `EMAIL_USERNAME` | E-mail para notificações |
| `EMAIL_PASSWORD` | Senha do e-mail |

---

## 📊 Monitoramento — BetterStack

O projeto utiliza **BetterStack** para:

- Coleta centralizada de **logs** da aplicação
- **Métricas** de performance e disponibilidade
- **Notificações** e alertas em tempo real

Os tokens de integração são gerenciados via GitHub Secrets (`Secrets API HML/PROD - BetterStack`).

---

## 🔍 Qualidade de Código — SonarCloud

Configuração em `sonar-project.properties`:

```properties
sonar.projectKey=pet-joyful---projeto-integrador-nextjs
sonar.organization=jaovitorz
sonar.sources=pet-joyful
sonar.exclusions=**/*.test.ts,**/__tests__/**,**/node_modules/**,**/dist/**
```

Análise executada automaticamente em cada pipeline via `SonarSource/sonarcloud-github-action@v2`.

---

## 🌿 Estratégia de Branches

```
main      → deploy automático em PRODUÇÃO
develop   → deploy automático em HOMOLOGAÇÃO
feature/* → branches de desenvolvimento de funcionalidades
```

---

## 👥 Equipe — Pet-Joyful

| Nome | GitHub |
|---|---|
| João Vitor | [@JaoVitorz](https://github.com/JaoVitorz) |
  Caio Fernando Scudeler
  Nicolas mencacci Pereira
  Mateus alves
  Elton Costa

---

