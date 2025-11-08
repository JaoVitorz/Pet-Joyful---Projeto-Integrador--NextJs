# 📝 Fluxo de Registro - Como os Dados são Salvos

## ✅ Sim, seus dados serão salvos no banco de dados!

Quando você faz o registro, o fluxo completo é:

## 🔄 Fluxo Completo

### 1. **Frontend (Formulário de Registro)**

```
Usuário preenche o formulário
  ↓
Dados coletados: nome, email, senha, tipo, cpf/cnpj, crmv (se veterinário)
  ↓
Enviados para: /api/registro (rota Next.js)
```

### 2. **Rota Next.js (`/api/registro/route.ts`)**

```
Recebe os dados do formulário
  ↓
Envia para o Backend Principal:
POST https://pet-joyful-backend-1.onrender.com/api/auth/register
  ↓
Body enviado:
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "tipo": "adotante",
  "cpf": "12345678900" (ou "cnpj" se ONG, ou "crmv" se veterinário)
}
```

### 3. **Backend Principal (Produção)**

```
Recebe os dados em /api/auth/register
  ↓
Valida os dados
  ↓
Criptografa a senha (bcrypt)
  ↓
Salva no MongoDB (banco de dados)
  ↓
Gera token JWT
  ↓
Retorna: { token, user, message }
```

### 4. **Frontend (Resposta)**

```
Recebe o token e dados do usuário
  ↓
Salva token no localStorage
  ↓
Redireciona para /Home
```

## 💾 Dados Salvos no MongoDB

O backend salva no banco de dados MongoDB:

```javascript
{
  _id: ObjectId("..."),
  nome: "João Silva",
  email: "joao@email.com",
  senha: "$2a$10$...", // Senha criptografada com bcrypt
  tipo: "adotante", // ou "ong", "veterinario"
  cpf: "12345678900", // Se adotante
  // ou
  cnpj: "12345678000190", // Se ONG
  // ou
  crmv: "12345", // Se veterinário
  createdAt: ISODate("2025-01-08T..."),
  updatedAt: ISODate("2025-01-08T...")
}
```

## 🔍 Como Verificar se Foi Salvo

### Opção 1: Verificar no Console do Navegador

Após o registro, abra o Console (F12) e você verá:

```
[API Registro] Dados recebidos: { nome: "...", email: "...", tipo: "..." }
✅ Token salvo no localStorage após registro
```

### Opção 2: Verificar o Token

No Console do navegador, digite:

```javascript
localStorage.getItem("token");
```

Se retornar um token (string longa), significa que:

- ✅ O registro foi bem-sucedido
- ✅ O usuário foi criado no banco de dados
- ✅ O token JWT foi gerado

### Opção 3: Tentar Fazer Login

Se conseguir fazer login com as mesmas credenciais, confirma que:

- ✅ Os dados foram salvos no banco
- ✅ A senha foi criptografada corretamente
- ✅ O usuário existe no sistema

## 📋 Dados Enviados no Registro

O formulário envia os seguintes dados:

### Para Adotante:

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "tipo": "adotante",
  "cpf": "12345678900"
}
```

### Para ONG:

```json
{
  "nome": "ONG Pet Feliz",
  "email": "ong@email.com",
  "senha": "senha123",
  "tipo": "ong",
  "cnpj": "12345678000190"
}
```

### Para Veterinário:

```json
{
  "nome": "Dr. João",
  "email": "vet@email.com",
  "senha": "senha123",
  "tipo": "veterinario",
  "cpf": "12345678900",
  "crmv": "12345"
}
```

## ⚠️ Validações do Backend

O backend valida:

1. **Email único:** Não pode ter dois usuários com o mesmo email
2. **Senha forte:** (conforme regras do backend)
3. **Campos obrigatórios:** nome, email, senha, tipo
4. **Formato de documentos:** CPF/CNPJ válidos

## 🔐 Segurança

- ✅ **Senha criptografada:** A senha é criptografada com bcrypt antes de salvar
- ✅ **Token JWT:** Após registro, você recebe um token JWT válido por 7 dias
- ✅ **HTTPS:** O backend em produção usa HTTPS (seguro)

## 💡 Resumo

**SIM, todos os dados do registro são salvos no banco de dados MongoDB do backend principal!**

O backend está em produção (`https://pet-joyful-backend-1.onrender.com`) e está conectado ao MongoDB Atlas (conforme visto no repositório).

Após o registro bem-sucedido:

1. ✅ Dados salvos no MongoDB
2. ✅ Token JWT gerado
3. ✅ Token salvo no localStorage
4. ✅ Usuário pode fazer login imediatamente
