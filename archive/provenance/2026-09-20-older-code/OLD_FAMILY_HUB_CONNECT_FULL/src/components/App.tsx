
import React, { useState, useEffect, CSSProperties, useMemo, useCallback, useRef, useReducer, Suspense, lazy } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from '../services/supabaseClient';
import type { AppState, AppAction, ToastMessage, PageView, PersonalizationData } from '../types';
import { styles } from '../styles';
import { AppProvider } from '../contexts/AppContext';
import LoadingSpinner from './ui/LoadingSpinner';
import TopBar from './ui/TopBar';
import NavigationBar from './ui/NavigationBar';
import FloatingActionButton from './ui/FloatingActionButton';
import { useAppContextValue } from '../hooks/useAppContextValue';
import { uniqueId } from '../utils/utils';


// --- useReducer State Management ---

const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_STATE':
            return { ...state, ...action.payload };
        case 'ADD_TOAST':
            return { ...state, activeToasts: [...state.activeToasts, action.payload] };
        case 'REMOVE_TOAST':
            return { ...state, activeToasts: state.activeToasts.filter(t => t.id !== action.payload) };
        case 'NAVIGATE':
            if (action.payload === state.currentPage) return state;
            return {
                ...state,
                pageHistory: [...state.pageHistory, state.currentPage],
                currentPage: action.payload,
            };
        case 'GO_BACK':
            if (state.pageHistory.length === 0) return state;
            const previousPage = state.pageHistory[state.pageHistory.length - 1];
            return {
                ...state,
                pageHistory: state.pageHistory.slice(0, -1),
                currentPage: previousPage,
            };
        case 'ADD_ITEM': {
            const { key, item } = action.payload;
            if (key in state) {
                const currentArray = state[key as keyof AppState] as any[];
                return { ...state, [key]: [...currentArray, item] };
            } else if (state.personalizationData && key in state.personalizationData) {
                const currentArray = (state.personalizationData[key as keyof PersonalizationData] as any[]) || [];
                return { ...state, personalizationData: { ...state.personalizationData, [key]: [...currentArray, item] } };
            }
            return state;
        }
        case 'UPDATE_ITEM': {
            const { key, id, updates } = action.payload;
            if (key in state) {
                const currentArray = state[key as keyof AppState] as any[];
                return { ...state, [key]: currentArray.map(i => i.id === id ? { ...i, ...updates } : i) };
            } else if (state.personalizationData && key in state.personalizationData) {
                 const currentArray = (state.personalizationData[key as keyof PersonalizationData] as any[]) || [];
                 return { ...state, personalizationData: { ...state.personalizationData, [key]: currentArray.map(i => i.id === id ? { ...i, ...updates } : i) } };
            }
            return state;
        }
         case 'DELETE_ITEM': {
            const { key, id } = action.payload;
            if (key in state) {
                const currentArray = state[key as keyof AppState] as any[];
                return { ...state, [key]: currentArray.filter(i => i.id !== id) };
            } else if (state.personalizationData && key in state.personalizationData) {
                 const currentArray = (state.personalizationData[key as keyof PersonalizationData] as any[]) || [];
                 return { ...state, personalizationData: { ...state.personalizationData, [key]: currentArray.filter(i => i.id !== id) } };
            }
            return state;
        }
        case 'UPDATE_MESSAGES_AS_READ': {
            const { messageIds, profileId } = action.payload;
            return {
                ...state,
                familyMessages: state.familyMessages.map(msg => 
                    messageIds.includes(msg.id) && !msg.readBy?.includes(profileId) 
                        ? { ...msg, readBy: [...(msg.readBy || []), profileId] } 
                        : msg
                )
            };
        }
        default:
            return state;
    }
};


