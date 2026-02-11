import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TodoList from './TodoList';
import todoService from '../../services/todoService';

jest.mock('../../services/todoService');

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    todoService.getTodos.mockResolvedValue({ todos: [] });
  });

  test('renders heading and add button', async () => {
    render(<TodoList />);
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('Add Todo')).toBeInTheDocument();
  });

  test('renders filter buttons', () => {
    render(<TodoList />);
    expect(screen.getByText('all')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  test('shows empty state when no todos', async () => {
    render(<TodoList />);
    await waitFor(() => {
      expect(screen.getByText('No todos yet')).toBeInTheDocument();
    });
  });

  test('displays todos from API', async () => {
    todoService.getTodos.mockResolvedValue({
      todos: [
        { id: '1', title: 'Task 1', priority: 'high', completed: false },
        { id: '2', title: 'Task 2', priority: 'low', completed: false },
      ],
    });

    render(<TodoList />);
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  test('shows form when Add Todo is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.click(screen.getByText('Add Todo'));
    expect(screen.getByText('New Todo')).toBeInTheDocument();
  });

  test('filters active todos', async () => {
    todoService.getTodos.mockResolvedValue({
      todos: [
        { id: '1', title: 'Active Task', priority: 'medium', completed: false },
        { id: '2', title: 'Done Task', priority: 'medium', completed: true },
      ],
    });

    const user = userEvent.setup();
    render(<TodoList />);

    await waitFor(() => expect(screen.getByText('Active Task')).toBeInTheDocument());

    await user.click(screen.getByText('active'));
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.queryByText('Done Task')).not.toBeInTheDocument();
  });

  test('filters completed todos', async () => {
    todoService.getTodos.mockResolvedValue({
      todos: [
        { id: '1', title: 'Active Task', priority: 'medium', completed: false },
        { id: '2', title: 'Done Task', priority: 'medium', completed: true },
      ],
    });

    const user = userEvent.setup();
    render(<TodoList />);

    await waitFor(() => expect(screen.getByText('Done Task')).toBeInTheDocument());

    await user.click(screen.getByText('completed'));
    expect(screen.queryByText('Active Task')).not.toBeInTheDocument();
    expect(screen.getByText('Done Task')).toBeInTheDocument();
  });
});
