"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import eventService from '../../services/eventService';
import { FaSave, FaTimes } from 'react-icons/fa';

export default function CriarEventoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'adoption_fair',
    startDate: '',
    endDate: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    maxParticipants: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
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
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null
      };

      await eventService.create(dataToSend);
      alert('Evento criado com sucesso!');
      router.push('/eventos');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar evento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Criar Novo Evento</h2>

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
                  <label className="form-label fw-bold">Tipo de Evento *</label>
                  <select
                    name="eventType"
                    className="form-select"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                  >
                    <option value="adoption_fair">Feira de Adoção</option>
                    <option value="vaccination_campaign">Campanha de Vacinação</option>
                    <option value="awareness">Conscientização</option>
                    <option value="workshop">Workshop</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                {/* Datas */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Data/Hora Início *</label>
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
                    <label className="form-label fw-bold">Data/Hora Fim *</label>
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
                  <label className="form-label fw-bold">Máximo de Participantes</label>
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
                    {loading ? 'Salvando...' : 'Criar Evento'}
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
  );
}