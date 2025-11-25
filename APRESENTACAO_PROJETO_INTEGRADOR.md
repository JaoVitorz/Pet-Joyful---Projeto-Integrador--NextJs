# 📋 Guia de Apresentação - Projeto Integrador

## 📅 Informações Gerais

- **Formato:** Feira de Projetos
- **Horário:** 19:00h
- **Tipo:** Apresentação para banca avaliadora

### 👥 Composição da Banca

**Professores:**

- Angelina
- Neusa
- Helder
- Angela
- Felipe
- Waldemar
- Cassio

**Membros Externos (Empresa Itix):**

- Milton
- Raissa

---

## 📊 Critérios de Avaliação

### 1️⃣ Explicação do Projeto (25%)

**O que será avaliado:**

- ✅ Clareza na apresentação
- ✅ Entendimento dos membros sobre o projeto
- ✅ Solução proposta
- ✅ Público-alvo
- ✅ Justificativa técnica
- ✅ Resposta aos questionamentos

**Como se preparar:**

```markdown
- Prepare um elevator pitch (1-2 minutos)
- Defina claramente o problema que o projeto resolve
- Explique por que escolheram essa solução
- Identifique o público-alvo específico
- Prepare respostas para perguntas técnicas comuns
```

---

### 2️⃣ Funcionalidades Principais (25%)

**O que será avaliado:**

- ✅ Demonstração do sistema funcionando
- ✅ Login/Autenticação
- ✅ Fluxo principal da aplicação
- ✅ Recursos do backend

**Checklist para demonstração:**

```markdown
✓ Testar ANTES da apresentação
✓ Ter usuários de teste já cadastrados
✓ Mostrar login e registro
✓ Demonstrar o fluxo principal (usuário comum)
✓ Mostrar funcionalidades CRUD (Create, Read, Update, Delete)
✓ Demonstrar integração frontend-backend
✓ Ter exemplos de dados preenchidos
```

**Fluxo sugerido de demonstração:**

1. Tela inicial/Landing page
2. Registro de novo usuário
3. Login
4. Dashboard/Home autenticado
5. Funcionalidade principal (ex: criar evento, fazer post, etc)
6. Editar/Atualizar dados
7. Excluir (se aplicável)

---

### 3️⃣ Segurança da Aplicação (20%)

**O que será avaliado:**

- ✅ Uso de token JWT
- ✅ API key ou equivalente
- ✅ Demonstração prática da segurança
- ✅ Aplicação hospedada em servidor na nuvem

**Pontos para demonstrar:**

```markdown
🔐 Autenticação JWT

- Mostrar o token sendo gerado no login
- Explicar como o token é armazenado (localStorage)
- Demonstrar requisições autenticadas (headers com Bearer token)
- Mostrar erro ao tentar acessar sem autenticação (401)

🔒 Autorização

- Demonstrar que usuários só podem editar/excluir seus próprios dados
- Mostrar erro de permissão (403) ao tentar editar dados de outros

☁️ Hospedagem

- Mostrar aplicação rodando em produção
- Ter URL acessível
- Certificado SSL (HTTPS) se possível
```

**Serviços de hospedagem sugeridos:**

- Frontend: Vercel, Netlify, GitHub Pages
- Backend: Render, Railway, Heroku, AWS

---

### 4️⃣ Documentação da API (15%)

**O que será avaliado:**

- ✅ Demonstração dos endpoints
- ✅ Rotas documentadas
- ✅ Testes via Swagger

**Preparação:**

```markdown
📚 Swagger/OpenAPI

- Ter Swagger configurado e funcionando
- URL acessível: http://seu-backend.com/api-docs
- Documentar TODOS os endpoints principais

📋 Endpoints obrigatórios para demonstrar:

- POST /api/auth/register (Registro)
- POST /api/auth/login (Login)
- GET /api/recurso (Listar)
- POST /api/recurso (Criar)
- PUT /api/recurso/:id (Atualizar)
- DELETE /api/recurso/:id (Excluir)

🧪 Testes ao vivo

- Fazer pelo menos 2-3 requisições via Swagger
- Mostrar respostas de sucesso (200, 201)
- Demonstrar erros tratados (400, 401, 403, 404)
```

---

### 5️⃣ Usabilidade e Acessibilidade (15%)

**O que será avaliado:**

- ✅ Simplicidade de uso
- ✅ Facilidade de aprendizado
- ✅ Recursos de acessibilidade
- ✅ Organização visual

**Checklist de Acessibilidade:**

