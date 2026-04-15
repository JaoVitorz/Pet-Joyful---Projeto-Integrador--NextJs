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
Este projeto utiliza Docker para garantir que o ambiente de execução seja idêntico em qualquer máquina, evitando problemas de "na minha máquina funciona". Utilizamos o modo Multi-stage Build com o Node.js 20 para gerar uma imagem otimizada.

🛠️ Pré-requisitos
Docker instalado.

Docker Compose (opcional, para facilitar o processo).

🚀 Comandos Úteis
1. Construir a Imagem (Build)
Para gerar a imagem localmente a partir da raiz do repositório:

Bash
docker build -t pet-joyful-frontend:latest .
2. Executar o Container
Para rodar o frontend na porta 3000:

Bash
docker run -p 3000:3000 --name pet-joyful-app pet-joyful-frontend:latest
Após rodar, o app estará disponível em: http://localhost:3000

3. Parar e Remover o Container
Bash
# Parar a execução
docker stop pet-joyful-app

# Remover o container (para poder rodar um novo)
docker rm pet-joyful-app
4. Verificar Imagens Criadas
Bash
docker images
⚙️ Estrutura no Docker (Standalone)
A imagem foi configurada no modo standalone do Next.js. Isso significa que:

A imagem final é extremamente leve (apenas o necessário para rodar).

Não depende de um servidor completo com todas as node_modules.

Os arquivos estáticos são servidos diretamente pelo servidor Node otimizado do Next.js.

🤖 CI/CD com GitHub Actions
O arquivo .github/workflows/ci.yml automatiza esse processo:

Linting: Verifica erros de código e acessibilidade.

Build Test: Valida se o Next.js consegue compilar.

Docker Build: Gera a imagem final automaticamente a cada push na branch main.
