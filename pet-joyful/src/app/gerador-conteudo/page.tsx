"use client";

import { useState, useRef, useEffect } from "react";
import { FiArrowLeft, FiSend, FiCopy, FiShare2 } from "react-icons/fi";
import Link from "next/link";

interface GeneratedContent {
  title: string;
  content: string;
  hashtags: string[];
  imagePrompt?: string;
}

const TEMAS = [
  { id: "vacinacao", label: "💉 Vacinação", emoji: "💉" },
  { id: "comportamento", label: "🐕 Comportamento", emoji: "🐕" },
  { id: "adocao", label: "❤️ Adoção Responsável", emoji: "❤️" },
  { id: "nutricao", label: "🥕 Nutrição e Saúde", emoji: "🥕" },
  { id: "treinamento", label: "🎓 Treinamento", emoji: "🎓" },
  { id: "higiene", label: "🛁 Higiene e Cuidados", emoji: "🛁" },
  { id: "emergencia", label: "🚨 Primeiros Socorros", emoji: "🚨" },
  { id: "bem-estar", label: "😊 Bem-estar Mental", emoji: "😊" },
];

const TIPOS = [
  {
    id: "dica-rapida",
    label: "⚡ Dica Rápida",
    description: "30-60 segundos de leitura",
  },
  { id: "guia", label: "📖 Guia Completo", description: "Artigo aprofundado" },
  {
    id: "historia",
    label: "📚 História de Sucesso",
    description: "Relato inspirador",
  },
  {
    id: "infografico",
    label: "📊 Infográfico",
    description: "Visual em formato texto",
  },
];

const AUDIENCIAS = [
  {
    id: "iniciantes",
    label: "👶 Donos Iniciantes",
    description: "Primeiro pet",
  },
  {
    id: "experientes",
    label: "👴 Donos Experientes",
    description: "Múltiplos pets",
  },
  { id: "protetores", label: "🛡️ Protetores", description: "Instituições" },
  {
    id: "veterinarios",
    label: "⚕️ Veterinários",
    description: "Profissionais",
  },
];

export default function GeradorConteudoPage() {
  const [step, setStep] = useState<"selection" | "generating" | "result">(
    "selection",
  );
  const [tema, setTema] = useState("");
  const [tipo, setTipo] = useState("");
  const [audiencia, setAudiencia] = useState("");
  const [dicas, setDicas] = useState("");
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setStep("generating");

    try {
      const temaLabel = TEMAS.find((t) => t.id === tema)?.label || tema;
      const tipoLabel = TIPOS.find((t) => t.id === tipo)?.label || tipo;
      const audienciaLabel =
        AUDIENCIAS.find((a) => a.id === audiencia)?.label || audiencia;

      const prompt = `Gere um post educativo para rede social Pet Joyful com as seguintes especificações:

TEMA: ${temaLabel}
TIPO DE CONTEÚDO: ${tipoLabel}
PÚBLICO-ALVO: ${audienciaLabel}
${dicas ? `DETALHES ADICIONAIS: ${dicas}` : ""}

Por favor, crie:
1. Um título atrativo e relevante
2. Um conteúdo engajante (${tipo === "dica-rapida" ? "50-100" : tipo === "historia" ? "150-250" : "100-200"} palavras)
3. 3-5 hashtags relevantes (#petjoyful, etc)
4. ${tipo === "infografico" ? "Uma descrição de como o conteúdo deveria ser visualizado em um infográfico" : "Uma sugestão de imagem/emoji para o post"}

Responda em JSON com este formato:
{
  "title": "Título do Post",
  "content": "Conteúdo completo aqui",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "imagePrompt": "Descrição da imagem ou emoji sugerido"
}`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();

      if (data.reply) {
        try {
          const jsonMatch = data.reply.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            setResult(parsed);
            setStep("result");
          }
        } catch (e) {
          console.error("Erro ao parsear resposta:", e);
          alert("Erro ao processar resposta da LLM");
        }
      }
    } catch (error) {
      console.error("Erro na geração:", error);
      alert("Erro ao conectar com a LLM");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      const text = `${result.title}\n\n${result.content}\n\n${result.hashtags.join(" ")}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="min-h-screen bg-linear-to-br p-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <Link href="/Home" className="text-purple-600 hover:text-purple-700">
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            📝 Gerador de Conteúdo
          </h1>
          <div className="w-6" />
        </div>

        {step === "selection" && (
          <>
            {/* Seleção de Tema */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🎯 Escolha um Tema
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TEMAS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTema(t.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-center font-medium ${
                      tema === t.id
                        ? "border-purple-600 bg-purple-50 text-purple-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-purple-600"
                    }`}
                  >
                    <div className="text-2xl mb-1">{t.emoji}</div>
                    <div className="text-sm">
                      {t.label.split(" ").slice(1).join(" ")}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Tipo */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📋 Tipo de Conteúdo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TIPOS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTipo(t.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                      tipo === t.id
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-orange-500"
                    }`}
                  >
                    <div className="font-bold">{t.label}</div>
                    <div className="text-sm text-gray-600">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Audiência */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                👥 Público-Alvo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AUDIENCIAS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAudiencia(a.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                      audiencia === a.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-500"
                    }`}
                  >
                    <div className="font-bold">{a.label}</div>
                    <div className="text-sm text-gray-600">{a.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dicas Adicionais */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💡 Detalhes Adicionais (Opcional)
              </label>
              <textarea
                value={dicas}
                onChange={(e) => setDicas(e.target.value)}
                placeholder="Ex: Mencionar raça específica, estação do ano, etc..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
              />
            </div>

            {/* Botões de Ação */}
            <button
              onClick={handleGenerate}
              disabled={!tema || !tipo || !audiencia}
              className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-lg"
            >
              <FiSend size={20} />
              Gerar Conteúdo
            </button>
          </>
        )}

        {step === "generating" && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="inline-block">
              <div className="text-6xl mb-4 animate-bounce">✨</div>
              <p className="text-xl font-bold text-gray-800 mb-2">
                Gerando Conteúdo...
              </p>
              <p className="text-gray-600">
                Nossa IA está criando um post incrível para você
              </p>
            </div>
          </div>
        )}

        {step === "result" && result && (
          <div className="space-y-6">
            {/* Preview do Post */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  📱 Preview do Post
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                  >
                    <FiCopy size={18} />
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* Post Card */}
              <div className="border-2 border-gray-200 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {result.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {result.content}
                  </p>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Imagem/Emoji Sugerido */}
                {result.imagePrompt && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>💭 Sugestão de Imagem:</strong>
                    </p>
                    <p className="text-gray-700 text-sm italic">
                      {result.imagePrompt}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep("selection");
                  setResult(null);
                  setTema("");
                  setTipo("");
                  setAudiencia("");
                  setDicas("");
                }}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                🔄 Gerar Outro Post
              </button>
              <button
                onClick={() => {
                  if (result) {
                    const text = `${result.title}\n\n${result.content}\n\n${result.hashtags.join(" ")}`;
                    // Aqui poderia integrar com a criação de post
                    navigator.clipboard.writeText(text);
                    alert("Post copiado! Você pode compartilhá-lo no feed.");
                  }
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FiShare2 size={18} />
                Compartilhar
              </button>
              <Link
                href="/"
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition text-center"
              >
                ← Voltar
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
