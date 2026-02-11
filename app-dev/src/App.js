import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FamilyProvider } from './contexts/FamilyContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FamilyPage from './pages/FamilyPage';

const App = () => {
  return (
    <AuthProvider>
      <FamilyProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/family" element={<FamilyPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </FamilyProvider>
    </AuthProvider>
  );
};

export default App;
