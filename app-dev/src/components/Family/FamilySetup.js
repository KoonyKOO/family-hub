import React, { useState } from 'react';

const FamilySetup = ({ onCreateFamily, onJoinFamily }) => {
  const [mode, setMode] = useState(null);
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!familyName.trim()) {
      setError('Family name is required');
      return;
    }
    try {
      setError('');
      await onCreateFamily(familyName.trim());
    } catch (err) {
      setError(err.message || 'Failed to create family');
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError('Invite code is required');
      return;
    }
    try {
      setError('');
      await onJoinFamily(inviteCode.trim());
    } catch (err) {
      setError(err.message || 'Failed to join family');
    }
  };

  return (
    <div className="mx-auto max-w-md py-8">
      <h2 className="mb-6 text-center text-xl font-bold text-gray-800">Family Setup</h2>

      {error && <p role="alert" className="mb-4 text-center text-sm text-red-600">{error}</p>}

      {!mode && (
        <div className="space-y-3">
          <button
            onClick={() => setMode('create')}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Create a Family
          </button>
          <button
            onClick={() => setMode('join')}
            className="w-full rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Join a Family
          </button>
        </div>
      )}

      {mode === 'create' && (
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="family-name" className="mb-1 block text-sm font-medium text-gray-700">Family Name</label>
            <input
              id="family-name"
              value={familyName}
              onChange={(e) => { setFamilyName(e.target.value); setError(''); }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter family name"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Create
            </button>
            <button type="button" onClick={() => { setMode(null); setError(''); }} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
              Back
            </button>
          </div>
        </form>
      )}

      {mode === 'join' && (
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="invite-code" className="mb-1 block text-sm font-medium text-gray-700">Invite Code</label>
            <input
              id="invite-code"
              value={inviteCode}
              onChange={(e) => { setInviteCode(e.target.value); setError(''); }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter invite code"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Join
            </button>
            <button type="button" onClick={() => { setMode(null); setError(''); }} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FamilySetup;
