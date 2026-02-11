import React, { createContext, useContext, useState, useCallback } from 'react';
import familyService from '../services/familyService';

const FamilyContext = createContext(null);

export const FamilyProvider = ({ children }) => {
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);

  const loadFamily = useCallback(async () => {
    try {
      const data = await familyService.getFamily();
      setFamily(data.family);
      setMembers(data.members || []);
    } catch {
      setFamily(null);
      setMembers([]);
    }
  }, []);

  const createFamily = useCallback(async (name) => {
    const data = await familyService.createFamily(name);
    setFamily(data.family);
    setMembers(data.members || []);
    return data.family;
  }, []);

  const joinFamily = useCallback(async (inviteCode) => {
    const data = await familyService.joinFamily(inviteCode);
    setFamily(data.family);
    setMembers(data.members || []);
    return data.family;
  }, []);

  const leaveFamily = useCallback(async () => {
    await familyService.leaveFamily();
    setFamily(null);
    setMembers([]);
  }, []);

  return (
    <FamilyContext.Provider value={{ family, members, loadFamily, createFamily, joinFamily, leaveFamily }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};

export default FamilyContext;
