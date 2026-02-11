import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FamilyProvider } from './contexts/FamilyContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CalendarPage from './pages/CalendarPage';
import TodoPage from './pages/TodoPage';
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
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/todos" element={<TodoPage />} />
              <Route path="/family" element={<FamilyPage />} />
              <Route path="/" element={<Navigate to="/calendar" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </FamilyProvider>
    </AuthProvider>
  );
};

export default App;
