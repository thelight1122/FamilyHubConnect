
// src/constants/navigation.ts
// This file defines the navigation structure and available modules for the application.
import type { PageView, ModuleDefinition } from '../types.ts';

// --- Dashboard Modules ---
export const ALL_MODULES: ModuleDefinition[] = [
    { page: 'chores', title: 'Chores', childTitle: 'My Jobs', icon: '🧹', description: 'Manage family tasks and track completion.' },
    { page: 'rewards', title: 'Rewards', childTitle: 'Prize Box', icon: '🏆', description: 'Earn points, badges, and redeem prizes.' },
    { page: 'calendar', title: 'Calendar', icon: '🗓️', description: 'View all family events and important dates.' },
    { page: 'shoppingList', title: 'Shopping List', icon: '🛒', description: 'Collaborate on a shared grocery list.' },
    { page: 'connections', title: 'Connections', icon: '💬', description: 'Messages, polls, and shout-outs.' },
    { page: 'finance', title: 'Finance Hub', icon: '💸', description: 'Manage allowances, budget, and learn.' },
    { page: 'familyCare', title: 'Family Care', icon: '❤️‍🩹', description: 'Health logs, medical info, and caregiving.' },
    { page: 'homeManagement', title: 'Home Hub', icon: '🏠', description: 'Manage vehicles and smart home devices.' },
    { page: 'theFridge', title: 'The Fridge', icon: '🧊', description: 'Meal plans, recipes, and pantry inventory.' },
    { page: 'familyMatters', title: 'Family Matters', icon: '👨‍👩‍👧‍👦', description: 'Handle discussions, court, and constitution.', parentOnly: true },
    { page: 'digitalDesk', title: 'Digital Desk', childTitle: 'My Desk', icon: '📝', description: 'Homework, routines, and reading.' },
    { page: 'lockerRoom', title: 'Locker Room', icon: '🏀', description: 'Activities, games, and skills.' },
    { page: 'creatorsStudio', title: 'Creator\'s Studio', icon: '✨', description: 'Create with AI tools, draw, and more.' },
    { page: 'familyTimeline', title: 'Family Timeline', icon: '⏳', description: 'A shared scrapbook of your memories.' },
    { page: 'settings', title: 'Settings', icon: '⚙️', description: 'Customize your Family Hub profile and app.' },
];

export const CONNECTIONS_MODULES: ModuleDefinition[] = [
    { page: 'messages', title: 'Family Messages', childTitle: 'Family Messages', icon: '💬', description: 'Send and receive direct or group messages.' },
    { page: 'polls', title: 'Family Polls', childTitle: 'Family Polls', icon: '🗳️', description: 'Create polls to vote on family decisions.' },
    { page: 'shoutOuts', title: 'Shout-Outs Board', childTitle: 'Shout-Outs Board', icon: '🎉', description: 'Share praise and celebrate successes.' },
];

export const FINANCE_MODULES: ModuleDefinition[] = [
    { page: 'allowance', title: 'Allowances & Wallets', childTitle: 'Allowances & Wallets', icon: '💰', description: 'Manage balances, savings goals, and spending.' },
    { page: 'budget', title: 'Family Budget', childTitle: 'Family Budget', icon: '📊', description: 'Set budgets for categories and track spending.' },
    { page: 'familyBank', title: 'Family Bank', childTitle: 'Family Bank', icon: '🏦', description: 'Manage loans and investments within the family.' },
    { page: 'screenTimeBank', title: 'Screen Time Bank', childTitle: 'Screen Time Bank', icon: '📱', description: 'Earn and spend screen time as a reward.' },
    { page: 'marketSim', title: 'Market Simulator', childTitle: 'Market Simulator', icon: '📈', description: 'Learn about the stock market with play money.' },
    { page: 'financialLiteracy', title: 'Financial Literacy', childTitle: 'Financial Literacy', icon: '🧑‍🏫', description: 'Interactive lessons on earning, saving, and investing.' },
];

export const FAMILY_CARE_MODULES: ModuleDefinition[] = [
    { page: 'aiNurse', title: 'AI Nurse-Bot', childTitle: 'AI Nurse-Bot', icon: '🤖', description: 'Get quick, AI-powered answers to general health questions.' },
    { page: 'health', title: 'Health Logs', childTitle: 'Health Logs', icon: '📝', description: 'Track symptoms, temperature, and other important health events.' },
    { page: 'medicalRecords', title: 'Medical Records', childTitle: 'Medical Records', icon: '🗂️', description: 'Securely store important medical documents and information.' },
    { page: 'caregivingCentral', title: 'Caregiving Central', childTitle: 'Caregiving Central', icon: '🤝', description: 'Manage caregivers and create detailed care plans.' },
];

export const HOME_MANAGEMENT_MODULES: ModuleDefinition[] = [
    { page: 'vehicleMaintenance', title: 'Vehicle Maintenance', childTitle: 'Vehicle Maintenance', icon: '🚗', description: 'Manage cars, log services, and view upcoming maintenance.' },
    { page: 'smartHome', title: 'Smart Home Control', childTitle: 'Smart Home Control', icon: '💡', description: 'Connect and manage your smart home devices.' },
    { page: 'weeklyReport', title: 'Weekly Reports', childTitle: 'Weekly Reports', icon: '📊', description: 'View summaries of family activity and achievements.' },
];

