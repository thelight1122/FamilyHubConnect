

import type { 
    Profile, CustomBadge, DigitalVaultItem
} from './profiles';
import type { 
    AvailableReward, RewardWishlistItem, Transaction, SavingsGoal, Loan, Investment, BudgetCategory, Expense, ScreenTimeLog, MarketAsset, PortfolioHolding, MarketTransaction
} from './finance';
import type { 
    AuthorizedApp, SafeWebsite, Contact, PhoneLog, TimeLockSetting
} from './communication';
import type { 
    MealSuggestion, Recipe, PlannedMeal, PantryItem, DayOfWeek
} from './planning';
import type { 
    Vehicle, VehicleMaintenanceLog, SmartDevice, SmartScene, AutomationRule
} from './home';
import type { 
    Skill, AssignedSkill, ActivityClub, FantasyLeague, MovieSuggestion
} from './activities';
import type { 
    Pet, PetLog, Poll, FamilyBranding, Infraction, FamilyCourtCase, ManualMemory, FamilyMeeting
} from './family';
import type { 
    MysteryBoxTier, Medal, AwardedMedal
} from './creative';
import type { 
    HomeworkAssignment, ShoutOut
} from './academics';
import type { 
    Collection, CollectionItem
} from './collections';
import type { 
    Caregiver, CareRecipient, CareLog, HealthLog, MedicalRecord
} from './care';
import type { 
    Habit, HabitLog
} from './chores';
import type { Todo } from './tasks';


export interface AdultDetailForm {
    id?: string;
    tempId: string;
    name: string;
    avatarUrl: string;
    role: 'adult';
    email?: string;
    phone?: string;
    screenName?: string;
}

export interface ChildDetailForm {
    id?: string;
    tempId: string;
    name: string;
    avatarUrl: string;
    role: 'child';
    age?: number;
    screenName?: string;
}


// This is the main data structure stored in the 'families' table 'personalization_data' column.
export interface PersonalizationData {
    id: string;
    user_id?: string;
    numAdultsStr: string;
    numChildrenStr: string;
    adultDetailsArray: AdultDetailForm[];
    childDetailsArray: ChildDetailForm[];
    gamifyTasks: boolean;
    availableRewards: AvailableReward[];
    rewardWishlist?: RewardWishlistItem[];
    specificChores: string;
    preferredRewards?: string;
    childrenAges?: string;
    authorizedApps?: AuthorizedApp[];
    favoriteMeals?: MealSuggestion[];
    savedRecipes?: Recipe[];
    allowanceSettings?: {
        enabled: boolean;
        amount: number;
        payday: DayOfWeek;
        lastPayoutDate?: string;
    };
    fridgeNote?: string;
    loans?: Loan[];
    investments?: Investment[];
    investment_rate?: number;
    loan_interest_rate?: number;
    vehicles?: Vehicle[];
    vehicleMaintenanceLogs?: VehicleMaintenanceLog[];
    movieSuggestions?: MovieSuggestion[];
    skills?: Skill[];
    assignedSkills?: AssignedSkill[];
    activityClubs?: ActivityClub[];
    healthLogs?: HealthLog[];
    medicalRecords?: MedicalRecord[];
    medicalRecordsPassword?: string;
    digitalVaultPassword?: string;
    familyCourtCases?: FamilyCourtCase[];
    phoneLogs?: PhoneLog[];
    timeLockSettings?: TimeLockSetting[];
    contacts?: Contact[];
    weeklyMealPlan?: PlannedMeal[];
    pets?: Pet[];
    petLogs?: PetLog[];
    appLock?: {
        enabled: boolean;
        message: string;
    };
    familyFoundations?: {
        content: string;
        acknowledgements: {
            [profileId: string]: number;
        };
    };
    usageLogs?: {
        [date: string]: {
            [profileId: string]: {
                [moduleId: string]: number;
            };
        };
    };
    manualMemories?: ManualMemory[];
    pantryItems?: PantryItem[];
    polls?: Poll[];
    familyBranding?: FamilyBranding;
    mysteryBoxTiers?: MysteryBoxTier[];
    medals?: Medal[];
    customBadges?: CustomBadge[];
    awardedMedals?: AwardedMedal[];
    smartDevices?: SmartDevice[];
    smartScenes?: SmartScene[];
    automationRules?: AutomationRule[];
    homeworkAssignments?: HomeworkAssignment[];
    shoutOuts?: ShoutOut[];
    budgetCategories?: BudgetCategory[];
    expenses?: Expense[];
    screenTimeLogs?: ScreenTimeLog[];
    marketAssets?: MarketAsset[];
    portfolioHoldings?: PortfolioHolding[];
    marketTransactions?: MarketTransaction[];
    familyMeetings?: FamilyMeeting[];
    habits?: Habit[];
    habitLogs?: HabitLog[];
    fantasyLeagues?: FantasyLeague[];
    collections?: Collection[];
    collectionItems?: CollectionItem[];
    caregivers?: Caregiver[];
    careRecipients?: CareRecipient[];
    careLogs?: CareLog[];
    location?: string;
    digitalVaultItems?: DigitalVaultItem[];
    todos?: Todo[];
}
