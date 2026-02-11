import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Family from './Family';
import { FamilyProvider } from '../../contexts/FamilyContext';
import familyService from '../../services/familyService';

jest.mock('../../services/familyService');

const renderFamily = () => {
  render(
    <FamilyProvider>
      <Family />
    </FamilyProvider>
  );
};

describe('Family', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows setup when no family exists', async () => {
    familyService.getFamily.mockRejectedValue(new Error('No family'));
    renderFamily();

    await waitFor(() => {
      expect(screen.getByText('Family Setup')).toBeInTheDocument();
    });
  });

  test('shows dashboard when family exists', async () => {
    familyService.getFamily.mockResolvedValue({
      family: { id: '1', name: 'Smiths', inviteCode: 'ABC' },
      members: [{ id: '1', name: 'Alice', email: 'a@b.com' }],
    });
    renderFamily();

    await waitFor(() => {
      expect(screen.getByText('Smiths')).toBeInTheDocument();
      expect(screen.getByText('ABC')).toBeInTheDocument();
    });
  });

  test('renders Family heading when no family', async () => {
    familyService.getFamily.mockRejectedValue(new Error('No family'));
    renderFamily();

    await waitFor(() => {
      expect(screen.getByText('Family')).toBeInTheDocument();
    });
  });
});
