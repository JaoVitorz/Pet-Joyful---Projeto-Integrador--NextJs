# 🐾 Pet-Joyful — Projeto Integrador Fatec

**Pet-Joyful** é uma rede social voltada à conexão entre instituições de adoção, adotantes e clínicas veterinárias. Nosso foco é a conscientização sobre cuidados com animais, vacinação e o incentivo à adoção responsável.

A plataforma facilita o acesso a informações, promove campanhas e eventos como forma de publicação para adoção, criando uma comunidade engajada com a causa animal.

---

## 🚀 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Bootstrap](https://getbootstrap.com/)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Formik](https://formik.org/)
- [Yup](https://www.npmjs.com/package/yup)

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

🐳 Docker (Frontend)
Este projeto utiliza Docker para garantir que o ambiente de execução seja idêntico em qualquer máquina, evitando problemas como “na minha máquina funciona”.
Foi adotado o padrão Multi-stage Build com Node.js 20, resultando em uma imagem otimizada e leve.
---
🛠️ Pré-requisitos
Antes de começar, você precisa ter instalado:
Docker
Docker Compose (opcional, mas recomendado)
---
🚀 Comandos Úteis
🔨 1. Construir a imagem (Build)
Para gerar a imagem localmente a partir da raiz do projeto:
```bash
docker build -t pet-joyful-frontend:latest .
```
---
▶️ 2. Executar o container
Para rodar o frontend na porta 3000:
```bash
docker run -p 3000:3000 --name pet-joyful-app pet-joyful-frontend:latest
```
Após executar, acesse:
👉 http://localhost:3000
---
⏹️ 3. Parar e remover o container
```bash
# Parar o container
docker stop pet-joyful-app

# Remover o container (necessário para recriar)
docker rm pet-joyful-app
```
---
📦 4. Verificar imagens criadas
```bash
docker images
```
---
⚙️ Estrutura no Docker (Standalone)
A aplicação foi configurada utilizando o modo standalone do Next.js, o que traz as seguintes vantagens:
📉 Imagem final extremamente leve (apenas o essencial)
🚫 Não depende de todas as `node_modules`
⚡ Arquivos estáticos servidos por um servidor Node otimizado
---
🤖 CI/CD com GitHub Actions
O arquivo:
```
.github/workflows/ci.yml
```
automatiza todo o processo de integração contínua.
🔁 Etapas automatizadas:
Linting  
Verificação de qualidade de código e acessibilidade
Build Test  
Validação da compilação do Next.js
Docker Build  
Geração automática da imagem a cada push na branch `main`
