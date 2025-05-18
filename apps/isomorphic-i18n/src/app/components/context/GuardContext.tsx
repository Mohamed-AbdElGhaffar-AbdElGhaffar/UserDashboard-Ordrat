'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type GuardContextType = {
  guard: boolean;
  setGuard: React.Dispatch<React.SetStateAction<boolean>>;

  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const GuardContext = createContext<GuardContextType | undefined>(undefined);

export const GuardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guard, setGuard] = useState<boolean>(true);
  const [login, setLogin] = useState<boolean>(false);
 
  return (
    <GuardContext.Provider value={{ guard, setGuard, login, setLogin }}>
      {children}
    </GuardContext.Provider>
  );
};

export const useGuardContext = () => {
  const context = useContext(GuardContext);
  if (context === undefined) {
    throw new Error('useGuardContext must be used within a FileProvider');
  }
  return context;
};
