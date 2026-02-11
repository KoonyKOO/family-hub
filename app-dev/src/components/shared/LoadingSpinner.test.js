import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders with status role', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders screen reader text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  test('renders message when provided', () => {
    render(<LoadingSpinner message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  test('does not render message when not provided', () => {
    render(<LoadingSpinner />);
    expect(screen.queryByText('Please wait...')).not.toBeInTheDocument();
  });
});
