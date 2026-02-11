import React, { useEffect } from 'react';
import { useFamily } from '../../contexts/FamilyContext';
import FamilySetup from './FamilySetup';
import FamilyDashboard from './FamilyDashboard';

const Family = () => {
  const { family, members, loadFamily, createFamily, joinFamily, leaveFamily } = useFamily();

  useEffect(() => {
    loadFamily();
  }, [loadFamily]);

  if (!family) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">Family</h2>
        <FamilySetup onCreateFamily={createFamily} onJoinFamily={joinFamily} />
      </div>
    );
  }

  return (
    <div>
      <FamilyDashboard family={family} members={members} onLeave={leaveFamily} />
    </div>
  );
};

export default Family;
