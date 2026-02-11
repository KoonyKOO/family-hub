import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  const setup = (props = {}) => {
    const user = userEvent.setup();
    const onSubmit = jest.fn(() => Promise.resolve());
    render(<LoginForm onSubmit={onSubmit} {...props} />);
    return { user, onSubmit };
  };

  test('renders email, password fields and buttons', () => {
    setup();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  test('shows validation errors for empty submission', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  test('shows error for invalid email format', async () => {
    const { user } = setup();
    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('shows error for short password', async () => {
    const { user } = setup();
    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  test('calls onSubmit with form data when validation passes', async () => {
    const { user, onSubmit } = setup();
    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });

  test('clear button resets all fields and errors', async () => {
    const { user } = setup();
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'mypassword');
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
  });

  test('toggles password visibility', async () => {
    const { user } = setup();
    const passwordInput = screen.getByLabelText('Password');
    const toggleBtn = screen.getByRole('button', { name: 'Show password' });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows loading state during submission', async () => {
    const onSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    const user = userEvent.setup();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Logging in...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });
});