```markdown
♿ Básico
✓ Contraste adequado de cores
✓ Textos alternativos em imagens (alt)
✓ Labels em formulários
✓ Navegação por teclado (Tab)
✓ Mensagens de erro claras

🎨 Design/UX
✓ Interface limpa e organizada
✓ Feedback visual nas ações (loading, sucesso, erro)
✓ Responsividade (mobile, tablet, desktop)
✓ Ícones intuitivos
✓ Mensagens de confirmação antes de ações destrutivas

📱 Usabilidade
✓ Fluxo lógico e intuitivo
✓ Poucos cliques para ações principais
✓ Ajudas contextuais (tooltips, placeholders)
✓ Validação de formulários em tempo real
```

---

## 🎯 Roteiro de Apresentação Sugerido

### ⏱️ Tempo estimado: 10-15 minutos

```markdown
1. INTRODUÇÃO (2 min)

   - Nome do projeto
   - Problema identificado
   - Solução proposta
   - Público-alvo

2. DEMONSTRAÇÃO PRÁTICA (5-7 min)

   - Sistema em produção
   - Fluxo completo de uso
   - Funcionalidades principais

3. ASPECTOS TÉCNICOS (3-4 min)

   - Arquitetura (frontend + backend)
   - Segurança (JWT, autenticação)
   - API (Swagger)
   - Tecnologias utilizadas

4. ACESSIBILIDADE E UX (1-2 min)

   - Recursos de acessibilidade
   - Design responsivo
   - Usabilidade

5. PERGUNTAS E RESPOSTAS (tempo variável)
   - Estar preparado para perguntas técnicas
   - Ter todos os membros prontos para responder
```

---

## 📝 Checklist Pré-Apresentação

### 🔧 Técnico

- [ ] Aplicação frontend em produção e funcionando
- [ ] Backend em produção e funcionando
- [ ] Banco de dados populado com dados de teste
- [ ] Swagger acessível e documentado
- [ ] Todos os endpoints testados
- [ ] Credenciais de teste preparadas
- [ ] Token JWT funcionando corretamente
- [ ] Validações de segurança implementadas

### 📱 Demonstração

- [ ] Usuário de teste cadastrado
- [ ] Fluxo completo testado 3x (pelo menos)
- [ ] Screenshots/prints de backup (caso a internet falhe)
- [ ] Vídeo de demonstração (backup)
- [ ] Internet estável verificada
- [ ] Notebook/dispositivo totalmente carregado

### 📄 Documentação

- [ ] README.md atualizado no GitHub
- [ ] Diagramas (arquitetura, fluxo)
- [ ] Lista de tecnologias utilizadas
- [ ] Instruções de instalação
- [ ] Documentação da API (Swagger)

### 👥 Equipe

- [ ] Todos os membros sabem explicar o projeto
- [ ] Divisão clara de quem fala sobre cada parte
- [ ] Respostas preparadas para perguntas comuns
- [ ] Backup: outros membros prontos para assumir se alguém travar

---

## ❓ Perguntas Comuns da Banca

**Prepare respostas para:**

1. **Por que escolheram essa tecnologia?**
2. **Como funciona a autenticação?**
3. **Como vocês garantem a segurança dos dados?**
4. **O que acontece se um usuário tentar acessar dados de outro?**
5. **Como vocês tratam erros?**
6. **A aplicação é escalável?**
7. **Quais foram os maiores desafios?**
8. **Como foi a divisão de trabalho?**
9. **Quais melhorias futuras vocês pensam?**
10. **Como vocês testaram a aplicação?**

---

## 🎨 Dicas de Apresentação

### ✅ FAÇA:

- Fale com clareza e confiança
- Mantenha contato visual com a banca
- Use exemplos práticos
- Demonstre entusiasmo pelo projeto
- Seja honesto sobre limitações
- Mostre o código quando relevante
- Explique decisões técnicas

### ❌ NÃO FAÇA:

- Ler slides/código diretamente
- Falar muito rápido
- Usar jargões sem explicar
- Culpar membros da equipe
- Inventar funcionalidades que não existem
- Deixar uma pessoa sozinha apresentando tudo
- Ignorar perguntas da banca

---

## 🏆 Diferencial para Nota Máxima

```markdown
🌟 Extras que impressionam:

- Testes automatizados
- CI/CD configurado
- Monitoramento de erros (Sentry, etc)
- Analytics/métricas
- Design system consistente
- Documentação exemplar
- Código limpo e bem estruturado
- Git com commits organizados
- README profissional
```

---

## 📞 Contatos de Emergência

**Antes da apresentação, tenha:**

- Números dos membros da equipe
- Link do projeto em produção salvo
- Credenciais de acesso anotadas
- Backup em pendrive/nuvem

---

## 💡 Lembre-se

> **"A apresentação é tão importante quanto o código!"**

- Pratique pelo menos 3 vezes
- Cronometre o tempo
- Peça feedback para colegas
- Grave um ensaio e assista
- Durma bem no dia anterior
- Chegue cedo no local

---

## ✨ Boa sorte na apresentação!

**Vocês conseguem! 🚀**
