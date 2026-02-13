import React, { useEffect } from 'react';
import Calendar from '../components/Calendar/Calendar';
import TodoList from '../components/Todo/TodoList';
import NotificationPrompt from '../components/shared/NotificationPrompt';
import pushService from '../services/pushService';

const DashboardPage = () => {
  useEffect(() => {
    pushService.refreshSubscription();
  }, []);

  return (
    <div>
      <NotificationPrompt />
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Calendar />
        </div>
        <div>
          <TodoList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
