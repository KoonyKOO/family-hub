import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TodoItem from './TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk and eggs',
    priority: 'high',
    dueDate: '2024-01-20',
    completed: false,
  };

  const defaultProps = {
    todo: mockTodo,
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  test('renders todo title and priority badge', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  test('renders description and due date', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText('Milk and eggs')).toBeInTheDocument();
    expect(screen.getByText('Due: 2024-01-20')).toBeInTheDocument();
  });

  test('renders checkbox that reflects completed state', () => {
    render(<TodoItem {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    await user.click(screen.getByRole('checkbox'));
    expect(defaultProps.onToggle).toHaveBeenCalledWith(mockTodo);
  });

  test('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    await user.click(screen.getByText('Edit'));
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTodo);
  });

  test('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    await user.click(screen.getByText('Delete'));
    expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
  });

  test('shows line-through when completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem {...defaultProps} todo={completedTodo} />);
    const title = screen.getByText('Buy groceries');
    expect(title).toHaveClass('line-through');
  });
});
