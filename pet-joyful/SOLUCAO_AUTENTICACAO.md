# 🔐 Solução: Erro "Não autorizado" ao Criar Evento

## ✅ O que foi corrigido:

1. **Rota de Login** agora chama o backend de autenticação (porta 3001)
2. **Token JWT** é salvo automaticamente no `localStorage` após login
3. **Token** é enviado automaticamente em todas as requisições para o backend de eventos

## 📋 Passo a Passo para Resolver:

### 1. Certifique-se de que os backends estão rodando:

**Backend de Autenticação (porta 3001):**

```bash
# No diretório do authserver.js
node authserver.js
# ou
npm run auth-server
```

**Backend de Eventos (porta 3002):**

```bash
# No diretório PET-JOYFUL-EVENTS-SERVICE
npm run dev
```

### 2. Faça Login Novamente:

1. Acesse a página de login: `http://localhost:3000/login`
2. Use as credenciais do backend de autenticação:
   - **Email:** `admin@example.com`
   - **Senha:** `senha123`
3. Após o login, o token será salvo automaticamente

### 3. Verifique se o Token foi Salvo:

Abra o **Console do Navegador** (F12) e digite:

```javascript
localStorage.getItem("token");
```

Se aparecer um token (string longa), está tudo certo! ✅

### 4. Tente Criar um Evento Novamente:

Agora o token será enviado automaticamente e você não deve mais receber o erro "Não autorizado".

## 🔍 Como Verificar se Está Funcionando:

### No Console do Navegador, você verá:

**Ao fazer login:**

```
✅ Token salvo no localStorage
```

**Ao criar evento:**

```
[API] Token JWT adicionado ao header para: POST /api/events
[eventService] POST /api/events
✅ Resposta da API: {...}
```

**Se não houver token:**

```
[API] ⚠️ Nenhum token encontrado no localStorage para: POST /api/events
```

## ⚠️ Se Ainda Não Funcionar:

### Verifique:

1. **Backend de autenticação está rodando?**

   - Acesse: `http://localhost:3001/api/login`
   - Deve retornar erro de método (não 404)

2. **Token está no localStorage?**

   - Console: `localStorage.getItem('token')`
   - Se for `null`, faça login novamente

3. **Token expirou?**

   - Tokens expiram em 1 hora
   - Faça login novamente se necessário

4. **Backend de eventos está validando o token?**
   - Verifique se o backend está usando o mesmo `JWT_SECRET`
   - Verifique os logs do backend ao tentar criar evento

## 🛠️ Configuração do .env.local (Opcional):

Se quiser configurar explicitamente:

```env
# Backend de Autenticação
NEXT_PUBLIC_AUTH_API_URL=http://localhost:3001

# Backend de Eventos
NEXT_PUBLIC_EVENTS_API_URL=http://localhost:3002
NEXT_PUBLIC_API_PREFIX=/api
NEXT_PUBLIC_API_ENDPOINT=events
```

## 💡 Dica:

Se você fechou o navegador ou passou mais de 1 hora desde o login, o token pode ter expirado. Basta fazer login novamente!
