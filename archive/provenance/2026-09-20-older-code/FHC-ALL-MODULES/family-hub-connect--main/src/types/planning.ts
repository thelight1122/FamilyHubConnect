//planning.ts
// src/types/planning.ts
// This file defines types related to planning and scheduling within the application, including events, meals,
export interface FamilyEvent {
    id: string;
    family_id: string;
    title: string;
    date: string;
    endDate?: string;
    time?: string;
    description?: string;
    createdBy: string;
    tripId?: string;
    google_event_id?: string;
    category?: 'general' | 'medical' | 'club' | 'homework';
    clubId?: string;
}

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';

export interface Recipe {
    id: string;
    name: string;
    description?: string;
    ingredients: string[];
    instructions: string;
    imageUrl?: string;
}

export interface MealSuggestion {
    id: string;
    name: string;
    description: string;
    ingredients?: string[];
    recipe?: string;
    recipeId?: string;
}

export interface PlannedMeal {
    id: string;
    family_id: string;
    dayOfWeek: DayOfWeek;
    mealType: MealType;
    meal: MealSuggestion;
}

export interface ShoppingListItem {
    id: string;
    family_id: string;
    name: string;
    addedBy: string;
    isChecked: boolean;
    quantity: number;
}

export interface PantryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
}

export type TripMode = 'Driving' | 'Flying' | 'Train' | 'Bus';

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface PackingItem {
    id: string;
    text: string;
    packed: boolean;
}

export interface TripJournalEntry {
    id: string;
    type: 'note' | 'photo';
    timestamp: number;
    content: string;
    photoUrl?: string;
    authorId: string;
}

export interface Trip {
    id: string;
    family_id: string;
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    modeOfTransport: TripMode;
    chores: ChecklistItem[];
    shoppingItems: ChecklistItem[];
    packingList: PackingItem[];
    aiSightseeingSuggestions?: string[];
    journal: TripJournalEntry[];
}
