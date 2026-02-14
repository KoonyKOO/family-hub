import React, { useState, useEffect, useCallback } from 'react';
import MemoItem from './MemoItem';
import MemoForm from './MemoForm';
import memoService from '../../services/memoService';

const MemoBoard = () => {
  const [memos, setMemos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMemo, setEditingMemo] = useState(null);
  const [error, setError] = useState('');

  const fetchMemos = useCallback(async () => {
    try {
      const data = await memoService.getMemos();
      setMemos(data.memos || []);
    } catch {
      setMemos([]);
    }
  }, []);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  const handleSubmit = async (formData) => {
    try {
      setError('');
      if (formData.id) {
        await memoService.updateMemo(formData.id, formData);
      } else {
        await memoService.createMemo(formData);
      }
      setShowForm(false);
      setEditingMemo(null);
      await fetchMemos();
    } catch (err) {
      setError(err.message || 'Failed to save memo');
    }
  };

  const handlePin = async (memo) => {
    try {
      setError('');
      await memoService.updateMemo(memo.id, { pinned: !memo.pinned });
      await fetchMemos();
    } catch (err) {
      setError(err.message || 'Failed to update memo');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await memoService.deleteMemo(id);
      await fetchMemos();
    } catch (err) {
      setError(err.message || 'Failed to delete memo');
    }
  };

  const handleEdit = (memo) => {
    setEditingMemo(memo);
    setShowForm(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Memo Board</h2>
        <button
          onClick={() => { setEditingMemo(null); setShowForm(true); }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Memo
        </button>
      </div>

      {error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}

      {showForm && (
        <div className="mb-4">
          <MemoForm
            memo={editingMemo}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingMemo(null); }}
          />
        </div>
      )}

      {memos.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No memos yet</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {memos.map((memo) => (
            <MemoItem
              key={memo.id}
              memo={memo}
              onPin={handlePin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoBoard;
