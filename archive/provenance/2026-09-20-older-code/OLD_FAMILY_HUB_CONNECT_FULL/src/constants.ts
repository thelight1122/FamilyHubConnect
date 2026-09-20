
import type { Badge, PageView, ModuleDefinition, PersonalizationData, Chore, FamilyMessage, ShoppingListItem, FamilyEvent, BookLogEntry, SafeWebsite, Trip, Transaction, Photo, PhotoAlbum, SavingsGoal, Infraction, Profile, AdultDetailForm, ChildDetailForm, Habit, HabitLog, ShoutOut } from './types';
import { uniqueId } from './utils/utils';

// --- badges.ts ---
export const BADGE_DEFINITIONS: Badge[] = [
    { id: 'FIRST_CHORE_COMPLETED', name: 'First Chore Complete!', description: 'Awarded for completing your very first chore.', icon: '🥇' },
    { id: 'FIVE_CHORES_COMPLETED', name: 'Five Chore Finisher', description: 'Awarded for completing five chores.', icon: '🌟' },
    { id: 'POINT_COLLECTOR_50', name: 'Point Collector (50)', description: 'Awarded for earning 50 points.', icon: '💰' },
    { id: 'POINT_COLLECTOR_100', name: 'Point Collector (100)', description: 'Awarded for earning 100 points.', icon: '🏅' },
    { id: 'POINT_COLLECTOR_250', name: 'Point Collector (250)', description: 'Awarded for earning 250 points.', icon: '🎖️' },
    { id: 'SUPER_READER', name: 'Super Reader', description: 'Awarded for finishing 5 books.', icon: '🧑‍🏫' },
    { id: 'TRIP_PLANNER_PRO', name: 'Trip Planner Pro', description: 'Awarded for planning a family trip.', icon: '🗺️' },
    { id: 'MASTER_CHEF', name: 'Master Chef', description: 'Awarded for creating a full weekly meal plan.', icon: '🧑‍🍳' },
    { id: 'MEMORY_MAKER', name: 'Memory Maker', description: 'Awarded for uploading your first photo to the family album.', icon: '📸' },
    { id: 'PERFECT_WEEK', name: 'Perfect Week!', description: 'Awarded for completing all your chores for 7 days in a row.', icon: '🗓️' },
    { id: 'SAVINGS_STARTER', name: 'Savings Starter', description: 'Awarded for creating your first savings goal.', icon: '🌱' },
    { id: 'GOAL_GETTER', name: 'Goal Getter!', description: 'Awarded for completing a savings goal.', icon: '🎯' },
    { id: 'STREAK_STARTER_3', name: 'Streak Starter', description: 'Awarded for completing chores 3 days in a row.', icon: '🥉' },
    { id: 'WEEKLY_WARRIOR_7', name: 'Weekly Warrior', description: 'Awarded for completing chores 7 days in a row.', icon: '🥈' },
    { id: 'MONTHLY_MASTER_30', name: 'Monthly Master', description: 'Awarded for completing chores 30 days in a row.', icon: '🥇' }
];

// --- finance.ts ---
export const FINANCIAL_LITERACY_TOPICS = [
  { id: 'earning', title: 'Earning & Saving Money', icon: '💰', description: "Learn where money comes from and why it's important to save some.", lessons: [ { id: 'earn_1', title: 'What is Money?' }, { id: 'earn_2', title: 'Ways to Earn Money' }, { id: 'earn_3', title: 'What is a Job?'}, { id: 'save_1', title: 'Why Should I Save?' }, { id: 'save_2', title: 'Setting a Savings Goal' } ] },
  { id: 'budgeting', title: 'Spending & Budgeting', icon: '🛍️', description: 'Understand the difference between what you need and what you want.', lessons: [ { id: 'spend_1', title: 'Needs vs. Wants' }, { id: 'spend_2', title: 'Making Smart Spending Choices'}, { id: 'budget_1', title: 'Making a Simple Budget' }, { id: 'budget_2', title: 'Tracking Your Spending' } ] },
  { id: 'investing', title: 'Growing Your Money', icon: '📈', description: 'Discover how money can make more money over time.', lessons: [ { id: 'invest_1', title: 'What is Investing?' }, { id: 'invest_2', title: 'Compound Interest is Magic' }, { id: 'invest_3', title: 'What are Stocks?' }, { id: 'invest_4', title: 'Risk and Reward' } ] },
  { id: 'debt', title: 'Borrowing & Credit', icon: '💳', description: 'Learn about borrowing money and using it responsibly.', lessons: [ { id: 'debt_1', title: 'What is a Loan?' }, { id: 'credit_1', title: 'Good vs. Bad Debt' }, { id: 'credit_2', title: 'What is a Credit Card?' } ] },
];

