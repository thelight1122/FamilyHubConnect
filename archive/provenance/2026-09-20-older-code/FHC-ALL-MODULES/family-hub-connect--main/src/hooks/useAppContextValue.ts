

import { useReducer, useCallback, useMemo, useEffect } from 'react';
import type { AppState, AppAction, PageView, ToastMessage, PersonalizationData, Profile, BadgeType, Chore, FamilyEvent, FamilyMessage, PhotoAlbum, AppNotification, Trip, AppContextType, PantryItem, BookLogEntry } from '../types.ts';
import { MOCK_PERSONALIZATION_DATA, MOCK_PROFILES, MOCK_CHORES, MOCK_SESSION, MOCK_EVENTS, MOCK_SHOPPING_LIST, MOCK_MESSAGES, MOCK_BOOK_LOG, MOCK_TRIPS, MOCK_SKILLS, MOCK_ASSIGNED_SKILLS, MOCK_VEHICLES, MOCK_MAINTENANCE_LOGS, MOCK_INFRACTIONS, BADGE_DEFINITIONS } from '../constants.ts';
import { uniqueId } from '../utils/utils.ts';

const initialState: AppState = {
    loadingApp: true,
    session: null,
    currentPage: 'dashboard',
    pageHistory: [],
    personalizationData: null,
    profiles: [],
    viewingAsProfileId: null,
    chores: [],
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
    activeMessageTargetId: null,
    activeTripId: null,
    activeClubId: null,
    activeCollectionId: null,
    prefilledPhoneNumber: null,
    lockDetails: { isLocked: false, message: '' },
    toasts: [],
    activityClubs: [],
    smartScenes: [],
    automationRules: [],
    budgetCategories: [],
    expenses: [],
    isGoogleLinked: false,
    weeklyMealPlan: [],
    collections: [],
    collectionItems: [],
    contacts: [],
    digitalVaultItems: [],
    loans: [],
    investments: [],
    manualMemories: [],
    fantasyLeagues: [],
    healthLogs: [],
    movieSuggestions: [],
    medals: [],
    awardedMedals: [],
    skills: [],
    assignedSkills: [],
    vehicles: [],
    vehicleMaintenanceLogs: [],
    pantryItems: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_STATE':
            return { ...state, ...action.payload };
        case 'NAVIGATE':
            if (action.payload === state.currentPage) return state;
            return {
                ...state,
                currentPage: action.payload,
                pageHistory: [...state.pageHistory, state.currentPage],
            };
        case 'GO_BACK': {
            const lastPage = state.pageHistory[state.pageHistory.length - 1];
            if (!lastPage) return state;
            return {
                ...state,
                currentPage: lastPage,
                pageHistory: state.pageHistory.slice(0, -1),
            };
        }
        case 'ADD_ITEM': {
            const currentArray = state[action.payload.key as keyof AppState] as any[];
            return { ...state, [action.payload.key]: [...currentArray, action.payload.item] };
        }
        case 'UPDATE_ITEM': {
            const currentArray = state[action.payload.key as keyof AppState] as any[];
            return {
                ...state,
                [action.payload.key]: currentArray.map(item =>
                    item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
                ),
            };
        }
        case 'DELETE_ITEM': {
            const currentArray = state[action.payload.key as keyof AppState] as any[];
            return { ...state, [action.payload.key]: currentArray.filter(item => item.id !== action.payload.id) };
        }
        case 'ADD_TOAST':
            return { ...state, toasts: [...state.toasts, action.payload] };
        case 'REMOVE_TOAST':
            return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
        default:
            return state;
    }
}

type Dispatchers = Omit<AppContextType, keyof AppState>;

