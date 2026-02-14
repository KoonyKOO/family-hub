import React from 'react';

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
};

const MemoItem = ({ memo, onPin, onEdit, onDelete }) => {
  return (
    <div
      className="relative rounded-lg p-3 shadow-sm"
      style={{ backgroundColor: memo.color || '#fef3c7' }}
    >
      {memo.pinned && (
        <span className="absolute -top-1 -right-1 text-sm" aria-label="Pinned">📌</span>
      )}

      <p className="mb-2 whitespace-pre-wrap text-sm text-gray-800">{memo.content}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{memo.createdBy?.name || 'Unknown'} · {formatTime(memo.createdAt)}</span>
        <div className="flex gap-1">
          <button
            onClick={() => onPin(memo)}
            className="rounded px-1.5 py-0.5 hover:bg-black/10"
            aria-label={memo.pinned ? 'Unpin memo' : 'Pin memo'}
          >
            {memo.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            onClick={() => onEdit(memo)}
            className="rounded px-1.5 py-0.5 text-blue-700 hover:bg-black/10"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(memo.id)}
            className="rounded px-1.5 py-0.5 text-red-700 hover:bg-black/10"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoItem;
