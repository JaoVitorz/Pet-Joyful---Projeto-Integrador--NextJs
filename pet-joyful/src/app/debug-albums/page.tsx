"use client";
import { useState, useEffect } from "react";

export default function DebugAlbumsPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const info = {
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + "..." : null,
      apiUrl: process.env.NEXT_PUBLIC_PROFILE_API_URL,
      timestamp: new Date().toISOString(),
    };
    setDebugInfo(info);
    console.log("[Debug] Informações:", info);
  }, []);

  const testConnection = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_PROFILE_API_URL ||
          "https://edicao-perfil-microservice.onrender.com/api"
        }/albums`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("[Debug] Resposta da API:", {
        status: response.status,
        data,
      });
      alert(
        `Status: ${response.status}\nResposta: ${JSON.stringify(data, null, 2)}`
      );
    } catch (error: any) {
      console.error("[Debug] Erro:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  const testCreateAlbum = async () => {
    try {
      const token = localStorage.getItem("token");
      const testData = {
        titulo: "Teste de Álbum",
        descricao: "Descrição de teste",
        privacidade: "publico",
      };

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_PROFILE_API_URL ||
          "https://edicao-perfil-microservice.onrender.com/api"
        }/albums`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(testData),
        }
      );

      const data = await response.json();
      console.log("[Debug] Resposta criar álbum:", {
        status: response.status,
        data,
      });
      alert(
        `Status: ${response.status}\nResposta: ${JSON.stringify(data, null, 2)}`
      );
    } catch (error: any) {
      console.error("[Debug] Erro ao criar:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Debug - Sistema de Álbuns</h1>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Informações de Debug</h5>
        </div>
        <div className="card-body">
          <pre className="bg-light p-3 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </div>

      <div className="d-flex gap-3">
        <button onClick={testConnection} className="btn btn-primary">
          Testar Conexão (GET /albums)
        </button>
        <button onClick={testCreateAlbum} className="btn btn-success">
          Testar Criar Álbum (POST /albums)
        </button>
      </div>

      <div className="alert alert-info mt-4">
        <h6>Instruções:</h6>
        <ol>
          <li>Verifique se você está logado (hasToken deve ser true)</li>
          <li>
            Clique em Testar Conexão para verificar se a API está acessível
          </li>
          <li>
            Clique em Testar Criar Álbum para tentar criar um álbum de teste
          </li>
          <li>Verifique o console do navegador (F12) para logs detalhados</li>
        </ol>
      </div>

      <div className="mt-4">
        <h6>URLs Esperadas:</h6>
        <ul>
          <li>
            <strong>API URL:</strong>{" "}
            {process.env.NEXT_PUBLIC_PROFILE_API_URL ||
              "https://edicao-perfil-microservice.onrender.com/api"}
          </li>
          <li>
            <strong>GET:</strong>{" "}
            {process.env.NEXT_PUBLIC_PROFILE_API_URL ||
              "https://edicao-perfil-microservice.onrender.com/api"}
            /albums
          </li>
          <li>
            <strong>POST:</strong>{" "}
            {process.env.NEXT_PUBLIC_PROFILE_API_URL ||
              "https://edicao-perfil-microservice.onrender.com/api"}
            /albums
          </li>
        </ul>
      </div>
    </div>
  );
}
