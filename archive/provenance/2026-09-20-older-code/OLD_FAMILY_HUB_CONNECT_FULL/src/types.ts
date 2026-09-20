
import type { Session as SupabaseSession } from '@supabase/supabase-js';

// --- App State & Actions ---
export interface AppState {
    loadingApp: boolean;
    session: SupabaseSession | null;
    personalizationData: PersonalizationData | null;
    familyProfiles: Profile[];
    choreList: Chore[];
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
    currentPage: PageView;
    pageHistory: PageView[];
    viewingAsProfileId: string | null;
    activeToasts: ToastMessage[];
    isAudioUnlocked: boolean;
    showWeeklyReviewPrompt: boolean;
    lockDetails: { isLocked: boolean; message: string };
    prefilledPhoneNumber: string | null;
    activeMessageTargetId: string | null;
    activeTripId: string | null;
    activeClubId: string | null;
    activeCollectionId: string | null;
}

export type AppAction =
    | { type: 'SET_STATE'; payload: Partial<AppState> }
    | { type: 'ADD_TOAST'; payload: ToastMessage }
    | { type: 'REMOVE_TOAST'; payload: string }
    | { type: 'NAVIGATE'; payload: PageView }
    | { type: 'GO_BACK' }
    | { type: 'ADD_ITEM'; payload: { key: keyof PersonalizationData | keyof AppState, item: any } }
    | { type: 'UPDATE_ITEM'; payload: { key: keyof PersonalizationData | keyof AppState, id: string, updates: any } }
    | { type: 'DELETE_ITEM'; payload: { key: keyof PersonalizationData | keyof AppState, id: string } }
    | { type: 'UPDATE_MESSAGES_AS_READ'; payload: { messageIds: string[], profileId: string } };

// --- from types/core.ts ---
export type PageView =
    | 'landing' | 'auth' | 'dashboard' | 'chores' | 'rewards' | 'calendar' | 'profileSettings' | 'shoppingList'
    | 'readingCorner' | 'messages' | 'tripPlanner' | 'settings' | 'familySettings' | 'choreSettings' | 'rewardSettings'
    | 'familyGames' | 'storyTime' | 'webBrowser' | 'upcoming' | 'allowance' | 'allowanceSettings' | 'notificationCenter'
    | 'photoAlbum' | 'internet' | 'socialMedia' | 'tripJournal' | 'themeSettings' | 'initialSetup' | 'creatorsStudio'
    | 'aiAvatarCreator' | 'homeworkHelper' | 'email' | 'theFridge' | 'drawingBoard' | 'googleCallback' | 'timeOut' | 'gps'
    | 'weeklyReport' | 'newsletterCreator' | 'familyBank' | 'vehicleMaintenance' | 'gameScorer' | 'movieNightPicker'
    | 'skillsTracker' | 'lockerRoom' | 'activityClubDetail' | 'digitalDesk' | 'familyCourt' | 'health' | 'aiNurse'
    | 'medicalRecords' | 'phoneSettings' | 'phone' | 'securitySettings' | 'lockScreen' | 'contacts' | 'phoneLogs'
    | 'mealPlan' | 'familyFoundations' | 'petHub' | 'familyTimeline' | 'recipeBook' | 'pantry' | 'polls' | 'familyBranding'
    | 'mysteryBox' | 'accolades' | 'smartHome' | 'automationSettings' | 'homeworkPlanner' | 'shoutOuts' | 'finance'
    | 'budget' | 'screenTimeBank' | 'marketSim' | 'familyMeeting' | 'routineBuilder' | 'financialLiteracy' | 'navigationSettings'
    | 'fantasyFootball' | 'collectionsHub' | 'collectionView' | 'familyCare' | 'familyMatters' | 'homeManagement'
    | 'connections' | 'chatbot' | 'mealSuggestions' | 'widget_chores' | 'widget_upcoming' | 'digitalVault'
    | 'weatherWidget' | 'dashboardSettings' | 'caregivingCentral' | 'integrations';

export interface ModuleDefinition {
    page: PageView;
    title: string;
    icon: string;
    description: string;
    childOnly?: boolean;
    parentOnly?: boolean;
    widget?: 'chores' | 'upcoming' | 'weather';
}

export interface ToastMessage {
    id: string;
    message: string;
    type: 'info' | 'points' | 'badge';
    icon?: string;
}

