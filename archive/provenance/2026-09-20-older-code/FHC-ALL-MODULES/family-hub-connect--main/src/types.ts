

// --- Page & Module Types ---
// Manually defining PageView as a string literal union type breaks the circular dependency 
// between types.ts and navigation.ts, which was likely causing the application to fail on load.
export type PageView =
  | 'dashboard' | 'auth' | 'chores' | 'rewards' | 'calendar' | 'shoppingList' | 'settings'
  | 'todo' | 'profileSettings' | 'connections' | 'messages' | 'polls' | 'shoutOuts'
  | 'finance' | 'allowance' | 'budget' | 'familyBank' | 'screenTimeBank' | 'marketSim'
  | 'financialLiteracy' | 'familyCare' | 'aiNurse' | 'health' | 'medicalRecords'
  | 'caregivingCentral' | 'homeManagement' | 'vehicleMaintenance' | 'smartHome'
  | 'weeklyReport' | 'theFridge' | 'mealPlan' | 'mealSuggestions' | 'recipeBook'
  | 'pantry' | 'familyMatters' | 'familyFoundations' | 'familyMeeting' | 'familyCourt'
  | 'consequences' | 'accolades' | 'digitalDesk' | 'homeworkPlanner' | 'homeworkHelper'
  | 'readingCorner' | 'routineBuilder' | 'lockerRoom' | 'skillsTracker' | 'familyGames'
  | 'movieNightPicker' | 'gameScorer' | 'creatorsStudio' | 'aiAvatarCreator' | 'storyGenerator'
  | 'drawingBoard' | 'newsletterCreator' | 'familyTimeline' | 'familySettings' | 'familyBranding'
  | 'choreSettings' | 'rewardSettings' | 'allowanceSettings' | 'navigationSettings' | 'dashboardSettings'
  | 'integrations' | 'securitySettings'
  // Pages from other parts of the app
  | 'phone' | 'petHub' | 'aiSettings' | 'collectionView' | 'tripJournal'
  | 'activities' | 'activityClubDetail' | 'automationSettings' | 'collectionsHub'
  | 'contacts' | 'digitalFridge' | 'digitalVault' | 'email' | 'events' | 'fantasyFootball'
  | 'googleCallback' | 'gpsTracking' | 'habitTracker' | 'internet' | 'landing'
  | 'lockScreen' | 'photoAlbum' | 'socialMedia' | 'themeSettings' | 'familyConstitution'
  | 'familyMeetings' | 'timeOut' | 'todoSettings' | 'tripPlanner' | 'upcoming' | 'webBrowser'
  // Special values
  | 'initialSetup'
  | ''; // For empty active page states


export interface ModuleDefinition {
    page: PageView;
    title: string;
    childTitle?: string;
    icon: string;
    description: string;
    parentOnly?: boolean;
    childOnly?: boolean;
    widget?: 'chores' | 'upcoming' | 'weather';
}


// --- Forms ---
export interface AdultDetailForm {
    tempId: string;
    name: string;
    avatarUrl: string;
    role: 'adult';
    email?: string;
}
export interface ChildDetailForm {
    tempId: string;
    name: string;
    avatarUrl: string;
    age?: number;
    role: 'child';
}

// --- Badge ---
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

// --- Core Data Structures ---
export interface Profile {
    id: string;
    name: string;
    email?: string;
    role: 'Admin' | 'Parent' | 'Child' | 'Other';
    age?: number;
    birthday?: string;
    points: number;
    balance?: number;
    screenTimeBalance?: number;
    earnedBadges: string[];
    completedLiteracyTopics?: string[];
    theme?: { [key: string]: string };
    dashboardLayout?: { page: PageView; visible: boolean }[];
    navBarLayout?: { page: PageView; label: string; icon: string }[];
    avatarUrl?: string;
    status?: 'active' | 'disabled';
}

export interface FamilyMessage {
    id: string;
    family_id?: string;
    text: string;
    authorId: string;
    authorName: string;
    timestamp: number;
    recipientId: string | null; // null for family chat
    readBy?: string[];
}

