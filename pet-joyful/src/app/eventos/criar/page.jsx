"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import eventService from "../../services/eventService";
import { FaSave, FaTimes, FaCalendarAlt } from "react-icons/fa";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

export default function CriarEventoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "adoption_fair",
    startDate: "",
    endDate: "",
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    maxParticipants: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : null,
      };

      console.log("Enviando dados:", dataToSend);
      const result = await eventService.create(dataToSend);
      console.log("Evento criado:", result);
      alert("Evento criado com sucesso!");
      router.push("/eventos");
    } catch (err) {
      console.error("Erro detalhado:", err);

      // Mensagem de erro mais detalhada
      let errorMessage = "Erro ao criar evento. ";

      if (err.response) {
        // Erro com resposta do servidor
        if (err.response.status === 404) {
          errorMessage +=
            "Rota não encontrada. Verifique se o backend está rodando e se o endpoint está correto.";
        } else if (err.response.status === 401) {
          errorMessage += "Não autorizado. Faça login novamente.";
        } else if (err.response.status === 400) {
          errorMessage +=
            err.response.data?.message ||
            "Dados inválidos. Verifique os campos do formulário.";
        } else if (err.response.data?.message) {
          errorMessage += err.response.data.message;
        } else {
          errorMessage += `Erro do servidor (${err.response.status}). Verifique o console para mais detalhes.`;
        }
      } else if (err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK") {
        errorMessage +=
          "Não foi possível conectar ao backend. Verifique se o servidor está rodando.";
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage +=
          "Erro desconhecido. Verifique o console para mais detalhes.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="card-title mb-0">Criar Novo Evento</h2>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => router.push("/eventos")}
                  >
                    <FaCalendarAlt className="me-2" />
                    Ver Eventos
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Título */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Título *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Feira de Adoção - Shopping Paulista"
                    />
                  </div>

                  {/* Descrição */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Descrição *</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Descreva o evento..."
                    />
                  </div>

                  {/* Tipo */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Tipo de Evento *
                    </label>
                    <select
                      name="eventType"
                      className="form-select"
                      value={formData.eventType}
                      onChange={handleChange}
                      required
                    >
                      <option value="adoption_fair">Feira de Adoção</option>
                      <option value="vaccination_campaign">
                        Campanha de Vacinação
                      </option>
                      <option value="awareness">Conscientização</option>
                      <option value="workshop">Workshop</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  {/* Datas */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Data/Hora Início *
                      </label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        className="form-control"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Data/Hora Fim *
                      </label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        className="form-control"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Endereço *</label>
                    <input
                      type="text"
                      name="location.address"
                      className="form-control"
                      value={formData.location.address}
                      onChange={handleChange}
                      required
                      placeholder="Rua, número"
                    />
                  </div>

                  {/* Cidade, Estado, CEP */}
                  <div className="row mb-3">
                    <div className="col-md-5">
                      <label className="form-label fw-bold">Cidade *</label>
                      <input
                        type="text"
                        name="location.city"
                        className="form-control"
                        value={formData.location.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">Estado *</label>
                      <input
                        type="text"
                        name="location.state"
                        className="form-control"
                        value={formData.location.state}
                        onChange={handleChange}
                        required
                        maxLength="2"
                        placeholder="SP"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">CEP *</label>
                      <input
                        type="text"
                        name="location.zipCode"
                        className="form-control"
                        value={formData.location.zipCode}
                        onChange={handleChange}
                        required
                        placeholder="00000-000"
                      />
                    </div>
                  </div>

                  {/* Max Participantes */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Máximo de Participantes
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      className="form-control"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      min="1"
                      placeholder="Ex: 500 (opcional)"
                    />
                  </div>

                  {/* URL Imagem */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">URL da Imagem</label>
                    <input
                      type="url"
                      name="imageUrl"
                      className="form-control"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://... (opcional)"
                    />
                  </div>

                  {/* Botões */}
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary flex-grow-1"
                      disabled={loading}
                    >
                      <FaSave className="me-2" />
                      {loading ? "Salvando..." : "Criar Evento"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => router.back()}
                    >
                      <FaTimes className="me-2" />
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
