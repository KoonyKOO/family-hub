import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FamilyProvider } from './contexts/FamilyContext';

const AllProviders = ({ children }) => (
  <MemoryRouter>
    <AuthProvider>
      <FamilyProvider>
        {children}
      </FamilyProvider>
    </AuthProvider>
  </MemoryRouter>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
