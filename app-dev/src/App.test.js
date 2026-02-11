import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./services/authService');
jest.mock('./services/familyService');
jest.mock('./services/eventService');
jest.mock('./services/todoService');

const renderApp = (route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
};

describe('App', () => {
  beforeEach(() => localStorage.clear());

  test('renders login page at /login', () => {
    renderApp('/login');
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  test('renders signup page at /signup', () => {
    renderApp('/signup');
    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
  });

  test('redirects unauthenticated user to /login', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  test('renders dashboard with calendar and todos when authenticated', () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Alice', email: 'a@b.com' }));
    renderApp('/');
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Todos' })).toBeInTheDocument();
  });
});