// --- misc.ts ---
export const SOUND_EFFECT_NOTIFICATION = new Audio('data:audio/wav;base64,UklGRjoAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQYAAAAIAAD//wA=');
export const ENABLE_AI_FEATURES = true;
export const PARENT_THEMES: { [key: string]: { [key: string]: string } } = {
    'Default': { '--primary-color': '#4a90e2', '--secondary-color': '#6c757d', '--accent-color': '#e74c3c', '--background-color': '#f0f4f8', '--text-color': '#333333', '--header-bg': '#34495e', '--header-text': '#ffffff', '--button-bg': '#4a90e2', '--button-text': '#ffffff', '--section-bg': '#ffffff', '--tile-bg': '#ffffff', '--top-bar-bg': '#34495e', '--top-bar-text': '#ffffff', '--modal-overlay-bg': 'rgba(0, 0, 0, 0.6)', '--accent-color-light': '#e9f5ff' },
    'Modern Dark': { '--primary-color': '#00aaff', '--secondary-color': '#555', '--accent-color': '#00d1ff', '--background-color': '#121212', '--text-color': '#e0e0e0', '--header-bg': '#1e1e1e', '--header-text': '#ffffff', '--button-bg': '#00aaff', '--button-text': '#ffffff', '--section-bg': '#1e1e1e', '--tile-bg': '#2a2a2a', '--top-bar-bg': '#1e1e1e', '--top-bar-text': '#ffffff', '--modal-overlay-bg': 'rgba(255, 255, 255, 0.1)' },
    'Classic Blue': { '--primary-color': '#0d47a1', '--secondary-color': '#757575', '--accent-color': '#2962ff', '--background-color': '#e3f2fd', '--text-color': '#212121', '--header-bg': '#1565c0', '--header-text': '#ffffff', '--button-bg': '#1976d2', '--button-text': '#ffffff', '--section-bg': '#ffffff', '--tile-bg': '#bbdefb', '--top-bar-bg': '#0d47a1', '--top-bar-text': '#ffffff', '--modal-overlay-bg': 'rgba(0, 0, 0, 0.5)' },
     'Minimalist Light': { '--primary-color': '#333333', '--secondary-color': '#888888', '--accent-color': '#5c5c5c', '--background-color': '#ffffff', '--text-color': '#333333', '--header-bg': '#f5f5f5', '--header-text': '#333333', '--button-bg': '#333333', '--button-text': '#ffffff', '--section-bg': '#f9f9f9', '--tile-bg': '#f0f0f0', '--top-bar-bg': '#ffffff', '--top-bar-text': '#333333', '--modal-overlay-bg': 'rgba(0, 0, 0, 0.4)' },
};
export const AVATAR_OPTIONS = [
    { value: '👤', label: '👤 Person' }, { value: '👩‍🦰', label: '👩‍🦰 Woman' }, { value: '👨‍🦱', label: '👨‍🦱 Man' }, { value: '👴', label: '👴 Grandparent' }, { value: '🧒', label: '🧒 Child' },
    { value: '👧', label: '👧 Girl' }, { value: '🧑‍🚀', label: '🧑‍🚀 Astronaut' }, { value: '🦸', label: '🦸 Superhero' }, { value: '🎨', label: '🎨 Artist' }, { value: '😊', label: '😊 Smiley Face' }, { value: '⭐', label: '⭐ Star' },
];

// --- navigation.ts ---
export const ALL_MODULES: ModuleDefinition[] = [
    { page: 'widget_upcoming', title: "Upcoming Banner", icon: "🗓️", description: "A banner showing events for the next week.", widget: 'upcoming' },
    { page: 'widget_chores', title: "Today's Chores", icon: "✅", description: "A quick look at chores due today.", widget: 'chores' },
    { page: 'weatherWidget', title: "Weather", icon: "🌦️", description: "Shows the current weather for your location.", widget: 'weather' },
    { page: 'familyMatters', title: "Family Matters", icon: "👨‍👩‍👧‍👦", description: "Manage care, review family rules, and hold meetings." },
    { page: 'connections', title: "Connections", icon: "💬", description: "Send messages, check the calendar, and create polls." },
    { page: 'digitalDesk', title: "Digital Desk", icon: "📝", description: "A personal space for productivity and creativity.", childOnly: true },
    { page: 'theFridge', title: "The Fridge", icon: "🧊", description: "Plan meals, manage your pantry, and browse recipes." },
    { page: 'homeManagement', title: "Home Management", icon: "🏠", description: "Oversee vehicles, smart home devices, and weekly reports.", parentOnly: true },
    { page: 'lockerRoom', title: "The Locker Room", icon: "🏀", description: "Join clubs, track skills, and play family games." },
    { page: 'finance', title: "Finance Hub", icon: "💸", description: "Oversee the family budget, bank, and allowances." },
    { page: 'petHub', title: "Pet Hub", icon: "🐾", description: "Log feeding, walks, and care for your furry friends." },
    { page: 'gps', title: "Location", icon: "🗺️", description: "View a map of family members' locations.", parentOnly: true },
    { page: 'tripPlanner', title: "Trips", icon: "✈️", description: "Plan and organize your next family vacation." },
];
export const ALL_NAV_ITEMS: { page: PageView; label: string; icon: string }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: '🏠' }, { page: 'chores', label: 'Chores', icon: '📋' }, { page: 'rewards', label: 'Rewards', icon: '🏆' },
    { page: 'allowance', label: 'Wallet', icon: '💰' }, { page: 'calendar', label: 'Calendar', icon: '📅' }, { page: 'messages', label: 'Messages', icon: '💬' },
    { page: 'phone', label: 'Phone', icon: '📱' }, { page: 'shoppingList', label: 'Shopping', icon: '🛒' }, { page: 'lockerRoom', label: 'Activities', icon: '🏀' },
    { page: 'creatorsStudio', label: 'Studio', icon: '✨' }, { page: 'finance', label: 'Finance', icon: '💸' }, { page: 'health', label: 'Health', icon: '❤️‍🩹' },
    { page: 'petHub', label: 'Pets', icon: '🐾' }, { page: 'smartHome', label: 'Home', icon: '💡' },
];
export const DEFAULT_NAV_ITEMS = ALL_NAV_ITEMS.slice(0, 5);

