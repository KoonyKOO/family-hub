import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FamilySetup from './FamilySetup';

describe('FamilySetup', () => {
  const defaultProps = {
    onCreateFamily: jest.fn(),
    onJoinFamily: jest.fn(),
  };

  test('renders create and join buttons initially', () => {
    render(<FamilySetup {...defaultProps} />);
    expect(screen.getByText('Family Setup')).toBeInTheDocument();
    expect(screen.getByText('Create a Family')).toBeInTheDocument();
    expect(screen.getByText('Join a Family')).toBeInTheDocument();
  });

  test('shows create form when Create button is clicked', async () => {
    const user = userEvent.setup();
    render(<FamilySetup {...defaultProps} />);

    await user.click(screen.getByText('Create a Family'));
    expect(screen.getByLabelText('Family Name')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  test('shows join form when Join button is clicked', async () => {
    const user = userEvent.setup();
    render(<FamilySetup {...defaultProps} />);

    await user.click(screen.getByText('Join a Family'));
    expect(screen.getByLabelText('Invite Code')).toBeInTheDocument();
    expect(screen.getByText('Join')).toBeInTheDocument();
  });

  test('shows error when creating with empty name', async () => {
    const user = userEvent.setup();
    render(<FamilySetup {...defaultProps} />);

    await user.click(screen.getByText('Create a Family'));
    await user.click(screen.getByText('Create'));
    expect(screen.getByText('Family name is required')).toBeInTheDocument();
  });

  test('calls onCreateFamily with name', async () => {
    const onCreateFamily = jest.fn();
    const user = userEvent.setup();
    render(<FamilySetup {...defaultProps} onCreateFamily={onCreateFamily} />);

    await user.click(screen.getByText('Create a Family'));
    await user.type(screen.getByLabelText('Family Name'), 'Smiths');
    await user.click(screen.getByText('Create'));
    expect(onCreateFamily).toHaveBeenCalledWith('Smiths');
  });

  test('calls onJoinFamily with invite code', async () => {
    const onJoinFamily = jest.fn();
    const user = userEvent.setup();
    render(<FamilySetup {...defaultProps} onJoinFamily={onJoinFamily} />);

    await user.click(screen.getByText('Join a Family'));
    await user.type(screen.getByLabelText('Invite Code'), 'ABC123');
    await user.click(screen.getByText('Join'));
    expect(onJoinFamily).toHaveBeenCalledWith('ABC123');
  });

  test('back button returns to initial view', async () => {
    const user = userEvent.setup();
    render(<FamilySetup {...defaultProps} />);

    await user.click(screen.getByText('Create a Family'));
    await user.click(screen.getByText('Back'));
    expect(screen.getByText('Create a Family')).toBeInTheDocument();
    expect(screen.getByText('Join a Family')).toBeInTheDocument();
  });
});
