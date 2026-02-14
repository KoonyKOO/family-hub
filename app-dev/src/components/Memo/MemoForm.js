import React, { useState } from 'react';

const COLOR_OPTIONS = [
  { value: '#fef3c7', label: 'Yellow' },
  { value: '#fce7f3', label: 'Pink' },
  { value: '#dbeafe', label: 'Blue' },
  { value: '#d1fae5', label: 'Green' },
  { value: '#f3e8ff', label: 'Purple' },
];

const MemoForm = ({ memo, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    content: memo?.content || '',
    color: memo?.color || '#fef3c7',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    onSubmit({ ...formData, id: memo?.id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {memo ? 'Edit Memo' : 'New Memo'}
      </h3>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <div>
        <label htmlFor="memo-content" className="mb-1 block text-sm font-medium text-gray-700">Content</label>
        <textarea
          id="memo-content"
          value={formData.content}
          onChange={(e) => { setFormData((prev) => ({ ...prev, content: e.target.value })); if (error) setError(''); }}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-gray-700">Color</span>
        <div className="flex gap-2">
          {COLOR_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, color: value }))}
              className={`h-8 w-8 rounded-full border-2 ${formData.color === value ? 'border-gray-800 ring-2 ring-gray-300' : 'border-transparent'}`}
              style={{ backgroundColor: value }}
              aria-label={label}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {memo ? 'Update' : 'Create'}
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

export default MemoForm;
