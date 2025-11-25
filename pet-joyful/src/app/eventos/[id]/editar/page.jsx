"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import eventService from "@/app/services/eventService";
import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function EditarEventoPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    requirements: [],
    activities: [],
    organizer: {
      name: "",
      phone: "",
      email: "",
    },
    status: "upcoming",
  });

  useEffect(() => {
    if (params.id) {
      loadEventData();
    }
  }, [params.id]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getEventById(params.id);
      const event = response.data || response;

      // Formatar datas para o formato datetime-local
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        title: event.title || "",
        description: event.description || "",
        eventType: event.eventType || "adoption_fair",
        startDate: event.startDate ? formatDateForInput(event.startDate) : "",
        endDate: event.endDate ? formatDateForInput(event.endDate) : "",
        location: {
          address: event.location?.address || "",
          city: event.location?.city || "",
          state: event.location?.state || "",
          zipCode: event.location?.zipCode || "",
        },
        maxParticipants: event.maxParticipants || "",
        imageUrl: event.imageUrl || "",
        requirements: event.requirements || [],
        activities: event.activities || [],
        organizer: {
          name: event.organizer?.name || "",
          phone: event.organizer?.phone || "",
          email: event.organizer?.email || "",
        },
        status: event.status || "upcoming",
      });
    } catch (err) {
      setError("Erro ao carregar dados do evento.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validar campos obrigatórios
      if (!formData.title || !formData.description || !formData.startDate) {
        throw new Error("Por favor, preencha todos os campos obrigatórios.");
      }

      if (!formData.location.city || !formData.location.state) {
        throw new Error("Por favor, preencha cidade e estado.");
      }

      // Garantir que endDate existe (o backend exige)
      if (!formData.endDate) {
        throw new Error("Por favor, preencha a data de término do evento.");
      }

      // Preparar dados no formato exato que o backend espera
      const cleanedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventType: formData.eventType,
        startDate: formData.startDate,
        endDate: formData.endDate, // Backend exige este campo
        location: {
          address: formData.location.address?.trim() || "",
          city: formData.location.city.trim(),
          state: formData.location.state.trim(),
          zipCode: formData.location.zipCode?.trim() || "",
        },
      };

      // Adicionar campos opcionais apenas se tiverem valor
      if (formData.maxParticipants && parseInt(formData.maxParticipants) > 0) {
        cleanedData.maxParticipants = parseInt(formData.maxParticipants);
      }

      if (formData.imageUrl && formData.imageUrl.trim()) {
        cleanedData.imageUrl = formData.imageUrl.trim();
      }

      if (formData.requirements.length > 0) {
        cleanedData.requirements = formData.requirements.filter(
          (r) => r && r.trim() !== ""
        );
      }

      if (formData.activities.length > 0) {
        cleanedData.activities = formData.activities.filter(
          (a) => a && a.trim() !== ""
        );
      }

      // Adicionar organizer se houver pelo menos um campo preenchido
      if (
        formData.organizer.name ||
        formData.organizer.phone ||
        formData.organizer.email
      ) {
        cleanedData.organizer = {};
        if (formData.organizer.name?.trim()) {
          cleanedData.organizer.name = formData.organizer.name.trim();
        }
        if (formData.organizer.phone?.trim()) {
          cleanedData.organizer.phone = formData.organizer.phone.trim();
        }
        if (formData.organizer.email?.trim()) {
          cleanedData.organizer.email = formData.organizer.email.trim();
        }
      }

      if (formData.status) {
        cleanedData.status = formData.status;
      }

      console.log("📤 Enviando dados de atualização:", cleanedData);
      console.log("🆔 ID do evento:", params.id);

      const response = await eventService.updateEvent(params.id, cleanedData);

      console.log("✅ Resposta da atualização:", response);

      alert("Evento atualizado com sucesso!");
      router.push(`/eventos/${params.id}`);
    } catch (err) {
      console.error("❌ Erro completo:", err);
      console.error("📋 Resposta do erro:", err.response);
      console.error("📊 Dados do erro:", err.response?.data);
      console.error("🔢 Status do erro:", err.response?.status);
      console.error("📝 Mensagem original:", err.response?.data?.message);
      console.error("⚠️ Detalhes do erro:", err.response?.data?.error);
      console.error("🔍 Stack trace:", err.response?.data?.stack);

      let errorMessage = "Erro ao atualizar evento. Tente novamente.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Adicionar detalhes específicos para erros de permissão
      if (err.response?.status === 403) {
        errorMessage =
          "❌ Sem permissão para atualizar este evento. Apenas o criador pode editar.";
      } else if (err.response?.status === 401) {
        errorMessage = "❌ Você precisa estar logado para atualizar eventos.";
      } else if (err.response?.status === 404) {
        errorMessage = "❌ Evento não encontrado.";
      } else if (err.response?.status === 500) {
        errorMessage = `❌ Erro no servidor: ${
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Erro interno do servidor"
        }`;
      } else if (err.response?.status === 400) {
        errorMessage = `❌ Dados inválidos: ${
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Verifique os campos preenchidos"
        }`;
      }

      setError(errorMessage);
      console.error("💬 Mensagem de erro exibida:", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "50vh" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <button
          className="btn btn-outline-primary mb-4"
          onClick={() => router.push(`/eventos/${params.id}`)}
        >
          <FaArrowLeft className="me-2" />
          Voltar para Detalhes
        </button>

        <div className="card">
          <div className="card-body">
            <h1 className="card-title mb-4">Editar Evento</h1>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Informações Básicas */}
              <div className="row mb-4">
                <div className="col-12">
                  <h4>Informações Básicas</h4>
                  <hr />
                </div>

                <div className="col-md-8 mb-3">
                  <label className="form-label">
                    Título do Evento <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Tipo de Evento <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="eventType"
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

                <div className="col-12 mb-3">
                  <label className="form-label">
                    Descrição <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Data de Início <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Data de Término <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                  <small className="text-muted">
                    Campo obrigatório pelo backend
                  </small>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="upcoming">Em Breve</option>
                    <option value="ongoing">Em Andamento</option>
                    <option value="completed">Finalizado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">URL da Imagem</label>
                  <input
                    type="url"
                    className="form-control"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Número Máximo de Participantes
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>

              {/* Localização */}
              <div className="row mb-4">
                <div className="col-12">
                  <h4>Localização</h4>
                  <hr />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Endereço</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-5 mb-3">
                  <label className="form-label">
                    Cidade <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Estado <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                    maxLength="2"
                    placeholder="SP"
                    required
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">CEP</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location.zipCode"
                    value={formData.location.zipCode}
                    onChange={handleChange}
                    placeholder="00000-000"
                  />
                </div>
              </div>

              {/* Organizador */}
              <div className="row mb-4">
                <div className="col-12">
                  <h4>Informações do Organizador</h4>
                  <hr />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    name="organizer.name"
                    value={formData.organizer.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Telefone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="organizer.phone"
                    value={formData.organizer.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    name="organizer.email"
                    value={formData.organizer.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Requisitos */}
              <div className="row mb-4">
                <div className="col-12">
                  <h4>Requisitos</h4>
                  <hr />
                </div>
                <div className="col-12">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={req}
                        onChange={(e) =>
                          handleArrayChange(
                            "requirements",
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Requisito ${index + 1}`}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeArrayItem("requirements", index)}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => addArrayItem("requirements")}
                  >
                    + Adicionar Requisito
                  </button>
                </div>
              </div>

              {/* Atividades */}
              <div className="row mb-4">
                <div className="col-12">
                  <h4>Atividades</h4>
                  <hr />
                </div>
                <div className="col-12">
                  {formData.activities.map((activity, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={activity}
                        onChange={(e) =>
                          handleArrayChange("activities", index, e.target.value)
                        }
                        placeholder={`Atividade ${index + 1}`}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeArrayItem("activities", index)}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => addArrayItem("activities")}
                  >
                    + Adicionar Atividade
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => router.push(`/eventos/${params.id}`)}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  <FaSave className="me-2" />
                  {submitting ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
