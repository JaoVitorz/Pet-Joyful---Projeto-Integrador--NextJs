import React from 'react';
import Link from 'next/link';
import { FaCalendar, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const EventCard = ({ event }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeLabel = (type) => {
    const types = {
      adoption_fair: 'Feira de Adoção',
      vaccination_campaign: 'Campanha de Vacinação',
      awareness: 'Conscientização',
      workshop: 'Workshop',
      other: 'Outro'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { label: 'Em Breve', class: 'badge bg-primary' },
      ongoing: { label: 'Em Andamento', class: 'badge bg-success' },
      completed: { label: 'Finalizado', class: 'badge bg-secondary' },
      cancelled: { label: 'Cancelado', class: 'badge bg-danger' }
    };
    return badges[status] || badges.upcoming;
  };

  const badge = getStatusBadge(event.status);

  return (
    <div className="card h-100 shadow-sm">
      {/* Imagem */}
      <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            className="card-img-top" 
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{ 
              height: '100%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <FaCalendar size={60} color="white" />
          </div>
        )}
        <span 
          className={badge.class}
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          {badge.label}
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        {/* Tipo */}
        <small className="text-primary fw-bold text-uppercase mb-2">
          {getEventTypeLabel(event.eventType)}
        </small>

        {/* Título */}
        <h5 className="card-title">{event.title}</h5>

        {/* Descrição */}
        <p className="card-text text-muted" style={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>
          {event.description}
        </p>

        {/* Informações */}
        <div className="mt-auto">
          <div className="d-flex align-items-center mb-2">
            <FaCalendar className="me-2 text-primary" />
            <small>{formatDate(event.startDate)}</small>
          </div>
          
          <div className="d-flex align-items-center mb-2">
            <FaMapMarkerAlt className="me-2 text-danger" />
            <small>{event.location.city}, {event.location.state}</small>
          </div>

          {event.maxParticipants && (
            <div className="d-flex align-items-center mb-3">
              <FaUsers className="me-2 text-success" />
              <small>
                {event.currentParticipants}/{event.maxParticipants} inscritos
              </small>
            </div>
          )}

          {/* Botão */}
          <Link href={`/eventos/${event._id}`}>
            <a className="btn btn-primary w-100">Ver Detalhes</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;