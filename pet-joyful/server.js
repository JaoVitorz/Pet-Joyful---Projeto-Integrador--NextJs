const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dados estáticos (mock database)
let comments = [
  {
    id: '1',
    postId: '101',
    content: 'Ótimo post!',
    author: { id: 'user1', name: 'João Silva' },
    createdAt: '2023-05-15T10:00:00Z',
    likes: 5
  },
  {
    id: '2',
    postId: '101',
    content: 'Muito útil, obrigado!',
    author: { id: 'user2', name: 'Maria Souza' },
    createdAt: '2023-05-15T11:30:00Z',
    likes: 2
  }
];

// Rotas da API
app.get('/api/posts/:postId/comments', (req, res) => {
  const postComments = comments.filter(c => c.postId === req.params.postId);
  res.json(postComments);
});

app.post('/api/posts/:postId/comments', (req, res) => {
  const { content, author } = req.body;
  
  if (!content || !author || !author.id || !author.name) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const newComment = {
    id: `comment-${Date.now()}`,
    postId: req.params.postId,
    content,
    author,
    createdAt: new Date().toISOString(),
    likes: 0
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

app.put('/api/comments/:commentId', (req, res) => {
  const { content } = req.body;
  const comment = comments.find(c => c.id === req.params.commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comentário não encontrado' });
  }

  if (!content) {
    return res.status(400).json({ error: 'Conteúdo é obrigatório' });
  }

  comment.content = content;
  res.json(comment);
});

app.delete('/api/comments/:commentId', (req, res) => {
  const index = comments.findIndex(c => c.id === req.params.commentId);

  if (index === -1) {
    return res.status(404).json({ error: 'Comentário não encontrado' });
  }

  comments.splice(index, 1);
  res.status(204).end();
});

app.post('/api/comments/:commentId/like', (req, res) => {
  const comment = comments.find(c => c.id === req.params.commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comentário não encontrado' });
  }

  comment.likes = (comment.likes || 0) + 1;
  res.json({ likes: comment.likes });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor de comentários rodando na porta ${PORT}`);
});