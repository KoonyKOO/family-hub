import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './DashboardPage';
import { FamilyProvider } from '../contexts/FamilyContext';

jest.mock('../services/familyService');
jest.mock('../services/eventService');
jest.mock('../services/todoService');

describe('DashboardPage', () => {
  test('renders both calendar and todos', () => {
    render(
      <FamilyProvider>
        <DashboardPage />
      </FamilyProvider>
    );
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Todos' })).toBeInTheDocument();
  });
});
