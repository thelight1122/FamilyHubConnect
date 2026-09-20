
import React, { createContext, useContext } from 'react';
import type { 
    PageView, Profile, ToastMessage, PersonalizationData, AppNotification, BadgeType, Chore, FamilyMessage, ShoppingListItem, FamilyEvent, BookLogEntry, PlannedMeal, SafeWebsite, Trip, Transaction, Photo, PhotoAlbum, SavingsGoal, Infraction, Loan, Investment, Vehicle, VehicleMaintenanceLog, MovieSuggestion, Skill, AssignedSkill, ActivityClub, FamilyCourtCase, HealthLog, MedicalRecord, PhoneLog, Contact, MealSuggestion, Pet, PetLog, ManualMemory, Recipe, PantryItem, Poll, FamilyBranding, MysteryBoxTier, Medal, AwardedMedal, SmartDevice, SmartScene, AutomationRule, HomeworkAssignment, ShoutOut, BudgetCategory, Expense, ScreenTimeLog, MarketAsset, FamilyMeeting, Habit, HabitLog, CustomBadge, RewardWishlistItem, DigitalVaultItem, FantasyLeague, Collection, CollectionItem, Caregiver, CareRecipient, CareLog, ChoreHandlers, MessageHandlers, PortfolioHolding, MarketTransaction, AppState
} from '../types';
import type { Session } from '@supabase/supabase-js';

// This new type accurately reflects the data provided by useAppContextValue.
// It resolves the previous mismatch where AppContextType extended AppState,
// which caused cascading type errors.
export interface AppContextType {
    // Core State & Flags
    IS_TESTING_MODE: boolean;
    session: Session | null;
    currentPage: PageView;
    hasHistory: boolean;
    isGoogleLinked: boolean;
    personalizationData: PersonalizationData | null;
    
    // Core Data Arrays
    profiles: Profile[];
    chores: Chore[];
    notifications: AppNotification[];
    familyMessages: FamilyMessage[];
    shoppingListItems: ShoppingListItem[];
    familyEvents: FamilyEvent[];
    bookLogEntries: BookLogEntry[];
    trips: Trip[];
    transactions: Transaction[];
    familyPhotos: Photo[];
    photoAlbums: PhotoAlbum[];
    savingsGoals: SavingsGoal[];
    infractions: Infraction[];
    safeWebsiteUrls: SafeWebsite[];

    // Derived Data
    currentViewingProfile: Profile | undefined;
    weeklyTopEarner: { profile: Profile, points: number } | null;

    // Flattened from personalizationData for convenience
    weeklyMealPlan: PlannedMeal[];
    favoriteMeals: MealSuggestion[];
    loans: Loan[];
    investments: Investment[];
    vehicles: Vehicle[];
    vehicleMaintenanceLogs: VehicleMaintenanceLog[];
    movieSuggestions: MovieSuggestion[];
    skills: Skill[];
    assignedSkills: AssignedSkill[];
    activityClubs: ActivityClub[];
    familyCourtCases: FamilyCourtCase[];
    familyFoundations: { content: string; acknowledgements: { [profileId: string]: number; }; };
    healthLogs: HealthLog[];
    medicalRecords: MedicalRecord[];
    phoneLogs: PhoneLog[];
    contacts: Contact[];
    pets: Pet[];
    petLogs: PetLog[];
    manualMemories: ManualMemory[];
    savedRecipes: Recipe[];
    pantryItems: PantryItem[];
    polls: Poll[];
    familyBranding?: FamilyBranding;
    mysteryBoxTiers: MysteryBoxTier[];
    medals: Medal[];
    customBadges: CustomBadge[];
    awardedMedals: AwardedMedal[];
    rewardWishlist: RewardWishlistItem[];
    digitalVaultItems: DigitalVaultItem[];
    smartDevices: SmartDevice[];
    smartScenes: SmartScene[];
    automationRules: AutomationRule[];
    homeworkAssignments: HomeworkAssignment[];
    shoutOuts: ShoutOut[];
    budgetCategories: BudgetCategory[];
    expenses: Expense[];
    screenTimeLogs: ScreenTimeLog[];
    marketAssets: MarketAsset[];
    portfolioHoldings: PortfolioHolding[];
    marketTransactions: MarketTransaction[];
    familyMeetings: FamilyMeeting[];
    habits: Habit[];
    habitLogs: HabitLog[];
    completedLiteracyTopics: string[];
    fantasyLeagues: FantasyLeague[];
    collections: Collection[];
    collectionItems: CollectionItem[];
    caregivers: Caregiver[];
    careRecipients: CareRecipient[];
    careLogs: CareLog[];

