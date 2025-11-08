"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import eventService from '../../services/eventService';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaClock, FaUserPlus, FaUserMinus } from 'react-icons/fa';

export default function EventoDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await eventService.getById(id);
      setEvent(response.data);
    } catch (err) {
      setError('Erro ao carregar evento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!confirm('Deseja se inscrever neste evento?')) return;
    
    try {
      setRegistering(true);
      await eventService.register(id);
      alert('Inscrição realizada com sucesso!');
      loadEvent();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao se inscrever');
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!confirm('Deseja cancelar sua inscrição?')) return;
    
    try {
      setRegistering(true);
      await eventService.unregister(id);
      alert('Inscrição cancelada!');
      loadEvent();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao cancelar inscrição');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container py-5">
      <button className="btn btn-link mb-3" onClick={() => router.back()}>
        ← Voltar
      </button>

      <div className="row">
        <div className="col-lg-8">
          {/* Imagem */}
          {event.imageUrl && (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="img-fluid rounded mb-4"
              style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            />
          )}

          {/* Título e Descrição */}
          <h1 className="display-5 mb-3">{event.title}</h1>
          <p className="lead text-muted">{event.description}</p>

          {/* Informações Detalhadas */}
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Informações do Evento</h5>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <FaCalendar className="me-2 text-primary" />
                    <div>
                      <small className="text-muted d-block">Início</small>
                      <strong>{formatDate(event.startDate)}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <FaClock className="me-2 text-primary" />
                    <div>
                      <small className="text-muted d-block">Término</small>
                      <strong>{formatDate(event.endDate)}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <hr />
                </div>

                <div className="col-md-12">
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2 text-danger" />
                    <div>
                      <small className="text-muted d-block">Localização</small>
                      <strong>
                        {event.location.address}<br />
                        {event.location.city}, {event.location.state} - {event.location.zipCode}
                      </strong>
                    </div>
                  </div>
                </div>

                {event.maxParticipants && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <FaUsers className="me-2 text-success" />
                      <div>
                        <small className="text-muted d-block">Participantes</small>
                        <strong>{event.currentParticipants} / {event.maxParticipants}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h5 className="card-title mb-3">Ações</h5>
              
              <button 
                className="btn btn-primary w-100 mb-2"
                onClick={handleRegister}
                disabled={registering}
              >
                <FaUserPlus className="me-2" />
                {registering ? 'Processando...' : 'Inscrever-se'}
              </button>

              <button 
                className="btn btn-outline-danger w-100"
                onClick={handleUnregister}
                disabled={registering}
              >
                <FaUserMinus className="me-2" />
                Cancelar Inscrição
              </button>

              <hr />

              <div className="text-center">
                <span className={`badge ${
                  event.status === 'upcoming' ? 'bg-primary' :
                  event.status === 'ongoing' ? 'bg-success' :
                  event.status === 'completed' ? 'bg-secondary' : 'bg-danger'
                }`}>
                  {event.status === 'upcoming' ? 'Em Breve' :
                   event.status === 'ongoing' ? 'Em Andamento' :
                   event.status === 'completed' ? 'Finalizado' : 'Cancelado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}