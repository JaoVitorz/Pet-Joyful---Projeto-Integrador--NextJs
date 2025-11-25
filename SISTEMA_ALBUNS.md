# Sistema de Álbuns - Pet Joyful

## 📸 Visão Geral

O sistema de álbuns permite que os usuários organizem suas fotos de pets em coleções personalizadas. Integrado ao microserviço de perfil (`edicao-perfil-microservice`), oferece upload, organização e compartilhamento de imagens.

## 🏗️ Arquitetura

### Componentes Criados

```
pet-joyful/
├── src/
│   ├── services/
│   │   └── albumApi.ts              # Serviço de API para álbuns
│   ├── types/
│   │   └── album.types.ts           # Tipos TypeScript
│   └── app/
│       ├── components/
│       │   └── albums/
│       │       ├── AlbumsList.tsx   # Lista de álbuns
│       │       └── AlbumView.tsx    # Visualização de álbum
│       └── albums/
│           ├── page.tsx             # Página /albums
│           └── [albumId]/
│               └── page.tsx         # Página /albums/:id
```

## 🔧 Configuração

### 1. Variável de Ambiente

O arquivo `.env.local` já foi configurado com:

```env
NEXT_PUBLIC_PROFILE_API_URL=https://edicao-perfil-microservice.onrender.com/api
```

### 2. Next.js Config

O `next.config.ts` já permite imagens do Cloudinary:

```typescript
remotePatterns: [
  {
    protocol: "https",
    hostname: "res.cloudinary.com",
    pathname: "/**",
  },
];
```

### 3. Header Atualizado

Adicionado link "Meus Álbuns" no menu de configurações (ícone de lista no header).

## 📋 Funcionalidades

### 1. **Listar Álbuns** (`/albums`)

- ✅ Visualização em grid responsivo
- ✅ Mostra capa do álbum ou ícone placeholder
- ✅ Contador de fotos
- ✅ Badge de privacidade (público/privado/amigos)
- ✅ Botão de deletar álbum
- ✅ Estado vazio com mensagem
- ✅ Loading spinner

### 2. **Criar Álbum**

- ✅ Modal com formulário
- ✅ Campos: título (obrigatório), descrição, privacidade
- ✅ Validação de formulário
- ✅ Feedback visual de sucesso/erro

### 3. **Visualizar Álbum** (`/albums/:id`)

- ✅ Detalhes do álbum (título, descrição, contador)
- ✅ Grid de fotos responsivo
- ✅ Botão "Adicionar Fotos"
- ✅ Upload de imagens
- ✅ Hover com botão de deletar
- ✅ Modal de visualização em tela cheia
- ✅ Navegação com voltar

### 4. **Upload de Fotos**

- ✅ Input file com accept="image/\*"
- ✅ Upload via FormData
- ✅ Loading state durante upload
- ✅ Refresh automático após upload

### 5. **Deletar Foto**

- ✅ Confirmação antes de deletar
- ✅ Feedback visual (hover no grid)
- ✅ Atualização automática após remoção

### 6. **Deletar Álbum**

- ✅ Confirmação antes de deletar
- ✅ Remove álbum e todas as fotos
- ✅ Redirecionamento para lista

## 🎨 Design

### Responsividade

- **Mobile**: 2 colunas no grid
- **Tablet**: 3 colunas
- **Desktop**: 4 colunas

### Estilos

- Bootstrap 5 para componentes base
- React Icons (FaPlus, FaTrash, FaImage, FaArrowLeft, FaUpload, FaTimes)
- Next.js Image para otimização
- Modais com backdrop
- Loading spinners
- Hover effects

## 🔐 Segurança

### Autenticação

```typescript
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});
```

### Permissões

- ⚠️ Apenas o dono pode criar/editar/deletar álbuns
- ⚠️ Token JWT obrigatório em todas as requisições
- ⚠️ Backend valida permissões no lado servidor

## 📡 API Endpoints

Base URL: `https://edicao-perfil-microservice.onrender.com/api`

### Álbuns

```
POST   /albums              - Criar álbum
GET    /albums              - Listar meus álbuns
GET    /albums/:id          - Buscar álbum específico
PUT    /albums/:id          - Atualizar álbum
DELETE /albums/:id          - Deletar álbum
```

