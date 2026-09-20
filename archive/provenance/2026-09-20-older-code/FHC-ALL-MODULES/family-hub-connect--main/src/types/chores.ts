// chores.ts
// src/types/chores.ts
// This file defines types related to chores and habits within the application.
export type ChoreStatus = 'pending' | 'in progress' | 'pending_approval' | 'completed' | 'rejected';

export interface Chore {
    id: string;
    family_id: string;
    name: string;
    assignedTo: string | null;
    status: ChoreStatus;
    requiresPhoto: boolean;
    photoProofUrl: string | null;
    points: number;
    dueDate: string | null;
    isRecurring: boolean;
    recurrenceType: 'none' | 'daily' | 'weekly';
    recurrenceDays: number[] | null;
    templateChoreId: string | null;
    minAge?: number;
    maxAge?: number;
    rejectionReason?: string;
    isBonus?: boolean;
    bonusAmount?: number;
    completed_at?: string;
}

export interface Habit {
    id: string;
    profileId: string;
    name: string;
    icon: string;
    color: string;
    weeklyGoal: number;
    currentStreak?: number;
    longestStreak?: number;
}

export interface HabitLog {
    id: string;
    habitId: string;
    date: string;
}