// --- mocks.ts ---
export const MOCK_SESSION = {
    user: { id: 'user_mock_123', email: 'dad@family.com' },
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
    expires_in: 3600,
    token_type: 'bearer',
};
export const MOCK_PROFILES: Profile[] = [
    { id: 'adult_mock_1', family_id: 'fam_mock_123', name: 'Dad', role: 'adult', points: 15, balance: 1050.75, avatarUrl: '👨‍🦱', earnedBadges: [], email: 'dad@family.com', screenTimeBalance: 0 },
    { id: 'adult_mock_2', family_id: 'fam_mock_123', name: 'Mom', role: 'adult', points: 20, balance: 1200.00, avatarUrl: '👩‍🦰', earnedBadges: [], email: 'mom@family.com', screenTimeBalance: 0 },
    { id: 'child_mock_1', family_id: 'fam_mock_123', name: 'Alex', role: 'child', points: 125, balance: 25.50, avatarUrl: '🧒', earnedBadges: ['FIRST_CHORE_COMPLETED', 'POINT_COLLECTOR_50'], age: 12, screenTimeBalance: 120 },
    { id: 'child_mock_2', family_id: 'fam_mock_123', name: 'Mia', role: 'child', points: 80, balance: 15.00, avatarUrl: '👧', earnedBadges: ['FIRST_CHORE_COMPLETED'], age: 8, screenTimeBalance: 90 },
];
const MOCK_ADULT_DETAILS: AdultDetailForm[] = MOCK_PROFILES
    .filter(p => p.role === 'adult')
    .map(p => ({ tempId: p.id, name: p.name, avatarUrl: p.avatarUrl || '', role: 'adult', email: p.email }));
const MOCK_CHILD_DETAILS: ChildDetailForm[] = MOCK_PROFILES
    .filter(p => p.role === 'child')
    .map(p => ({ tempId: p.id, name: p.name, avatarUrl: p.avatarUrl || '', role: 'child', age: p.age }));
