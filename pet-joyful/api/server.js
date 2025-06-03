const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Cadastro de tutor
app.post('/api/tutores', (req, res) => {
  // Aqui você pode acessar req.body para pegar os dados enviados
  res.json({
    success: true,
    message: 'Tutor cadastrado com sucesso!',
    tutor: {
      id: 1,
      nome: req.body.nome || 'Exemplo Tutor',
      email: req.body.email || 'tutor@exemplo.com'
    }
  });
});

// Cadastro de ONG
app.post('/api/ongs', (req, res) => {
  res.json({
    success: true,
    message: 'ONG cadastrada com sucesso!',
    ong: {
      id: 1,
      nome: req.body.nome || 'Exemplo ONG',
      cnpj: req.body.cnpj || '00.000.000/0001-00',
      email: req.body.email || 'ong@exemplo.com'
    }
  });
});

// Listar tutores (exemplo)
app.get('/api/tutores', (req, res) => {
  res.json([
    { id: 1, nome: 'Maria', email: 'maria@email.com' },
    { id: 2, nome: 'João', email: 'joao@email.com' }
  ]);
});

// Listar ONGs (exemplo)
app.get('/api/ongs', (req, res) => {
  res.json([
    { id: 1, nome: 'ONG Exemplo', cnpj: '00.000.000/0001-00', email: 'ong@exemplo.com' }
  ]);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});