# 🔧 Troubleshooting - Erro 404 ao Criar Evento

## Passo a Passo para Resolver

### 1️⃣ Verifique se o Backend está Rodando

Abra um terminal e verifique se o backend PET-JOYFUL-EVENTS-SERVICE está rodando:

```bash
# Verifique se há um processo na porta 3002
# Windows PowerShell:
netstat -ano | findstr :3002

# Ou tente acessar diretamente no navegador:
# http://localhost:3002
```

**Se o backend não estiver rodando:**
- Inicie o backend PET-JOYFUL-EVENTS-SERVICE
- Verifique em qual porta ele está rodando

### 2️⃣ Verifique a Configuração do .env.local

Crie ou edite o arquivo `.env.local` na raiz do projeto `pet-joyful/`:

```env
# URL do backend (ajuste a porta se necessário)
NEXT_PUBLIC_EVENTS_API_URL=http://localhost:3002
EVENTOS_API_URL=http://localhost:3002

# IMPORTANTE: Verifique qual estrutura o backend usa
# Opção 1: Se o backend usa /api/eventos
NEXT_PUBLIC_API_PREFIX=/api

# Opção 2: Se o backend usa apenas /eventos (sem /api)
# NEXT_PUBLIC_API_PREFIX=""
```

### 3️⃣ Descubra Qual Estrutura o Backend Usa

**Opção A - Verificar no código do backend:**
- Procure pelas rotas definidas no backend
- Veja se as rotas são `/api/eventos` ou apenas `/eventos`

**Opção B - Testar manualmente:**
```bash
# Teste 1: Tente com /api/eventos
curl -X POST http://localhost:3002/api/eventos \
  -H "Content-Type: application/json" \
  -d '{"title":"Teste"}'

# Teste 2: Tente com apenas /eventos
curl -X POST http://localhost:3002/eventos \
  -H "Content-Type: application/json" \
  -d '{"title":"Teste"}'
```

O que funcionar é a estrutura correta!

### 4️⃣ Verifique os Logs do Console

Ao tentar criar um evento, abra o **Console do Navegador** (F12) e procure por:

```
[eventService] POST /api/eventos
[eventService] URL completa: http://localhost:3002/api/eventos
```

**Se aparecer erro 404:**
- A URL mostrada é a que está sendo tentada
- Compare com a estrutura real do backend
- Ajuste o `NEXT_PUBLIC_API_PREFIX` no `.env.local`

### 5️⃣ Reinicie o Servidor Next.js

Após alterar o `.env.local`, **sempre reinicie** o servidor:

```bash
# Pare o servidor (Ctrl+C)
# Depois inicie novamente:
npm run dev
```

### 6️⃣ Verifique CORS (se necessário)

Se o erro for de CORS, configure no backend para aceitar requisições do frontend:

```javascript
// No backend, adicione:
app.use(cors({
  origin: 'http://localhost:3000', // URL do frontend Next.js
  credentials: true
}));
```

## 📋 Checklist Rápido

- [ ] Backend está rodando na porta correta?
- [ ] Arquivo `.env.local` existe e está configurado?
- [ ] `NEXT_PUBLIC_API_PREFIX` está correto?
- [ ] Servidor Next.js foi reiniciado após alterar `.env.local`?
- [ ] Console do navegador mostra a URL correta?
- [ ] Backend tem CORS configurado?

## 🆘 Ainda com Problemas?

1. **Copie a mensagem de erro completa** do console
2. **Verifique qual URL está sendo tentada** (aparece nos logs)
3. **Teste a URL manualmente** com curl ou Postman
4. **Compare** com as rotas definidas no backend

## 💡 Exemplo de Configuração Correta

**Cenário 1: Backend usa `/api/eventos`**
```env
NEXT_PUBLIC_EVENTS_API_URL=http://localhost:3002
NEXT_PUBLIC_API_PREFIX=/api
```

**Cenário 2: Backend usa apenas `/eventos`**
```env
NEXT_PUBLIC_EVENTS_API_URL=http://localhost:3002
NEXT_PUBLIC_API_PREFIX=""
```

**Cenário 3: Backend em outra porta**
```env
NEXT_PUBLIC_EVENTS_API_URL=http://localhost:3003
NEXT_PUBLIC_API_PREFIX=/api
```

