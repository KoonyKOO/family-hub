import React from 'react';
import Calendar from '../components/Calendar/Calendar';
import TodoList from '../components/Todo/TodoList';

const DashboardPage = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Calendar />
      </div>
      <div>
        <TodoList />
      </div>
    </div>
  );
};

export default DashboardPage;
