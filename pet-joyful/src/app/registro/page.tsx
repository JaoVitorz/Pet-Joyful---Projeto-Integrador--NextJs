// src/app/registro/page.tsx
"use client";

import React, { useState } from "react";

interface RegistroData {
  nome: string;
  email: string;
  senha: string;
}

export default function RegistroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar usuário");

      // Transformando a resposta em tipo seguro
      const data: RegistroData = await res.json();

      console.log("Registro feito com sucesso:", data);
      alert("Cadastro realizado!");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao registrar. Tente novamente.");
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNome(e.target.value)
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSenha(e.target.value)
          }
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
