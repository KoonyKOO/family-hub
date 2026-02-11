import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  test('renders nothing when message is empty', () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container.firstChild).toBeNull();
  });

  test('renders error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('renders retry button when onRetry is provided', () => {
    render(<ErrorMessage message="Error" onRetry={jest.fn()} />);
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  test('calls onRetry when retry button is clicked', async () => {
    const onRetry = jest.fn();
    const user = userEvent.setup();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);

    await user.click(screen.getByText('Try again'));
    expect(onRetry).toHaveBeenCalled();
  });

  test('does not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });
});