export interface AppNotification {
    id: string;
    message: string;
    type: 'new_message' | 'chore_status' | 'badge_earned' | 'reward_redeemed' | 'event_reminder' | 'allowance_request' | 'goal_achieved' | 'new_book_log';
    timestamp: number;
    read: boolean;
    relatedProfileId?: string;
}

export interface AvailableReward {
    id: string;
    name: string;
    cost: number;
}

export interface RewardWishlistItem {
    id: string;
    profileId: string;
    name: string;
    url?: string;
    status: 'pending' | 'approved' | 'denied';
}

export interface PhotoAlbum {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    timestamp: number;
}

export interface Photo {
    id: string;
    albumId: string;
    imageUrl: string;
    caption?: string;
    uploadedBy: string;
    timestamp: number;
}

export interface BookLogEntry {
    id: string;
    family_id?: string;
    profileId: string;
    title: string;
    author?: string;
    status: 'reading' | 'finished' | 'to_read';
    rating?: number;
    notes?: string;
    startDate?: string;
    finishDate?: string;
}

export interface Skill {
    id: string;
    name: string;
    description: string;
}

export interface AssignedSkill {
    id: string;
    skillId: string;
    profileId: string;
    mastery: 'beginner' | 'intermediate' | 'expert';
}

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    profileId: string;
}

export interface ShoutOut {
    id: string;
    fromProfileId: string;
    toProfileId: string;
    message: string;
    timestamp: number;
}

export interface Medal {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface AwardedMedal {
    id: string;
    medalId: string;
    profileId: string;
    awardedBy: string;
    reason: string;
    timestamp: number;
}


// --- AI Specific Types ---
export interface AISettings {
    ageAppropriate: boolean;
    restrictedTopics: string[];
}
export interface FamilyMeeting {
    id: string;
    title: string;
    date: string;
    time: string;
    agenda: any[];
    actionItems: any[];
}
export interface FamilyCourtCase {
    id: string;
    title: string;
    description: string;
    plaintiffId: string;
    defendantId: string;
    status: 'Open' | 'Closed';
    verdict?: string;
    consequence?: string;
    consequenceDurationHours?: number;
    verdictTimestamp?: number;
}

export interface Habit {
    id: string;
    profileId: string;
    name: string;
    icon: string;
    color: string;
    weeklyGoal: number;
    currentStreak: number;
    longestStreak: number;
}

export interface HabitLog {
    id: string;
    habitId: string;
    date: string;
}

export interface SafeWebsite {
    id: string;
    family_id?: string;
    name: string;
    url: string;
}

export interface FamilyBranding {
    motto?: string;
    crestUrl?: string | null;
    headerFont?: string;
    bodyFont?: string;
    borderRadius?: string;
}

export interface PersonalizationData {
    familyName?: string;
    aiSettings?: AISettings;
    familyFoundations?: { content: string; acknowledgements: { [key: string]: number } };
    familyMeetings?: FamilyMeeting[],
    familyCourtCases?: FamilyCourtCase[],
    bookLogEntries?: BookLogEntry[];
    
    // For setup
    numAdultsStr?: string;
    numChildrenStr?: string;
    adultDetailsArray?: AdultDetailForm[];
    childDetailsArray?: ChildDetailForm[];
    