export const THE_FRIDGE_MODULES: ModuleDefinition[] = [
    { page: 'mealPlan', title: 'Weekly Meal Plan', childTitle: 'Weekly Meal Plan', icon: '📅', description: 'Plan your breakfasts, lunches, and dinners.' },
    { page: 'mealSuggestions', title: 'AI Meal Suggestions', childTitle: 'AI Meal Suggestions', icon: '🧠', description: 'Get creative, AI-powered meal ideas.' },
    { page: 'recipeBook', title: 'My Recipe Book', childTitle: 'My Recipe Book', icon: '🍳', description: 'Browse your collection of saved family recipes.' },
    { page: 'pantry', title: 'Pantry Inventory', childTitle: 'Pantry Inventory', icon: '🥫', description: 'Keep track of what you have in stock.' },
];

export const FAMILY_MATTERS_MODULES: ModuleDefinition[] = [
    { page: 'familyFoundations', title: 'Family Foundations', childTitle: 'Family Foundations', icon: '📜', description: 'Create and agree upon your family\'s core values.' },
    { page: 'familyMeeting', title: 'Family Meetings', childTitle: 'Family Huddle', icon: '👨‍👩‍👧‍👦', description: 'Schedule and organize meetings.' },
    { page: 'familyCourt', title: 'Family Court', childTitle: 'Family Court', icon: '⚖️', description: 'Resolve disputes and make decisions together.' },
];

export const DIGITAL_DESK_MODULES: ModuleDefinition[] = [
    { page: 'homeworkPlanner', title: 'Homework Planner', childTitle: 'Homework Planner', icon: '🗓️', description: 'Keep track of school assignments and due dates.' },
    { page: 'homeworkHelper', title: 'Homework Helper', childTitle: 'Homework Helper', icon: '💡', description: 'Get AI-powered help for tough subjects.' },
    { page: 'readingCorner', title: 'Reading Corner', childTitle: 'Reading Corner', icon: '📚', description: 'Log books, discover new ones, and earn badges.' },
    { page: 'routineBuilder', title: 'Routine Builder', childTitle: 'Routine Builder', icon: '🎯', description: 'Create and track your daily routines.' },
];

export const LOCKER_ROOM_MODULES: ModuleDefinition[] = [
    { page: 'skillsTracker', title: 'Skills Tracker', childTitle: 'Skills Tracker', icon: '🎯', description: 'Learn new talents and track your mastery.' },
    { page: 'familyGames', title: 'Family Games', childTitle: 'Family Games', icon: '🎲', description: 'Play fun, interactive games like AI Mad Libs.' },
    { page: 'movieNightPicker', title: 'Movie Night Picker', childTitle: 'Movie Night Picker', icon: '🎬', description: 'Let the wheel decide what to watch.' },
    { page: 'gameScorer', title: 'Game Scorer', childTitle: 'Game Scorer', icon: '💯', description: 'A simple scoreboard for any game you play.' },
];

export const CREATORS_STUDIO_MODULES: ModuleDefinition[] = [
    { page: 'aiAvatarCreator', title: 'AI Avatar Creator', childTitle: 'AI Avatar Creator', icon: '🤖', description: 'Design a unique, personalized avatar using AI.' },
    { page: 'storyGenerator', title: 'AI Story Generator', childTitle: 'AI Story Generator', icon: '📖', description: 'Create imaginative stories with custom characters.' },
    { page: 'drawingBoard', title: 'Digital Drawing Board', childTitle: 'Digital Drawing Board', icon: '🎨', description: 'A simple canvas for free-form drawing and doodling.' },
    { page: 'newsletterCreator', title: 'Family Newsletter', childTitle: 'Family Newsletter', icon: '📰', description: 'Create a fun newsletter about your family\'s week.' },
];

export const SETTINGS_MODULES: PageView[] = [
    'profileSettings',
    'familySettings',
    'familyBranding',
    'choreSettings',
    'rewardSettings',
    'allowanceSettings',
    'navigationSettings',
    'dashboardSettings',
    'integrations',
    'securitySettings',
];

// --- Navigation Bar Customization ---
export const ALL_NAV_ITEMS: { page: PageView; label: string; icon: string }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { page: 'chores', label: 'Chores', icon: '📋' },
    { page: 'todo', label: 'To-Do', icon: '✅' },
    { page: 'rewards', label: 'Rewards', icon: '🏆' },
    { page: 'allowance', label: 'Wallet', icon: '💰' },
    { page: 'calendar', label: 'Calendar', icon: '📅' },
    { page: 'messages', label: 'Messages', icon: '💬' },
    { page: 'phone', label: 'Phone', icon: '📱' },
    { page: 'shoppingList', label: 'Shopping', icon: '🛒' },
    { page: 'lockerRoom', label: 'Activities', icon: '🏀' },
    { page: 'creatorsStudio', label: 'Studio', icon: '✨' },
    { page: 'finance', label: 'Finance', icon: '💸' },
    { page: 'health', label: 'Health', icon: '❤️‍🩹' },
    { page: 'petHub', label: 'Pets', icon: '🐾' },
    { page: 'smartHome', label: 'Home', icon: '💡' },
];

export const DEFAULT_NAV_ITEMS = ALL_NAV_ITEMS.slice(0, 5);