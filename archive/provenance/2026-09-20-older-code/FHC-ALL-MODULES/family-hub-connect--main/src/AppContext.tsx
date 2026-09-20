
import React, { createContext, useContext } from 'react';
import type { AppState, AppContextType } from './types.ts';

// A type for the dispatch context, omitting state properties.
type AppDispatchContextType = Omit<AppContextType, keyof AppState>;

// Create separate contexts for state and dispatch to optimize re-renders.
export const AppStateContext = createContext<AppState | null>(null);
export const AppDispatchContext = createContext<AppDispatchContextType | null>(null);

// Custom hook to consume the app state.
export const useAppState = (): AppState => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppStateContext.Provider');
    }
    return context;
};

// Custom hook to consume the dispatch functions.
export const useAppDispatch = (): AppDispatchContextType => {
    const context = useContext(AppDispatchContext);
    if (!context) {
        throw new Error('useAppDispatch must be used within an AppDispatchContext.Provider');
    }
    return context;
};