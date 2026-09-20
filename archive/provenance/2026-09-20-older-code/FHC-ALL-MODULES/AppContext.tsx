import React, { createContext, useContext } from 'react';
import { PersonalizationData, Profile } from './types';

interface AppContextType {
    personalizationData: PersonalizationData;
    onSavePersonalization: (updates: Partial<PersonalizationData>) => void;
    profiles: Profile[];
    setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
    currentViewingProfile: Profile;
    setCurrentViewingProfile: React.Dispatch<React.SetStateAction<Profile>>;
    addToast: (message: string, type: 'info' | 'badge') => void;
    onNavigate: (page: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

interface MockAppProviderProps {
    children: React.ReactNode;
    onNavigate: (page: string) => void;
    profiles: Profile[];
    setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
    currentProfile: Profile;
    setCurrentProfile: React.Dispatch<React.SetStateAction<Profile>>;
    personalizationData: PersonalizationData;
    setPersonalizationData: React.Dispatch<React.SetStateAction<PersonalizationData>>;
    addToast: (message: string, type: 'info' | 'badge') => void;
}

export const MockAppProvider = ({ children, onNavigate, profiles, setProfiles, currentProfile, setCurrentProfile, personalizationData, setPersonalizationData, addToast }: MockAppProviderProps) => {
    
    const onSavePersonalization = (updates: Partial<PersonalizationData>) => {
        setPersonalizationData(prev => ({...prev, ...updates}));
    };
    
    const contextValue: AppContextType = {
        personalizationData, onSavePersonalization, profiles, setProfiles,
        currentViewingProfile: currentProfile, 
        setCurrentViewingProfile: setCurrentProfile,
        addToast,
        onNavigate
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
