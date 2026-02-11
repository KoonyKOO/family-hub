import React from 'react';

const FamilyDashboard = ({ family, members, onLeave }) => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{family.name}</h2>
        <button
          onClick={onLeave}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Leave Family
        </button>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 p-4">
        <p className="mb-1 text-sm font-medium text-gray-700">Invite Code</p>
        <p className="font-mono text-lg font-bold text-blue-600">{family.inviteCode}</p>
        <p className="mt-1 text-xs text-gray-500">Share this code with family members</p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Members ({members.length})</h3>
        <ul className="space-y-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                {member.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{member.name}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FamilyDashboard;
