import api from './api';

const todoService = {
  getTodos: () => api.get('/api/todos'),
  createTodo: (todo) => api.post('/api/todos', todo),
  updateTodo: (id, todo) => api.put(`/api/todos/${id}`, todo),
  deleteTodo: (id) => api.delete(`/api/todos/${id}`),
};

export default todoService;
