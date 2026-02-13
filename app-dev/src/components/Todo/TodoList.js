import React, { useState, useCallback } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import todoService from '../../services/todoService';
import useOptimisticList from '../../hooks/useOptimisticList';
import usePolling from '../../hooks/usePolling';
import useSyncChannel from '../../hooks/useSyncChannel';
import useOnlineStatus from '../../hooks/useOnlineStatus';

const FILTERS = ['all', 'active', 'completed'];

const TodoList = () => {
  const { items: todos, setItems: setTodos, optimisticAdd, optimisticUpdate, optimisticDelete, isPending } = useOptimisticList();
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [error, setError] = useState('');
  const isOnline = useOnlineStatus();

  const fetchTodos = useCallback(async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(data.todos || []);
    } catch {
      // Keep existing data on fetch failure
    }
  }, [setTodos]);

  const { triggerNow } = usePolling(fetchTodos, { intervalMs: 15000, enabled: isOnline });
  useSyncChannel('todos:changed', triggerNow);

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
        await optimisticUpdate(formData.id, formData,
          () => todoService.updateTodo(formData.id, formData)
        );
      } else {
        await optimisticAdd(
          { ...formData, completed: false, priority: formData.priority || 'medium' },
          () => todoService.createTodo(formData)
        );
      }
      setShowForm(false);
      setEditingTodo(null);
    } catch (err) {
      setError(err.message || 'Failed to save todo');
    }
  };

  const handleToggle = async (todo) => {
    try {
      setError('');
      await optimisticUpdate(todo.id, { completed: !todo.completed },
        () => todoService.updateTodo(todo.id, { ...todo, completed: !todo.completed })
      );
    } catch (err) {
      setError(err.message || 'Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await optimisticDelete(id, () => todoService.deleteTodo(id));
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
              isPending={isPending(todo.id)}
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
