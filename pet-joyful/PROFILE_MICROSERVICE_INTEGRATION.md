# Integração do Microserviço de Perfil

Este documento descreve como integrar o microserviço de edição de perfil ao frontend PetJoyful.

## 📋 Pré-requisitos

1. **Microserviço de Perfil** rodando em `http://localhost:3001`
   - Repositório: https://github.com/JaoVitorz/EDICAO-PERFIL-MICROSERVICE
   - Siga as instruções do README do microserviço para configurar e executar

2. **Variáveis de Ambiente**
   - Adicione ao seu arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_PROFILE_API_URL=http://localhost:3001
   ```

## 🚀 Arquivos Criados

### 1. Serviço de API (`src/services/profileApi.ts`)
- Comunicação com o microserviço
- Interceptors para autenticação automática
- Funções para todas as operações de perfil
- Tipos TypeScript para o perfil

### 2. Componentes de Perfil

#### `src/app/components/profile/EditProfileForm.tsx`
- Formulário completo de edição de perfil
- Upload de foto de perfil
- Validação com Yup
- Formatação automática de telefone e CEP

#### `src/app/components/profile/ProfileDisplay.tsx`
- Exibição do perfil do usuário
- Suporte a perfil próprio ou de outros usuários
- Layout responsivo

### 3. Páginas

#### `src/app/perfil-edit/page.tsx`
- Página dedicada para edição de perfil
- Breadcrumb e navegação
- Tratamento de erros

#### `src/app/meu-perfil/page.tsx`
- Página principal do perfil
- Tabs para diferentes seções
- Configurações da conta

## 🔧 Como Usar

### 1. Iniciar o Microserviço
```bash
# No diretório do microserviço
npm install
npm start
```

### 2. Configurar Variáveis de Ambiente
Adicione ao `.env.local`:
```env
NEXT_PUBLIC_PROFILE_API_URL=http://localhost:3001
```

### 3. Instalar Dependências
```bash
npm install yup
```

### 4. Navegar para as Páginas
- **Editar Perfil**: `/perfil-edit`
- **Meu Perfil**: `/meu-perfil`

## 📡 Endpoints Utilizados

### Perfil do Usuário Autenticado
- `GET /api/profile/me` - Buscar perfil
- `PUT /api/profile/me` - Atualizar perfil
- `POST /api/profile/me/photo` - Upload de foto

### Perfil por ID
- `GET /api/profile/:userId` - Buscar perfil por ID
- `PUT /api/profile/:userId` - Atualizar perfil por ID

### Health Check
- `GET /health` - Verificar saúde do serviço

## 🔐 Autenticação

O sistema usa JWT tokens armazenados no `localStorage`:
- Token é automaticamente incluído nas requisições
- Redirecionamento automático para login se token inválido
- Interceptors tratam expiração de token

## 📝 Campos do Perfil

### Obrigatórios
- `nome` - Nome completo (2-255 caracteres)

### Opcionais
- `telefone` - Formato (11) 99999-9999
- `data_nascimento` - Data de nascimento (13-120 anos)
- `bio` - Biografia (máx. 1000 caracteres)
- `foto_perfil` - URL da foto (upload via Cloudinary)
- `cidade` - Cidade (máx. 100 caracteres)
- `estado` - UF (2 caracteres maiúsculos)
- `cep` - CEP formato 00000-000
- `endereco` - Endereço (máx. 255 caracteres)
- `numero` - Número (máx. 20 caracteres)
- `complemento` - Complemento (máx. 100 caracteres)

## 🎨 Validações

### Telefone
- Formato automático: `(11) 99999-9999`
- Aceita 10 ou 11 dígitos

### CEP
- Formato automático: `00000-000`
- Remove caracteres não numéricos

### Estado
- Converte automaticamente para maiúsculas
- Valida 2 caracteres

### Data de Nascimento
- Idade mínima: 13 anos
- Idade máxima: 120 anos

## 🔄 Fluxo de Uso

1. **Primeiro Acesso**
   - Usuário acessa `/meu-perfil`
   - Se perfil não existe, mostra opção "Criar Perfil"
   - Redireciona para `/perfil-edit`

2. **Edição de Perfil**
   - Carrega dados existentes
   - Permite edição de todos os campos
   - Upload de foto separado
   - Validação em tempo real

3. **Visualização**
   - Exibe perfil completo
   - Botão "Editar Perfil" se for o próprio usuário
   - Layout responsivo

## 🚨 Tratamento de Erros

- **Perfil não encontrado**: Opção de criar novo perfil
- **Token expirado**: Redirecionamento automático para login
- **Erro de rede**: Botão "Tentar novamente"
- **Validação**: Mensagens específicas por campo

## 🔗 Integração com Páginas Existentes

Para integrar com a página de perfil existente (`/Perfil`), você pode:

1. **Substituir componentes existentes** pelos novos
2. **Adicionar links** para as novas páginas
3. **Migrar dados** do sistema atual para o microserviço

### Exemplo de Link no Header
```tsx
<Link href="/meu-perfil">Meu Perfil</Link>
```

## 📱 Responsividade

Todos os componentes são totalmente responsivos:
- **Mobile**: Layout em coluna única
- **Tablet**: Grid adaptativo
- **Desktop**: Layout completo

## 🧪 Testando a Integração

1. **Verificar Microserviço**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Testar Autenticação**
   - Fazer login no frontend
   - Verificar se token está no localStorage
   - Acessar `/meu-perfil`

3. **Testar CRUD**
   - Criar/editar perfil
   - Upload de foto
   - Visualizar perfil

## 🔧 Troubleshooting

### Erro CORS
- Verificar se microserviço tem CORS configurado
- Adicionar origem do frontend nas configurações

### Token não enviado
- Verificar se token está no localStorage
- Verificar interceptor do axios

### Upload de foto falha
- Verificar configuração do Cloudinary no microserviço
- Verificar tamanho e formato da imagem

### Perfil não carrega
- Verificar se microserviço está rodando
- Verificar URL da API nas variáveis de ambiente
- Verificar logs do microserviço

## 📚 Próximos Passos

1. **Integrar com sistema de posts** - Mostrar posts do usuário na aba "Minhas Publicações"
2. **Sistema de favoritos** - Implementar funcionalidade de favoritar pets
3. **Configurações avançadas** - Adicionar mais opções de privacidade
4. **Notificações** - Integrar sistema de notificações
5. **Busca de usuários** - Permitir buscar outros perfis

## 🤝 Contribuindo

Para contribuir com melhorias:
1. Teste a integração completa
2. Reporte bugs encontrados
3. Sugira melhorias de UX/UI
4. Documente novos recursos
