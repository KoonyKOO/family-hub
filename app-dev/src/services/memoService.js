import api from './api';

const memoService = {
  getMemos: () => api.get('/api/memos'),
  createMemo: (memo) => api.post('/api/memos', memo),
  updateMemo: (id, memo) => api.put(`/api/memos/${id}`, memo),
  deleteMemo: (id) => api.delete(`/api/memos/${id}`),
};

export default memoService;
