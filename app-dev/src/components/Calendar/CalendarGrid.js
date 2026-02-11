import React from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const CalendarGrid = ({ year, month, selectedDate, onSelectDate, events = [] }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const eventsByDate = {};
  events.forEach((event) => {
    const d = event.date?.slice(0, 10);
    if (d) {
      eventsByDate[d] = (eventsByDate[d] || 0) + 1;
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="h-12" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isSelected = selectedDate === dateStr;
    const hasEvents = eventsByDate[dateStr] > 0;
    const isToday = dateStr === new Date().toISOString().slice(0, 10);

    cells.push(
      <button
        key={day}
        onClick={() => onSelectDate(dateStr)}
        className={`relative flex h-12 items-center justify-center rounded-lg text-sm font-medium transition-colors
          ${isSelected ? 'bg-blue-600 text-white' : ''}
          ${!isSelected && isToday ? 'bg-blue-50 text-blue-600' : ''}
          ${!isSelected && !isToday ? 'text-gray-700 hover:bg-gray-100' : ''}
        `}
        aria-label={`${dateStr}${hasEvents ? ', has events' : ''}`}
      >
        {day}
        {hasEvents && (
          <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
        )}
      </button>
    );
  }

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{cells}</div>
    </div>
  );
};

export default CalendarGrid;
