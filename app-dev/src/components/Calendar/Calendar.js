import React, { useState, useEffect, useCallback } from 'react';
import CalendarGrid from './CalendarGrid';
import EventList from './EventList';
import EventForm from './EventForm';
import eventService from '../../services/eventService';

const Calendar = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(now.toISOString().slice(0, 10));
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState('');

  const monthLabel = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  const fetchEvents = useCallback(async () => {
    try {
      const data = await eventService.getEvents({ year, month: month + 1 });
      setEvents(data.events || []);
    } catch {
      setEvents([]);
    }
  }, [year, month]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const navigateMonth = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setMonth(newMonth);
    setYear(newYear);
  };

  const eventsForDate = events.filter((e) => e.date?.slice(0, 10) === selectedDate);

  const handleSubmitEvent = async (formData) => {
    try {
      setError('');
      if (formData.id) {
        await eventService.updateEvent(formData.id, formData);
      } else {
        await eventService.createEvent(formData);
      }
      setShowForm(false);
      setEditingEvent(null);
      await fetchEvents();
    } catch (err) {
      setError(err.message || 'Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await eventService.deleteEvent(id);
      await fetchEvents();
    } catch (err) {
      setError(err.message || 'Failed to delete event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-800">Calendar</h2>
      {error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => navigateMonth(-1)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              aria-label="Previous month"
            >
              &larr;
            </button>
            <span className="text-sm font-semibold text-gray-700">{monthLabel}</span>
            <button
              onClick={() => navigateMonth(1)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              aria-label="Next month"
            >
              &rarr;
            </button>
          </div>
          <CalendarGrid
            year={year}
            month={month}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            events={events}
          />
        </div>

        <div>
          {showForm ? (
            <EventForm
              event={editingEvent}
              date={selectedDate}
              onSubmit={handleSubmitEvent}
              onCancel={() => { setShowForm(false); setEditingEvent(null); }}
            />
          ) : (
            <EventList
              events={eventsForDate}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