    // Features
    gamifyTasks?: boolean;
    availableRewards?: AvailableReward[];
    specificChores?: string;
    allowanceSettings?: {
        enabled: boolean;
        amount: number;
        payday: DayOfWeek;
        lastPayoutDate?: string;
    };
    todos?: Todo[];
    shoutOuts?: ShoutOut[];
    digitalVaultPassword?: string;
    location?: string;
    familyBranding?: FamilyBranding;
    habits?: Habit[];
    habitLogs?: HabitLog[];
}

// --- Chore Types ---
export type ChoreStatus = 'pending' | 'in progress' | 'pending_approval' | 'completed' | 'rejected';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';
export interface Chore {
    id: string;
    family_id?: string;
    name: string;
    assignedTo: string | null;
    status: ChoreStatus;
    dueDate: string; // YYYY-MM-DD
    points: number;
    requiresPhoto: boolean;
    photoProofUrl?: string | null;
    isRecurring: boolean;
    recurrenceType: RecurrenceType;
    recurrenceDays: number[] | null;
    templateChoreId: string | null;
    isBonus: boolean;
    rejectionReason?: string;
    completed_at?: string; // ISO string
}

// --- Event & Trip Types ---
export interface FamilyEvent {
    id: string;
    family_id?: string;
    title: string;
    date: string; // YYYY-MM-DD
    endDate?: string;
    time?: string; // HH:MM
    description?: string;
    createdBy: string;
    google_event_id?: string;
    tripId?: string;
    category?: 'general' | 'club';
    clubId?: string;
}

export type TripMode = 'Driving' | 'Flying' | 'Train' | 'Bus' | 'Other';
export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}
export interface PackingListItem {
    id: string;
    text: string;
    packed: boolean;
}
export interface TripJournalEntry {
    id: string;
    type: 'note' | 'photo';
    timestamp: number;
    content: string;
    authorId: string;
    imageUrl?: string;
}
export interface Trip {
    id: string;
    family_id?: string;
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    modeOfTransport: TripMode;
    chores: ChecklistItem[];
    shoppingItems: ChecklistItem[];
    packingList: PackingListItem[];
    journal: TripJournalEntry[];
}

// --- Meal Planning Types ---
export interface Meal {
    id: string;
    name: string;
    recipeUrl?: string;
}
export interface PlannedMeal {
    id: string;
    dayOfWeek: DayOfWeek;
    mealType: 'Breakfast' | 'Lunch' | 'Dinner';
    meal: Meal;
}
export interface PantryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    location: 'fridge' | 'pantry';
    category: string;
    expirationDate?: string; // YYYY-MM-DD
    addedBy: string;
}


// --- Activity Club Types ---
export interface ClubRosterMember {
    profileId: string;
    role: 'Member' | 'Admin';
}
export interface EquipmentRequest {
    id:string;
    requestedBy: string;
    itemName: string;
    status: 'pending' | 'approved' | 'denied';
}
export interface ActivityClub {
    id: string;
    name: string;
    description: string;
    roster: ClubRosterMember[];
    calendar: FamilyEvent[];
    messages: FamilyMessage[];
    equipmentRequests: EquipmentRequest[];
}

// --- Financial Types ---
export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export interface Transaction {
    id: string;
    family_id?: string;
    profileId: string;
    amount: number;
    description: string;
    timestamp: number;
    status: 'completed' | 'pending' | 'denied';
}
export interface SavingsGoal {
    id: string;
    family_id?: string;
    profileId: string;
    name: string;
    icon: string;
    targetAmount: number;
    currentAmount: number;
    isCompleted: boolean;
}
export type BadgeType = 'FIRST_CHORE_COMPLETED' | 'SAVINGS_STARTER' | 'GOAL_GETTER';
export interface BudgetCategory {
    id: string;
    name: string;
    icon: string;
    allocated: number;
}
export interface Expense {
    id: string;
    categoryId: string;
    description: string;
    amount: number;
    timestamp: number;
}
export interface Loan {
    id: string;
    profileId: string;
    amount: number;
    reason: string;
    status: 'pending' | 'active' | 'paid' | 'denied';
    remainingAmount: number;
    createdAt: number;
}
export interface Investment {
    id: string;
    profileId: string;
    initialAmount: number;
    currentValue: number;
    createdAt: number;
}

// --- Smart Home & Automation ---
export interface AutomationRule {
    id: string;
    enabled: boolean;
    trigger: {
        type: 'all_chores_complete';
        forProfileId: string;
    };
    action: {
        type: 'activate_scene';
        sceneId: string;
    };
}
export interface SmartScene {
    id: string;
    name: string;
    icon: string;
    actions: any[];
}

// --- Collections ---
export interface Collection {
    id: string;
    name: string;
    icon: string;
}
export interface CollectionItem {
    id: string;
    collectionId: string;
    name: string;
    description?: string;
    imageUrl?: string;
}

