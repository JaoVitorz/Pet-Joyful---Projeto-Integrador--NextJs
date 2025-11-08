# Integração com Backends Pet-Joyful

Este documento descreve como configurar a integração do frontend Next.js com os backends do projeto Pet-Joyful.

**📚 Para documentação completa dos dois backends, veja:** [INTEGRACAO_BACKENDS.md](./INTEGRACAO_BACKENDS.md)

## 🏗️ Arquitetura

O projeto utiliza **microsserviços** com dois backends:

1. **Backend Principal** - Autenticação, Mensagens, Denúncias

   - URL Produção: `https://pet-joyful-backend-1.onrender.com`
   - Repositório: [Pet-Joyful-Backend](https://github.com/JaoVitorz/Pet-Joyful-Backend)

2. **Backend de Eventos** - Microserviço de Eventos
   - URL Local: `http://localhost:3002`

## Configuração de Variáveis de Ambiente

1. **Crie um arquivo `.env.local`** na raiz do projeto `pet-joyful/`:

```env
# Backend PET-JOYFUL-EVENTS-SERVICE
# URL do serviço de eventos (backend)
NEXT_PUBLIC_EVENTS_API_URL=http://localhost:3002
EVENTOS_API_URL=http://localhost:3002

# Prefixo da API (opcional)
# Se o backend usar apenas /eventos (sem /api), defina como vazio: NEXT_PUBLIC_API_PREFIX=""
# Se o backend usar /api/eventos, deixe como padrão ou defina: NEXT_PUBLIC_API_PREFIX="/api"
NEXT_PUBLIC_API_PREFIX=/api

# Backend de Autenticação (se diferente)
NEXT_PUBLIC_AUTH_API_URL=http://localhost:3001

# Ambiente
NODE_ENV=development
```

2. **Ajuste as URLs** conforme necessário:
   - Se o backend estiver rodando em outra porta, altere `NEXT_PUBLIC_EVENTS_API_URL`
   - Se o backend estiver em outro servidor, use a URL completa (ex: `http://seu-servidor:3002`)
   - **Importante**: Se o backend usar apenas `/eventos` (sem o prefixo `/api`), defina `NEXT_PUBLIC_API_PREFIX=""` no `.env.local`

## Estrutura da Integração

### Arquivos de Configuração da API

1. **`src/services/api.ts`** - Cliente Axios principal

   - Base URL: `NEXT_PUBLIC_EVENTS_API_URL` (padrão: `http://localhost:3002`)
   - Inclui interceptores para autenticação JWT
   - Tratamento de erros 401

2. **`src/app/services/api.js`** - Cliente Axios específico para eventos

   - Usa a mesma configuração de base URL
   - Interceptores para autenticação e tratamento de erros

3. **`src/app/services/eventService.js`** - Serviço de eventos
   - Métodos: `create`, `getEvents`, `getEventById`, `updateEvent`, `deleteEvent`
   - Endpoints: `/api/eventos`

### Endpoints do Backend

O frontend espera os seguintes endpoints no backend (o prefixo `/api` pode ser configurado):

- `GET {PREFIX}/eventos` - Listar eventos (com query params para filtros)
- `GET {PREFIX}/eventos/:id` - Buscar evento por ID
- `POST {PREFIX}/eventos` - Criar novo evento
- `PUT {PREFIX}/eventos/:id` - Atualizar evento
- `DELETE {PREFIX}/eventos/:id` - Deletar evento

Onde `{PREFIX}` é o valor de `NEXT_PUBLIC_API_PREFIX` (padrão: `/api`).

**Exemplos:**

- Se `NEXT_PUBLIC_API_PREFIX=/api`: endpoints serão `/api/eventos`, `/api/eventos/:id`, etc.
- Se `NEXT_PUBLIC_API_PREFIX=""`: endpoints serão `/eventos`, `/eventos/:id`, etc.

### Autenticação

O frontend envia o token JWT no header `Authorization`:

```
Authorization: Bearer <token>
```

O token é obtido do `localStorage` e adicionado automaticamente pelos interceptores do Axios.

## Como Testar a Integração

1. **Certifique-se de que o backend está rodando:**

   ```bash
   # No diretório do backend PET-JOYFUL-EVENTS-SERVICE
   npm start
   # ou
   node server.js
   ```

2. **Inicie o frontend:**

   ```bash
   # No diretório pet-joyful
   npm run dev
   ```

3. **Verifique os logs:**
   - Os logs do console mostrarão as requisições sendo feitas
   - Verifique se as URLs estão corretas nos logs

## Troubleshooting

### Erro: "Erro ao conectar com o serviço de eventos"

- Verifique se o backend está rodando
- Verifique se a URL no `.env.local` está correta
- Verifique se não há problemas de CORS no backend

### Erro: "401 Unauthorized"

- Verifique se o token JWT está sendo enviado corretamente
- Verifique se o token não expirou
- Faça login novamente se necessário

### Erro: "CORS policy"

- Configure o CORS no backend para aceitar requisições do frontend
- Adicione a URL do frontend nas origens permitidas do backend

### Erro: "Rota não encontrada" (404)

- Verifique se o backend está rodando na porta correta
- Verifique se o prefixo da API está correto:
  - Se o backend usa `/api/eventos`, deixe `NEXT_PUBLIC_API_PREFIX=/api` (padrão)
  - Se o backend usa apenas `/eventos`, defina `NEXT_PUBLIC_API_PREFIX=""` no `.env.local`
- Verifique os logs do console do navegador para ver a URL exata que está sendo tentada
- Verifique se o backend tem as rotas configuradas corretamente

## Notas Importantes

- Variáveis com prefixo `NEXT_PUBLIC_` são expostas ao cliente (browser)
- Variáveis sem esse prefixo são apenas do servidor (server-side)
- O arquivo `.env.local` não deve ser commitado no Git (já está no .gitignore)
- Use `.env.example` como template para outros desenvolvedores
