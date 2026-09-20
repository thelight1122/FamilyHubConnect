
import React, { useMemo, useCallback, Dispatch, lazy, useEffect } from 'react';
import { supabase } from '../src/services/supabaseClient';
import { uniqueId } from '../src/utils/utils';
import type { 
    AppState, AppAction, PersonalizationData, Chore, FamilyMessage, ShoppingListItem, 
    FamilyEvent, BookLogEntry, PlannedMeal, SafeWebsite, Trip, Transaction, Photo, 
    PhotoAlbum, SavingsGoal, Infraction, Vehicle, VehicleMaintenanceLog, MovieSuggestion, 
    Skill, AssignedSkill, Recipe, MealSuggestion, Pet, PetLog, ManualMemory, PantryItem, 
    Poll, FamilyBranding, MysteryBoxTier, Medal, AwardedMedal, SmartDevice, SmartScene, 
    AutomationRule, HomeworkAssignment, ShoutOut, BudgetCategory, Expense, ScreenTimeLog, 
    MarketAsset, FamilyMeeting, Habit, HabitLog, CustomBadge, RewardWishlistItem, 
    DigitalVaultItem, Loan, Investment, Contact, ActivityClub, HealthLog, MedicalRecord, 
    FamilyCourtCase, PhoneLog, FantasyLeague, Collection, CollectionItem, Caregiver, 
    CareRecipient, CareLog, ChoreHandlers, MessageHandlers, PortfolioHolding, MarketTransaction, 
    Profile, AppNotification, BadgeType, PageView, ToastMessage
} from '../src/types';
import { 
    MOCK_SESSION, MOCK_PERSONALIZATION_DATA, MOCK_PROFILES, MOCK_CHORES, 
    MOCK_MESSAGES, MOCK_SHOPPING_LIST, MOCK_EVENTS, MOCK_BOOK_LOG, 
    MOCK_SAFE_WEBSITES, MOCK_TRIPS, MOCK_TRANSACTIONS, MOCK_PHOTOS, 
    MOCK_PHOTO_ALBUMS, MOCK_SAVINGS_GOALS, MOCK_INFRACTIONS
} from '../src/constants';

type ToastFunction = (message: string, type: 'info' | 'points' | 'badge', icon?: string) => void;

// --- Lazy-loaded View Components ---
const LandingPage = lazy(() => import('../src/pages/LandingPage'));
const PersonalizationFormView = lazy(() => import('../src/pages/PersonalizationFormView'));
const AuthView = lazy(() => import('../src/pages/AuthView'));
const DashboardView = lazy(() => import('../src/pages/DashboardView'));
const ChoresView = lazy(() => import('../src/pages/ChoresView'));
const RewardsView = lazy(() => import('../src/pages/RewardsView'));
const CalendarView = lazy(() => import('../src/pages/CalendarView'));
const ProfileSettingsView = lazy(() => import('../src/pages/ProfileSettingsView'));
const ShoppingListView = lazy(() => import('../src/pages/ShoppingListView'));
const ReadingCornerView = lazy(() => import('../src/pages/ReadingCornerView'));
const MessagesView = lazy(() => import('../src/pages/MessagesView'));
const TripPlannerView = lazy(() => import('../src/pages/TripPlannerView'));
const TripJournalView = lazy(() => import('../src/pages/TripJournalView'));
const StoryGeneratorView = lazy(() => import('../src/pages/StoryGeneratorView'));
const WebBrowserView = lazy(() => import('../src/pages/WebBrowserView'));
const UpcomingView = lazy(() => import('../src/pages/UpcomingView'));
const AllowanceView = lazy(() => import('../src/pages/AllowanceView'));
const NotificationCenterView = lazy(() => import('../src/pages/NotificationCenterView'));
const PhotoAlbumView = lazy(() => import('../src/pages/PhotoAlbumView'));
const InternetView = lazy(() => import('../src/pages/InternetView'));
const SocialMediaView = lazy(() => import('../src/pages/SocialMediaView'));
const ThemeSettingsView = lazy(() => import('../src/pages/ThemeSettingsView'));
const CreatorsStudioView = lazy(() => import('../src/pages/CreatorsStudioView'));
const AIAvatarCreatorView = lazy(() => import('../src/pages/AIAvatarCreatorView'));
const HomeworkHelperView = lazy(() => import('../src/pages/HomeworkHelperView'));
const EmailView = lazy(() => import('../src/pages/EmailView'));
const TheFridgeView = lazy(() => import('../src/pages/TheFridgeView'));
const GoogleCallbackView = lazy(() => import('../src/pages/GoogleCallbackView'));
const DrawingBoardView = lazy(() => import('../src/pages/DrawingBoardView'));
const TimeOutView = lazy(() => import('../src/pages/TimeOutView'));
const GpsTrackingView = lazy(() => import('../src/pages/GpsTrackingView'));
const WeeklyReportView = lazy(() => import('../src/pages/WeeklyReportView'));
const NewsletterCreatorView = lazy(() => import('../src/pages/NewsletterCreatorView'));
const FamilyBankView = lazy(() => import('../src/pages/FamilyBankView'));
const VehicleMaintenanceView = lazy(() => import('../src/pages/VehicleMaintenanceView'));
const GameScorerView = lazy(() => import('../src/pages/GameScorerView'));
const MovieNightPickerView = lazy(() => import('../src/pages/MovieNightPickerView'));
const SkillsTrackerView = lazy(() => import('../src/pages/SkillsTrackerView'));
const LockerRoomView = lazy(() => import('../src/pages/LockerRoomView'));
const ActivityClubDetailView = lazy(() => import('../src/pages/ActivityClubDetailView'));
const DigitalDeskView = lazy(() => import('../src/pages/DigitalDeskView'));
const FamilyCourtView = lazy(() => import('../src/pages/FamilyCourtView'));
const HealthView = lazy(() => import('../src/pages/HealthView'));
const AINurseView = lazy(() => import('../src/pages/AINurseView'));
const MedicalRecordsView = lazy(() => import('../src/pages/MedicalRecordsView'));
const PhoneSettingsView = lazy(() => import('../src/pages/PhoneSettingsView'));
const PhoneView = lazy(() => import('../src/pages/PhoneView'));
const SecuritySettingsView = lazy(() => import('../src/pages/SecuritySettingsView'));
const LockScreenView = lazy(() => import('../src/pages/LockScreenView'));
const ContactsView = lazy(() => import('../src/pages/ContactsView'));
const PhoneLogsView = lazy(() => import('../src/pages/PhoneLogsView'));
const MealPlanView = lazy(() => import('../src/pages/MealPlanView'));
const FamilyFoundationsView = lazy(() => import('../src/pages/FamilyFoundationsView'));
const PetHubView = lazy(() => import('../src/pages/PetHubView'));
const FamilyTimelineView = lazy(() => import('../src/pages/FamilyTimelineView'));
const RecipeBookView = lazy(() => import('../src/pages/RecipeBookView'));
const PantryView = lazy(() => import('../src/pages/PantryView'));
const PollsView = lazy(() => import('../src/pages/PollsView'));
const FamilyBrandingView = lazy(() => import('../src/pages/FamilyBrandingView'));
const MysteryBoxView = lazy(() => import('../src/pages/MysteryBoxView'));
const AccoladesView = lazy(() => import('../src/pages/AccoladesView'));
const SmartHomeView = lazy(() => import('../src/pages/SmartHomeView'));
const AutomationSettingsView = lazy(() => import('../src/pages/AutomationSettingsView'));
const HomeworkPlannerView = lazy(() => import('../src/pages/HomeworkPlannerView'));
const ShoutOutsView = lazy(() => import('../src/pages/ShoutOutsView'));
const FinanceView = lazy(() => import('../src/pages/FinanceView'));
const BudgetView = lazy(() => import('../src/pages/BudgetView'));
const ScreenTimeBankView = lazy(() => import('../src/pages/ScreenTimeBankView'));
const MarketSimView = lazy(() => import('../src/pages/MarketSimView'));
const FamilyMeetingView = lazy(() => import('../src/pages/FamilyMeetingView'));
const RoutineBuilderView = lazy(() => import('../src/pages/RoutineBuilderView'));
const FinancialLiteracyView = lazy(() => import('../src/pages/FinancialLiteracyView'));
const FantasyFootballView = lazy(() => import('../src/pages/FantasyFootballView'));
const CollectionsHubView = lazy(() => import('../src/pages/CollectionsHubView'));
const CollectionView = lazy(() => import('../src/pages/CollectionView'));
const FamilyCareView = lazy(() => import('../src/pages/FamilyCareView'));
const FamilyMattersView = lazy(() => import('../src/pages/FamilyMattersView'));
const HomeManagementView = lazy(() => import('../src/pages/HomeManagementView'));
const ConnectionsView = lazy(() => import('../src/pages/ConnectionsView'));
const ChatbotView = lazy(() => import('../src/pages/ChatbotView'));
const MealSuggestionView = lazy(() => import('../src/pages/MealSuggestionView'));
const DigitalVaultView = lazy(() => import('../src/pages/DigitalVaultView'));
const SettingsView = lazy(() => import('../src/pages/SettingsView'));
const FamilySettingsView = lazy(() => import('../src/pages/FamilySettingsView'));
const ChoreSettingsView = lazy(() => import('../src/pages/ChoreSettingsView'));
const RewardSettingsView = lazy(() => import('../src/pages/RewardSettingsView'));
const AllowanceSettingsView = lazy(() => import('../src/pages/AllowanceSettingsView'));
const NavigationSettingsView = lazy(() => import('../src/pages/NavigationSettingsView'));
const DashboardSettingsView = lazy(() => import('../src/pages/DashboardSettingsView'));
const IntegrationsView = lazy(() => import('../src/pages/IntegrationsView'));
const FamilyGamesView = lazy(() => import('../src/pages/FamilyGamesView'));

