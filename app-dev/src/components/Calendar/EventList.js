import React from 'react';

const EventList = ({ events = [], isPending, onEdit, onDelete, onAdd }) => {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">No events for this date</p>
        <button
          onClick={onAdd}
          className="mt-2 text-sm font-medium text-blue-600 hover:underline"
        >
          Add event
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Events</h3>
        <button
          onClick={onAdd}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.id}
            className={`rounded-lg border border-gray-200 p-2.5 sm:p-3 transition-opacity ${isPending?.(event.id) ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-2">
              {event.color && (
                <span
                  className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">{event.title}</p>
                {event.time && <p className="mt-0.5 text-xs text-gray-500">{event.time}</p>}
                {event.description && (
                  <p className="mt-1 text-xs text-gray-500">{event.description}</p>
                )}
              </div>
            </div>
            <div className="mt-1.5 flex justify-end gap-1">
              <button
                onClick={() => onEdit(event)}
                className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
