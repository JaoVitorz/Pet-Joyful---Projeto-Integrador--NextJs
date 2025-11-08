# 🔗 Integração com Backends Pet-Joyful

Este documento descreve a integração do frontend com os **dois backends** do projeto Pet-Joyful.

## 📋 Arquitetura de Microsserviços

O projeto utiliza uma arquitetura de **microsserviços** com dois backends separados:

### 1. **Backend Principal** (Autenticação, Mensagens, Denúncias)
- **Repositório:** [Pet-Joyful-Backend](https://github.com/JaoVitorz/Pet-Joyful-Backend)
- **URL Produção:** `https://pet-joyful-backend-1.onrender.com`
- **URL Local:** `http://localhost:3001` (se rodando localmente)
- **Endpoints:**
  - `/api/auth/register` - Registro de usuário
  - `/api/auth/login` - Login
  - `/api/auth/me` - Perfil do usuário (requer Bearer Token)
  - `/api/messages/*` - Mensagens
  - `/api/messages/denuncia` - Denúncias

### 2. **Backend de Eventos** (Microserviço de Eventos)
- **Serviço:** PET-JOYFUL-EVENTS-SERVICE
- **URL Local:** `http://localhost:3002`
- **Endpoints:**
  - `/api/events` - CRUD de eventos
  - `/api/events/:id` - Evento específico

## 🔧 Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto `pet-joyful/`:

```env
# Backend Principal (Autenticação, Mensagens, Denúncias)
NEXT_PUBLIC_AUTH_API_URL=https://pet-joyful-backend-1.onrender.com
# Para desenvolvimento local (se rodar o backend localmente):
# NEXT_PUBLIC_AUTH_API_URL=http://localhost:3001

# Backend de Eventos (Microserviço)
NEXT_PUBLIC_EVENTS_API_URL=http://localhost:3002
EVENTOS_API_URL=http://localhost:3002

# Configuração de Endpoints
NEXT_PUBLIC_API_PREFIX=/api
NEXT_PUBLIC_API_ENDPOINT=events

# Ambiente
NODE_ENV=development
```

## 📡 Endpoints do Backend Principal

### Autenticação

#### POST `/api/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "tipo": "adotante" // opcional: "adotante", "veterinario", "ong"
}
```

**Resposta:**
```json
{
  "token": "jwt_token_aqui",
  "user": {
    "id": "...",
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "adotante"
  },
  "message": "Usuário registrado com sucesso"
}
```

#### POST `/api/auth/login`
Faz login do usuário.

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "token": "jwt_token_aqui",
  "user": {
    "id": "...",
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "adotante"
  },
  "message": "Login bem-sucedido"
}
```

#### GET `/api/auth/me`
Obtém o perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "user": {
    "id": "...",
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "adotante"
  }
}
```

### Mensagens

- `POST /api/messages/post` - Criar mensagem em um post
- `GET /api/messages/post/:postId` - Listar mensagens de um post
- `PUT /api/messages/:id` - Atualizar mensagem (requer Admin Key)
- `DELETE /api/messages/:id` - Deletar mensagem (requer Admin Key)

### Denúncias

- `POST /api/messages/denuncia` - Criar denúncia
- `GET /api/messages/denuncia` - Listar denúncias (requer Admin Key)
- `PUT /api/messages/denuncia/:id` - Atualizar denúncia (requer Admin Key)
- `DELETE /api/messages/denuncia/:id` - Deletar denúncia (requer Admin Key)

## 📡 Endpoints do Backend de Eventos

### Eventos

- `GET /api/events` - Listar eventos (com query params para filtros)
- `GET /api/events/:id` - Buscar evento por ID
- `POST /api/events` - Criar novo evento (requer Bearer Token)
- `PUT /api/events/:id` - Atualizar evento (requer Bearer Token)
- `DELETE /api/events/:id` - Deletar evento (requer Bearer Token)

## 🔐 Autenticação

### Bearer Token (JWT)

O frontend envia o token JWT no header `Authorization`:

```
Authorization: Bearer {token}
```

O token é:
- Obtido após login/registro
- Salvo no `localStorage` com a chave `"token"`
- Adicionado automaticamente pelos interceptores do Axios
- Válido por 7 dias (conforme backend)

### Admin Key (Operações Administrativas)

Para operações administrativas, o backend aceita:

```
x-admin-key: {admin_key_from_env}
```

**Nota:** O middleware `ensureAuth` aceita tanto Bearer Token quanto Admin Key.

## 📁 Estrutura de Arquivos no Frontend

### Autenticação

- `src/app/api/login/route.ts` - Rota Next.js para login
- `src/app/api/registro/route.ts` - Rota Next.js para registro
- `src/app/api/authapi.ts` - Cliente Axios para autenticação

### Eventos

- `src/services/api.ts` - Cliente Axios principal (eventos)
- `src/app/services/eventService.js` - Serviço de eventos
- `src/app/api/eventos/route.ts` - Rota Next.js para eventos

## 🚀 Como Testar

### 1. Backend Principal (Produção)

O backend principal está em produção, então você pode usar diretamente:

```bash
# Não precisa rodar localmente, use a URL de produção
NEXT_PUBLIC_AUTH_API_URL=https://pet-joyful-backend-1.onrender.com
```

### 2. Backend de Eventos (Local)

```bash
# No diretório PET-JOYFUL-EVENTS-SERVICE
npm run dev
```

### 3. Frontend

```bash
# No diretório pet-joyful
npm run dev
```

## 🔍 Troubleshooting

### Erro: "401 Unauthorized"

- Verifique se fez login e o token está salvo no `localStorage`
- Verifique se o token não expirou (válido por 7 dias)
- Faça login novamente se necessário

### Erro: "Rota não encontrada" (404)

- Verifique se a URL do backend está correta
- Verifique se o endpoint existe no backend
- Verifique os logs do console para ver a URL tentada

### Erro: "CORS policy"

- O backend de produção já está configurado para aceitar requisições
- Se rodar localmente, configure CORS no backend

## 📚 Documentação Adicional

- **Backend Principal:** [GitHub Repository](https://github.com/JaoVitorz/Pet-Joyful-Backend)
- **Swagger Docs:** `https://pet-joyful-backend-1.onrender.com/api-docs`
- **Backend de Eventos:** Ver documentação do microserviço

## 💡 Notas Importantes

1. **Token JWT:** O token obtido no login/registro funciona para **ambos os backends** se usarem o mesmo `JWT_SECRET`
2. **Formato de Dados:** O backend principal usa campos em português (`nome`, `senha`, `tipo`)
3. **Produção vs Local:** O backend principal está em produção, mas você pode rodar localmente se necessário
4. **Admin Key:** Para operações administrativas, você pode usar a Admin Key em vez do Bearer Token