export const useAppContextValue = (): [AppState, Dispatchers] => {
    const IS_TESTING_MODE = true;
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        if (IS_TESTING_MODE && !state.session) {
            console.log("TESTING MODE: Loading mock data.");
            dispatch({ type: 'SET_STATE', payload: {
                loadingApp: false,
                session: MOCK_SESSION as any,
                personalizationData: MOCK_PERSONALIZATION_DATA,
                profiles: MOCK_PROFILES,
                viewingAsProfileId: MOCK_PROFILES[0].id,
                chores: MOCK_CHORES,
                familyEvents: MOCK_EVENTS,
                shoppingListItems: MOCK_SHOPPING_LIST,
                familyMessages: MOCK_MESSAGES,
                bookLogEntries: MOCK_BOOK_LOG,
                currentPage: 'dashboard',
                skills: MOCK_SKILLS,
                assignedSkills: MOCK_ASSIGNED_SKILLS,
                vehicles: MOCK_VEHICLES,
                vehicleMaintenanceLogs: MOCK_MAINTENANCE_LOGS,
                trips: MOCK_TRIPS,
                infractions: MOCK_INFRACTIONS,
            }});
        }
    }, [IS_TESTING_MODE, state.session]);

    const addToast = useCallback((message: string, type: ToastMessage['type'], icon?: string) => {
        dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message, type, icon } });
    }, []);
    
    const removeToast = useCallback((id: number) => {
        dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, []);

    const onNavigate = useCallback((page: PageView) => {
        dispatch({ type: 'NAVIGATE', payload: page });
    }, []);

    const setCurrentViewingProfile = useCallback((profile: Profile) => {
        if (profile) {
            dispatch({ type: 'SET_STATE', payload: { viewingAsProfileId: profile.id } });
        }
    }, []);

    const onSavePersonalization = useCallback((updates: Partial<PersonalizationData>) => {
        const newPersonalizationData = { ...state.personalizationData, ...updates };
        dispatch({ type: 'SET_STATE', payload: { personalizationData: newPersonalizationData as PersonalizationData }});
    }, [state.personalizationData]);
    
    const getProfileName = useCallback((id: string | null) => {
         if (!id) return 'N/A';
        return state.profiles.find(p => p.id === id)?.name || 'Unknown';
    }, [state.profiles]);

    const createChoreTemplates = useCallback((choreNames: string) => {
        const names = choreNames.split('\n').filter(Boolean);
        if (names.length === 0) {
            addToast("No chore names provided to create templates.", 'info');
            return;
        }
        const newTemplates: Omit<Chore, 'id'>[] = names.map(name => ({
            family_id: 'fam_mock_123',
            name: name.trim(),
            points: 10,
            requiresPhoto: false,
            isRecurring: false,
            recurrenceType: 'none',
            assignedTo: null,
            status: 'pending',
            photoProofUrl: null,
            templateChoreId: null,
            dueDate: '',
            isBonus: false,
            recurrenceDays: null,
        }));
        
        newTemplates.forEach(t => {
            const newChore = { ...t, id: uniqueId() };
            dispatch({type: 'ADD_ITEM', payload: { key: 'chores', item: newChore }});
        });
        
        addToast(`${newTemplates.length} chore templates created!`, 'badge');
    }, [addToast]);

    const genericUpdate = useCallback(async (key: keyof AppState, id: string, updates: any) => {
        dispatch({ type: 'UPDATE_ITEM', payload: { key, id, updates } });
    }, []);
    
    const genericAdd = useCallback(async (key: keyof AppState, item: any) => {
        const newItem = { ...item, id: uniqueId() };
        dispatch({ type: 'ADD_ITEM', payload: { key, item: newItem } });
        return newItem;
    }, []);
    
    const genericDelete = useCallback(async (key: keyof AppState, id: string) => {
        dispatch({ type: 'DELETE_ITEM', payload: { key, id } });
    }, []);
    
    const updateProfile = useCallback(async (profileId: string, updates: Partial<Profile>) => {
        await genericUpdate('profiles', profileId, updates);
    }, [genericUpdate]);

    const addAppNotification = useCallback(async (message: string, type: AppNotification['type'], relatedProfileId?: string) => {
       await genericAdd('appNotifications', { message, type, relatedProfileId, timestamp: Date.now(), read: false });
    }, [genericAdd]);

    const awardBadgeIfEligible = useCallback(async (profileId: string, badgeType: BadgeType) => {
        const profile = state.profiles.find(p => p.id === profileId);
        const badge = BADGE_DEFINITIONS.find(b => b.id === badgeType);
        if (profile && badge && !profile.earnedBadges.includes(badgeType)) {
            const newBadges = [...profile.earnedBadges, badgeType];
            await updateProfile(profileId, { earnedBadges: newBadges });
            addToast(`${profile.name} earned a badge: ${badge.name}!`, 'badge', badge.icon);
        }
    }, [state.profiles, updateProfile, addToast]);
    
    const onClearInitialRecipient = useCallback(() => {
        dispatch({ type: 'SET_STATE', payload: { activeMessageTargetId: null } });
    }, []);

    const choreHandlers = useMemo(() => ({
        add: async (chore: Omit<Chore, 'id' | 'family_id'>) => { return await genericAdd('chores', chore) as Chore | null },
        update: async (id: string, updates: Partial<Chore>) => { await genericUpdate('chores', id, updates) },
        delete: async (id: string) => { await genericDelete('chores', id) },
        generateWeeklyChores: async () => { addToast("Weekly chores generated (mock).", 'info'); },
        complete: async (choreId: string) => { 
            await genericUpdate('chores', choreId, { status: 'completed', completed_at: new Date().toISOString() });
        },
    }), [genericAdd, genericUpdate, genericDelete, addToast]);
    
    const dispatchers: Dispatchers = useMemo(() => ({
        addToast,
        removeToast,
        onNavigate,
        onSavePersonalization,
        getProfileName,
        createChoreTemplates,
        setCurrentViewingProfile,
        updateProfile,
        addAppNotification,
        awardBadgeIfEligible,
        onClearInitialRecipient,
        choreHandlers,
        addTransaction: async (tx) => { await genericAdd('transactions', tx) },
        updateTransaction: async (id, updates) => { await genericUpdate('transactions', id, updates) },
        addSavingsGoal: async (goal) => { await genericAdd('savingsGoals', goal) },
        updateSavingsGoal: async (id, updates) => { await genericUpdate('savingsGoals', id, updates) },
        handleLogin: async () => { addToast('Login successful!', 'badge'); onNavigate('dashboard') },
        handleSignup: async () => { addToast('Signup successful!', 'badge'); return true },
        handleSaveInitialSetup: async (data) => { 
            dispatch({ type: 'SET_STATE', payload: { personalizationData: data, currentPage: 'dashboard' } });
        },
        updateActivityClub: async (id, updates) => { await genericUpdate('activityClubs', id, updates) },
        addEvent: async (event) => { return await genericAdd('familyEvents', event) as FamilyEvent },
        addMessage: async (message) => { return await genericAdd('familyMessages', message) as FamilyMessage },
        addAutomationRule: async (rule) => { await genericAdd('automationRules', rule) },
        updateAutomationRule: async (id, updates) => { await genericUpdate('automationRules', id, updates) },
        deleteAutomationRule: async (id) => { await genericDelete('automationRules', id) },
        addBudgetCategory: async (category) => { await genericAdd('budgetCategories', category) },
        updateBudgetCategory: async (id, updates) => { await genericUpdate('budgetCategories', id, updates) },
        deleteBudgetCategory: async (id) => { await genericDelete('budgetCategories', id) },
        addExpense: async (expense) => { await genericAdd('expenses', expense) },
        updateEvent: async (updates) => { await genericUpdate('familyEvents', updates.id, updates) },
        deleteEvent: async (event) => { await genericDelete('familyEvents', event.id) },
        getGoogleAuthUrl: async () => 'https://mock-google-auth.com',
        sendEmail: async () => { addToast('Email sent!', 'badge') },
        exchangeGoogleCode: async () => { dispatch({ type: 'SET_STATE', payload: { isGoogleLinked: true } }) },
        addCollection: async (collection) => { await genericAdd('collections', collection) },
        updateCollection: async (id, updates) => { await genericUpdate('collections', id, updates) },
        addCollectionItem: async (item) => { await genericAdd('collectionItems', item) },
        updateCollectionItem: async (id, updates) => { await genericUpdate('collectionItems', id, updates) },
        setActiveCollectionId: (id) => { dispatch({ type: 'SET_STATE', payload: { activeCollectionId: id } }) },
        addContact: async (contact) => { await genericAdd('contacts', contact) },
        updateContact: async (id, updates) => { await genericUpdate('contacts', id, updates) },
        deleteContact: async (id) => { await genericDelete('contacts', id) },
        navigateToPhoneWithNumber: (num) => { addToast(`Calling ${num}...`, 'info') },
        addDigitalVaultItem: async (item) => { await genericAdd('digitalVaultItems', item) },
        updateDigitalVaultItem: async (id, updates) => { await genericUpdate('digitalVaultItems', id, updates) },
        deleteDigitalVaultItem: async (id) => { await genericDelete('digitalVaultItems', id) },
        addAlbum: async (album) => { return await genericAdd('photoAlbums', album) as PhotoAlbum },
        addPhoto: async (photo) => { await genericAdd('familyPhotos', photo) },
        addLoan: async (loan) => { await genericAdd('loans', loan) },
        updateLoan: async (id, updates) => { await genericUpdate('loans', id, updates) },
        addInvestment: async (investment) => { await genericAdd('investments', investment) },
        generateFamilyCrest: async () => 'https://placehold.co/100x100?text=Crest',
        addManualMemory: (memory) => { genericAdd('manualMemories', memory) },
        getSymptomAnalysis: async (symptoms) => `AI analysis for "${symptoms}": This is general information. Consult a doctor.`,
        addHealthLog: async (log) => { await genericAdd('healthLogs', log) },
        addMovieSuggestion: async (suggestion) => { await genericAdd('movieSuggestions', suggestion) },
        updateMovieSuggestion: async (id, updates) => { await genericUpdate('movieSuggestions', id, updates) },
        deleteMovieSuggestion: async (id) => { await genericDelete('movieSuggestions', id) },
        addMedal: (medal) => { genericAdd('medals', medal) },
        updateMedal: (id, updates) => { genericUpdate('medals', id, updates) },
        deleteMedal: (id) => { genericDelete('medals', id) },
        addAwardedMedal: (award) => { genericAdd('awardedMedals', award) },
        generateWeeklyReport: async () => "This was a great week!",
        addInfraction: async (infraction) => { await genericAdd('infractions', infraction) },
        addTrip: async (trip) => { return await genericAdd('trips', trip) as Trip },
        updateTrip: async (id, updates) => { await genericUpdate('trips', id, updates) },
        deleteTrip: async (id) => { await genericDelete('trips', id) },
        addSkill: async (skill) => { await genericAdd('skills', skill) },
        updateSkill: async (id, updates) => { await genericUpdate('skills', id, updates) },
        deleteSkill: async (id) => { await genericDelete('skills', id) },
        assignSkill: async (skillId: string, profileId: string) => {
            await genericAdd('assignedSkills', { skillId, profileId, mastery: 'beginner' });
        },
        updateAssignedSkill: async (id, updates) => { await genericUpdate('assignedSkills', id, updates) },
        addVehicle: async (vehicle) => { await genericAdd('vehicles', vehicle) },
        updateVehicle: async (id, updates) => { await genericUpdate('vehicles', id, updates) },
        addMaintenanceLog: async (log) => { await genericAdd('vehicleMaintenanceLogs', log) },
        updateMaintenanceLog: async (id, updates) => { await genericUpdate('vehicleMaintenanceLogs', id, updates) },
        addBookLogEntry: async (entry: Omit<BookLogEntry, 'id' | 'family_id'>) => { await genericAdd('bookLogEntries', entry) },
        updateBookLogEntry: async (id: string, updates: Partial<BookLogEntry>) => { await genericUpdate('bookLogEntries', id, updates) },
        addPantryItem: async (item: Omit<PantryItem, 'id'>) => { return await genericAdd('pantryItems', item) as PantryItem },
        updatePantryItem: async (id: string, updates: Partial<PantryItem>) => { await genericUpdate('pantryItems', id, updates) },
        deletePantryItem: async (id: string) => { await genericDelete('pantryItems', id) },
    }), [addToast, removeToast, onNavigate, onSavePersonalization, getProfileName, createChoreTemplates, setCurrentViewingProfile, updateProfile, addAppNotification, awardBadgeIfEligible, onClearInitialRecipient, choreHandlers, genericAdd, genericUpdate, genericDelete]);
    
    return [state, dispatchers];
};