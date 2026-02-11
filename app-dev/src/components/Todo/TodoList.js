import React, { useState, useEffect, useCallback } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import todoService from '../../services/todoService';

const FILTERS = ['all', 'active', 'completed'];

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(data.todos || []);
    } catch {
      setTodos([]);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
  });

  const handleSubmit = async (formData) => {
    try {
      setError('');
      if (formData.id) {
        await todoService.updateTodo(formData.id, formData);
      } else {
        await todoService.createTodo(formData);
      }
      setShowForm(false);
      setEditingTodo(null);
      await fetchTodos();
    } catch (err) {
      setError(err.message || 'Failed to save todo');
    }
  };

  const handleToggle = async (todo) => {
    try {
      setError('');
      await todoService.updateTodo(todo.id, { ...todo, completed: !todo.completed });
      await fetchTodos();
    } catch (err) {
      setError(err.message || 'Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await todoService.deleteTodo(id);
      await fetchTodos();
    } catch (err) {
      setError(err.message || 'Failed to delete todo');
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Todos</h2>
        <button
          onClick={() => { setEditingTodo(null); setShowForm(true); }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Todo
        </button>
      </div>

      {error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}

      {showForm && (
        <div className="mb-4">
          <TodoForm
            todo={editingTodo}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingTodo(null); }}
          />
        </div>
      )}

      <div className="mb-4 flex gap-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {sortedTodos.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No todos yet</p>
      ) : (
        <ul className="space-y-2">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
