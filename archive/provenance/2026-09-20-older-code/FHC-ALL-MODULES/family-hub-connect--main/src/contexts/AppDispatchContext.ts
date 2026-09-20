//AppDispatchContext.ts
// src/context/AppDispatchContext.ts
// This file defines the AppDispatchContext which provides methods to update the app state. 
// It is used to manage actions like updating the viewing profile, navigating, etc.

import { createContext, useContext } from 'react';

// Define type for your dispatch context
export type AppDispatchContextType = {
  updateViewingProfileId: (id: string) => void;
  // Add other dispatch methods here as needed
};

// Create the context with default (empty) implementation
export const AppDispatchContext = createContext<AppDispatchContextType>({
  updateViewingProfileId: () => {
    throw new Error('updateViewingProfileId not implemented');
  },
});

// Custom hook for cleaner access
export const useAppDispatch = () => useContext(AppDispatchContext);
