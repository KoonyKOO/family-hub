import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarPage from './CalendarPage';
import { FamilyProvider } from '../contexts/FamilyContext';

jest.mock('../services/familyService');
jest.mock('../services/eventService');

describe('CalendarPage', () => {
  test('renders calendar component', () => {
    render(
      <FamilyProvider>
        <CalendarPage />
      </FamilyProvider>
    );
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });
});