export default function App() {
    // --- TESTING MODE FLAG ---
    // Set this to true to bypass Supabase checks and load mock data.
    const IS_TESTING_MODE = false;
    
    // Check for Supabase config first, but allow testing mode to proceed.
    if (!supabaseUrl || !supabaseAnonKey) {
        if (!IS_TESTING_MODE) {
            return React.createElement('div', { style: styles.configErrorScreen },
                React.createElement('div', { style: styles.configErrorBox },
                    React.createElement('h2', null, 'Configuration Error'),
                    React.createElement('p', null, 'Supabase URL or Key is missing.'),
                    React.createElement('p', null, "Please create a `.env` file in the root directory and add your Supabase credentials."),
                    React.createElement('pre', { style: styles.configErrorCode },
                        `VITE_SUPABASE_URL="YOUR_URL"\n` +
                        `VITE_SUPABASE_ANON_KEY="YOUR_KEY"`
                    ),
                    React.createElement('p', null, "Refer to the README.md file for more details.")
                )
            );
        }
    }


    const initialState: AppState = {
        loadingApp: true,
        session: null,
        personalizationData: null,
        familyProfiles: [],
        choreList: [],
        appNotifications: [],
        familyMessages: [],
        shoppingListItems: [],
        familyEvents: [],
        bookLogEntries: [],
        safeWebsiteUrls: [],
        trips: [],
        transactions: [],
        familyPhotos: [],
        photoAlbums: [],
        savingsGoals: [],
        infractions: [],
        currentPage: 'landing',
        pageHistory: [],
        viewingAsProfileId: null,
        activeToasts: [],
        isAudioUnlocked: false,
        showWeeklyReviewPrompt: false,
        lockDetails: { isLocked: false, message: '' },
        prefilledPhoneNumber: null,
        activeMessageTargetId: null,
        activeTripId: null,
        activeClubId: null,
        activeCollectionId: null,
    };

    const [state, dispatch] = useReducer(appReducer, initialState);

    const {
        loadingApp, session, personalizationData, lockDetails, currentPage,
        showWeeklyReviewPrompt, activeToasts, familyProfiles, viewingAsProfileId
    } = state;
    
    const currentViewingProfile = useMemo(() => {
        return familyProfiles.find(p => p.id === viewingAsProfileId);
    }, [familyProfiles, viewingAsProfileId]);

    // --- Page Scroll Effect ---
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const addToast = useCallback((message: string, type: ToastMessage['type'], icon?: string) => {
        const newToast: ToastMessage = { id: uniqueId(), message, type, icon };
        dispatch({ type: 'ADD_TOAST', payload: newToast });
        setTimeout(() => {
            dispatch({ type: 'REMOVE_TOAST', payload: newToast.id });
        }, 4000);
    }, []);
    
    const appContextValue = useAppContextValue(state, dispatch, addToast, IS_TESTING_MODE);
    const { onNavigate, renderPage } = appContextValue;
    
    // --- Dynamic Theming Engine ---
    useEffect(() => {
        const root = document.documentElement;

        // Apply branding from personalizationData
        const branding = personalizationData?.familyBranding;
        if (branding) {
            // Font loading
            const headerFont = branding.headerFont || 'Nunito';
            const bodyFont = branding.bodyFont || 'Nunito';
            const fontFamilies = [headerFont, bodyFont].filter((v, i, a) => a.indexOf(v) === i);
            const fontUrl = `https://fonts.googleapis.com/css2?${fontFamilies.map(f => `family=${f.replace(/ /g, '+')}:wght@400;600;700`).join('&')}&display=swap`;
            
            let fontLink = document.getElementById('dynamic-google-fonts');
            if (!fontLink) {
                fontLink = document.createElement('link');
                fontLink.id = 'dynamic-google-fonts';
                (fontLink as HTMLLinkElement).rel = 'stylesheet';
                document.head.appendChild(fontLink);
            }
            (fontLink as HTMLLinkElement).href = fontUrl;

            root.style.setProperty('--font-family-header', `'${headerFont}', sans-serif`);
            root.style.setProperty('--font-family-body', `'${bodyFont}', sans-serif`);
            root.style.setProperty('--border-radius-main', branding.borderRadius || '8px');
        }

        // Apply profile-specific theme overrides
        if (currentViewingProfile?.theme) {
            const theme = currentViewingProfile.theme;
            const previousTheme = JSON.parse(root.dataset.currentTheme || '{}');
            
            Object.keys(previousTheme).forEach(key => {
                if (!theme[key]) root.style.removeProperty(key);
            });

            Object.entries(theme).forEach(([key, value]) => {
                root.style.setProperty(key, value as string);
            });
            
            const backgroundImageUrl = theme['--background-image'];
            if (backgroundImageUrl) {
                document.body.style.backgroundImage = backgroundImageUrl;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
            } else {
                document.body.style.backgroundImage = '';
            }
            root.dataset.currentTheme = JSON.stringify(theme);
        }
    }, [currentViewingProfile, personalizationData?.familyBranding]);
    
    // --- Supabase Subscription and Initial Data Load ---
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            dispatch({ type: 'SET_STATE', payload: { session, loadingApp: false } });
        })
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                dispatch({ type: 'SET_STATE', payload: { session, loadingApp: false } });
                if (event === "SIGNED_OUT") {
                    dispatch({ type: 'SET_STATE', payload: initialState });
                }
            }
        );
        return () => authListener.subscription.unsubscribe();
    }, []);
    
    const AppContent = () => {
        if (loadingApp) return React.createElement(LoadingSpinner, null);
        
        // Let the useAppContextValue hook handle the rendering logic
        return (
            React.createElement('div', { style: styles.mainContentPane, className: `role-${currentViewingProfile?.role}` },
                React.createElement(TopBar, null),
                React.createElement(Suspense, { fallback: React.createElement(LoadingSpinner, { message: "Loading Page..." }) },
                    renderPage()
                ),
                React.createElement(NavigationBar, null),
                currentPage === 'dashboard' && React.createElement(FloatingActionButton, {
                    icon: '🤖',
                    ariaLabel: 'Open AI Assistant',
                    onClick: () => onNavigate('chatbot')
                }),
                showWeeklyReviewPrompt && (
                    React.createElement('div', { style: styles.promptBanner },
                        React.createElement('p', {style: {margin:0}}, 'It\'s Sunday! Would you like to create a weekly highlights report?'),
                        React.createElement('div', {style: {display: 'flex', gap: '10px'}},
                            React.createElement('button', {style: {...styles.button, width:'auto', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white'}, onClick: () => onNavigate('weeklyReport')}, 'Yes'),
                            React.createElement('button', {style: {...styles.button, ...styles.buttonSecondary, width:'auto'}, onClick: () => dispatch({ type: 'SET_STATE', payload: { showWeeklyReviewPrompt: false } })}, 'Later')
                        )
                    )
                )
            )
        );
    }

    return (
        React.createElement('div', { style: styles.appLayout },
            React.createElement(AppProvider, { value: appContextValue },
                 AppContent(),
                 React.createElement('div', { style: styles.toastContainer },
                    activeToasts.map(toast => React.createElement('div', { key: toast.id, style: styles.toast },
                        toast.icon && React.createElement('span', { style: styles.toastIcon }, toast.icon),
                        toast.message
                    ))
                )
            )
        )
    );
}
