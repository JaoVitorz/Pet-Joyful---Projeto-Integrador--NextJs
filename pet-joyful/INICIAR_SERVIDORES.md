# 🚀 Como Iniciar os Servidores

## ⚠️ Problema: "Missing script: auth-server"

Se você está recebendo esse erro, siga estes passos:

### 1. Verifique se está no diretório correto

Você **DEVE** estar no diretório `pet-joyful`:

```bash
# Windows PowerShell
cd "C:\Users\João\OneDrive\Área de Trabalho\PI SITE\front\Pet-Joyful---Projeto-Integrador--NextJs-1\pet-joyful"

# Verifique se está no lugar certo
pwd
# ou
Get-Location
```

### 2. Limpe o cache do npm e reinstale

```bash
# Limpar cache
npm cache clean --force

# Reinstalar dependências
npm install
```

### 3. Verifique se o script existe

```bash
# Ver todos os scripts disponíveis
npm run

# Ou abra o package.json e verifique se a linha 11 tem:
# "auth-server": "node authserver.js"
```

## ✅ Formas de Iniciar o Servidor de Autenticação

### Opção 1: Usando npm (Recomendado)

```bash
# No diretório pet-joyful
npm run auth-server
```

### Opção 2: Executar diretamente com Node

```bash
# No diretório pet-joyful
node authserver.js
```

### Opção 3: Executar tudo junto (Frontend + Backend Auth)

```bash
# No diretório pet-joyful
npm run dev:all
```

Isso inicia:
- ✅ Servidor de autenticação (porta 3001)
- ✅ Frontend Next.js (porta 3000)

## 📋 Checklist Completo

Para ter tudo funcionando, você precisa de **3 servidores rodando**:

### 1. Backend de Autenticação (porta 3001)
```bash
# Terminal 1 - No diretório pet-joyful
npm run auth-server
# ou
node authserver.js
```

**Você deve ver:**
```
Servidor de autenticação rodando na porta 3001
Usuário de teste: admin@example.com / senha123
```

### 2. Backend de Eventos (porta 3002)
```bash
# Terminal 2 - No diretório PET-JOYFUL-EVENTS-SERVICE
npm run dev
```

**Você deve ver:**
```
🚀 SERVIDOR INICIADO COM SUCESSO!
URL Principal: http://localhost:3002
✔ Health Check: http://localhost:3002/health
API Events: http://localhost:3002/api/events
```

### 3. Frontend Next.js (porta 3000)
```bash
# Terminal 3 - No diretório pet-joyful
npm run dev
```

**Ou use o comando que inicia tudo:**
```bash
# Terminal único - No diretório pet-joyful
npm run dev:all
# Isso inicia o auth-server E o Next.js juntos
```

## 🔧 Se o Script Ainda Não Funcionar

### Solução Manual:

1. **Abra o arquivo `package.json`**
2. **Verifique se a linha 11 tem:**
   ```json
   "auth-server": "node authserver.js",
   ```
3. **Se não tiver, adicione manualmente:**
   ```json
   {
     "scripts": {
       "dev": "next dev ",
       "dev:webpack": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint",
       "auth-server": "node authserver.js",
       "dev:all": "concurrently \"npm run auth-server\" \"npm run dev\"",
       "dev:all:webpack": "concurrently \"npm run auth-server\" \"npm run dev:webpack\""
     }
   }
   ```
4. **Salve o arquivo**
5. **Execute novamente:**
   ```bash
   npm run auth-server
   ```

### Alternativa: Execute Diretamente

Se nada funcionar, simplesmente execute:

```bash
node authserver.js
```

Isso funciona independente do npm scripts!

## 💡 Dica

Se você está usando o VS Code, pode abrir 3 terminais integrados:
- Terminal 1: `npm run auth-server` (ou `node authserver.js`)
- Terminal 2: Backend de eventos (no diretório do backend)
- Terminal 3: `npm run dev` (frontend)

Ou use o comando `npm run dev:all` que inicia auth-server + frontend juntos!