    // --- Core Handlers ---
    onNavigate: (page: PageView) => void;
    goBack: () => void;
    addToast: (message: string, type: ToastMessage['type'], icon?: string) => void;
    addAppNotification: (message: string, type: AppNotification['type'], relatedProfileId?: string) => Promise<void>;
    getProfileName: (profileId: string | null) => string;
    updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<void>;
    awardBadgeIfEligible: (profileId: string, badgeId: BadgeType) => Promise<boolean>;
    deductPoints: (profileId: string, points: number) => Promise<void>;
    addScreenTime: (profileId: string, minutes: number, reason: string) => Promise<void>;
    generateWeeklyReport: (highlightsText: string) => Promise<string>;
    onSavePersonalization: (updates: Partial<PersonalizationData>) => Promise<void>;
    handleSaveInitialSetup: (data: PersonalizationData) => Promise<void>;
    renderPage: () => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
    createChoreTemplates: (choreNames: string) => Promise<void>;
    
    // --- Module-specific Handlers ---
    choreHandlers: ChoreHandlers;
    messageHandlers: MessageHandlers;
    addShoppingListItem: (item: Omit<ShoppingListItem, 'id' | 'family_id'>) => Promise<ShoppingListItem>;
    updateShoppingListItem: (id: string, updates: Partial<ShoppingListItem>) => Promise<void>;
    deleteShoppingListItem: (id: string) => Promise<void>;
    clearPurchasedItems: () => Promise<void>;
    addEvent: (item: Omit<FamilyEvent, 'id' | 'family_id' | 'google_event_id'>) => Promise<FamilyEvent | null>;
    updateEvent: (event: FamilyEvent) => Promise<void>;
    deleteEvent: (event: FamilyEvent) => Promise<void>;
    addBookLogEntry: (item: Omit<BookLogEntry, 'id' | 'family_id'>) => Promise<BookLogEntry | void>;
    updateBookLogEntry: (id: string, updates: Partial<BookLogEntry>) => Promise<void>;
    deleteBookLogEntry: (id: string) => Promise<void>;
    addSafeWebsite: (item: Omit<SafeWebsite, 'id' | 'family_id'>) => Promise<SafeWebsite>;
    updateSafeWebsite: (id: string, updates: Partial<SafeWebsite>) => Promise<void>;
    deleteSafeWebsite: (id: string) => Promise<void>;
    addTrip: (item: Omit<Trip, 'id' | 'family_id'>) => Promise<Trip>;
    updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
    deleteTrip: (id: string) => Promise<void>;
    addTransaction: (item: Omit<Transaction, 'id' | 'family_id'>) => Promise<Transaction>;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    addPhotoAlbum: (item: Omit<PhotoAlbum, 'id' | 'family_id'>) => Promise<PhotoAlbum>;
    updatePhotoAlbum: (id: string, updates: Partial<PhotoAlbum>) => Promise<void>;
    deletePhotoAlbum: (id: string) => Promise<void>;
    addPhoto: (item: Omit<Photo, 'id' | 'family_id'>) => Promise<Photo>;
    updatePhoto: (id: string, updates: Partial<Photo>) => Promise<void>;
    deletePhoto: (id: string) => Promise<void>;
    addSavingsGoal: (item: Omit<SavingsGoal, 'id' | 'family_id'>) => Promise<SavingsGoal>;
    updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
    deleteSavingsGoal: (id: string) => Promise<void>;
    addInfraction: (infraction: Omit<Infraction, 'id' | 'family_id' | 'created_at' | 'completed_at' | 'evidence_urls'>, evidenceFile?: File) => Promise<void>;
    updateInfraction: (id: string, updates: Partial<Infraction>) => Promise<void>;
    deleteInfraction: (id: string) => Promise<void>;
    addVehicle: (item: Omit<Vehicle, 'id'>) => Promise<Vehicle | undefined | null>;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
    deleteVehicle: (id: string) => Promise<void>;
    addMaintenanceLog: (item: Omit<VehicleMaintenanceLog, 'id'>) => Promise<VehicleMaintenanceLog | undefined | null>;
    updateMaintenanceLog: (id: string, updates: Partial<VehicleMaintenanceLog>) => Promise<void>;
    deleteMaintenanceLog: (id: string) => Promise<void>;
    addMovieSuggestion: (item: Omit<MovieSuggestion, 'id'>) => Promise<MovieSuggestion | undefined | null>;
    updateMovieSuggestion: (id: string, updates: Partial<MovieSuggestion>) => Promise<void>;
    deleteMovieSuggestion: (id: string) => Promise<void>;
    addSkill: (item: Omit<Skill, 'id'>) => Promise<Skill | undefined | null>;
    updateSkill: (id: string, updates: Partial<Skill>) => Promise<void>;
    deleteSkill: (id: string) => Promise<void>;
    assignSkill: (item: Omit<AssignedSkill, 'id'>) => Promise<AssignedSkill | undefined | null>;
    updateAssignedSkill: (id: string, updates: Partial<AssignedSkill>) => Promise<void>;
    deleteAssignedSkill: (id: string) => Promise<void>;
    addRecipe: (item: Omit<Recipe, 'id'>) => Promise<Recipe | undefined | null>;
    updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
    deleteRecipe: (id: string) => Promise<void>;
    addHabit: (item: Omit<Habit, 'id'>) => Promise<Habit | undefined | null>;
    updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    addHabitLog: (item: Omit<HabitLog, 'id'>) => Promise<HabitLog | undefined | null>;
    updateHabitLog: (id: string, updates: Partial<HabitLog>) => Promise<void>;
    deleteHabitLog: (id: string) => Promise<void>;
    toggleHabitLogAndUpdateStreak: (habit: Habit, date: Date) => Promise<void>;
    addPet: (item: Omit<Pet, 'id'>) => Promise<Pet | undefined | null>;
    updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
    deletePet: (id: string) => Promise<void>;
    addPetLog: (item: Omit<PetLog, 'id'>) => Promise<PetLog | undefined | null>;
    updatePetLog: (id: string, updates: Partial<PetLog>) => Promise<void>;
    deletePetLog: (id: string) => Promise<void>;
    addManualMemory: (item: Omit<ManualMemory, 'id'>) => Promise<ManualMemory | undefined | null>;
    updateManualMemory: (id: string, updates: Partial<ManualMemory>) => Promise<void>;
    deleteManualMemory: (id: string) => Promise<void>;
    addPantryItem: (item: Omit<PantryItem, 'id'>) => Promise<PantryItem | undefined | null>;
    updatePantryItem: (id: string, updates: Partial<PantryItem>) => Promise<void>;
    deletePantryItem: (id: string) => Promise<void>;
    addPoll: (item: Omit<Poll, 'id'>) => Promise<Poll | undefined | null>;
    updatePoll: (id: string, updates: Partial<Poll>) => Promise<void>;
    deletePoll: (id: string) => Promise<void>;
    addContact: (item: Omit<Contact, 'id'>) => Promise<Contact | undefined | null>;
    updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
    addActivityClub: (item: Omit<ActivityClub, 'id'>) => Promise<ActivityClub | undefined | null>;
    updateActivityClub: (id: string, updates: Partial<ActivityClub>) => Promise<void>;
    deleteActivityClub: (id: string) => Promise<void>;
    addHealthLog: (item: Omit<HealthLog, 'id'>) => Promise<HealthLog | undefined | null>;
    updateHealthLog: (id: string, updates: Partial<HealthLog>) => Promise<void>;
    deleteHealthLog: (id: string) => Promise<void>;
    addMedicalRecord: (item: Omit<MedicalRecord, 'id'>) => Promise<MedicalRecord | undefined | null>;
    updateMedicalRecord: (id: string, updates: Partial<MedicalRecord>) => Promise<void>;
    deleteMedicalRecord: (id: string) => Promise<void>;
    addFamilyCourtCase: (item: Omit<FamilyCourtCase, 'id'>) => Promise<FamilyCourtCase | undefined | null>;
    updateFamilyCourtCase: (id: string, updates: Partial<FamilyCourtCase>) => Promise<void>;
    deleteFamilyCourtCase: (id: string) => Promise<void>;
    addPhoneLog: (item: Omit<PhoneLog, 'id'>) => Promise<PhoneLog | undefined | null>;
    addShoutOut: (item: Omit<ShoutOut, 'id'>) => Promise<ShoutOut | undefined | null>;
    addBudgetCategory: (item: Omit<BudgetCategory, 'id'>) => Promise<BudgetCategory | undefined | null>;
    updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => Promise<void>;
    deleteBudgetCategory: (id: string) => Promise<void>;
    addExpense: (item: Omit<Expense, 'id'>) => Promise<Expense | undefined | null>;
    addScreenTimeLog: (item: Omit<ScreenTimeLog, 'id'>) => Promise<ScreenTimeLog | undefined | null>;
    updateScreenTimeLog: (id: string, updates: Partial<ScreenTimeLog>) => Promise<void>;
    addFamilyMeeting: (item: Omit<FamilyMeeting, 'id'>) => Promise<FamilyMeeting | undefined | null>;
    updateFamilyMeeting: (id: string, updates: Partial<FamilyMeeting>) => Promise<void>;
    deleteFamilyMeeting: (id: string) => Promise<void>;
    addCollection: (item: Omit<Collection, 'id'>) => Promise<Collection | undefined | null>;
    updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
    deleteCollection: (id: string) => Promise<void>;
    addCollectionItem: (item: Omit<CollectionItem, 'id'>) => Promise<CollectionItem | undefined | null>;
    updateCollectionItem: (id: string, updates: Partial<CollectionItem>) => Promise<void>;
    deleteCollectionItem: (id: string) => Promise<void>;
    addCaregiver: (item: Omit<Caregiver, 'id'>) => Promise<Caregiver | undefined | null>;
    updateCaregiver: (id: string, updates: Partial<Caregiver>) => Promise<void>;
    deleteCaregiver: (id: string) => Promise<void>;
    addCareRecipient: (item: Omit<CareRecipient, 'id'>) => Promise<CareRecipient | undefined | null>;
    updateCareRecipient: (id: string, updates: Partial<CareRecipient>) => Promise<void>;
    deleteCareRecipient: (id: string) => Promise<void>;
    addCareLog: (item: Omit<CareLog, 'id'>) => Promise<CareLog | undefined | null>;
    addFantasyLeague: (item: Omit<FantasyLeague, 'id'>) => Promise<FantasyLeague | undefined | null>;
    updateFantasyLeague: (id: string, updates: Partial<FantasyLeague>) => Promise<void>;
    deleteFantasyLeague: (id: string) => Promise<void>;
    addCustomBadge: (item: Omit<CustomBadge, 'id'>) => Promise<CustomBadge | undefined | null>;
    updateCustomBadge: (id: string, updates: Partial<CustomBadge>) => Promise<void>;
    deleteCustomBadge: (id: string) => Promise<void>;
    addMedal: (item: Omit<Medal, 'id'>) => Promise<Medal | undefined | null>;
    updateMedal: (id: string, updates: Partial<Medal>) => Promise<void>;
    deleteMedal: (id: string) => Promise<void>;
    addAwardedMedal: (item: Omit<AwardedMedal, 'id'>) => Promise<AwardedMedal | undefined | null>;
    addRewardWishlistItem: (item: Omit<RewardWishlistItem, 'id'>) => Promise<RewardWishlistItem | undefined | null>;
    updateRewardWishlistItem: (id: string, updates: Partial<RewardWishlistItem>) => Promise<void>;
    deleteRewardWishlistItem: (id: string) => Promise<void>;
    addSmartDevice: (item: Omit<SmartDevice, 'id'>) => Promise<SmartDevice | undefined | null>;
    updateSmartDevice: (id: string, updates: Partial<SmartDevice>) => Promise<void>;
    deleteSmartDevice: (id: string) => Promise<void>;
    addScene: (item: Omit<SmartScene, 'id'>) => Promise<SmartScene | undefined | null>;
    updateScene: (id: string, updates: Partial<SmartScene>) => Promise<void>;
    deleteScene: (id: string) => Promise<void>;
    addAutomationRule: (item: Omit<AutomationRule, 'id'>) => Promise<AutomationRule | undefined | null>;
    updateAutomationRule: (id: string, updates: Partial<AutomationRule>) => Promise<void>;
    deleteAutomationRule: (id: string) => Promise<void>;
    addHomeworkAssignment: (item: Omit<HomeworkAssignment, 'id'>) => Promise<HomeworkAssignment | undefined | null>;
    updateHomeworkAssignment: (id: string, updates: Partial<HomeworkAssignment>) => Promise<void>;
    deleteHomeworkAssignment: (id: string) => Promise<void>;
    addDigitalVaultItem: (item: Omit<DigitalVaultItem, 'id'>) => Promise<DigitalVaultItem | undefined | null>;
    updateDigitalVaultItem: (id: string, updates: Partial<DigitalVaultItem>) => Promise<void>;
    deleteDigitalVaultItem: (id: string) => Promise<void>;
    addLoan: (item: Omit<Loan, 'id'>) => Promise<Loan | undefined | null>;
    updateLoan: (id: string, updates: Partial<Loan>) => Promise<void>;
    deleteLoan: (id: string) => Promise<void>;
    addInvestment: (item: Omit<Investment, 'id'>) => Promise<Investment | undefined | null>;
    updateInvestment: (id: string, updates: Partial<Investment>) => Promise<void>;
    deleteInvestment: (id: string) => Promise<void>;
    addMarketAsset: (item: Omit<MarketAsset, 'id'>) => Promise<MarketAsset | undefined | null>;
    updateMarketAsset: (id: string, updates: Partial<MarketAsset>) => Promise<void>;
    deleteMarketAsset: (id: string) => Promise<void>;
    addPortfolioHolding: (item: Omit<PortfolioHolding, 'id'>) => Promise<PortfolioHolding | undefined | null>;
    updatePortfolioHolding: (id: string, updates: Partial<PortfolioHolding>) => Promise<void>;
    deletePortfolioHolding: (id: string) => Promise<void>;
    addMarketTransaction: (item: Omit<MarketTransaction, 'id'>) => Promise<MarketTransaction | undefined | null>;
    addMealSuggestion: (item: Omit<MealSuggestion, 'id'>) => Promise<MealSuggestion | undefined | null>;
    updateMealSuggestion: (id: string, updates: Partial<MealSuggestion>) => Promise<void>;
    deleteMealSuggestion: (id: string) => Promise<void>;
    addMysteryBoxTier: (item: Omit<MysteryBoxTier, 'id'>) => Promise<MysteryBoxTier | undefined | null>;
    updateMysteryBoxTier: (id: string, updates: Partial<MysteryBoxTier>) => Promise<void>;
    deleteMysteryBoxTier: (id: string) => Promise<void>;
    
    // Special Navigators
    navigateToPhoneWithNumber: (number: string) => void;
    onNavigateToMessages: (recipientId: string) => void;
    setActiveCollectionId: (id: string | null) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a AppProvider');
    }
    return context;
};

export const AppProvider = AppContext.Provider;
