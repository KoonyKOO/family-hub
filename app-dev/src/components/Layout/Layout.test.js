import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Layout from './Layout';
import { AuthProvider } from '../../contexts/AuthContext';

jest.mock('../../services/authService');

const renderLayout = () => {
  localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Alice', email: 'a@b.com' }));
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </MemoryRouter>
  );
  return { user };
};

describe('Layout', () => {
  beforeEach(() => localStorage.clear());

  test('renders navigation links', () => {
    renderLayout();
    expect(screen.getByText('Family Hub')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
  });

  test('displays user name', () => {
    renderLayout();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  test('renders logout button', () => {
    renderLayout();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('logout clears user', async () => {
    const { user } = renderLayout();
    await user.click(screen.getByText('Logout'));
    expect(localStorage.getItem('user')).toBeNull();
  });
});
