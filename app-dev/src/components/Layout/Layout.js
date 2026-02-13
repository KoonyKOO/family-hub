import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import OfflineBanner from '../shared/OfflineBanner';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/family', label: 'Family' },
];

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-6">
            <span className="text-base font-bold text-blue-600 sm:text-lg">Family Hub</span>
            <div className="flex gap-1">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  className={({ isActive }) =>
                    `rounded-lg px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="hidden text-sm text-gray-600 sm:inline">{user?.name}</span>
            <button
              onClick={logout}
              className="rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:px-3 sm:py-2 sm:text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <OfflineBanner />
      <main className="mx-auto max-w-7xl px-3 py-3 sm:p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
