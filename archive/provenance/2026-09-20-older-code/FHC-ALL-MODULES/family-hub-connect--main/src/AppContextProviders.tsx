

//AppContextProviders.tsx

import React from 'react';
import { AppStateContext, AppDispatchContext } from './AppContext.tsx';
import { useAppContextValue } from './hooks/useAppContextValue.ts';
import { Toast, LoadingSpinner } from './components.tsx';
import type { ToastMessage } from './types.ts';

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatchers] = useAppContextValue();

  if (state.loadingApp) {
    return <LoadingSpinner message="Initializing Family Hub..." />;
  }

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatchers}>
        {children}
        <div className="toast-area">
            {state.toasts.map((toast: ToastMessage) => (
                <Toast key={toast.id} message={toast.message} type={toast.type} icon={toast.icon} onClose={() => dispatchers.removeToast(toast.id)} />
            ))}
        </div>
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};