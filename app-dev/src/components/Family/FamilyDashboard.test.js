import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FamilyDashboard from './FamilyDashboard';

describe('FamilyDashboard', () => {
  const defaultProps = {
    family: { id: '1', name: 'The Smiths', inviteCode: 'ABC123' },
    members: [
      { id: '1', name: 'Alice', email: 'alice@example.com' },
      { id: '2', name: 'Bob', email: 'bob@example.com' },
    ],
    onLeave: jest.fn(),
  };

  test('renders family name', () => {
    render(<FamilyDashboard {...defaultProps} />);
    expect(screen.getByText('The Smiths')).toBeInTheDocument();
  });

  test('renders invite code', () => {
    render(<FamilyDashboard {...defaultProps} />);
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('Share this code with family members')).toBeInTheDocument();
  });

  test('renders members list', () => {
    render(<FamilyDashboard {...defaultProps} />);
    expect(screen.getByText('Members (2)')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  test('renders member avatar initials', () => {
    render(<FamilyDashboard {...defaultProps} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  test('calls onLeave when leave button is clicked', async () => {
    const user = userEvent.setup();
    render(<FamilyDashboard {...defaultProps} />);

    await user.click(screen.getByText('Leave Family'));
    expect(defaultProps.onLeave).toHaveBeenCalled();
  });
});
