import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CalendarGrid from './CalendarGrid';

describe('CalendarGrid', () => {
  const defaultProps = {
    year: 2024,
    month: 0, // January
    selectedDate: '2024-01-15',
    onSelectDate: jest.fn(),
    events: [],
  };

  test('renders day headers', () => {
    render(<CalendarGrid {...defaultProps} />);
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  test('renders correct number of days for January', () => {
    render(<CalendarGrid {...defaultProps} />);
    expect(screen.getByText('31')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('calls onSelectDate when a day is clicked', async () => {
    const user = userEvent.setup();
    render(<CalendarGrid {...defaultProps} />);

    await user.click(screen.getByText('10'));
    expect(defaultProps.onSelectDate).toHaveBeenCalledWith('2024-01-10');
  });

  test('shows event indicator when events exist for a date', () => {
    const events = [{ id: '1', title: 'Test', date: '2024-01-15' }];
    render(<CalendarGrid {...defaultProps} events={events} />);

    const btn = screen.getByLabelText('2024-01-15, has events');
    expect(btn).toBeInTheDocument();
  });

  test('renders February correctly (non-leap year)', () => {
    render(<CalendarGrid {...defaultProps} year={2023} month={1} />);
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.queryByText('29')).not.toBeInTheDocument();
  });
});
