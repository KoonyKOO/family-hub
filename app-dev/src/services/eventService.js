import api from './api';

const eventService = {
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/events${query ? `?${query}` : ''}`);
  },
  createEvent: (event) => api.post('/api/events', event),
  updateEvent: (id, event) => api.put(`/api/events/${id}`, event),
  deleteEvent: (id) => api.delete(`/api/events/${id}`),
};

export default eventService;
