import React, { useState } from 'react';

const TodoForm = ({ todo, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    priority: todo?.priority || 'medium',
    dueDate: todo?.dueDate || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({ ...formData, id: todo?.id, completed: todo?.completed || false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {todo ? 'Edit Todo' : 'New Todo'}
      </h3>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <div>
        <label htmlFor="todo-title" className="mb-1 block text-sm font-medium text-gray-700">Title</label>
        <input
          id="todo-title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="todo-description" className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="todo-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="todo-priority" className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="todo-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="todo-dueDate" className="mb-1 block text-sm font-medium text-gray-700">Due Date</label>
          <input
            id="todo-dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {todo ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
