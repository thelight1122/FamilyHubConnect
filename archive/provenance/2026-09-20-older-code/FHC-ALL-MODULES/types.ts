export interface Profile { 
    id: string; 
    name: string; 
    email?: string; 
    role: 'Admin' | 'Parent' | 'Child' | 'Other'; 
    age?: number; 
    birthday?: string; 
    gender?: string; 
    phone?: string; 
    workContact?: { workPhone: string; workEmail: string }; 
    school?: string; 
    grade?: string; 
    schoolEmail?: string; 
}
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

export interface Meal {
    id: string;
    name: string;
    notes?: string;
    recipeUrl?: string;
}

export interface DailyMeals {
    breakfast?: Meal | null;
    lunch?: Meal | null;
    dinner?: Meal | null;
}

export interface WeeklyMealPlan {
    [date: string]: DailyMeals; // date as key, e.g., '2024-07-29'
}

export type AllowanceTransactionCategory = 'allowance' | 'bonus' | 'chore' | 'reward' | 'deduction' | 'adjustment' | 'savings';
export interface AllowanceTransaction {
    id: string;
    profileId: string;
    date: number; // timestamp
    description: string;
    amount: number; // positive for income, negative for spending
    category: AllowanceTransactionCategory;
}

export interface AllowanceSetting {
    amount: number;
    interval: 'weekly';
    dayOfWeek: number; // 0 (Sun) to 6 (Sat)
}

export type ChoreStatus = 'to-do' | 'pending-approval' | 'done';
export type ChoreRecurrence = 'none' | 'daily' | 'weekly';

export interface Chore {
    id: string;
    title: string;
    description?: string;
    assignedTo: string; // profileId
    reward: number;
    dueDate: string; // ISO date string 'YYYY-MM-DD'
    status: ChoreStatus;
    recurrence: ChoreRecurrence;
    createdAt: number; // timestamp
    completedAt?: number; // timestamp
    approvedAt?: number; // timestamp
}

export interface ShoppingListItem {
    id: string;
    name: string;
    category: string;
    isComplete: boolean;
}

export interface Message {
    id: string;
    channelId: string;
    senderId: string; // profileId
    content: string;
    timestamp: number;
}

export interface MessageChannel {
    id: string;
    name: string;
    description?: string;
    memberIds: string[]; // array of profileIds
}

export interface Photo {
    id: string;
    albumId: string;
    url: string; // can be a data URL or a web URL
    caption: string;
    uploaderId: string; // profileId
    timestamp: number;
}

export interface PhotoAlbum {
    id: string;
    name: string;
    description: string;
    coverPhotoUrl?: string;
    createdBy: string; // profileId
    createdAt: number;
}

export interface MovieSuggestion {
    id: string;
    eventId: string;
    title: string;
    description: string;
    posterUrl: string;
    suggestedBy: string; // profileId or 'ai_assistant'
    votes: string[]; // array of profileIds
}

export interface MovieNightEvent {
    id: string;
    date: string; // ISO 'YYYY-MM-DD'
    status: 'voting' | 'closed';
    winnerMovieId?: string;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    summary: string;
    coverUrl: string;
    pageCount: number;
    currentPage: number;
    status: 'reading' | 'finished';
    addedBy: string; // profileId
}

// --- Trip Planner Types ---
export interface ActivityItem {
    id:string;
    title: string;
    description: string;
    timeSlot: 'Morning' | 'Afternoon' | 'Evening';
    status: 'idea' | 'confirmed';
}

export interface ItineraryDay {
    date: string; // 'YYYY-MM-DD'
    activities: ActivityItem[];
}

export interface PackingListItem {
    id: string;
    name: string;
    category: string;
    packedBy: string | null; // profileId
}

export interface BudgetItem {
    id: string;
    category: 'Flights' | 'Accommodation' | 'Food' | 'Activities' | 'Other';
    description: string;
    estimatedCost: number;
    actualCost: number | null;
}

export interface Trip {
    id: string;
    name: string;
    destination: string;
    startDate: string; // 'YYYY-MM-DD'
    endDate: string; // 'YYYY-MM-DD'
    travelerIds: string[];
    coverImageUrl: string;
    itinerary: ItineraryDay[];
    packingList: PackingListItem[];
    budget: BudgetItem[];
}

// --- Finance Hub Types ---
export interface BudgetCategory {
    id: string;
    name: string;
    limit: number;
}

export interface BudgetExpense {
    id: string;
    categoryId: string;
    description: string;
    amount: number;
    date: number; // timestamp
}

export interface SavingsGoal {
    id:string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    imageUrl: string;
    createdBy: string; // profileId
}

