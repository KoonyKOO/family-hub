import React from 'react';

const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const TodoItem = ({ todo, isPending, onToggle, onEdit, onDelete }) => {
  return (
    <li className={`rounded-lg border border-gray-200 p-2.5 sm:p-3 transition-opacity ${isPending ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600"
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <p className={`text-sm font-medium ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
              {todo.title}
            </p>
            {todo.priority && (
              <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium sm:px-2 ${PRIORITY_STYLES[todo.priority] || ''}`}>
                {todo.priority}
              </span>
            )}
          </div>
          {todo.description && (
            <p className="mt-0.5 text-xs text-gray-500">{todo.description}</p>
          )}
          {(todo.dueDate || todo.dueTime) && (
            <p className="mt-0.5 text-xs text-gray-400">
              Due: {todo.dueDate}{todo.dueTime ? ` ${todo.dueTime}` : ''}
            </p>
          )}
        </div>
      </div>
      <div className="mt-1.5 flex justify-end gap-1 sm:mt-0">
        <button
          onClick={() => onEdit(todo)}
          className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
