import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from './AuthContext';
import authService from '../services/authService';

jest.mock('../services/authService');

const TestConsumer = () => {
  const { user, login, signup, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.name : 'null'}</span>
      <button onClick={() => login({ email: 'a@b.com', password: '12345678' })}>Login</button>
      <button onClick={() => signup({ name: 'John', email: 'a@b.com', password: '12345678' })}>Signup</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const renderWithProvider = () => {
  const user = userEvent.setup();
  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
  return { user };
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('starts with null user', () => {
    renderWithProvider();
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });

  test('login sets user and stores in localStorage', async () => {
    authService.login.mockResolvedValue({ user: { id: '1', name: 'Alice', email: 'a@b.com' } });
    const { user } = renderWithProvider();

    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Alice');
    });
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: '1', name: 'Alice', email: 'a@b.com' });
  });

  test('signup sets user and stores in localStorage', async () => {
    authService.signup.mockResolvedValue({ user: { id: '2', name: 'John', email: 'a@b.com' } });
    const { user } = renderWithProvider();

    await user.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('John');
    });
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: '2', name: 'John', email: 'a@b.com' });
  });

  test('logout clears user and localStorage', async () => {
    authService.login.mockResolvedValue({ user: { id: '1', name: 'Alice', email: 'a@b.com' } });
    const { user } = renderWithProvider();

    await user.click(screen.getByText('Login'));
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('Alice'));

    await user.click(screen.getByText('Logout'));
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(localStorage.getItem('user')).toBeNull();
  });

  test('loads user from localStorage on mount', () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Stored', email: 's@b.com' }));
    renderWithProvider();
    expect(screen.getByTestId('user')).toHaveTextContent('Stored');
  });

  test('throws if useAuth is used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within an AuthProvider');
    spy.mockRestore();
  });
});
