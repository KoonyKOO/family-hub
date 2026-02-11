import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Calendar from './Calendar';
import eventService from '../../services/eventService';

jest.mock('../../services/eventService');

describe('Calendar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    eventService.getEvents.mockResolvedValue({ events: [] });
  });

  test('renders calendar heading', async () => {
    render(<Calendar />);
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  test('renders month navigation arrows', () => {
    render(<Calendar />);
    expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
    expect(screen.getByLabelText('Next month')).toBeInTheDocument();
  });

  test('shows empty state for selected date', async () => {
    render(<Calendar />);
    await waitFor(() => {
      expect(screen.getByText('No events for this date')).toBeInTheDocument();
    });
  });

  test('navigates to next month', async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    expect(screen.getByText(currentMonth)).toBeInTheDocument();

    await user.click(screen.getByLabelText('Next month'));
    expect(eventService.getEvents).toHaveBeenCalledTimes(2);
  });

  test('shows event form when add is clicked', async () => {
    const user = userEvent.setup();
    render(<Calendar />);

    await waitFor(() => {
      expect(screen.getByText('Add event')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Add event'));
    expect(screen.getByText('New Event')).toBeInTheDocument();
  });

  test('displays events for selected date', async () => {
    const today = new Date().toISOString().slice(0, 10);
    eventService.getEvents.mockResolvedValue({
      events: [{ id: '1', title: 'Test Event', date: today, time: '09:00' }],
    });

    render(<Calendar />);
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
  });
});