// --- from types/profiles.ts ---
export type BadgeType =
    | 'FIRST_CHORE_COMPLETED' | 'FIVE_CHORES_COMPLETED' | 'POINT_COLLECTOR_50' | 'POINT_COLLECTOR_100'
    | 'POINT_COLLECTOR_250' | 'SUPER_READER' | 'TRIP_PLANNER_PRO' | 'MASTER_CHEF' | 'MEMORY_MAKER'
    | 'PERFECT_WEEK' | 'SAVINGS_STARTER' | 'GOAL_GETTER' | 'STREAK_STARTER_3' | 'WEEKLY_WARRIOR_7' | 'MONTHLY_MASTER_30';

export interface Badge { id: BadgeType; name: string; description: string; icon: string; }
export interface CustomBadge { id: string; name: string; description: string; icon: string; }
export type DigitalVaultItemType = 'id_card' | 'passport' | 'birth_certificate' | 'social_security_card' | 'generic_document' | 'secure_note';
export interface DigitalVaultItem { id: string; profileId: string; type: DigitalVaultItemType; title: string; documentUrl?: string; documentName?: string; notes?: string; }
export interface Profile { id: string; user_id?: string; family_id?: string; name: string; points: number; earnedBadges: BadgeType[]; role: 'adult' | 'child'; email?: string; phone?: string; screenName?: string; avatarUrl?: string; age?: number; balance?: number; theme?: { [key: string]: string; }; lastChoreCompletionDate?: string; choreStreakCount?: number; google_refresh_token?: string; screenTimeBalance?: number; favoriteColor?: string; favoriteFood?: string; favoriteAnimal?: string; hobbies?: string; aboutMe?: string; dashboardLayout?: { page: PageView, visible: boolean }[]; navBarLayout?: { page: PageView; label: string; icon: string }[]; completedLiteracyTopics?: string[]; firstName?: string; lastName?: string; status?: 'active' | 'disabled'; gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'; birthday?: string; income?: number; }

// --- from types/chores.ts ---
export type ChoreStatus = 'pending' | 'in progress' | 'pending_approval' | 'completed' | 'rejected';
export interface Chore { id: string; family_id: string; name: string; assignedTo: string | null; status: ChoreStatus; requiresPhoto: boolean; photoProofUrl: string | null; points: number; dueDate: string | null; isRecurring: boolean; recurrenceType: 'none' | 'daily' | 'weekly'; recurrenceDays: number[] | null; templateChoreId: string | null; minAge?: number; maxAge?: number; rejectionReason?: string; isBonus?: boolean; bonusAmount?: number; completed_at?: string; }
export interface Habit { id: string; profileId: string; name: string; icon: string; color: string; weeklyGoal: number; currentStreak?: number; longestStreak?: number; }
export interface HabitLog { id: string; habitId: string; date: string; }

// --- from types/communication.ts ---
export interface AppNotification { id: string; family_id: string; message: string; type: 'new_message' | 'chore_status' | 'badge_earned' | 'reward_redeemed' | 'event_reminder' | 'new_trip' | 'new_book_log' | 'allowance_paid' | 'new_photo' | 'allowance_request' | 'goal_achieved' | 'hearing_request' | 'hearing_scheduled' | 'shout_out' | 'automation_triggered'; timestamp: number; read: boolean; relatedProfileId?: string; }
export interface FamilyMessage { id: string; family_id: string; text?: string; authorId: string; authorName: string; timestamp: number; recipientId: string | null; isPriority?: boolean; readBy?: string[]; subject?: string; audioUrl?: string; audioType?: string; }
export interface AuthorizedApp { id: string; name: string; urlScheme: string; icon: string; }
export interface SafeWebsite { id: string; family_id: string; name: string; url: string; }
export type PhoneLogType = 'call' | 'sms';
export interface PhoneLog { id: string; type: PhoneLogType; profileId: string; contact: string; contactNumber: string; direction: 'incoming' | 'outgoing'; durationSeconds?: number; content?: string; timestamp: number; }
export interface Contact { id: string; profileId?: string; name: string; number: string; avatarUrl?: string; isAuthorized: boolean; }
export interface TimeLockSetting { moduleId: string; limitMinutes: number; }

// --- from types/planning.ts ---
export interface FamilyEvent { id: string; family_id: string; title: string; date: string; endDate?: string; time?: string; description?: string; createdBy: string; tripId?: string; google_event_id?: string; category?: 'general' | 'medical' | 'club' | 'homework'; clubId?: string; }
export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
export interface Recipe { id: string; name: string; description?: string; ingredients: string[]; instructions: string; imageUrl?: string; }
export interface MealSuggestion { id: string; name: string; description: string; ingredients?: string[]; recipe?: string; recipeId?: string; }
export interface PlannedMeal { id: string; family_id: string; dayOfWeek: DayOfWeek; mealType: MealType; meal: MealSuggestion; }
export interface ShoppingListItem { id: string; family_id: string; name: string; addedBy: string; isChecked: boolean; quantity: number; }
export interface PantryItem { id: string; name: string; category: string; quantity: number; }
export type TripMode = 'Driving' | 'Flying' | 'Train' | 'Bus';
export interface ChecklistItem { id: string; text: string; completed: boolean; }
export interface PackingItem { id: string; text: string; packed: boolean; }
export interface TripJournalEntry { id: string; type: 'note' | 'photo'; timestamp: number; content: string; photoUrl?: string; authorId: string; }
export interface Trip { id: string; family_id: string; name: string; destination: string; startDate: string; endDate: string; modeOfTransport: TripMode; chores: ChecklistItem[]; shoppingItems: ChecklistItem[]; packingList: PackingItem[]; aiSightseeingSuggestions?: string[]; journal: TripJournalEntry[]; }

// --- from types/finance.ts ---
export interface AvailableReward { id: string; name: string; cost: number; }
export interface RewardWishlistItem { id: string; profileId: string; name: string; url?: string; status: 'pending' | 'approved' | 'denied'; }
export interface Transaction { id: string; profileId: string; family_id: string; amount: number; description: string; timestamp: number; status: 'completed' | 'pending' | 'denied'; }
export interface SavingsGoal { id: string; profileId: string; family_id: string; name: string; icon: string; targetAmount: number; currentAmount: number; isCompleted: boolean; }
export interface Investment { id: string; profileId: string; initialAmount: number; currentValue: number; createdAt: number; }
export interface Loan { id: string; profileId: string; amount: number; reason: string; status: 'pending' | 'active' | 'paid'; remainingAmount: number; createdAt: number; paidAt?: number; }
export interface BudgetCategory { id: string; name: string; allocated: number; icon: string; }
export interface Expense { id: string; categoryId: string; description: string; amount: number; timestamp: number; }
export interface ScreenTimeLog { id: string; profileId: string; changeMinutes: number; status: 'completed' | 'pending_approval' | 'denied'; reason: string; timestamp: number; }
export interface MarketAsset { id: string; name: string; ticker: string; type: 'stock' | 'crypto'; price: number; trend: 'up' | 'down' | 'stable'; }
export interface PortfolioHolding { id: string; profileId: string; assetId: string; quantity: number; avgBuyPrice: number; }
export interface MarketTransaction { id: string; profileId: string; assetId: string; type: 'buy' | 'sell'; quantity: number; pricePerShare: number; timestamp: number; }

// --- from types/activities.ts ---
export type MasteryLevel = 'beginner' | 'intermediate' | 'expert';
export interface Skill { id: string; name: string; description: string; }
export interface AssignedSkill { id: string; skillId: string; profileId: string; mastery: MasteryLevel; }
export interface ClubRosterMember { profileId: string; role: 'Member' | 'Coach' | 'Manager'; }
export interface EquipmentRequest { id: string; requestedBy: string; itemName: string; price?: number; url?: string; status: 'pending' | 'approved' | 'denied'; }
export interface ActivityClub { id: string; name: string; description: string; roster: ClubRosterMember[]; equipmentRequests: EquipmentRequest[]; calendar: FamilyEvent[]; messages: FamilyMessage[]; }
export interface Player { id: string; name: string; position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF'; team: string; }
export interface FantasyTeam { id: string; profileId: string; teamName: string; roster: Player[]; wins: number; losses: number; }
export interface Matchup { week: number; team1Id: string; team2Id: string; team1Score: number; team2Score: number; }
export interface FantasyLeague { id: string; name: string; teams: FantasyTeam[]; matchups: Matchup[]; }
export interface MovieSuggestion { id: string; title: string; addedBy: string; watched: boolean; }

// --- from types/family.ts ---
export interface RestorativeTask { id: string; text: string; completed: boolean; }
export type ConsequenceType = 'time_out' | 'restriction' | 'hearing_request';
export interface Infraction { id: string; family_id: string; child_id: string; created_by: string; reason: string; evidence_urls: string[]; consequence_type: ConsequenceType; consequence_value: string; status: 'active' | 'completed' | 'pending'; created_at: string; completed_at: string | null; }
export interface FamilyCourtCase { id: string; infractionId: string; tasks: RestorativeTask[]; participants: string[]; status: 'pending_review' | 'in_progress' | 'closed'; verdict?: 'responsible' | 'not_responsible' | string; notes?: string; evidenceUrls?: string[]; }
export interface Pet { id: string; name: string; species: string; avatarUrl?: string; notes?: string; }
export type PetLogType = 'food' | 'walk' | 'medicine' | 'grooming' | 'other';
export interface PetLog { id: string; petId: string; type: PetLogType; notes?: string; timestamp: number; loggedBy: string; }
export interface ManualMemory { id: string; title: string; description: string; date: string; imageUrl?: string; }
export interface PollOption { id: string; text: string; voterIds: string[]; }
export interface Poll { id: string; question: string; options: PollOption[]; createdBy: string; createdAt: number; isClosed: boolean; allowMultipleVotes?: boolean; }
export interface FamilyBranding { motto?: string; crestUrl?: string | null; headerFont?: string; bodyFont?: string; borderRadius?: string; }
export interface ActionItem { id: string; text: string; assignedTo: string; isCompleted: boolean; }
export interface AgendaItem { id: string; text: string; addedBy: string; }
export interface FamilyMeeting { id: string; title: string; date: string; time: string; agenda: AgendaItem[]; minutes?: string; actionItems: ActionItem[]; eventId?: string; }

// --- from types/creative.ts ---
export interface PhotoAlbum { id: string; family_id: string; name: string; description?: string; createdBy: string; timestamp: number; }
export interface Photo { id: string; family_id: string; albumId: string; imageUrl: string; caption?: string; uploadedBy: string; timestamp: number; }
export type MadLibTheme = "Fantasy Adventure" | "Silly School Day" | "Outer Space Mystery" | "Pirate Treasure Hunt" | "Talking Animals Farm";
export interface MadLibPrompt { id: string; label: string; }
export interface AIStoryTemplate { story: string; prompts: MadLibPrompt[]; }
export type MysteryPrizeType = 'points' | 'privilege';
export interface MysteryBoxPrize { id: string; type: MysteryPrizeType; value: string; weight: number; }
export interface MysteryBoxTier { id: string; name: string; cost: number; color: string; prizes: MysteryBoxPrize[]; }
export interface Medal { id: string; name: string; description: string; icon: string; }
export interface AwardedMedal { id: string; medalId: string; profileId: string; awardedBy: string; reason?: string; timestamp: number; }

// --- from types/academics.ts ---
export interface BookLogEntry { id: string; family_id: string; profileId: string; title: string; author?: string; status: 'reading' | 'finished' | 'to_read'; startDate?: string; finishDate?: string; rating?: number; notes?: string; }
export interface AISuggestedBook { title: string; author: string; shortDescription: string; }
export interface AIDiscussionAndPrompts { discussionQuestions: string[]; creativePrompts: string[]; }
export interface HomeworkAssignment { id: string; profileId: string; subject: string; description: string; dueDate: string; status: 'Not Started' | 'In Progress' | 'Completed'; attachmentUrl?: string; eventId?: string; }
export interface ShoutOut { id: string; fromProfileId: string; toProfileId:string; message: string; timestamp: number; }

// --- from types/home.ts ---
export interface Vehicle { id: string; nickname: string; make: string; model: string; year: number; licensePlate?: string; vin?: string; insuranceInfo?: string; aiSchedule?: MaintenanceTaskTemplate[]; }
export interface MaintenanceTaskTemplate { serviceType: string; intervalMonths?: number; intervalMiles?: number; }
export interface VehicleMaintenanceLog { id: string; vehicleId: string; serviceType: string; date: string; notes?: string; cost?: number; mileage?: number; nextServiceDue?: string; }
export interface SmartDevice { id: string; name: string; type: 'light' | 'thermostat' | 'lock'; status: 'on' | 'off' | 'locked' | 'unlocked' | number; }
export interface SmartScene { id: string; name: string; icon: string; actions: { deviceId: string; newStatus: SmartDevice['status'] }[]; }
export interface AutomationRule { id: string; enabled: boolean; trigger: { type: 'all_chores_complete'; forProfileId: string | 'any_child' }; action: { type: 'activate_scene'; sceneId: string }; }

// --- from types/collections.ts ---
export interface Collection { id: string; name: string; icon: string; }
export interface CollectionItem { id: string; collectionId: string; name: string; description: string; purchaseDate?: string; notes?: string; imageUrl?: string; }

// --- from types/care.ts ---
export type CareLogType = 'medication' | 'food' | 'activity' | 'mood' | 'general';
export interface CareLog { id: string; recipientProfileId: string; loggedBy: string; timestamp: number; type: CareLogType; notes: string; medicationName?: string; }
export interface Medication { id: string; name: string; dosage: string; time: string; }
export interface Caregiver { id: string; name: string; phone: string; email?: string; notes?: string; userId?: string; authorizedFor: string[]; }
export interface CareRecipient { id: string; profileId: string; medications: Medication[]; allergies: string; dietaryConcerns: string; bedtimeRoutine: string; comfortInstructions: string; emergencyContacts: Contact[]; medicalInstructions: string; }
export interface HealthLog { id: string; profileId: string; timestamp: number; symptoms: string; notes?: string; temperature?: number; }
export interface MedicalRecord { id: string; profileId: string; title: string; documentUrl?: string; documentName?: string; notes?: string; }

// --- from types/handlers.ts ---
export interface ChoreHandlers { add: (item: Omit<Chore, 'id' | 'family_id'>) => Promise<Chore | null>; update: (itemId: string, updates: Partial<Chore>) => Promise<void>; delete: (itemId: string) => Promise<void>; generateWeeklyChores: () => Promise<void>; complete: (choreId: string) => Promise<void>; }
export interface MessageHandlers { add: (item: Omit<FamilyMessage, 'id' | 'family_id'>) => Promise<FamilyMessage | null>; markAsRead: (messageIds: string[]) => Promise<void>; }

// --- from types/personalization.ts ---
export interface AdultDetailForm { id?: string; tempId: string; name: string; avatarUrl: string; role: 'adult'; email?: string; phone?: string; screenName?: string; }
export interface ChildDetailForm { id?: string; tempId: string; name: string; avatarUrl: string; role: 'child'; age?: number; screenName?: string; }
export interface PersonalizationData { id: string; user_id?: string; numAdultsStr: string; numChildrenStr: string; adultDetailsArray: AdultDetailForm[]; childDetailsArray: ChildDetailForm[]; gamifyTasks: boolean; availableRewards: AvailableReward[]; rewardWishlist?: RewardWishlistItem[]; specificChores: string; preferredRewards?: string; childrenAges?: string; authorizedApps?: AuthorizedApp[]; favoriteMeals?: MealSuggestion[]; savedRecipes?: Recipe[]; allowanceSettings?: { enabled: boolean; amount: number; payday: DayOfWeek; lastPayoutDate?: string; }; fridgeNote?: string; loans?: Loan[]; investments?: Investment[]; investment_rate?: number; loan_interest_rate?: number; vehicles?: Vehicle[]; vehicleMaintenanceLogs?: VehicleMaintenanceLog[]; movieSuggestions?: MovieSuggestion[]; skills?: Skill[]; assignedSkills?: AssignedSkill[]; activityClubs?: ActivityClub[]; healthLogs?: HealthLog[]; medicalRecords?: MedicalRecord[]; medicalRecordsPassword?: string; digitalVaultPassword?: string; familyCourtCases?: FamilyCourtCase[]; phoneLogs?: PhoneLog[]; timeLockSettings?: TimeLockSetting[]; contacts?: Contact[]; weeklyMealPlan?: PlannedMeal[]; pets?: Pet[]; petLogs?: PetLog[]; appLock?: { enabled: boolean; message: string; }; familyFoundations?: { content: string; acknowledgements: { [profileId: string]: number; }; }; usageLogs?: { [date: string]: { [profileId: string]: { [moduleId: string]: number; }; }; }; manualMemories?: ManualMemory[]; pantryItems?: PantryItem[]; polls?: Poll[]; familyBranding?: FamilyBranding; mysteryBoxTiers?: MysteryBoxTier[]; medals?: Medal[]; customBadges?: CustomBadge[]; awardedMedals?: AwardedMedal[]; smartDevices?: SmartDevice[]; smartScenes?: SmartScene[]; automationRules?: AutomationRule[]; homeworkAssignments?: HomeworkAssignment[]; shoutOuts?: ShoutOut[]; budgetCategories?: BudgetCategory[]; expenses?: Expense[]; screenTimeLogs?: ScreenTimeLog[]; marketAssets?: MarketAsset[]; portfolioHoldings?: PortfolioHolding[]; marketTransactions?: MarketTransaction[]; familyMeetings?: FamilyMeeting[]; habits?: Habit[]; habitLogs?: HabitLog[]; fantasyLeagues?: FantasyLeague[]; collections?: Collection[]; collectionItems?: CollectionItem[]; caregivers?: Caregiver[]; careRecipients?: CareRecipient[]; careLogs?: CareLog[]; location?: string; digitalVaultItems?: DigitalVaultItem[]; }