### Fotos

```
POST   /albums/:id/photos           - Adicionar foto
DELETE /albums/:id/photos/:fotoId   - Remover foto
```

## 🎯 Modelos de Dados

### Album

```typescript
interface Album {
  _id: string;
  userId: string;
  titulo: string;
  descricao?: string;
  fotos: Foto[];
  capa?: string;
  privacidade: "publico" | "privado" | "amigos";
  total_fotos: number;
  createdAt: string;
  updatedAt: string;
}
```

### Foto

```typescript
interface Foto {
  _id: string;
  url: string;
  public_id: string;
  legenda?: string;
  ordem: number;
  data_upload: string;
}
```

## 🧪 Como Testar

### 1. Iniciar o Servidor

```bash
cd pet-joyful
npm run dev
```

### 2. Fazer Login

- Acesse `http://localhost:3000/login`
- Faça login com credenciais válidas
- Verifique se o token está no localStorage

### 3. Acessar Álbuns

- Clique no menu de configurações (ícone de lista no header)
- Selecione "Meus Álbuns"
- Ou acesse diretamente: `http://localhost:3000/albums`

### 4. Criar Álbum

- Clique em "Novo Álbum"
- Preencha título, descrição e privacidade
- Clique em "Criar Álbum"

### 5. Adicionar Fotos

- Clique no card do álbum
- Clique em "Adicionar Fotos"
- Selecione imagens do seu computador
- Aguarde o upload

### 6. Visualizar e Deletar

- Clique em uma foto para ver em tela cheia
- Hover sobre foto e clique no ícone de lixeira para remover
- Na lista de álbuns, clique na lixeira para deletar o álbum completo

## 🐛 Troubleshooting

### Erro: "Unauthorized" (401)

- **Causa**: Token JWT ausente ou expirado
- **Solução**: Faça login novamente

### Erro: "Failed to upload photo"

- **Causa**: Backend pode estar offline ou arquivo muito grande
- **Solução**:
  - Verifique se o microserviço está ativo
  - Reduza o tamanho da imagem (max 5MB recomendado)

### Imagens não carregam

- **Causa**: Next.js não permite domínio externo
- **Solução**: Já configurado no `next.config.ts`, reinicie o servidor

### Modal não fecha

- **Causa**: Propagação de evento
- **Solução**: Já tratado com `stopPropagation()` nos botões

## 🚀 Melhorias Futuras

### Sugeridas para v2

- [ ] Drag & drop para reordenar fotos
- [ ] Editar legenda das fotos
- [ ] Compartilhar álbum por link
- [ ] Baixar álbum completo como ZIP
- [ ] Filtros e efeitos nas fotos
- [ ] Álbuns compartilhados entre usuários
- [ ] Comentários nas fotos
- [ ] Tags e busca por tags
- [ ] Galeria com lightbox profissional
- [ ] Upload múltiplo (várias fotos de uma vez)

## 📱 Acessibilidade

✅ **Implementado**:

- Alt text em todas as imagens
- ARIA labels nos botões
- Labels em inputs de formulário
- Focus visible com outlines
- Confirmações antes de ações destrutivas
- Loading states visuais
- Mensagens de erro claras

## 📊 Apresentação

### Para a Feira de Projetos

1. **Demonstrar criação de álbum**: "Organizando memórias do meu pet"
2. **Upload de fotos**: "Adicionando fotos de forma intuitiva"
3. **Visualização responsiva**: "Funciona em mobile e desktop"
4. **Segurança**: "Apenas o dono pode editar - JWT no backend"
5. **Privacidade**: "Controle quem vê suas fotos"

### Pontos de Destaque

- 🎯 **Integração com microserviço especializado**
- 🔒 **Segurança com JWT**
- 📱 **Design responsivo**
- ♿ **Acessibilidade**
- 🚀 **Performance com Next.js Image**

## 🤝 Suporte

Para dúvidas sobre o sistema de álbuns:

1. Verifique os logs do console (F12)
2. Confirme se o backend está online
3. Valide o token JWT no localStorage
4. Revise este documento

---

**Última Atualização**: 25/11/2025
**Versão**: 1.0.0
**Desenvolvedor**: João Vitor - Projeto Integrador Pet Joyful
