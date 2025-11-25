"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import eventService from "@/app/services/eventService";
import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaShare,
} from "react-icons/fa";

export default function EventoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadEventDetails();
    }
  }, [params.id]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getEventById(params.id);
      setEvent(response.data || response);
    } catch (err) {
      setError("Erro ao carregar detalhes do evento.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventTypeLabel = (type) => {
    const types = {
      adoption_fair: "Feira de Adoção",
      vaccination_campaign: "Campanha de Vacinação",
      awareness: "Conscientização",
      workshop: "Workshop",
      other: "Outro",
    };
    return types[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { label: "Em Breve", class: "badge bg-primary" },
      ongoing: { label: "Em Andamento", class: "badge bg-success" },
      completed: { label: "Finalizado", class: "badge bg-secondary" },
      cancelled: { label: "Cancelado", class: "badge bg-danger" },
    };
    return badges[status] || badges.upcoming;
  };

  const handleParticipate = () => {
    // Implementar lógica de inscrição
    setIsParticipating(true);
    alert("Inscrição realizada com sucesso!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        setLoading(true);
        await eventService.deleteEvent(params.id);
        alert("Evento excluído com sucesso!");
        router.push("/eventos");
      } catch (err) {
        setLoading(false);
        const errorMessage =
          err.response?.data?.message ||
          "Erro ao excluir evento. Tente novamente.";
        alert(errorMessage);
        console.error("Erro ao excluir evento:", err);
      }
    }
  };

  const handleEdit = () => {
    router.push(`/eventos/${params.id}/editar`);
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

  if (error || !event) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error || "Evento não encontrado"}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/eventos")}
          >
            <FaArrowLeft className="me-2" />
            Voltar para Eventos
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const badge = getStatusBadge(event.status);
  const isEventFull =
    event.maxParticipants && event.currentParticipants >= event.maxParticipants;

  return (
    <>
      <Header />
      <div className="container py-5">
        {/* Botão Voltar */}
        <button
          className="btn btn-outline-primary mb-4"
          onClick={() => router.push("/eventos")}
        >
          <FaArrowLeft className="me-2" />
          Voltar para Eventos
        </button>

        <div className="row">
          {/* Coluna Principal */}
          <div className="col-lg-8">
            {/* Imagem do Evento */}
            <div className="card mb-4">
              <div
                style={{
                  height: "400px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    className="card-img-top"
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <FaCalendar size={80} color="white" />
                  </div>
                )}
                <span
                  className={badge.class}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    fontSize: "1rem",
                    padding: "8px 16px",
                  }}
                >
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Detalhes do Evento */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <small className="text-primary fw-bold text-uppercase">
                      {getEventTypeLabel(event.eventType)}
                    </small>
                    <h1 className="display-5 mb-0">{event.title}</h1>
                  </div>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleShare}
                  >
                    <FaShare />
                  </button>
                </div>

                <hr />

                <h4 className="mb-3">Sobre o Evento</h4>
                <p className="lead" style={{ whiteSpace: "pre-line" }}>
                  {event.description}
                </p>

                {event.requirements && event.requirements.length > 0 && (
                  <>
                    <hr />
                    <h4 className="mb-3">Requisitos</h4>
                    <ul>
                      {event.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </>
                )}

                {event.activities && event.activities.length > 0 && (
                  <>
                    <hr />
                    <h4 className="mb-3">Atividades</h4>
                    <ul>
                      {event.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Card de Inscrição */}
            <div className="card mb-4 sticky-top" style={{ top: "20px" }}>
              <div className="card-body">
                <h5 className="card-title mb-4">Informações</h5>

                {/* Data e Hora */}
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaCalendar className="me-2 text-primary" />
                    <strong>Data de Início</strong>
                  </div>
                  <p className="ms-4 mb-0">
                    {formatDate(event.startDate)}
                    <br />
                    <small className="text-muted">
                      {formatTime(event.startDate)}
                    </small>
                  </p>
                </div>

                {event.endDate && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaClock className="me-2 text-primary" />
                      <strong>Data de Término</strong>
                    </div>
                    <p className="ms-4 mb-0">
                      {formatDate(event.endDate)}
                      <br />
                      <small className="text-muted">
                        {formatTime(event.endDate)}
                      </small>
                    </p>
                  </div>
                )}

                <hr />

                {/* Localização */}
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaMapMarkerAlt className="me-2 text-danger" />
                    <strong>Localização</strong>
                  </div>
                  <p className="ms-4 mb-0">
                    {event.location.address && (
                      <>
                        {event.location.address}
                        <br />
                      </>
                    )}
                    {event.location.city}, {event.location.state}
                    {event.location.zipCode && (
                      <>
                        <br />
                        CEP: {event.location.zipCode}
                      </>
                    )}
                  </p>
                </div>

                <hr />

                {/* Participantes */}
                {event.maxParticipants && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaUsers className="me-2 text-success" />
                      <strong>Participantes</strong>
                    </div>
                    <div className="ms-4">
                      <div className="progress mb-2" style={{ height: "25px" }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${
                              (event.currentParticipants /
                                event.maxParticipants) *
                              100
                            }%`,
                          }}
                          aria-valuenow={event.currentParticipants}
                          aria-valuemin="0"
                          aria-valuemax={event.maxParticipants}
                        >
                          {event.currentParticipants}/{event.maxParticipants}
                        </div>
                      </div>
                      {isEventFull && (
                        <small className="text-danger">Vagas esgotadas</small>
                      )}
                    </div>
                  </div>
                )}

                <hr />

                {/* Contato */}
                {(event.organizer?.phone || event.organizer?.email) && (
                  <div className="mb-4">
                    <h6 className="mb-3">Contato do Organizador</h6>
                    {event.organizer.phone && (
                      <div className="d-flex align-items-center mb-2">
                        <FaPhone className="me-2 text-primary" />
                        <small>{event.organizer.phone}</small>
                      </div>
                    )}
                    {event.organizer.email && (
                      <div className="d-flex align-items-center">
                        <FaEnvelope className="me-2 text-primary" />
                        <small>{event.organizer.email}</small>
                      </div>
                    )}
                  </div>
                )}

                {/* Botão de Inscrição */}
                {event.status === "upcoming" && !isEventFull && (
                  <button
                    className={`btn ${
                      isParticipating ? "btn-success" : "btn-primary"
                    } w-100 mb-2`}
                    onClick={handleParticipate}
                    disabled={isParticipating}
                  >
                    <FaUserPlus className="me-2" />
                    {isParticipating ? "Inscrito!" : "Participar do Evento"}
                  </button>
                )}

                {isEventFull && event.status === "upcoming" && (
                  <button className="btn btn-secondary w-100 mb-2" disabled>
                    Vagas Esgotadas
                  </button>
                )}

                {/* Botões de Ação (Admin) */}
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleEdit}
                    disabled={loading}
                  >
                    <FaEdit className="me-2" />
                    Editar
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    <FaTrash className="me-2" />
                    {loading ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