// --- Contacts ---
export interface Contact {
    id: string;
    name: string;
    number: string;
    isAuthorized: boolean;
}

// --- Digital Vault ---
export type DigitalVaultItemType = 'generic_document' | 'secure_note' | 'id_card' | 'passport';
export interface DigitalVaultItem {
    id: string;
    profileId: string;
    title: string;
    type: DigitalVaultItemType;
    notes?: string;
    documentUrl?: string;
    documentName?: string;
}

// --- Games & Entertainment ---
export type MadLibTheme = "Fantasy Adventure" | "Silly School Day" | "Outer Space Mystery" | "Pirate Treasure Hunt" | "Talking Animals Farm";
export interface MadLibPrompt {
    id: string;
    label: string;
}
export interface AIStoryTemplate {
    story: string;
    prompts: MadLibPrompt[];
}
export interface ToastMessage {
    id: number;
    message: string;
    type: 'info' | 'badge' | 'points';
    icon?: string;
}
export interface FantasyTeam {
    id: string;
    profileId: string;
    teamName: string;
    wins: number;
    losses: number;
}
export interface FantasyLeague {
    id: string;
    name: string;
    teams: FantasyTeam[];
}

// --- Health & Caregiving ---
export interface HealthLog {
    id: string;
    profileId: string;
    timestamp: number;
    symptoms: string;
    temperature?: number;
    notes?: string;
}

// --- Family Matters ---
export type ConsequenceType = 'time_out' | 'restriction' | 'hearing_request';
export interface Infraction {
    id: string;
    family_id: string;
    child_id: string;
    created_by: string;
    reason: string;
    consequence_type: ConsequenceType;
    consequence_value: string;
    status: 'active' | 'completed';
    created_at: string;
    completed_at: string | null;
    evidence_urls: string[] | null;
}

// --- Misc ---
export interface ManualMemory {
    id: string;
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    imageUrl?: string;
}
export interface ShoppingListItem {
    id: string;
    family_id?: string;
    name: string;
    addedBy: string;
    isChecked: boolean;
    quantity: number;
}
export interface Vehicle {
    id: string;
    nickname: string;
    make: string;
    model: string;
    year: number;
    aiSchedule?: { serviceType: string; intervalMiles: number }[];
}
export interface VehicleMaintenanceLog {
    id: string;
    vehicleId: string;
    serviceType: string;
    date: string;
    notes?: string;
}
export interface MovieSuggestion {
    id: string;
    title: string;
    addedBy: string;
    watched: boolean;
}

// --- Newly defined interfaces (previously empty) ---
export interface MedicalRecord {
    id: string;
    profileId: string;
    recordType: string;
    date: string;
    notes: string;
    documentUrl?: string;
}
export interface PhoneLog {
    id: string;
    profileId: string;
    type: 'incoming' | 'outgoing' | 'missed';
    number: string;
    durationSeconds: number;
    timestamp: number;
}
export interface Pet {
    id: string;
    name: string;
    species: string;
    breed?: string;
    birthday?: string;
    avatarUrl?: string;
}
export interface PetLog {
    id: string;
    petId: string;
    type: 'feeding' | 'medication' | 'vet_visit' | 'note';
    notes: string;
    timestamp: number;
}
export interface Recipe {
    id: string;
    name: string;
    ingredients: { name: string; amount: string; }[];
    instructions: string[];
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
}
// export interface PantryItem {
//     id: string;
//     name: string;
//     quantity: number;
//     unit?: 'pcs' | 'kg' | 'g' | 'L' | 'ml' | 'can' | 'box';
//     purchaseDate?: string;
// }
export interface Poll {
    id: string;
    question: string;
    options: { id: string; text: string; }[];
    votes: { optionId: string; profileId: string; }[];
    createdBy: string;
    createdAt: number;
}
export interface MysteryBoxTier {
    id: string;
    name: string;
    cost: number;
    possibleRewards: string[];
}
export interface SmartDevice {
    id: string;
    name: string;
    type: 'light' | 'thermostat' | 'lock' | 'speaker';
    status: string;
    roomId?: string;
}
export interface HomeworkAssignment {
    id: string;
    profileId: string;
    subject: string;
    task: string;
    dueDate: string;
    completed: boolean;
}
export interface ScreenTimeLog {
    id: string;
    profileId: string;
    amountMinutes: number;
    type: 'earned' | 'spent' | 'adjusted';
    reason: string;
    timestamp: number;
}
export interface MarketAsset {
    id: string;
    ticker: string;
    name: string;
    currentPrice: number;
}
export interface CustomBadge {
    id: string;
    name: string;
    icon: string;
    description: string;
    createdBy: string;
}
export interface Caregiver {
    id: string;
    name: string;
    contactInfo: string;
    notes?: string;
}
export interface CareRecipient {
    id: string;
    profileId: string;
    carePlan: string;
}
export interface CareLog {
    id: string;
    careRecipientId: string;
    caregiverId: string;
    notes: string;
    timestamp: number;
}
export interface MessageHandlers {
    [key: string]: (...args: any[]) => void;
}
export interface PortfolioHolding {
    id: string;
    profileId: string;
    assetId: string;
    shares: number;
}
export interface MarketTransaction {
    id: string;
    profileId: string;
    assetId: string;
    shares: number;
    pricePerShare: number;
    type: 'buy' | 'sell';
    timestamp: number;
}
export interface MealSuggestion {
    id: string;
    name: string;
    description: string;
    recipeUrl?: string;
}


