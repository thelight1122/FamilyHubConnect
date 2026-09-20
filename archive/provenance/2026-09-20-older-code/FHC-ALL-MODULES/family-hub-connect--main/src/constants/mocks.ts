

// src/constants/mocks.ts
// This file contains mock data used for testing and development purposes.
import { uniqueId } from '../utils/utils';
import type { 
    PersonalizationData, Chore, FamilyMessage, ShoppingListItem, FamilyEvent, 
    BookLogEntry, Trip, Transaction, Photo, PhotoAlbum, 
    SavingsGoal, Infraction, Profile, AdultDetailForm, ChildDetailForm,
    Habit, HabitLog, ShoutOut, Todo, SafeWebsite, Skill, AssignedSkill, Vehicle, VehicleMaintenanceLog
} from '../types';

export const MOCK_SESSION = {
    user: { id: 'user_mock_123', email: 'dad@family.com' },
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
    expires_in: 3600,
    token_type: 'bearer',
};

export const MOCK_PROFILES: Profile[] = [
    { id: 'adult_mock_1', name: 'Dad', role: 'Admin', points: 15, balance: 1050.75, avatarUrl: '👨‍🦱', earnedBadges: [], email: 'dad@family.com', screenTimeBalance: 0 },
    { id: 'adult_mock_2', name: 'Mom', role: 'Parent', points: 20, balance: 1200.00, avatarUrl: '👩‍🦰', earnedBadges: [], email: 'mom@family.com', screenTimeBalance: 0 },
    { id: 'child_mock_1', name: 'Alex', role: 'Child', points: 125, balance: 25.50, avatarUrl: '🧒', earnedBadges: ['FIRST_CHORE_COMPLETED', 'POINT_COLLECTOR_50'], age: 12, screenTimeBalance: 120 },
    { id: 'child_mock_2', name: 'Mia', role: 'Child', points: 80, balance: 15.00, avatarUrl: '👧', earnedBadges: ['FIRST_CHORE_COMPLETED'], age: 8, screenTimeBalance: 90 },
];

const MOCK_ADULT_DETAILS: AdultDetailForm[] = MOCK_PROFILES
    .filter(p => p.role === 'Admin' || p.role === 'Parent')
    .map(p => ({ tempId: p.id, name: p.name, avatarUrl: p.avatarUrl || '', role: 'adult', email: p.email }));

const MOCK_CHILD_DETAILS: ChildDetailForm[] = MOCK_PROFILES
    .filter(p => p.role === 'Child')
    .map(p => ({ tempId: p.id, name: p.name, avatarUrl: p.avatarUrl || '', role: 'child', age: p.age }));

export const MOCK_CHORES: Chore[] = [
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Take out the trash', assignedTo: 'child_mock_1', status: 'pending', points: 10, dueDate: new Date().toISOString().split('T')[0], requiresPhoto: false, isRecurring: true, recurrenceType: 'weekly', recurrenceDays: [2, 5], photoProofUrl: null, templateChoreId: 'template_1', isBonus: false },
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Feed the dog', assignedTo: 'child_mock_2', status: 'completed', points: 5, dueDate: new Date().toISOString().split('T')[0], requiresPhoto: false, isRecurring: true, recurrenceType: 'daily', recurrenceDays: [0,1,2,3,4,5,6], photoProofUrl: null, templateChoreId: 'template_2', completed_at: new Date().toISOString(), isBonus: false },
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Clean your room', assignedTo: 'child_mock_1', status: 'pending_approval', points: 20, dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], requiresPhoto: true, photoProofUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=Room+Photo', isRecurring: false, recurrenceType: 'none', recurrenceDays: null, templateChoreId: null, isBonus: false },
    { id: uniqueId(), family_id: 'fam_mock_123', name: 'Wash the dishes', assignedTo: 'adult_mock_2', status: 'in progress', points: 0, dueDate: new Date().toISOString().split('T')[0], requiresPhoto: false, photoProofUrl: null, isRecurring: false, recurrenceType: 'none', recurrenceDays: null, templateChoreId: null, isBonus: false },
    { id: 'template_1', family_id: 'fam_mock_123', name: 'Take out the trash', assignedTo: null, status: 'pending', points: 10, dueDate: new Date().toISOString().split('T')[0], requiresPhoto: false, isRecurring: true, recurrenceType: 'weekly', recurrenceDays: [2, 5], photoProofUrl: null, templateChoreId: null, isBonus: false },
    { id: 'template_2', family_id: 'fam_mock_123', name: 'Feed the dog', assignedTo: null, status: 'pending', points: 5, dueDate: new Date().toISOString().split('T')[0], requiresPhoto: false, isRecurring: true, recurrenceType: 'daily', recurrenceDays: [0,1,2,3,4,5,6], photoProofUrl: null, templateChoreId: null, isBonus: false },
];

