"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventCard from '../components/EventCard';
import eventService from '../services/eventService';
import { FaPlus, FaFilter } from 'react-icons/fa';

export default function EventosPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    eventType: '',
    city: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadEvents();
  }, [filters, pagination.page]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventService.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      setEvents(response.data);
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          ...response.pagination
        }));
      }
    } catch (err) {
      setError('Erro ao carregar eventos. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ status: '', eventType: '', city: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && events.length === 0) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4">🎉 Eventos</h1>
        <button 
          className="btn btn-primary"
          onClick={() => router.push('/eventos/criar')}
        >
          <FaPlus className="me-2" />
          Criar Evento
        </button>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <FaFilter className="me-2" />
            Filtros
          </h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select 
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="upcoming">Em Breve</option>
                <option value="ongoing">Em Andamento</option>
                <option value="completed">Finalizados</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Tipo</label>
              <select 
                name="eventType"
                className="form-select"
                value={filters.eventType}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="adoption_fair">Feira de Adoção</option>
                <option value="vaccination_campaign">Vacinação</option>
                <option value="awareness">Conscientização</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Cidade</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="Ex: São Paulo"
                value={filters.city}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button 
                className="btn btn-secondary w-100"
                onClick={clearFilters}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-danger ms-3"
            onClick={loadEvents}
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Lista de Eventos */}
      {events.length === 0 && !loading ? (
        <div className="text-center py-5">
          <h3>Nenhum evento encontrado</h3>
          <p className="text-muted">Tente ajustar os filtros ou criar um novo evento</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {events.map(event => (
              <div key={event._id} className="col-md-6 col-lg-4">
                <EventCard event={event} />
              </div>
            ))}
          </div>

          {/* Paginação */}
          {pagination.pages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Anterior
                  </button>
                </li>

                {[...Array(pagination.pages)].map((_, index) => (
                  <li 
                    key={index + 1}
                    className={`page-item ${pagination.page === index + 1 ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    Próxima
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}