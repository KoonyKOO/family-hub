import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TodoForm from './TodoForm';

describe('TodoForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  test('renders new todo form', () => {
    render(<TodoForm {...defaultProps} />);
    expect(screen.getByText('New Todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  test('renders edit todo form with pre-filled data', () => {
    const todo = { id: '1', title: 'Task', description: 'Desc', priority: 'high', dueDate: '2024-01-20' };
    render(<TodoForm {...defaultProps} todo={todo} />);
    expect(screen.getByText('Edit Todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('Task');
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  test('shows error when title is empty', async () => {
    const user = userEvent.setup();
    render(<TodoForm {...defaultProps} />);

    await user.click(screen.getByText('Create'));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  test('calls onSubmit with form data', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(<TodoForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Title'), 'New task');
    await user.click(screen.getByText('Create'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New task', priority: 'medium' })
    );
  });

  test('calls onCancel when cancel is clicked', async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();
    render(<TodoForm {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