// --- App State Management ---
export interface AppState {
    loadingApp: boolean;
    session: any; // Replace 'any' with a proper session type
    currentPage: PageView;
    pageHistory: PageView[];
    personalizationData: PersonalizationData | null;
    profiles: Profile[];
    viewingAsProfileId: string | null;
    chores: Chore[];
    appNotifications: AppNotification[];
    familyMessages: FamilyMessage[];
    shoppingListItems: ShoppingListItem[];
    familyEvents: FamilyEvent[];
    bookLogEntries: BookLogEntry[];
    safeWebsiteUrls: SafeWebsite[];
    trips: Trip[];
    transactions: Transaction[];
    familyPhotos: Photo[];
    photoAlbums: PhotoAlbum[];
    savingsGoals: SavingsGoal[];
    infractions: Infraction[];
    activeMessageTargetId: string | null;
    activeTripId: string | null;
    activeClubId: string | null;
    activeCollectionId: string | null;
    prefilledPhoneNumber: string | null;
    lockDetails: { isLocked: boolean; message: string; };
    toasts: ToastMessage[];
    activityClubs: ActivityClub[];
    smartScenes: SmartScene[];
    automationRules: AutomationRule[];
    budgetCategories: BudgetCategory[];
    expenses: Expense[];
    isGoogleLinked: boolean;
    weeklyMealPlan: PlannedMeal[];
    collections: Collection[];
    collectionItems: CollectionItem[];
    contacts: Contact[];
    digitalVaultItems: DigitalVaultItem[];
    loans: Loan[];
    investments: Investment[];
    manualMemories: ManualMemory[];
    fantasyLeagues: FantasyLeague[];
    healthLogs: HealthLog[];
    movieSuggestions: MovieSuggestion[];
    medals: Medal[];
    awardedMedals: AwardedMedal[];
    skills: Skill[];
    assignedSkills: AssignedSkill[];
    vehicles: Vehicle[];
    vehicleMaintenanceLogs: VehicleMaintenanceLog[];
    pantryItems: PantryItem[];
}

export type AppAction =
    | { type: 'SET_STATE'; payload: Partial<AppState> }
    | { type: 'NAVIGATE'; payload: PageView }
    | { type: 'GO_BACK' }
    | { type: 'ADD_ITEM'; payload: { key: keyof AppState; item: any } }
    | { type: 'UPDATE_ITEM'; payload: { key: keyof AppState; id: string; updates: any } }
    | { type: 'DELETE_ITEM'; payload: { key: keyof AppState; id: string } }
    | { type: 'UPDATE_MESSAGES_AS_READ'; payload: { messageIds: string[]; profileId: string } }
    | { type: 'ADD_TOAST'; payload: ToastMessage }
    | { type: 'REMOVE_TOAST'; payload: number };

