import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { FamilyProvider, useFamily } from './FamilyContext';
import familyService from '../services/familyService';

jest.mock('../services/familyService');

const TestConsumer = () => {
  const { family, members, loadFamily, createFamily, joinFamily, leaveFamily } = useFamily();
  return (
    <div>
      <span data-testid="family">{family ? family.name : 'none'}</span>
      <span data-testid="members">{members.length}</span>
      <button onClick={loadFamily}>Load</button>
      <button onClick={() => createFamily('Smiths')}>Create</button>
      <button onClick={() => joinFamily('ABC123')}>Join</button>
      <button onClick={leaveFamily}>Leave</button>
    </div>
  );
};

const renderWithProvider = () => {
  const user = userEvent.setup();
  render(
    <FamilyProvider>
      <TestConsumer />
    </FamilyProvider>
  );
  return { user };
};

describe('FamilyContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('starts with no family', () => {
    renderWithProvider();
    expect(screen.getByTestId('family')).toHaveTextContent('none');
    expect(screen.getByTestId('members')).toHaveTextContent('0');
  });

  test('createFamily sets family and members', async () => {
    familyService.createFamily.mockResolvedValue({
      family: { id: '1', name: 'Smiths', inviteCode: 'ABC' },
      members: [{ id: '1', name: 'Alice' }],
    });
    const { user } = renderWithProvider();

    await user.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(screen.getByTestId('family')).toHaveTextContent('Smiths');
      expect(screen.getByTestId('members')).toHaveTextContent('1');
    });
  });

  test('joinFamily sets family and members', async () => {
    familyService.joinFamily.mockResolvedValue({
      family: { id: '2', name: 'Jones', inviteCode: 'XYZ' },
      members: [{ id: '1', name: 'Bob' }, { id: '2', name: 'Carol' }],
    });
    const { user } = renderWithProvider();

    await user.click(screen.getByText('Join'));

    await waitFor(() => {
      expect(screen.getByTestId('family')).toHaveTextContent('Jones');
      expect(screen.getByTestId('members')).toHaveTextContent('2');
    });
  });

  test('leaveFamily clears family and members', async () => {
    familyService.createFamily.mockResolvedValue({
      family: { id: '1', name: 'Smiths', inviteCode: 'ABC' },
      members: [{ id: '1', name: 'Alice' }],
    });
    familyService.leaveFamily.mockResolvedValue({});
    const { user } = renderWithProvider();

    await user.click(screen.getByText('Create'));
    await waitFor(() => expect(screen.getByTestId('family')).toHaveTextContent('Smiths'));

    await user.click(screen.getByText('Leave'));
    await waitFor(() => {
      expect(screen.getByTestId('family')).toHaveTextContent('none');
      expect(screen.getByTestId('members')).toHaveTextContent('0');
    });
  });

  test('loadFamily fetches family data', async () => {
    familyService.getFamily.mockResolvedValue({
      family: { id: '1', name: 'Loaded', inviteCode: 'LLL' },
      members: [{ id: '1', name: 'Dan' }],
    });
    const { user } = renderWithProvider();

    await user.click(screen.getByText('Load'));

    await waitFor(() => {
      expect(screen.getByTestId('family')).toHaveTextContent('Loaded');
    });
  });

  test('throws if useFamily is used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useFamily must be used within a FamilyProvider');
    spy.mockRestore();
  });
});
