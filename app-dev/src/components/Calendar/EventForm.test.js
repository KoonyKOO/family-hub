import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EventForm from './EventForm';

describe('EventForm', () => {
  const defaultProps = {
    date: '2024-01-15',
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  test('renders new event form', () => {
    render(<EventForm {...defaultProps} />);
    expect(screen.getByText('New Event')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  test('renders edit event form with pre-filled data', () => {
    const event = { id: '1', title: 'Meeting', description: 'Sync', date: '2024-01-15', time: '10:00', color: '#ef4444' };
    render(<EventForm {...defaultProps} event={event} />);
    expect(screen.getByText('Edit Event')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('Meeting');
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  test('shows error when title is empty', async () => {
    const user = userEvent.setup();
    render(<EventForm {...defaultProps} />);

    await user.click(screen.getByText('Create'));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  test('calls onSubmit with form data', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(<EventForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Title'), 'New meeting');
    await user.click(screen.getByText('Create'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New meeting', date: '2024-01-15' })
    );
  });

  test('calls onCancel when cancel is clicked', async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();
    render(<EventForm {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  test('allows color selection', async () => {
    const user = userEvent.setup();
    render(<EventForm {...defaultProps} />);

    const colorBtn = screen.getByLabelText('Color #ef4444');
    await user.click(colorBtn);

    await user.type(screen.getByLabelText('Title'), 'Test');
    await user.click(screen.getByText('Create'));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ color: '#ef4444' })
    );
  });
});