export interface ChoreHandlers {
    add: (chore: Omit<Chore, 'id' | 'family_id'>) => Promise<Chore | null>;
    update: (id: string, updates: Partial<Chore>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    generateWeeklyChores: () => Promise<void>;
    complete: (choreId: string) => Promise<void>;
}
export interface AppContextType extends AppState {
    addToast: (message: string, type: ToastMessage['type'], icon?: string) => void;
    removeToast: (id: number) => void;
    onNavigate: (page: PageView) => void;
    onSavePersonalization: (updates: Partial<PersonalizationData>) => void;
    getProfileName: (id: string | null) => string;
    createChoreTemplates: (choreNames: string) => void;
    setCurrentViewingProfile: (profile: Profile) => void;
    currentViewingProfile?: Profile;
    updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<void>;
    addAppNotification: (message: string, type: AppNotification['type'], relatedProfileId?: string) => Promise<void>;
    awardBadgeIfEligible: (profileId: string, badgeType: BadgeType) => Promise<void>;
    addTransaction: (tx: Omit<Transaction, 'id' | 'family_id'>) => Promise<void>;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
    addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'family_id'>) => Promise<void>;
    updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
    handleLogin: (email: string, password: string) => Promise<void>;
    handleSignup: (email: string, password: string) => Promise<boolean>;
    handleSaveInitialSetup: (data: PersonalizationData) => Promise<void>;
    updateActivityClub: (id: string, updates: Partial<ActivityClub>) => Promise<void>;
    addEvent: (event: Omit<FamilyEvent, 'id' | 'google_event_id' | 'family_id'>) => Promise<FamilyEvent>;
    addMessage: (message: Omit<FamilyMessage, 'id'|'family_id'>) => Promise<FamilyMessage>;
    addAutomationRule: (rule: Omit<AutomationRule, 'id'>) => Promise<void>;
    updateAutomationRule: (id: string, updates: Partial<AutomationRule>) => Promise<void>;
    deleteAutomationRule: (id: string) => Promise<void>;
    addBudgetCategory: (category: Omit<BudgetCategory, 'id'>) => Promise<void>;
    updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => Promise<void>;
    deleteBudgetCategory: (id: string) => Promise<void>;
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
    updateEvent: (event: Partial<FamilyEvent> & { id: string }) => Promise<void>;
    deleteEvent: (event: FamilyEvent) => Promise<void>;
    getGoogleAuthUrl: () => Promise<string | null>;
    sendEmail: (params: { recipient: string; subject: string; body: string }) => Promise<void>;
    exchangeGoogleCode: (code: string) => Promise<void>;
    addCollection: (collection: Omit<Collection, 'id'>) => Promise<void>;
    updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
    addCollectionItem: (item: Omit<CollectionItem, 'id'>) => Promise<void>;
    updateCollectionItem: (id: string, updates: Partial<CollectionItem>) => Promise<void>;
    setActiveCollectionId: (id: string | null) => void;
    addContact: (contact: Omit<Contact, 'id'>) => Promise<void>;
    updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
    navigateToPhoneWithNumber: (number: string) => void;
    addDigitalVaultItem: (item: Omit<DigitalVaultItem, 'id'>) => Promise<void>;
    updateDigitalVaultItem: (id: string, updates: Partial<DigitalVaultItem>) => Promise<void>;
    deleteDigitalVaultItem: (id: string) => Promise<void>;
    addAlbum: (album: Omit<PhotoAlbum, 'id' | 'family_id'>) => Promise<PhotoAlbum>;
    addPhoto: (photo: Omit<Photo, 'id' | 'family_id'>) => Promise<void>;
    addLoan: (loan: Omit<Loan, 'id'>) => Promise<void>;
    updateLoan: (id: string, updates: Partial<Loan>) => Promise<void>;
    addInvestment: (investment: Omit<Investment, 'id'>) => Promise<void>;
    generateFamilyCrest: (prompt: string) => Promise<string | null>;
    addManualMemory: (memory: Omit<ManualMemory, 'id'>) => void;
    getSymptomAnalysis: (symptoms: string) => Promise<string>;
    addHealthLog: (log: Omit<HealthLog, 'id'>) => Promise<void>;
    addMovieSuggestion: (suggestion: Omit<MovieSuggestion, 'id'>) => Promise<void>;
    updateMovieSuggestion: (id: string, updates: Partial<MovieSuggestion>) => Promise<void>;
    deleteMovieSuggestion: (id: string) => Promise<void>;
    addMedal: (medal: Omit<Medal, 'id'>) => void;
    updateMedal: (id: string, updates: Partial<Medal>) => void;
    deleteMedal: (id: string) => void;
    addAwardedMedal: (award: Omit<AwardedMedal, 'id'>) => void;
    generateWeeklyReport: (highlights: string) => Promise<string>;
    onClearInitialRecipient: () => void;
    choreHandlers: ChoreHandlers;
    addInfraction: (infraction: Omit<Infraction, 'id' | 'family_id'>) => Promise<void>;
    addTrip: (trip: Omit<Trip, 'id' | 'family_id'>) => Promise<Trip>;
    updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
    deleteTrip: (id: string) => Promise<void>;
    addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
    updateSkill: (id: string, updates: Partial<Skill>) => Promise<void>;
    deleteSkill: (id: string) => Promise<void>;
    assignSkill: (skillId: string, profileId: string) => Promise<void>;
    updateAssignedSkill: (id: string, updates: Partial<AssignedSkill>) => Promise<void>;
    addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
    addMaintenanceLog: (log: Omit<VehicleMaintenanceLog, 'id'>) => Promise<void>;
    updateMaintenanceLog: (id: string, updates: Partial<VehicleMaintenanceLog>) => Promise<void>;
    addBookLogEntry: (entry: Omit<BookLogEntry, 'id' | 'family_id'>) => Promise<void>;
    updateBookLogEntry: (id: string, updates: Partial<BookLogEntry>) => Promise<void>;
    addPantryItem: (item: Omit<PantryItem, 'id'>) => Promise<PantryItem>;
    updatePantryItem: (id: string, updates: Partial<PantryItem>) => Promise<void>;
    deletePantryItem: (id: string) => Promise<void>;
}
/*
The original AppContextType was:
export interface AppContextType extends AppState {
    addToast: (message: string, type: ToastMessage['type'], icon?: string) => void;
    removeToast: (id: number) => void;
    onNavigate: (page: PageView) => void;
    onSavePersonalization: (updates: Partial<PersonalizationData>) => void;
    getProfileName: (id: string | null) => string;
    createChoreTemplates: (choreNames: string) => void;
    setCurrentViewingProfile: (profile: Profile) => void;
    currentViewingProfile?: Profile;
    updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<void>;
    addAppNotification: (message: string, type: AppNotification['type'], relatedProfileId?: string) => Promise<void>;
    awardBadgeIfEligible: (profileId: string, badgeType: BadgeType) => Promise<void>;
    addTransaction: (tx: Omit<Transaction, 'id' | 'family_id'>) => Promise<void>;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
    addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'family_id'>) => Promise<void>;
    updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
    handleLogin: (email: string, password: string) => Promise<void>;
    handleSignup: (email: string, password: string) => Promise<boolean>;
    handleSaveInitialSetup: (data: PersonalizationData) => Promise<void>;
    updateActivityClub: (id: string, updates: Partial<ActivityClub>) => Promise<void>;
    addEvent: (event: Omit<FamilyEvent, 'id' | 'google_event_id' | 'family_id'>) => Promise<FamilyEvent>;
    addMessage: (message: Omit<FamilyMessage, 'id'|'family_id'>) => Promise<FamilyMessage>;
    addAutomationRule: (rule: Omit<AutomationRule, 'id'>) => Promise<void>;
    updateAutomationRule: (id: string, updates: Partial<AutomationRule>) => Promise<void>;
    deleteAutomationRule: (id: string) => Promise<void>;
    addBudgetCategory: (category: Omit<BudgetCategory, 'id'>) => Promise<void>;
    updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => Promise<void>;
    deleteBudgetCategory: (id: string) => Promise<void>;
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
    updateEvent: (event: Partial<FamilyEvent> & { id: string }) => Promise<void>;
    deleteEvent: (event: FamilyEvent) => Promise<void>;
    getGoogleAuthUrl: () => Promise<string | null>;
    sendEmail: (params: { recipient: string; subject: string; body: string }) => Promise<void>;
    exchangeGoogleCode: (code: string) => Promise<void>;
    addCollection: (collection: Omit<Collection, 'id'>) => Promise<void>;
    updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
    addCollectionItem: (item: Omit<CollectionItem, 'id'>) => Promise<void>;
    updateCollectionItem: (id: string, updates: Partial<CollectionItem>) => Promise<void>;
    setActiveCollectionId: (id: string | null) => void;
    addContact: (contact: Omit<Contact, 'id'>) => Promise<void>;
    updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
    navigateToPhoneWithNumber: (number: string) => void;
    addDigitalVaultItem: (item: Omit<DigitalVaultItem, 'id'>) => Promise<void>;
    updateDigitalVaultItem: (id: string, updates: Partial<DigitalVaultItem>) => Promise<void>;
    deleteDigitalVaultItem: (id: string) => Promise<void>;
    addAlbum: (album: Omit<PhotoAlbum, 'id' | 'family_id'>) => Promise<PhotoAlbum>;
    addPhoto: (photo: Omit<Photo, 'id' | 'family_id'>) => Promise<void>;
    addLoan: (loan: Omit<Loan, 'id'>) => Promise<void>;
    updateLoan: (id: string, updates: Partial<Loan>) => Promise<void>;
    addInvestment: (investment: Omit<Investment, 'id'>) => Promise<void>;
    generateFamilyCrest: (prompt: string) => Promise<string | null>;
    addManualMemory: (memory: Omit<ManualMemory, 'id'>) => void;
    getSymptomAnalysis: (symptoms: string) => Promise<string>;
    addHealthLog: (log: Omit<HealthLog, 'id'>) => Promise<void>;
    addMovieSuggestion: (suggestion: Omit<MovieSuggestion, 'id'>) => Promise<void>;
    updateMovieSuggestion: (id: string, updates: Partial<MovieSuggestion>) => Promise<void>;
    deleteMovieSuggestion: (id: string) => Promise<void>;
    addMedal: (medal: Omit<Medal, 'id'>) => void;
    updateMedal: (id: string, updates: Partial<Medal>) => void;
    deleteMedal: (id: string) => void;
    addAwardedMedal: (award: Omit<AwardedMedal, 'id'>) => void;
    generateWeeklyReport: (highlights: string) => Promise<string>;
    onClearInitialRecipient: () => void;
    choreHandlers: ChoreHandlers;
    addInfraction: (infraction: Omit<Infraction, 'id' | 'family_id'>) => Promise<void>;
    addTrip: (trip: Omit<Trip, 'id' | 'family_id'>) => Promise<Trip>;
    updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
    deleteTrip: (id: string) => Promise<void>;
    addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
    updateSkill: (id: string, updates: Partial<Skill>) => Promise<void>;
    deleteSkill: (id: string) => Promise<void>;
    assignSkill: (skillId: string, profileId: string) => Promise<void>;
    updateAssignedSkill: (id: string, updates: Partial<AssignedSkill>) => Promise<void>;
    addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
    addMaintenanceLog: (log: Omit<VehicleMaintenanceLog, 'id'>) => Promise<void>;
    updateMaintenanceLog: (id: string, updates: Partial<VehicleMaintenanceLog>) => Promise<void>;
    addPantryItem: (item: Omit<PantryItem, 'id'>) => Promise<PantryItem>;
    updatePantryItem: (id: string, updates: Partial<PantryItem>) => Promise<void>;
    deletePantryItem: (id: string) => Promise<void>;
}
*/