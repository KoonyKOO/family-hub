import React, { useState, useCallback } from 'react';
import CalendarGrid from './CalendarGrid';
import EventList from './EventList';
import EventForm from './EventForm';
import eventService from '../../services/eventService';
import useOptimisticList from '../../hooks/useOptimisticList';
import usePolling from '../../hooks/usePolling';
import useSyncChannel from '../../hooks/useSyncChannel';
import useOnlineStatus from '../../hooks/useOnlineStatus';

const Calendar = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(now.toISOString().slice(0, 10));
  const { items: events, setItems: setEvents, optimisticAdd, optimisticUpdate, optimisticDelete, isPending } = useOptimisticList();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState('');
  const isOnline = useOnlineStatus();

  const monthLabel = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  const fetchEvents = useCallback(async () => {
    try {
      const data = await eventService.getEvents({ year, month: month + 1 });
      setEvents(data.events || []);
    } catch {
      // Keep existing data on fetch failure
    }
  }, [year, month, setEvents]);

  const { triggerNow } = usePolling(fetchEvents, { intervalMs: 15000, enabled: isOnline });
  useSyncChannel('events:changed', triggerNow);

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
        await optimisticUpdate(formData.id, formData,
          () => eventService.updateEvent(formData.id, formData)
        );
      } else {
        await optimisticAdd(
          { ...formData, color: formData.color || '#3b82f6' },
          () => eventService.createEvent(formData)
        );
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      setError(err.message || 'Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await optimisticDelete(id, () => eventService.deleteEvent(id));
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
              isPending={isPending}
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