// --- Home Management Types ---
export interface MaintenanceTask {
    id: string;
    name: string;
    description?: string;
    category: 'General' | 'HVAC' | 'Plumbing' | 'Electrical' | 'Yard' | 'Appliance';
    recurrence: 'none' | 'monthly' | 'quarterly' | 'annually';
    lastCompleted?: string; // YYYY-MM-DD
    nextDue: string; // YYYY-MM-DD
    isComplete: boolean;
}

export interface HomeProjectTask {
    id: string;
    name: string;
    isComplete: boolean;
}

export interface HomeProject {
    id: string;
    name: string;
    description: string;
    status: 'Planning' | 'In Progress' | 'Completed';
    budget?: number;
    tasks: HomeProjectTask[];
}

export interface ServiceContact {
    id: string;
    name: string;
    category: 'Plumber' | 'Electrician' | 'HVAC' | 'Handyman' | 'Painter' | 'Landscaper' | 'Other';
    phone: string;
    email?: string;
    notes?: string;
}

export type SmartDeviceType = 'Light' | 'Thermostat' | 'Lock' | 'Camera';

export interface SmartDevice {
    id: string;
    name: string;
    room: string;
    type: SmartDeviceType;
    status: 'on' | 'off' | 'locked' | 'unlocked' | number; // number for temperature
    connectionState: 'connected' | 'disconnected';
}

export interface SmartScene {
    id: string;
    name: string;
    icon: string;
    actions: { deviceId: string; targetStatus: SmartDevice['status'] }[];
}

// --- Skills Tracker Types ---
export interface SkillMilestone {
    id: string;
    description: string;
    isComplete: boolean;
}

export interface Skill {
    id: string;
    name: string;
    level: number;
    xp: number;
    milestones: SkillMilestone[];
    addedBy: string; // profileId
}

// --- Routine Builder Types ---
export interface Routine {
    id: string;
    name: string;
    description?: string;
    frequency: 'daily' | 'weekly';
    addedBy: string; // profileId
}

export interface RoutineLog {
    routineId: string;
    date: string; // YYYY-MM-DD
}

// --- Shout-Outs Types ---
export interface ShoutOutReaction {
    [profileId: string]: string; // e.g. { 'profile_1': '❤️' }
}

export interface ShoutOut {
    id: string;
    fromProfileId: string;
    toProfileId: string;
    message: string;
    timestamp: number;
    reactions: ShoutOutReaction;
}

// --- Locker Room Types ---
export interface ActivityScheduleItem {
    dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string; // "HH:MM"
    endTime: string;   // "HH:MM"
}

export interface ActivityGearItem {
    id: string;
    name:string;
    packed: boolean;
}

export type ActivityType = 'Sport' | 'Music' | 'Art' | 'Academic' | 'Other';

export interface ExtracurricularActivity {
    id: string;
    profileId: string; // To whom this activity belongs
    name: string;
    type: ActivityType;
    location: string;
    notes?: string;
    schedule: ActivityScheduleItem[];
    gear: ActivityGearItem[];
}


export interface PersonalizationData { 
    familyName?: string; 
    motto?: string; 
    coatOfArmsUrl?: string; 
    aiSettings?: AISettings; 
    address?: object; 
    emergencyContact?: object; 
    familyPhysician?: object; 
    insuranceInfo?: any[]; 
    familyFoundations?: { content: string; acknowledgements: { [key: string]: number } }; 
    familyMeetings?: FamilyMeeting[], 
    familyCourtCases?: FamilyCourtCase[],
    mealPlans?: WeeklyMealPlan,
    allowanceSettings?: { [profileId: string]: AllowanceSetting };
    allowanceTransactions?: AllowanceTransaction[];
    chores?: Chore[];
    shoppingListItems?: ShoppingListItem[];
    messageChannels?: MessageChannel[];
    messages?: Message[];
    photoAlbums?: PhotoAlbum[];
    photos?: Photo[];
    movieNightEvents?: MovieNightEvent[];
    movieSuggestions?: MovieSuggestion[];
    readingCornerBooks?: Book[];
    trips?: Trip[];
    budgets?: BudgetCategory[];
    expenses?: BudgetExpense[];
    savingsGoals?: SavingsGoal[];
    maintenanceTasks?: MaintenanceTask[];
    homeProjects?: HomeProject[];
    serviceContacts?: ServiceContact[];
    smartDevices?: SmartDevice[];
    smartScenes?: SmartScene[];
    skills?: Skill[];
    routines?: Routine[];
    routineLogs?: RoutineLog[];
    shoutOuts?: ShoutOut[];
    extracurricularActivities?: ExtracurricularActivity[];
}