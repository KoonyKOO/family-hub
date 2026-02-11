import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EventList from './EventList';

describe('EventList', () => {
  const mockEvents = [
    { id: '1', title: 'Meeting', time: '10:00', description: 'Team sync', color: '#3b82f6' },
    { id: '2', title: 'Lunch', time: '12:00', color: '#ef4444' },
  ];

  test('shows empty state when no events', () => {
    render(<EventList events={[]} onAdd={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('No events for this date')).toBeInTheDocument();
    expect(screen.getByText('Add event')).toBeInTheDocument();
  });

  test('renders events with title and time', () => {
    render(<EventList events={mockEvents} onAdd={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Meeting')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', async () => {
    const onEdit = jest.fn();
    const user = userEvent.setup();
    render(<EventList events={mockEvents} onAdd={jest.fn()} onEdit={onEdit} onDelete={jest.fn()} />);

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockEvents[0]);
  });

  test('calls onDelete when delete button is clicked', async () => {
    const onDelete = jest.fn();
    const user = userEvent.setup();
    render(<EventList events={mockEvents} onAdd={jest.fn()} onEdit={jest.fn()} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('calls onAdd when add button is clicked', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();
    render(<EventList events={mockEvents} onAdd={onAdd} onEdit={jest.fn()} onDelete={jest.fn()} />);

    await user.click(screen.getByText('Add'));
    expect(onAdd).toHaveBeenCalled();
  });
});
