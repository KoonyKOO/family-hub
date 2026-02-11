import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FamilyPage from './FamilyPage';
import { FamilyProvider } from '../contexts/FamilyContext';

jest.mock('../services/familyService');

describe('FamilyPage', () => {
  test('renders family component', () => {
    render(
      <FamilyProvider>
        <FamilyPage />
      </FamilyProvider>
    );
    expect(screen.getByText('Family')).toBeInTheDocument();
  });
});