export const MOCK_MESSAGES: FamilyMessage[] = [
    { id: uniqueId(), text: 'Hey everyone, remember pizza night is Friday!', authorId: 'adult_mock_1', authorName: 'Dad', timestamp: Date.now() - 200000, recipientId: null, readBy: ['adult_mock_1'] },
    { id: uniqueId(), text: 'Can I go to the park after school?', authorId: 'child_mock_1', authorName: 'Alex', timestamp: Date.now() - 100000, recipientId: 'adult_mock_2', readBy: ['child_mock_1'] },
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
    { id: uniqueId(), profileId: 'child_mock_2', title: 'The Cat in the Hat', author: 'Dr. Seuss', status: 'finished', rating: 5, finishDate: '2023-10-10' },
];

export const MOCK_SAFE_WEBSITES: SafeWebsite[] = [
    { id: uniqueId(), name: 'PBS Kids', url: 'https://pbskids.org' },
];

export const MOCK_TRIPS: Trip[] = [
    {
        id: 'trip_1',
        family_id: 'fam_mock_123',
        name: 'Summer Beach Trip',
        destination: 'Ocean City',
        startDate: '2024-07-20',
        endDate: '2024-07-27',
        modeOfTransport: 'Driving',
        chores: [],
        shoppingItems: [],
        packingList: [],
        journal: [],
    }
];
export const MOCK_TRANSACTIONS: Transaction[] = [];
export const MOCK_PHOTO_ALBUMS: PhotoAlbum[] = [];
export const MOCK_PHOTOS: Photo[] = [];
export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [];
export const MOCK_INFRACTIONS: Infraction[] = [];

export const MOCK_SKILLS: Skill[] = [
    { id: 'skill_1', name: 'Tying Shoes', description: 'Mastering the art of the bunny ears and loop-swoop-and-pull.' },
    { id: 'skill_2', name: 'Riding a Bike', description: 'Balancing and pedaling on two wheels.' },
    { id: 'skill_3', name: 'Making a Sandwich', description: 'Assembling a delicious and nutritious sandwich.' },
];

export const MOCK_ASSIGNED_SKILLS: AssignedSkill[] = [
    { id: 'as_1', profileId: 'child_mock_1', skillId: 'skill_1', mastery: 'expert' },
    { id: 'as_2', profileId: 'child_mock_1', skillId: 'skill_2', mastery: 'intermediate' },
    { id: 'as_3', profileId: 'child_mock_2', skillId: 'skill_1', mastery: 'beginner' },
];

export const MOCK_VEHICLES: Vehicle[] = [
    { id: 'vehicle_1', nickname: 'The Minivan', make: 'Honda', model: 'Odyssey', year: 2021, aiSchedule: [] },
    { id: 'vehicle_2', nickname: 'The Sedan', make: 'Toyota', model: 'Camry', year: 2020, aiSchedule: [] },
];

export const MOCK_MAINTENANCE_LOGS: VehicleMaintenanceLog[] = [
    { id: 'log_1', vehicleId: 'vehicle_1', serviceType: 'Oil Change', date: '2023-08-15', notes: 'Used synthetic oil.' },
];

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

const MOCK_TODOS: Todo[] = [
    { id: uniqueId(), text: 'Finish app refactoring', completed: false, profileId: 'adult_mock_1' },
    { id: uniqueId(), text: 'Buy groceries', completed: true, profileId: 'adult_mock_1' },
    { id: uniqueId(), text: 'Math homework page 5', completed: false, profileId: 'child_mock_1' },
];

export const MOCK_PERSONALIZATION_DATA: PersonalizationData = {
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
    todos: MOCK_TODOS,
};