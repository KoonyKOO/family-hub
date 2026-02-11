import React, { useState } from 'react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

const TIME_OPTIONS = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const label = `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
    TIME_OPTIONS.push({ val, label });
  }
}

const EventForm = ({ event, date, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date?.slice(0, 10) || date || '',
    time: event?.time || '',
    color: event?.color || COLORS[0],
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
    if (!formData.date) {
      setError('Date is required');
      return;
    }
    onSubmit({ ...formData, id: event?.id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {event ? 'Edit Event' : 'New Event'}
      </h3>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <div>
        <label htmlFor="event-title" className="mb-1 block text-sm font-medium text-gray-700">Title</label>
        <input
          id="event-title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="event-description" className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="event-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="event-date" className="mb-1 block text-sm font-medium text-gray-700">Date</label>
          <input
            id="event-date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="event-time" className="mb-1 block text-sm font-medium text-gray-700">Time</label>
          <select
            id="event-time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No time</option>
            {TIME_OPTIONS.map(({ val, label }) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-gray-700">Color</span>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, color: c }))}
              className={`h-8 w-8 rounded-full border-2 ${
                formData.color === c ? 'border-gray-800' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {event ? 'Update' : 'Create'}
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

export default EventForm;
