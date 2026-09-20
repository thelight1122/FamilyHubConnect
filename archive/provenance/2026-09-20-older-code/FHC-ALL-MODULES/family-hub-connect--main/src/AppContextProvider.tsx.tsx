import React from 'react';
import { AppStateContext, AppDispatchContext } from './AppContext';
import { useAppContextValue } from '../src/hooks/useAppContextValue';

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatchers] = useAppContextValue();

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatchers}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
