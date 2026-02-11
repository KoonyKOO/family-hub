import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoPage from './TodoPage';

jest.mock('../services/todoService');

describe('TodoPage', () => {
  test('renders todo list component', () => {
    render(<TodoPage />);
    expect(screen.getByText('Todos')).toBeInTheDocument();
  });
});