export const useAppContextValue = (state: AppState, dispatch: Dispatch<AppAction>, addToast: ToastFunction, IS_TESTING_MODE: boolean) => {
    const {
        session, currentPage, pageHistory, personalizationData,
        familyProfiles, viewingAsProfileId, choreList, appNotifications,
        familyMessages, shoppingListItems, familyEvents, bookLogEntries,
        safeWebsiteUrls, trips, transactions, familyPhotos, photoAlbums,
        savingsGoals, infractions, activeMessageTargetId, activeTripId,
        activeClubId, activeCollectionId, prefilledPhoneNumber, lockDetails
    } = state;

    // --- MOCK DATA LOADER ---
    useEffect(() => {
        if (IS_TESTING_MODE && !state.session) {
            console.log("TESTING MODE: Loading mock data.");
            dispatch({ type: 'SET_STATE', payload: {
                loadingApp: false,
                session: MOCK_SESSION as any,
                personalizationData: MOCK_PERSONALIZATION_DATA,
                familyProfiles: MOCK_PROFILES,
                viewingAsProfileId: 'adult_mock_1',
                choreList: MOCK_CHORES,
                familyMessages: MOCK_MESSAGES,
                shoppingListItems: MOCK_SHOPPING_LIST,
                familyEvents: MOCK_EVENTS,
                bookLogEntries: MOCK_BOOK_LOG,
                safeWebsiteUrls: MOCK_SAFE_WEBSITES,
                trips: MOCK_TRIPS,
                transactions: MOCK_TRANSACTIONS,
                familyPhotos: MOCK_PHOTOS,
                photoAlbums: MOCK_PHOTO_ALBUMS,
                savingsGoals: MOCK_SAVINGS_GOALS,
                infractions: MOCK_INFRACTIONS,
                currentPage: 'dashboard',
            }});
        }
    }, [IS_TESTING_MODE, dispatch, state.session]);

    const currentViewingProfile = useMemo(() => {
        return familyProfiles.find(p => p.id === viewingAsProfileId);
    }, [familyProfiles, viewingAsProfileId]);
    
    // --- Navigation Handlers ---
    const navigate = useCallback((page: PageView) => dispatch({ type: 'NAVIGATE', payload: page }), [dispatch]);
    const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), [dispatch]);
    const hasHistory = useMemo(() => pageHistory.length > 0, [pageHistory]);
    
    const isGoogleLinked = useMemo(() => !!currentViewingProfile?.google_refresh_token, [currentViewingProfile]);
    
    // --- Data Handlers ---
    const onSavePersonalization = useCallback(async (updates: Partial<PersonalizationData>) => {
        if (!personalizationData && !IS_TESTING_MODE) {
            addToast("Cannot update settings: personalization data not loaded.", 'info');
            return;
        }
        const currentData = personalizationData || { id: 'fam_mock_123' };
        const newPersonalizationData = { ...currentData, ...updates };
        
        if (!IS_TESTING_MODE) {
             const { error } = await supabase.from('families').update({ personalization_data: newPersonalizationData }).eq('id', newPersonalizationData.id);
             if (error) { addToast(`Error saving settings: ${error.message}`, 'info'); return; }
        }
        dispatch({ type: 'SET_STATE', payload: { personalizationData: newPersonalizationData as PersonalizationData } });
    }, [personalizationData, IS_TESTING_MODE, addToast, dispatch]);

    const getProfileName = useCallback((profileId: string | null): string => {
        if (!profileId) return 'Unassigned';
        return familyProfiles.find(p => p.id === profileId)?.name || 'Unknown User';
    }, [familyProfiles]);

    const addAppNotification = useCallback(async (message: string, type: AppNotification['type'], relatedProfileId?: string) => {
        const newNotif = { id: uniqueId(), message, type, relatedProfileId, family_id: 'fam_mock_123', timestamp: Date.now(), read: false };
        dispatch({ type: 'ADD_ITEM', payload: { key: 'appNotifications', item: newNotif } });
    }, [dispatch]);

    const awardBadgeIfEligible = useCallback(async (profileId: string, badgeId: BadgeType): Promise<boolean> => {
       return false; // Simplified
    }, [familyProfiles, addAppNotification, addToast, IS_TESTING_MODE]);

    const updateProfile = useCallback(async (profileId: string, updates: Partial<Profile>) => {
        const { earnedBadges, ...dbUpdates } = updates; // Separate non-db field
        dispatch({ type: 'UPDATE_ITEM', payload: { key: 'familyProfiles', id: profileId, updates } });
        
        if (IS_TESTING_MODE) return;
        
        const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', profileId);
        if (error) { addToast(`Error updating profile: ${error.message}`, 'info'); /* Revert state? */ }
    }, [IS_TESTING_MODE, addToast, dispatch]);

    const generateWeeklyReport = async (highlightsText: string): Promise<string> => {
        if (IS_TESTING_MODE) {
            return "This was a fantastic week for the family! Everyone did a great job with their chores, and we shared some lovely moments. Let's keep the positivity going into next week!";
        }
        const prompt = `You are a warm, friendly family reporter. Based on the following highlights, write a short, cheerful summary (2-3 paragraphs) of the family's week. Focus on achievements and positive moments. Be conversational. \n\nHighlights:\n${highlightsText}`;
        
        try {
            const { data, error } = await supabase.functions.invoke('ai-handler', {
                body: { endpoint: 'generateText', prompt }
            });
            if (error) throw error;
            return data.text;
        } catch(e: any) {
            console.error("Error generating weekly report:", e);
            throw new Error(e.message || "Failed to generate summary.");
        }
    };
    
    const choreHandlers = useMemo(() => ({
        add: async (item: any) => {
            const newChore = { ...item, id: uniqueId(), family_id: 'fam_mock_123' } as Chore;
            dispatch({ type: 'ADD_ITEM', payload: { key: 'choreList', item: newChore } });
            return newChore;
        },
        update: async (itemId: any, updates: any) => dispatch({ type: 'UPDATE_ITEM', payload: { key: 'choreList', id: itemId, updates } }),
        delete: async (itemId: any) => dispatch({ type: 'DELETE_ITEM', payload: { key: 'choreList', id: itemId } }),
        generateWeeklyChores: async () => addToast('Weekly chore generation not implemented in test mode.', 'info'),
        complete: async (choreId: any) => dispatch({ type: 'UPDATE_ITEM', payload: { key: 'choreList', id: choreId, updates: { status: 'completed' } } }),
    }), [addToast, dispatch]);

    const createChoreTemplates = useCallback(async (choreNames: string) => {
        const names = choreNames.split('\n').filter(Boolean);
        if (names.length === 0) {
            addToast("No chore names provided to create templates.", 'info');
            return;
        }
        const newTemplates = names.map(name => ({
            name: name.trim(), points: 10, requiresPhoto: false, isRecurring: false, recurrenceType: 'none',
            assignedTo: null, status: 'pending', photoProofUrl: null, templateChoreId: null, dueDate: null
        } as Omit<Chore, 'id' | 'family_id'>));
        
        await Promise.all(newTemplates.map(t => choreHandlers.add(t)));
        
        addToast(`${newTemplates.length} chore templates created!`, 'badge');
    }, [addToast, choreHandlers]);

    const messageHandlers = useMemo(() => ({
        add: async (item: any) => {
            const newMessage = { ...item, id: uniqueId(), family_id: 'fam_mock_123' } as FamilyMessage;
            dispatch({ type: 'ADD_ITEM', payload: { key: 'familyMessages', item: newMessage } });
            return newMessage;
        },
        markAsRead: async (messageIds: any) => {
            if (!currentViewingProfile) return;
            dispatch({ type: 'UPDATE_MESSAGES_AS_READ', payload: { messageIds, profileId: currentViewingProfile.id }});
        }
    }), [currentViewingProfile, dispatch]);

    const createGenericHandler = useCallback(<T extends { id: string }>(key: keyof AppState) => ({
        add: async (item: Omit<T, 'id' | 'family_id'>): Promise<T> => {
            const newItem = { ...item, id: uniqueId(), family_id: 'fam_mock_123' } as unknown as T;
            dispatch({ type: 'ADD_ITEM', payload: { key, item: newItem } });
            return newItem;
        },
        update: async (id: string, updates: Partial<T>) => dispatch({ type: 'UPDATE_ITEM', payload: { key, id, updates } }),
        delete: async (id: string) => dispatch({ type: 'DELETE_ITEM', payload: { key, id } }),
    }), [dispatch]);

    const createPersonalizationHandler = useCallback(<T extends { id: string }>(key: keyof PersonalizationData) => ({
        add: async (item: Omit<T, 'id'>) => {
            if (!personalizationData) return null;
            const newItem = { ...item, id: uniqueId() } as T;
            const currentArray = (personalizationData[key] as T[] || []);
            onSavePersonalization({ [key]: [...currentArray, newItem] } as Partial<PersonalizationData>);
            return newItem;
        },
        update: async (id: string, updates: Partial<T>) => {
            if (!personalizationData) return;
            const currentArray = (personalizationData[key] as T[] || []);
            onSavePersonalization({ [key]: currentArray.map(i => i.id === id ? { ...i, ...updates } : i) } as Partial<PersonalizationData>);
        },
        delete: async (id: string) => {
            if (!personalizationData) return;
            const currentArray = (personalizationData[key] as T[] || []);
            onSavePersonalization({ [key]: currentArray.filter(i => i.id !== id) } as Partial<PersonalizationData>);
        },
    }), [personalizationData, onSavePersonalization]);
    
    // --- SPECIALIZED HANDLERS ---
    
    const calendarEventHandlers = useMemo(() => {
        const baseHandler = createGenericHandler<FamilyEvent>('familyEvents');
        return {
            add: async (eventData: Omit<FamilyEvent, 'id'|'family_id'|'google_event_id'>): Promise<FamilyEvent | null> => {
                let google_event_id: string | undefined = undefined;
                if (isGoogleLinked) {
                    try {
                        const { data } = await supabase.functions.invoke('google-api-handler', {
                            body: { endpoint: 'create-event', event: eventData }
                        });
                        google_event_id = data.id;
                    } catch (e) {
                        addToast("Failed to sync event with Google Calendar.", 'info');
                    }
                }
                const newEvent = await baseHandler.add({ ...eventData, google_event_id });
                return newEvent;
            },
            update: async (event: FamilyEvent) => {
                if (isGoogleLinked && event.google_event_id) {
                    try {
                        await supabase.functions.invoke('google-api-handler', {
                            body: { endpoint: 'update-event', event }
                        });
                    } catch (e) {
                        addToast("Failed to update Google Calendar event.", 'info');
                    }
                }
                await baseHandler.update(event.id, event);
            },
            delete: async (event: FamilyEvent) => {
                 if (isGoogleLinked && event.google_event_id) {
                    try {
                        await supabase.functions.invoke('google-api-handler', {
                            body: { endpoint: 'delete-event', event }
                        });
                    } catch (e) {
                        addToast("Failed to delete Google Calendar event.", 'info');
                    }
                }
                await baseHandler.delete(event.id);
            }
        }
    }, [createGenericHandler, isGoogleLinked, addToast]);


    const shoppingListItemHandlers = useMemo(() => ({
        ...createGenericHandler<ShoppingListItem>('shoppingListItems'),
        clearPurchasedItems: async () => {
            const purchased = shoppingListItems.filter(i => i.isChecked);
            if(personalizationData) {
                const newPantryItems = purchased.map(i => ({id: uniqueId(), name: i.name, category: 'Uncategorized', quantity: i.quantity}));
                onSavePersonalization({pantryItems: [...(personalizationData.pantryItems || []), ...newPantryItems]});
            }
            dispatch({ type: 'SET_STATE', payload: { shoppingListItems: shoppingListItems.filter(i => !i.isChecked) } });
        }
    }), [createGenericHandler, shoppingListItems, personalizationData, onSavePersonalization, dispatch]);

    const bookLogHandlers = useMemo(() => createGenericHandler<BookLogEntry>('bookLogEntries'), [createGenericHandler]);
    const safeWebsiteHandlers = useMemo(() => createGenericHandler<SafeWebsite>('safeWebsiteUrls'), [createGenericHandler]);
    const tripHandlers = useMemo(() => createGenericHandler<Trip>('trips'), [createGenericHandler]);
    const transactionHandlers = useMemo(() => createGenericHandler<Transaction>('transactions'), [createGenericHandler]);
    const photoAlbumHandlers = useMemo(() => createGenericHandler<PhotoAlbum>('photoAlbums'), [createGenericHandler]);
    const photoHandlers = useMemo(() => createGenericHandler<Photo>('familyPhotos'), [createGenericHandler]);
    const savingsGoalHandlers = useMemo(() => createGenericHandler<SavingsGoal>('savingsGoals'), [createGenericHandler]);
    const infractionHandlers = useMemo(() => ({
        add: async (infraction: Omit<Infraction, 'id' | 'family_id' | 'created_at' | 'completed_at' | 'evidence_urls'>, evidenceFile?: File) => {
            const newInfraction: Infraction = {
                ...infraction,
                id: uniqueId(),
                family_id: 'fam_mock_123',
                created_at: new Date().toISOString(),
                completed_at: null,
                evidence_urls: []
            };
            dispatch({ type: 'ADD_ITEM', payload: { key: 'infractions', item: newInfraction }});
        },
        update: async (infractionId: string, updates: Partial<Infraction>) => dispatch({ type: 'UPDATE_ITEM', payload: { key: 'infractions', id: infractionId, updates } }),
        delete: async (infractionId: string) => dispatch({ type: 'DELETE_ITEM', payload: { key: 'infractions', id: infractionId } }),
    }), [dispatch]);

    const deductPoints = useCallback(async (profileId: string, points: number) => {
        const profile = familyProfiles.find(p => p.id === profileId);
        if (!profile) return;
        updateProfile(profileId, { points: Math.max(0, (profile.points || 0) - points) });
    }, [familyProfiles, updateProfile]);

    const addScreenTime = useCallback(async (profileId: string, minutes: number, reason: string) => {
        const profile = familyProfiles.find(p => p.id === profileId);
        if (!profile) return;
        const newBalance = (profile.screenTimeBalance || 0) + minutes;
        await updateProfile(profileId, { screenTimeBalance: newBalance });
        const newLog = { id: uniqueId(), profileId, changeMinutes: minutes, reason: reason, status: 'completed', timestamp: Date.now() } as ScreenTimeLog;
        await onSavePersonalization({ screenTimeLogs: [...(personalizationData?.screenTimeLogs || []), newLog] });
        addToast(`${minutes} minutes of screen time added for ${profile.name}!`, 'info');
    }, [familyProfiles, updateProfile, onSavePersonalization, addToast, personalizationData]);

    const navigateToPhoneWithNumber = useCallback((number: string) => {
        dispatch({ type: 'SET_STATE', payload: { prefilledPhoneNumber: number } });
        navigate('phone');
    }, [navigate, dispatch]);

    const navigateToMessagesWithRecipient = useCallback((recipientId: string) => {
        dispatch({ type: 'SET_STATE', payload: { activeMessageTargetId: recipientId } });
        navigate('messages');
    }, [navigate, dispatch]);
    
    const navigateToTripJournal = useCallback((tripId: string) => {
        dispatch({ type: 'SET_STATE', payload: { activeTripId: tripId } });
        navigate('tripJournal');
    }, [navigate, dispatch]);

    const handleSaveInitialSetup = async (data: PersonalizationData) => {
        const mockProfiles: Profile[] = [
            ...data.adultDetailsArray.map((a, i) => ({ id: `adult_mock_${i+1}`, family_id: 'fam_mock_123', name: a.name, avatarUrl: a.avatarUrl, role: 'adult' as const, points: 0, earnedBadges: [], balance: 0, screenTimeBalance: 0, email: a.email })),
            ...data.childDetailsArray.map((c, i) => ({ id: `child_mock_${i+1}`, family_id: 'fam_mock_123', name: c.name, avatarUrl: c.avatarUrl, role: 'child' as const, points: 0, earnedBadges: [], balance: 0, screenTimeBalance: 0, age: c.age }))
        ];
        dispatch({ type: 'SET_STATE', payload: {
            personalizationData: data, familyProfiles: mockProfiles,
            viewingAsProfileId: mockProfiles[0].id, currentPage: 'dashboard'
        }});
        addToast('Welcome to your new Family Hub!', 'badge');
    };
    
    // --- Personalization Handlers ---
    const vehicleHandlers = useMemo(() => createPersonalizationHandler<Vehicle>('vehicles'), [createPersonalizationHandler]);
    const maintenanceLogHandlers = useMemo(() => createPersonalizationHandler<VehicleMaintenanceLog>('vehicleMaintenanceLogs'), [createPersonalizationHandler]);
    const movieSuggestionHandlers = useMemo(() => createPersonalizationHandler<MovieSuggestion>('movieSuggestions'), [createPersonalizationHandler]);
    const skillHandlers = useMemo(() => createPersonalizationHandler<Skill>('skills'), [createPersonalizationHandler]);
    const assignedSkillHandlers = useMemo(() => createPersonalizationHandler<AssignedSkill>('assignedSkills'), [createPersonalizationHandler]);
    const recipeHandlers = useMemo(() => createPersonalizationHandler<Recipe>('savedRecipes'), [createPersonalizationHandler]);
    const mealSuggestionHandlers = useMemo(() => createPersonalizationHandler<MealSuggestion>('favoriteMeals'), [createPersonalizationHandler]);
    const habitHandlers = useMemo(() => createPersonalizationHandler<Habit>('habits'), [createPersonalizationHandler]);
    const habitLogHandlers = useMemo(() => createPersonalizationHandler<HabitLog>('habitLogs'), [createPersonalizationHandler]);
    const petHandlers = useMemo(() => createPersonalizationHandler<Pet>('pets'), [createPersonalizationHandler]);
    const petLogHandlers = useMemo(() => createPersonalizationHandler<PetLog>('petLogs'), [createPersonalizationHandler]);
    const manualMemoryHandlers = useMemo(() => createPersonalizationHandler<ManualMemory>('manualMemories'), [createPersonalizationHandler]);
    const pantryItemHandlers = useMemo(() => createPersonalizationHandler<PantryItem>('pantryItems'), [createPersonalizationHandler]);
    const pollHandlers = useMemo(() => createPersonalizationHandler<Poll>('polls'), [createPersonalizationHandler]);
    const contactHandlers = useMemo(() => createPersonalizationHandler<Contact>('contacts'), [createPersonalizationHandler]);
    const activityClubHandlers = useMemo(() => createPersonalizationHandler<ActivityClub>('activityClubs'), [createPersonalizationHandler]);
    const healthLogHandlers = useMemo(() => createPersonalizationHandler<HealthLog>('healthLogs'), [createPersonalizationHandler]);
    const medicalRecordHandlers = useMemo(() => createPersonalizationHandler<MedicalRecord>('medicalRecords'), [createPersonalizationHandler]);
    const familyCourtCaseHandlers = useMemo(() => createPersonalizationHandler<FamilyCourtCase>('familyCourtCases'), [createPersonalizationHandler]);
    const phoneLogHandlers = useMemo(() => createPersonalizationHandler<PhoneLog>('phoneLogs'), [createPersonalizationHandler]);
    const shoutOutHandlers = useMemo(() => createPersonalizationHandler<ShoutOut>('shoutOuts'), [createPersonalizationHandler]);
    const budgetCategoryHandlers = useMemo(() => createPersonalizationHandler<BudgetCategory>('budgetCategories'), [createPersonalizationHandler]);
    const expenseHandlers = useMemo(() => createPersonalizationHandler<Expense>('expenses'), [createPersonalizationHandler]);
    const screenTimeLogHandlers = useMemo(() => createPersonalizationHandler<ScreenTimeLog>('screenTimeLogs'), [createPersonalizationHandler]);
    const familyMeetingHandlers = useMemo(() => createPersonalizationHandler<FamilyMeeting>('familyMeetings'), [createPersonalizationHandler]);
    const collectionHandlers = useMemo(() => createPersonalizationHandler<Collection>('collections'), [createPersonalizationHandler]);
    const collectionItemHandlers = useMemo(() => createPersonalizationHandler<CollectionItem>('collectionItems'), [createPersonalizationHandler]);
    const caregiverHandlers = useMemo(() => createPersonalizationHandler<Caregiver>('caregivers'), [createPersonalizationHandler]);
    const careRecipientHandlers = useMemo(() => createPersonalizationHandler<CareRecipient>('careRecipients'), [createPersonalizationHandler]);
    const careLogHandlers = useMemo(() => createPersonalizationHandler<CareLog>('careLogs'), [createPersonalizationHandler]);
    const fantasyLeagueHandlers = useMemo(() => createPersonalizationHandler<FantasyLeague>('fantasyLeagues'), [createPersonalizationHandler]);
    const customBadgeHandlers = useMemo(() => createPersonalizationHandler<CustomBadge>('customBadges'), [createPersonalizationHandler]);
    const medalHandlers = useMemo(() => createPersonalizationHandler<Medal>('medals'), [createPersonalizationHandler]);
    const awardedMedalHandlers = useMemo(() => createPersonalizationHandler<AwardedMedal>('awardedMedals'), [createPersonalizationHandler]);
    const rewardWishlistHandlers = useMemo(() => createPersonalizationHandler<RewardWishlistItem>('rewardWishlist'), [createPersonalizationHandler]);
    const smartDeviceHandlers = useMemo(() => createPersonalizationHandler<SmartDevice>('smartDevices'), [createPersonalizationHandler]);
    const smartSceneHandlers = useMemo(() => createPersonalizationHandler<SmartScene>('smartScenes'), [createPersonalizationHandler]);
    const automationRuleHandlers = useMemo(() => createPersonalizationHandler<AutomationRule>('automationRules'), [createPersonalizationHandler]);
    const homeworkAssignmentHandlers = useMemo(() => createPersonalizationHandler<HomeworkAssignment>('homeworkAssignments'), [createPersonalizationHandler]);
    const digitalVaultItemHandlers = useMemo(() => createPersonalizationHandler<DigitalVaultItem>('digitalVaultItems'), [createPersonalizationHandler]);
    const loanHandlers = useMemo(() => createPersonalizationHandler<Loan>('loans'), [createPersonalizationHandler]);
    const investmentHandlers = useMemo(() => createPersonalizationHandler<Investment>('investments'), [createPersonalizationHandler]);
    const marketAssetHandlers = useMemo(() => createPersonalizationHandler<MarketAsset>('marketAssets'), [createPersonalizationHandler]);
    const portfolioHoldingHandlers = useMemo(() => createPersonalizationHandler<PortfolioHolding>('portfolioHoldings'), [createPersonalizationHandler]);
    const marketTransactionHandlers = useMemo(() => createPersonalizationHandler<MarketTransaction>('marketTransactions'), [createPersonalizationHandler]);

    const toggleHabitLogAndUpdateStreak = useCallback(async (habit: Habit, date: Date) => {
        if (!personalizationData) return;
        const dateString = date.toISOString().split('T')[0];
        const allHabitLogs = personalizationData.habitLogs || [];
        const existingLog = allHabitLogs.find(log => log.habitId === habit.id && log.date === dateString);
    
        let logsAfterToggle: HabitLog[];
        if (existingLog) {
            logsAfterToggle = allHabitLogs.filter(log => log.id !== existingLog.id);
            await habitLogHandlers.delete(existingLog.id);
        } else {
            const newLog = { habitId: habit.id, date: dateString };
            const addedLog = await habitLogHandlers.add(newLog);
            logsAfterToggle = addedLog ? [...allHabitLogs, addedLog] : allHabitLogs;
        }
        
        const logsForThisHabit = logsAfterToggle.filter(log => log.habitId === habit.id);
        
        const sortedDates = logsForThisHabit
            .map(l => new Date(l.date + 'T00:00:00Z'))
            .sort((a, b) => b.getTime() - a.getTime());
    
        let currentStreak = 0;
        
        if (sortedDates.length > 0) {
            const today = new Date(); today.setUTCHours(0,0,0,0);
            const yesterday = new Date(today); yesterday.setUTCDate(today.getUTCDate() - 1);
    
            const mostRecentLogTime = sortedDates[0].getTime();
            
            if (mostRecentLogTime === today.getTime() || mostRecentLogTime === yesterday.getTime()) {
                currentStreak = 1;
                for (let i = 0; i < sortedDates.length - 1; i++) {
                    const diff = (sortedDates[i].getTime() - sortedDates[i + 1].getTime());
                    if (diff === 86400000) { // one day in ms
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }
        
        const longestStreak = habit.longestStreak || 0;
        const newLongestStreak = Math.max(longestStreak, currentStreak);
        
        await habitHandlers.update(habit.id, { currentStreak, longestStreak: newLongestStreak });
        
    }, [personalizationData, habitLogHandlers, habitHandlers]);

    // --- New calculation for RewardsView ---
    const weeklyTopEarner = useMemo(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneWeekAgoTimestamp = oneWeekAgo.getTime();

        const pointsByProfile: { [key: string]: number } = {};

        choreList.forEach(chore => {
            if (chore.status === 'completed' && chore.completed_at) {
                const completedTimestamp = new Date(chore.completed_at).getTime();
                if (completedTimestamp >= oneWeekAgoTimestamp && chore.assignedTo) {
                    pointsByProfile[chore.assignedTo] = (pointsByProfile[chore.assignedTo] || 0) + (chore.points || 0);
                }
            }
        });

        let topEarner = null;
        let maxPoints = 0;

        for (const profileId in pointsByProfile) {
            if (pointsByProfile[profileId] > maxPoints) {
                maxPoints = pointsByProfile[profileId];
                const profile = familyProfiles.find(p => p.id === profileId);
                if (profile) {
                    topEarner = { profile, points: maxPoints };
                }
            }
        }
        
        return topEarner;
    }, [choreList, familyProfiles]);
    
    
    const renderPage = useCallback(() => {
        const setViewingAsProfileId = (id: string | null) => dispatch({ type: 'SET_STATE', payload: { viewingAsProfileId: id } });
        const setActiveCollectionId = (id: string | null) => dispatch({ type: 'SET_STATE', payload: { activeCollectionId: id } });
        const onClearInitialRecipient = () => dispatch({ type: 'SET_STATE', payload: { activeMessageTargetId: null } });
        const onCallComplete = () => dispatch({ type: 'SET_STATE', payload: { prefilledPhoneNumber: null } });

        switch (currentPage) {
            case 'landing': return React.createElement(LandingPage, { personalizationDataExists: !!personalizationData });
            case 'initialSetup': return React.createElement(PersonalizationFormView, { onSave: handleSaveInitialSetup });
            case 'auth': return React.createElement(AuthView, null);
            case 'dashboard': return React.createElement(DashboardView, { setCurrentViewingProfileId: setViewingAsProfileId });
            case 'chores': return React.createElement(ChoresView, null);
            case 'rewards': return React.createElement(RewardsView, { updateProfile, deductPoints });
            case 'calendar': return React.createElement(CalendarView, { addEvent: async (e) => { await calendarEventHandlers.add(e) }, updateEvent: calendarEventHandlers.update, deleteEvent: calendarEventHandlers.delete });
            case 'profileSettings': return React.createElement(ProfileSettingsView, { updateProfile });
            case 'shoppingList': return React.createElement(ShoppingListView, null);
            case 'readingCorner': return React.createElement(ReadingCornerView, { bookLogEntries, addBookLogEntry: async (entry) => { await bookLogHandlers.add(entry); }, updateBookLogEntry: bookLogHandlers.update });
            case 'messages': return React.createElement(MessagesView, { initialRecipientId: activeMessageTargetId, onClearInitialRecipient });
            case 'tripPlanner': return React.createElement(TripPlannerView, { trips, addTrip: async (trip) => { await tripHandlers.add(trip); }, updateTrip: tripHandlers.update, deleteTrip: tripHandlers.delete, addShoppingListItem: async (item) => { await shoppingListItemHandlers.add(item); }, addEvent: async (event) => { await calendarEventHandlers.add(event); }, onNavigateToJournal: navigateToTripJournal });
            case 'tripJournal': return React.createElement(TripJournalView, { activeTripId, trips, updateTrip: tripHandlers.update });
            case 'storyTime': return React.createElement(StoryGeneratorView, { onBackToDashboard: goBack });
            case 'familyGames': return React.createElement(FamilyGamesView, null);
            case 'webBrowser': return React.createElement(WebBrowserView, { onBackToDashboard: goBack });
            case 'upcoming': return React.createElement(UpcomingView, { onBackToDashboard: goBack });
            case 'allowance': return React.createElement(AllowanceView, { addTransaction: async (tx) => { await transactionHandlers.add(tx); }, updateTransaction: transactionHandlers.update, addSavingsGoal: async (goal) => { await savingsGoalHandlers.add(goal); }, updateSavingsGoal: savingsGoalHandlers.update, deleteSavingsGoal: savingsGoalHandlers.delete, updateProfile, awardBadgeIfEligible });
            case 'notificationCenter': return React.createElement(NotificationCenterView, { notifications: appNotifications, setNotifications: (updater) => dispatch({ type: 'SET_STATE', payload: { appNotifications: typeof updater === 'function' ? updater(appNotifications) : updater } }) });
            case 'photoAlbum': return React.createElement(PhotoAlbumView, { addAlbum: async (album) => { await photoAlbumHandlers.add(album); }, deleteAlbum: photoAlbumHandlers.delete, addPhoto: async (photo) => { await photoHandlers.add(photo); }, deletePhoto: photoHandlers.delete, addMessage: messageHandlers.add });
            case 'internet': return React.createElement(InternetView, { onNavigate: navigate, onBack: goBack });
            case 'socialMedia': return React.createElement(SocialMediaView, { onSave: onSavePersonalization, onBack: goBack });
            case 'themeSettings': return React.createElement(ThemeSettingsView, { updateProfile });
            case 'creatorsStudio': return React.createElement(CreatorsStudioView, { onNavigate: navigate, onBack: goBack });
            case 'aiAvatarCreator': return React.createElement(AIAvatarCreatorView, { updateProfile, onBack: goBack });
            case 'homeworkHelper': return React.createElement(HomeworkHelperView, { onBack: goBack });
            case 'email': return React.createElement(EmailView, null);
            case 'theFridge': return React.createElement(TheFridgeView, null);
            case 'googleCallback': return React.createElement(GoogleCallbackView, null);
            case 'drawingBoard': return React.createElement(DrawingBoardView, { addAlbum: async (album) => { await photoAlbumHandlers.add(album); }, addPhoto: async (photo) => { await photoHandlers.add(photo); }, onBack: goBack });
            case 'timeOut': return React.createElement(TimeOutView, { infractions, addInfraction: infractionHandlers.add, updateInfraction: infractionHandlers.update, onBack: goBack });
            case 'gps': return React.createElement(GpsTrackingView, { onBack: goBack });
            case 'weeklyReport': return React.createElement(WeeklyReportView, null);
            case 'newsletterCreator': return React.createElement(NewsletterCreatorView, { onBack: goBack });
            case 'familyBank': return React.createElement(FamilyBankView, null);
            case 'vehicleMaintenance': return React.createElement(VehicleMaintenanceView, null);
            case 'gameScorer': return React.createElement(GameScorerView, { onBack: goBack });
            case 'movieNightPicker': return React.createElement(MovieNightPickerView, { onBack: goBack });
            case 'skillsTracker': return React.createElement(SkillsTrackerView, { onBack: goBack });
            case 'lockerRoom': return React.createElement(LockerRoomView, { setActiveClubId: (id) => dispatch({ type: 'SET_STATE', payload: { activeClubId: id } }), onNavigate: navigate, onBack: goBack });
            case 'activityClubDetail': return React.createElement(ActivityClubDetailView, { activeClubId, addEvent: async (event) => { await calendarEventHandlers.add(event as any) }, addMessage: messageHandlers.add, onBack: goBack });
            case 'digitalDesk': return React.createElement(DigitalDeskView, null);
            case 'familyCourt': return React.createElement(FamilyCourtView, { onBack: goBack });
            case 'health': return React.createElement(HealthView, { onNavigate: navigate });
            case 'aiNurse': return React.createElement(AINurseView, { onBack: goBack });
            case 'medicalRecords': return React.createElement(MedicalRecordsView, { onBack: goBack });
            case 'phoneSettings': return React.createElement(PhoneSettingsView, { onBack: goBack });
            case 'phone': return React.createElement(PhoneView, { prefilledNumber: prefilledPhoneNumber, onCallComplete });
            case 'securitySettings': return React.createElement(SecuritySettingsView, null);
            case 'lockScreen': return React.createElement(LockScreenView, { message: lockDetails.message });
            case 'contacts': return React.createElement(ContactsView, null);
            case 'phoneLogs': return React.createElement(PhoneLogsView, { onBack: goBack });
            case 'mealPlan': return React.createElement(MealPlanView, null);
            case 'familyFoundations': return React.createElement(FamilyFoundationsView, null);
            case 'petHub': return React.createElement(PetHubView, null);
            case 'familyTimeline': return React.createElement(FamilyTimelineView, null);
            case 'recipeBook': return React.createElement(RecipeBookView, null);
            case 'pantry': return React.createElement(PantryView, null);
            case 'polls': return React.createElement(PollsView, null);
            case 'familyBranding': return React.createElement(FamilyBrandingView, { onBack: goBack });
            case 'mysteryBox': return React.createElement(MysteryBoxView, { updateProfile, addAppNotification });
            case 'accolades': return React.createElement(AccoladesView, null);
            case 'smartHome': return React.createElement(SmartHomeView, null);
            case 'automationSettings': return React.createElement(AutomationSettingsView, { onBack: goBack });
            case 'homeworkPlanner': return React.createElement(HomeworkPlannerView, null);
            case 'shoutOuts': return React.createElement(ShoutOutsView, null);
            case 'finance': return React.createElement(FinanceView, null);
            case 'budget': return React.createElement(BudgetView, null);
            case 'screenTimeBank': return React.createElement(ScreenTimeBankView, null);
            case 'marketSim': return React.createElement(MarketSimView, null);
            case 'familyMeeting': return React.createElement(FamilyMeetingView, null);
            case 'routineBuilder': return React.createElement(RoutineBuilderView, null);
            case 'financialLiteracy': return React.createElement(FinancialLiteracyView, null);
            case 'fantasyFootball': return React.createElement(FantasyFootballView, null);
            case 'collectionsHub': return React.createElement(CollectionsHubView, null);
            case 'collectionView': return React.createElement(CollectionView, { activeCollectionId: activeCollectionId! });
            case 'familyCare': return React.createElement(FamilyCareView, null);
            case 'familyMatters': return React.createElement(FamilyMattersView, null);
            case 'homeManagement': return React.createElement(HomeManagementView, null);
            case 'connections': return React.createElement(ConnectionsView, null);
            case 'chatbot': return React.createElement(ChatbotView, null);
            case 'mealSuggestions': return React.createElement(MealSuggestionView, null);
            case 'digitalVault': return React.createElement(DigitalVaultView, null);
            case 'settings': return React.createElement(SettingsView, { onSavePartial: onSavePersonalization });
            case 'familySettings': return React.createElement(FamilySettingsView, { onSave: onSavePersonalization });
            case 'choreSettings': return React.createElement(ChoreSettingsView, { onSave: onSavePersonalization, onCreateTemplates: createChoreTemplates });
            case 'rewardSettings': return React.createElement(RewardSettingsView, { onSave: onSavePersonalization });
            case 'allowanceSettings': return React.createElement(AllowanceSettingsView, null);
            case 'navigationSettings': return React.createElement(NavigationSettingsView, null);
            case 'dashboardSettings': return React.createElement(DashboardSettingsView, null);
            case 'integrations': return React.createElement(IntegrationsView, null);
            default: return React.createElement(DashboardView, { setCurrentViewingProfileId: setViewingAsProfileId });
        }
    }, [
        currentPage, personalizationData, handleSaveInitialSetup, updateProfile, deductPoints,
        bookLogEntries, bookLogHandlers, trips, tripHandlers, shoppingListItemHandlers,
        calendarEventHandlers, navigateToTripJournal, goBack, appNotifications, dispatch,
        infractions, infractionHandlers, photoAlbumHandlers, photoHandlers, messageHandlers,
        navigate, onSavePersonalization, transactionHandlers, savingsGoalHandlers,
        awardBadgeIfEligible, activeMessageTargetId, activeTripId, prefilledPhoneNumber,
        lockDetails, activeClubId, activeCollectionId, createChoreTemplates
    ]);

    // This is the object that gets passed to the context.
    return useMemo(() => ({
        // State
        IS_TESTING_MODE, session, currentPage, isGoogleLinked,
        hasHistory,
        profiles: familyProfiles, currentViewingProfile, personalizationData, chores: choreList, 
        notifications: appNotifications, familyMessages, shoppingListItems, familyEvents, 
        bookLogEntries, trips, transactions, familyPhotos, photoAlbums, savingsGoals, infractions,
        weeklyMealPlan: personalizationData?.weeklyMealPlan || [],
        favoriteMeals: personalizationData?.favoriteMeals || [],
        loans: personalizationData?.loans || [],
        investments: personalizationData?.investments || [],
        vehicles: personalizationData?.vehicles || [],
        vehicleMaintenanceLogs: personalizationData?.vehicleMaintenanceLogs || [],
        movieSuggestions: personalizationData?.movieSuggestions || [],
        skills: personalizationData?.skills || [],
        assignedSkills: personalizationData?.assignedSkills || [],
        activityClubs: personalizationData?.activityClubs || [],
        familyCourtCases: personalizationData?.familyCourtCases || [],
        familyFoundations: personalizationData?.familyFoundations || { content: '', acknowledgements: {} },
        healthLogs: personalizationData?.healthLogs || [],
        medicalRecords: personalizationData?.medicalRecords || [],
        phoneLogs: personalizationData?.phoneLogs || [],
        contacts: personalizationData?.contacts || [],
        pets: personalizationData?.pets || [],
        petLogs: personalizationData?.petLogs || [],
        manualMemories: personalizationData?.manualMemories || [],
        savedRecipes: personalizationData?.savedRecipes || [],
        pantryItems: personalizationData?.pantryItems || [],
        polls: personalizationData?.polls || [],
        familyBranding: personalizationData?.familyBranding,
        mysteryBoxTiers: personalizationData?.mysteryBoxTiers || [],
        medals: personalizationData?.medals || [],
        customBadges: personalizationData?.customBadges || [],
        awardedMedals: personalizationData?.awardedMedals || [],
        rewardWishlist: personalizationData?.rewardWishlist || [],
        digitalVaultItems: personalizationData?.digitalVaultItems || [],
        safeWebsiteUrls,
        smartDevices: personalizationData?.smartDevices || [],
        smartScenes: personalizationData?.smartScenes || [],
        automationRules: personalizationData?.automationRules || [],
        homeworkAssignments: personalizationData?.homeworkAssignments || [],
        shoutOuts: personalizationData?.shoutOuts || [],
        budgetCategories: personalizationData?.budgetCategories || [],
        expenses: personalizationData?.expenses || [],
        screenTimeLogs: personalizationData?.screenTimeLogs || [],
        marketAssets: personalizationData?.marketAssets || [],
        portfolioHoldings: personalizationData?.portfolioHoldings || [],
        marketTransactions: personalizationData?.marketTransactions || [],
        familyMeetings: personalizationData?.familyMeetings || [],
        habits: personalizationData?.habits || [],
        habitLogs: personalizationData?.habitLogs || [],
        completedLiteracyTopics: currentViewingProfile?.completedLiteracyTopics || [],
        fantasyLeagues: personalizationData?.fantasyLeagues || [],
        collections: personalizationData?.collections || [],
        collectionItems: personalizationData?.collectionItems || [],
        caregivers: personalizationData?.caregivers || [],
        careRecipients: personalizationData?.careRecipients || [],
        careLogs: personalizationData?.careLogs || [],
        weeklyTopEarner,

        // Handlers
        onNavigate: navigate, goBack, addToast, addAppNotification, getProfileName,
        updateProfile, awardBadgeIfEligible, deductPoints, addScreenTime,
        generateWeeklyReport, onSavePersonalization,
        handleSaveInitialSetup, renderPage,
        choreHandlers, messageHandlers,
        addShoppingListItem: shoppingListItemHandlers.add,
        updateShoppingListItem: shoppingListItemHandlers.update,
        deleteShoppingListItem: shoppingListItemHandlers.delete,
        clearPurchasedItems: shoppingListItemHandlers.clearPurchasedItems,
        addEvent: calendarEventHandlers.add, updateEvent: calendarEventHandlers.update, deleteEvent: calendarEventHandlers.delete,
        addBookLogEntry: bookLogHandlers.add, updateBookLogEntry: bookLogHandlers.update, deleteBookLogEntry: bookLogHandlers.delete,
        addSafeWebsite: safeWebsiteHandlers.add, updateSafeWebsite: safeWebsiteHandlers.update, deleteSafeWebsite: safeWebsiteHandlers.delete,
        addTrip: tripHandlers.add, updateTrip: tripHandlers.update, deleteTrip: tripHandlers.delete,
        addTransaction: transactionHandlers.add, updateTransaction: transactionHandlers.update, deleteTransaction: transactionHandlers.delete,
        addPhotoAlbum: photoAlbumHandlers.add, updatePhotoAlbum: photoAlbumHandlers.update, deletePhotoAlbum: photoAlbumHandlers.delete,
        addPhoto: photoHandlers.add, updatePhoto: photoHandlers.update, deletePhoto: photoHandlers.delete,
        addSavingsGoal: savingsGoalHandlers.add, updateSavingsGoal: savingsGoalHandlers.update, deleteSavingsGoal: savingsGoalHandlers.delete,
        addInfraction: infractionHandlers.add, updateInfraction: infractionHandlers.update, deleteInfraction: infractionHandlers.delete,
        addVehicle: vehicleHandlers.add, updateVehicle: vehicleHandlers.update, deleteVehicle: vehicleHandlers.delete,
        addMaintenanceLog: maintenanceLogHandlers.add, updateMaintenanceLog: maintenanceLogHandlers.update, deleteMaintenanceLog: maintenanceLogHandlers.delete,
        addMovieSuggestion: movieSuggestionHandlers.add, updateMovieSuggestion: movieSuggestionHandlers.update, deleteMovieSuggestion: movieSuggestionHandlers.delete,
        addSkill: skillHandlers.add, updateSkill: skillHandlers.update, deleteSkill: skillHandlers.delete,
        assignSkill: assignedSkillHandlers.add, updateAssignedSkill: assignedSkillHandlers.update, deleteAssignedSkill: assignedSkillHandlers.delete,
        addRecipe: recipeHandlers.add, updateRecipe: recipeHandlers.update, deleteRecipe: recipeHandlers.delete,
        addMealSuggestion: mealSuggestionHandlers.add, updateMealSuggestion: mealSuggestionHandlers.update, deleteMealSuggestion: mealSuggestionHandlers.delete,
        addHabit: habitHandlers.add, updateHabit: habitHandlers.update, deleteHabit: habitHandlers.delete,
        addHabitLog: habitLogHandlers.add, updateHabitLog: habitLogHandlers.update, deleteHabitLog: habitLogHandlers.delete,
        toggleHabitLogAndUpdateStreak,
        addPet: petHandlers.add, updatePet: petHandlers.update, deletePet: petHandlers.delete,
        addPetLog: petLogHandlers.add, updatePetLog: petLogHandlers.update, deletePetLog: petLogHandlers.delete,
        addManualMemory: manualMemoryHandlers.add, updateManualMemory: manualMemoryHandlers.update, deleteManualMemory: manualMemoryHandlers.delete,
        addPantryItem: pantryItemHandlers.add, updatePantryItem: pantryItemHandlers.update, deletePantryItem: pantryItemHandlers.delete,
        addPoll: pollHandlers.add, updatePoll: pollHandlers.update, deletePoll: pollHandlers.delete,
        addContact: contactHandlers.add, updateContact: contactHandlers.update, deleteContact: contactHandlers.delete,
        addActivityClub: activityClubHandlers.add, updateActivityClub: activityClubHandlers.update, deleteActivityClub: activityClubHandlers.delete,
        addHealthLog: healthLogHandlers.add, updateHealthLog: healthLogHandlers.update, deleteHealthLog: healthLogHandlers.delete,
        addMedicalRecord: medicalRecordHandlers.add, updateMedicalRecord: medicalRecordHandlers.update, deleteMedicalRecord: medicalRecordHandlers.delete,
        addFamilyCourtCase: familyCourtCaseHandlers.add, updateFamilyCourtCase: familyCourtCaseHandlers.update, deleteFamilyCourtCase: familyCourtCaseHandlers.delete,
        addPhoneLog: phoneLogHandlers.add,
        addShoutOut: shoutOutHandlers.add,
        addBudgetCategory: budgetCategoryHandlers.add, updateBudgetCategory: budgetCategoryHandlers.update, deleteBudgetCategory: budgetCategoryHandlers.delete,
        addExpense: expenseHandlers.add,
        addScreenTimeLog: screenTimeLogHandlers.add, updateScreenTimeLog: screenTimeLogHandlers.update,
        addFamilyMeeting: familyMeetingHandlers.add, updateFamilyMeeting: familyMeetingHandlers.update, deleteFamilyMeeting: familyMeetingHandlers.delete,
        addCollection: collectionHandlers.add, updateCollection: collectionHandlers.update, deleteCollection: collectionHandlers.delete,
        addCollectionItem: collectionItemHandlers.add, updateCollectionItem: collectionItemHandlers.update, deleteCollectionItem: collectionItemHandlers.delete,
        addCaregiver: caregiverHandlers.add, updateCaregiver: caregiverHandlers.update, deleteCaregiver: caregiverHandlers.delete,
        addCareRecipient: careRecipientHandlers.add, updateCareRecipient: careRecipientHandlers.update, deleteCareRecipient: careRecipientHandlers.delete,
        addCareLog: careLogHandlers.add,
        addFantasyLeague: fantasyLeagueHandlers.add, updateFantasyLeague: fantasyLeagueHandlers.update, deleteFantasyLeague: fantasyLeagueHandlers.delete,
        addCustomBadge: customBadgeHandlers.add, updateCustomBadge: customBadgeHandlers.update, deleteCustomBadge: customBadgeHandlers.delete,
        addMedal: medalHandlers.add, updateMedal: medalHandlers.update, deleteMedal: medalHandlers.delete,
        addAwardedMedal: awardedMedalHandlers.add,
        addRewardWishlistItem: rewardWishlistHandlers.add, updateRewardWishlistItem: rewardWishlistHandlers.update, deleteRewardWishlistItem: rewardWishlistHandlers.delete,
        addSmartDevice: smartDeviceHandlers.add, updateSmartDevice: smartDeviceHandlers.update, deleteSmartDevice: smartDeviceHandlers.delete,
        addScene: smartSceneHandlers.add, updateScene: smartSceneHandlers.update, deleteScene: smartSceneHandlers.delete,
        addAutomationRule: automationRuleHandlers.add, updateAutomationRule: automationRuleHandlers.update, deleteAutomationRule: automationRuleHandlers.delete,
        addHomeworkAssignment: homeworkAssignmentHandlers.add, updateHomeworkAssignment: homeworkAssignmentHandlers.update, deleteHomeworkAssignment: homeworkAssignmentHandlers.delete,
        addDigitalVaultItem: digitalVaultItemHandlers.add, updateDigitalVaultItem: digitalVaultItemHandlers.update, deleteDigitalVaultItem: digitalVaultItemHandlers.delete,
        addLoan: loanHandlers.add, updateLoan: loanHandlers.update, deleteLoan: loanHandlers.delete,
        addInvestment: investmentHandlers.add, updateInvestment: investmentHandlers.update, deleteInvestment: investmentHandlers.delete,
        addMarketAsset: marketAssetHandlers.add, updateMarketAsset: marketAssetHandlers.update, deleteMarketAsset: marketAssetHandlers.delete,
        addPortfolioHolding: portfolioHoldingHandlers.add, updatePortfolioHolding: portfolioHoldingHandlers.update, deletePortfolioHolding: portfolioHoldingHandlers.delete,
        addMarketTransaction: marketTransactionHandlers.add,
        addMysteryBoxTier: createPersonalizationHandler<MysteryBoxTier>('mysteryBoxTiers').add,
        updateMysteryBoxTier: createPersonalizationHandler<MysteryBoxTier>('mysteryBoxTiers').update,
        deleteMysteryBoxTier: createPersonalizationHandler<MysteryBoxTier>('mysteryBoxTiers').delete,
        navigateToPhoneWithNumber,
        onNavigateToMessages: navigateToMessagesWithRecipient,
        setActiveCollectionId: (id: string | null) => dispatch({ type: 'SET_STATE', payload: { activeCollectionId: id } }),
    }), [
        IS_TESTING_MODE, session, currentPage, isGoogleLinked, pageHistory, hasHistory, familyProfiles,
        currentViewingProfile, personalizationData, choreList, appNotifications, familyMessages,
        shoppingListItems, familyEvents, bookLogEntries, safeWebsiteUrls, trips, transactions,
        familyPhotos, photoAlbums, savingsGoals, infractions, navigate, goBack, addToast,
        addAppNotification, getProfileName, updateProfile, awardBadgeIfEligible, deductPoints,
        addScreenTime, onSavePersonalization, handleSaveInitialSetup, renderPage, choreHandlers,
        messageHandlers, shoppingListItemHandlers, calendarEventHandlers, bookLogHandlers,
        safeWebsiteHandlers, tripHandlers, transactionHandlers, photoAlbumHandlers,
        photoHandlers, savingsGoalHandlers, infractionHandlers, vehicleHandlers,
        maintenanceLogHandlers, movieSuggestionHandlers, skillHandlers, assignedSkillHandlers,
        recipeHandlers, mealSuggestionHandlers, habitHandlers, habitLogHandlers, petHandlers,
        petLogHandlers, manualMemoryHandlers, pantryItemHandlers, pollHandlers,
        contactHandlers, activityClubHandlers, healthLogHandlers, medicalRecordHandlers,
        familyCourtCaseHandlers, phoneLogHandlers, shoutOutHandlers, budgetCategoryHandlers,
        expenseHandlers, screenTimeLogHandlers, familyMeetingHandlers, collectionHandlers,
        collectionItemHandlers, caregiverHandlers, careRecipientHandlers, careLogHandlers,
        fantasyLeagueHandlers, customBadgeHandlers, medalHandlers, awardedMedalHandlers,
        rewardWishlistHandlers, smartDeviceHandlers, smartSceneHandlers, automationRuleHandlers,
        homeworkAssignmentHandlers, digitalVaultItemHandlers, loanHandlers, investmentHandlers,
        marketAssetHandlers, portfolioHoldingHandlers, marketTransactionHandlers,
        createPersonalizationHandler, navigateToPhoneWithNumber, navigateToMessagesWithRecipient, dispatch,
        createChoreTemplates, weeklyTopEarner, toggleHabitLogAndUpdateStreak
    ]);
};
