import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SignupPage from './SignupPage';
import { AuthProvider } from '../contexts/AuthContext';

jest.mock('../services/authService');

describe('SignupPage', () => {
  test('renders signup form and login link', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <SignupPage />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/)).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
