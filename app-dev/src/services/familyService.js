import api from './api';

const familyService = {
  getFamily: () => api.get('/api/family'),
  createFamily: (name) => api.post('/api/family', { name }),
  joinFamily: (inviteCode) => api.post('/api/family/join', { inviteCode }),
  leaveFamily: () => api.post('/api/family/leave'),
  getMembers: () => api.get('/api/family/members'),
};

export default familyService;
