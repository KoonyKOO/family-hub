import React from 'react';

const LoadingSpinner = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8" role="status">
      <div
        className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size] || sizeClasses.md}`}
      />
      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default LoadingSpinner;
