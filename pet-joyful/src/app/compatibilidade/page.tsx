"use client";

import { useState, useRef, useEffect } from "react";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import Link from "next/link";

interface CompatibilityResult {
  score: number;
  assessment: string;
  alerts: string[];
  tips: string[];
}

export default function CompatibilidadePage() {
  const [step, setStep] = useState<"adopter" | "pet" | "result">("adopter");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  // Adopter form
  const [adopterData, setAdopterData] = useState({
    livingSpace: "",
    experience: "",
    timeAvailable: "",
    familyComposition: "",
    lifestyle: "",
  });

  // Pet form
  const [petData, setPetData] = useState({
    type: "",
    breed: "",
    temperament: "",
    energy: "",
    specialNeeds: "",
    description: "",
  });

  const handleAdopterChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setAdopterData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePetChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setPetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const prompt = `Analise a compatibilidade entre este adotante potencial e o pet descrito.

PERFIL DO ADOTANTE:
- Espaço de moradia: ${adopterData.livingSpace}
- Experiência com animais: ${adopterData.experience}
- Tempo disponível diariamente: ${adopterData.timeAvailable}
- Composição familiar: ${adopterData.familyComposition}
- Estilo de vida: ${adopterData.lifestyle}

PERFIL DO PET:
- Tipo: ${petData.type}
- Raça: ${petData.breed}
- Temperamento: ${petData.temperament}
- Nível de energia: ${petData.energy}
- Necessidades especiais: ${petData.specialNeeds || "Nenhuma"}
- Descrição adicional: ${petData.description}

Por favor, forneça:
1. Score de compatibilidade (0-100%)
2. Avaliação geral (2-3 linhas)
3. Lista de alertas/incompatibilidades (se houver)
4. Dicas para melhorar a adoção

Responda em JSON com este formato:
{
  "score": número,
  "assessment": "texto da avaliação",
  "alerts": ["alerta 1", "alerta 2"],
  "tips": ["dica 1", "dica 2"]
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
      console.error("Erro na análise:", error);
      alert("Erro ao conectar com a LLM");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50";
    if (score >= 60) return "bg-yellow-50";
    return "bg-red-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <Link href="/Home" className="text-indigo-600 hover:text-indigo-700">
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Compatibilidade Adotante-Pet
          </h1>
          <div className="w-6" />
        </div>

        {step === "adopter" && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              📋 Dados do Adotante
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Espaço de Moradia
                </label>
                <select
                  name="livingSpace"
                  value={adopterData.livingSpace}
                  onChange={handleAdopterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="apartamento pequeno">
                    Apartamento Pequeno (até 50m²)
                  </option>
                  <option value="apartamento medio">
                    Apartamento Médio (50-100m²)
                  </option>
                  <option value="apartamento grande">
                    Apartamento Grande (+ de 100m²)
                  </option>
                  <option value="casa pequena">
                    Casa Pequena com quintal pequeno
                  </option>
                  <option value="casa grande">Casa com quintal grande</option>
                  <option value="sitio">Sítio/Chácara</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experiência com Animais
                </label>
                <select
                  name="experience"
                  value={adopterData.experience}
                  onChange={handleAdopterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="primeira vez">Primeira vez adotando</option>
                  <option value="pouca">Pouca experiência</option>
                  <option value="moderada">Experiência moderada</option>
                  <option value="ampla">Ampla experiência</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo Disponível Diariamente
                </label>
                <select
                  name="timeAvailable"
                  value={adopterData.timeAvailable}
                  onChange={handleAdopterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="menos 1 hora">Menos de 1 hora</option>
                  <option value="1-2 horas">1-2 horas</option>
                  <option value="2-4 horas">2-4 horas</option>
                  <option value="mais 4 horas">Mais de 4 horas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Composição Familiar
                </label>
                <input
                  type="text"
                  name="familyComposition"
                  value={adopterData.familyComposition}
                  onChange={handleAdopterChange}
                  placeholder="Ex: Casal com 2 crianças (5 e 8 anos)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo de Vida
                </label>
                <textarea
                  name="lifestyle"
                  value={adopterData.lifestyle}
                  onChange={handleAdopterChange}
                  placeholder="Ex: Gostamos de atividades ao ar livre, trabalho em casa, rotina tranquila..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-20"
                />
              </div>

              <button
                onClick={() => setStep("pet")}
                disabled={
                  !adopterData.livingSpace ||
                  !adopterData.experience ||
                  !adopterData.timeAvailable
                }
                className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Próximo: Dados do Pet →
              </button>
            </div>
          </div>
        )}

        {step === "pet" && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              🐾 Dados do Pet
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Animal
                </label>
                <select
                  name="type"
                  value={petData.type}
                  onChange={handlePetChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="cachorro">Cachorro</option>
                  <option value="gato">Gato</option>
                  <option value="coelho">Coelho</option>
                  <option value="passaro">Pássaro</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raça / Descrição
                </label>
                <input
                  type="text"
                  name="breed"
                  value={petData.breed}
                  onChange={handlePetChange}
                  placeholder="Ex: Golden Retriever mix"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperamento
                </label>
                <input
                  type="text"
                  name="temperament"
                  value={petData.temperament}
                  onChange={handlePetChange}
                  placeholder="Ex: Dócil, brincalhão, sociável"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Energia
                </label>
                <select
                  name="energy"
                  value={petData.energy}
                  onChange={handlePetChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="muito baixo">Muito baixo (sedentário)</option>
                  <option value="baixo">Baixo</option>
                  <option value="moderado">Moderado</option>
                  <option value="alto">Alto</option>
                  <option value="muito alto">Muito alto (hiperativo)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Necessidades Especiais
                </label>
                <textarea
                  name="specialNeeds"
                  value={petData.specialNeeds}
                  onChange={handlePetChange}
                  placeholder="Ex: Alergia, cuidados com articulações, medicações..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Adicional
                </label>
                <textarea
                  name="description"
                  value={petData.description}
                  onChange={handlePetChange}
                  placeholder="Informações extras sobre o pet..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-20"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("adopter")}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !petData.type || !petData.breed}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⚙️</span>
                      Analisando...
                    </>
                  ) : (
                    <>
                      <FiSend size={18} />
                      Analisar Compatibilidade
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "result" && result && (
          <div className="space-y-6">
            {/* Score Card */}
            <div
              className={`${getScoreBg(result.score)} rounded-lg shadow-lg p-8 border-l-4 ${
                result.score >= 80
                  ? "border-green-600"
                  : result.score >= 60
                    ? "border-yellow-600"
                    : "border-red-600"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Score de Compatibilidade
                </h2>
                <span
                  className={`text-5xl font-bold ${getScoreColor(result.score)}`}
                >
                  {result.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    result.score >= 80
                      ? "bg-green-600"
                      : result.score >= 60
                        ? "bg-yellow-600"
                        : "bg-red-600"
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            {/* Assessment */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                📝 Avaliação Geral
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {result.assessment}
              </p>
            </div>

            {/* Alerts */}
            {result.alerts.length > 0 && (
              <div className="bg-red-50 rounded-lg shadow-lg p-8 border-l-4 border-red-600">
                <h3 className="text-lg font-bold text-red-800 mb-4">
                  ⚠️ Alertas & Incompatibilidades
                </h3>
                <ul className="space-y-2">
                  {result.alerts.map((alert, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="bg-green-50 rounded-lg shadow-lg p-8 border-l-4 border-green-600">
                <h3 className="text-lg font-bold text-green-800 mb-4">
                  💡 Dicas para a Adoção
                </h3>
                <ul className="space-y-2">
                  {result.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep("adopter");
                  setResult(null);
                  setAdopterData({
                    livingSpace: "",
                    experience: "",
                    timeAvailable: "",
                    familyComposition: "",
                    lifestyle: "",
                  });
                  setPetData({
                    type: "",
                    breed: "",
                    temperament: "",
                    energy: "",
                    specialNeeds: "",
                    description: "",
                  });
                }}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                🔄 Analisar Outro Pet
              </button>
              <Link
                href="/"
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition text-center"
              >
                ← Voltar ao Início
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
