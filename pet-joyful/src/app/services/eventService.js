import api from '../../services/api';

const eventService = {
  // Método esperado pela página de criação: eventService.create(data)
  async create(eventData) {
    try {
      console.log('Criando evento com dados:', eventData);
      const response = await api.post('/api/eventos', eventData);
      console.log('Resposta da API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async getEvents(query = {}) {
    try {
      const { status, eventType, city, page = 1, limit = 9 } = query;
      const params = {
        status,
        eventType,
        city,
        page,
        limit
      };
      
      // Remove empty params
      Object.keys(params).forEach(key => 
        (params[key] === undefined || params[key] === '') && delete params[key]
      );

      const response = await api.get('/api/eventos', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getEventById(id) {
    try {
      const response = await api.get(`/eventos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Compatibilidade com código existente
  async getById(id) {
    return await eventService.getEventById(id);
  },

  async getAll(query) {
    // query pode conter page/limit/filters
    // Mapeia para getEvents
    return await eventService.getEvents(query);
  },

  async updateEvent(id, eventData) {
    try {
      const response = await api.put(`/eventos/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteEvent(id) {
    try {
      await api.delete(`/eventos/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default eventService;