export const MOCK_CHORES: Chore[] = [
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Take out the trash', assignedTo: 'child_mock_1', status: 'pending', points: 10, dueDate: new Date().toISOString().split('T')[0], requiresPhoto: false, isRecurring: true, recurrenceType: 'weekly', recurrenceDays: [2, 5], photoProofUrl: null, templateChoreId: 'template_1' },
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Feed the dog', assignedTo: 'child_mock_2', status: 'completed', points: 5, dueDate: new Date().toISOString().split('T')[0], requiresPhoto: false, isRecurring: true, recurrenceType: 'daily', recurrenceDays: [0,1,2,3,4,5,6], photoProofUrl: null, templateChoreId: 'template_2', completed_at: new Date().toISOString() },
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Clean your room', assignedTo: 'child_mock_1', status: 'pending_approval', points: 20, dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], requiresPhoto: true, photoProofUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=Room+Photo', isRecurring: false, recurrenceType: 'none', recurrenceDays: null, templateChoreId: null },
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Wash the dishes', assignedTo: 'adult_mock_2', status: 'in progress', points: 0, dueDate: new Date().toISOString().split('T')[0], requiresPhoto: false, photoProofUrl: null, isRecurring: false, recurrenceType: 'none', recurrenceDays: null, templateChoreId: null },
    { id: 'template_1', family_id: 'fam_mock_123', name: 'Take out the trash', assignedTo: null, status: 'pending', points: 10, dueDate: null, requiresPhoto: false, isRecurring: true, recurrenceType: 'weekly', recurrenceDays: [2, 5], photoProofUrl: null, templateChoreId: null },
    { id: 'template_2', family_id: 'fam_mock_123', name: 'Feed the dog', assignedTo: null, status: 'pending', points: 5, dueDate: null, requiresPhoto: false, isRecurring: true, recurrenceType: 'daily', recurrenceDays: [0,1,2,3,4,5,6], photoProofUrl: null, templateChoreId: null },
];
export const MOCK_MESSAGES: FamilyMessage[] = [
    { id: uniqueId(), family_id: 'fam_mock_123', text: 'Hey everyone, remember pizza night is Friday!', authorId: 'adult_mock_1', authorName: 'Dad', timestamp: Date.now() - 200000, recipientId: null, readBy: ['adult_mock_1'] },
    { id: uniqueId(), family_id: 'fam_mock_123', text: 'Can I go to the park after school?', authorId: 'child_mock_1', authorName: 'Alex', timestamp: Date.now() - 100000, recipientId: 'adult_mock_2', readBy: ['child_mock_1'] },
];
export const MOCK_SHOPPING_LIST: ShoppingListItem[] = [
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Milk', addedBy: 'adult_mock_1', isChecked: false, quantity: 1 },
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Bread', addedBy: 'adult_mock_1', isChecked: false, quantity: 2 },
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Apples', addedBy: 'child_mock_2', isChecked: true, quantity: 1 },
];
export const MOCK_EVENTS: FamilyEvent[] = [
    { id: uniqueId(), family_id: 'fam_mock_123', title: 'Soccer Practice', date: new Date().toISOString().split('T')[0], time: '16:00', createdBy: 'adult_mock_2' },
];
export const MOCK_BOOK_LOG: BookLogEntry[] = [
    { id: uniqueId(), family_id: 'fam_mock_123', profileId: 'child_mock_2', title: 'The Cat in the Hat', author: 'Dr. Seuss', status: 'finished', rating: 5, finishDate: '2023-10-10' },
];
export const MOCK_SAFE_WEBSITES: SafeWebsite[] = [
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'PBS Kids', url: 'https://pbskids.org' },
];
export const MOCK_TRIPS: Trip[] = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
export const MOCK_PHOTO_ALBUMS: PhotoAlbum[] = [];
export const MOCK_PHOTOS: Photo[] = [];
export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [];
export const MOCK_INFRACTIONS: Infraction[] = [];
const MOCK_HABITS: Habit[] = [
    {id: uniqueId(), profileId: 'child_mock_1', name: 'Read for 20 mins', icon: '📖', color: '#4a90e2', weeklyGoal: 5, currentStreak: 3, longestStreak: 5},
    {id: uniqueId(), profileId: 'child_mock_2', name: 'Practice piano', icon: '🎹', color: '#50e3c2', weeklyGoal: 4, currentStreak: 0, longestStreak: 2},
];
const MOCK_HABIT_LOGS: HabitLog[] = [
    {id: uniqueId(), habitId: MOCK_HABITS[0].id, date: new Date(Date.now() - 86400000*3).toISOString().split('T')[0] },
    {id: uniqueId(), habitId: MOCK_HABITS[0].id, date: new Date(Date.now() - 86400000*2).toISOString().split('T')[0] },
    {id: uniqueId(), habitId: MOCK_HABITS[0].id, date: new Date(Date.now() - 86400000*1).toISOString().split('T')[0] },
];
const MOCK_SHOUTOUTS: ShoutOut[] = [
    {id: uniqueId(), fromProfileId: 'adult_mock_2', toProfileId: 'child_mock_1', message: 'Great job on your math test!', timestamp: Date.now() - 500000 }
];
export const MOCK_PERSONALIZATION_DATA: PersonalizationData = {
    id: 'fam_mock_123',
    numAdultsStr: '2',
    numChildrenStr: '2',
    adultDetailsArray: MOCK_ADULT_DETAILS,
    childDetailsArray: MOCK_CHILD_DETAILS,
    gamifyTasks: true,
    availableRewards: [
        { id: 'r1', name: '30 mins extra screen time', cost: 50 },
        { id: 'r2', name: 'Ice cream trip', cost: 100 },
        { id: 'r3', name: 'Pick a movie for movie night', cost: 75 },
    ],
    specificChores: 'Walk the dog\nSet the table\nFeed the cat\nClean your room\nDo homework',
    allowanceSettings: { enabled: true, amount: 5, payday: 'Saturday' },
    familyBranding: { motto: 'The Awesome Family', headerFont: 'Nunito', bodyFont: 'Nunito', borderRadius: '8px' },
    habits: MOCK_HABITS,
    habitLogs: MOCK_HABIT_LOGS,
    shoutOuts: MOCK_SHOUTOUTS,
};
