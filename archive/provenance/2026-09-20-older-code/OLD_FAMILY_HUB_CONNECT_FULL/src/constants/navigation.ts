

import type { PageView, ModuleDefinition } from '../types/index.ts';

// --- Dashboard Modules ---
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
