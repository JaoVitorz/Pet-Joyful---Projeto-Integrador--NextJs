const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock database
let users = [
  {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMy.MH/rW1sLqBzUQUZ5C5/5GpF8v5XJQ1W", // "senha123"
    role: "admin",
  },
];

// Chave secreta para JWT (em produção, use uma variável de ambiente)
const JWT_SECRET = "sua_chave_secreta_super_segura";

// Rotas de Autenticação
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validação simples
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  // Verifica se usuário já existe
  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ error: "Email já cadastrado" });
  }

  try {
    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria novo usuário
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: "user",
    };

    users.push(newUser);

    // Cria token JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Validação simples
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  // Encontra usuário
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  try {
    // Verifica senha
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Cria token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login bem-sucedido",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Rota protegida de exemplo
app.get("/api/profile", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }
    req.user = user;
    next();
  });
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor de autenticação rodando na porta ${PORT}`);
  console.log(`Usuário de teste: admin@example.com / senha123`);
});
