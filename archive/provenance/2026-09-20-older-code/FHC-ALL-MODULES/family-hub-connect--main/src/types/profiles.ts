
//profiles.ts
// src/types/profiles.ts
// This file defines types related to user profiles, badges, and digital vault items within the application
import type { PageView } from './core'; 

export type BadgeType =
    | 'FIRST_CHORE_COMPLETED'
    | 'FIVE_CHORES_COMPLETED'
    | 'POINT_COLLECTOR_50'
    | 'POINT_COLLECTOR_100'
    | 'POINT_COLLECTOR_250'
    | 'SUPER_READER'
    | 'TRIP_PLANNER_PRO'
    | 'MASTER_CHEF'
    | 'MEMORY_MAKER'
    | 'PERFECT_WEEK'
    | 'SAVINGS_STARTER'
    | 'GOAL_GETTER'
    | 'STREAK_STARTER_3'
    | 'WEEKLY_WARRIOR_7'
    | 'MONTHLY_MASTER_30';


export interface Badge {
    id: BadgeType;
    name: string;
    description: string;
    icon: string;
}

export interface CustomBadge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export type DigitalVaultItemType = 'id_card' | 'passport' | 'birth_certificate' | 'social_security_card' | 'generic_document' | 'secure_note';
        
export interface DigitalVaultItem {
    id: string;
    profileId: string;
    type: DigitalVaultItemType;
    title: string;
    documentUrl?: string;
    documentName?: string;
    notes?: string;
}

export interface Profile {
    id: string;
    user_id?: string;
    family_id?: string;
    name: string;
    points: number;
    earnedBadges: BadgeType[];
    role: 'Admin' | 'Parent' | 'Child' | 'Other';
    email?: string;
    phone?: string;
    screenName?: string;
    avatarUrl?: string;
    age?: number;
    balance?: number;
    theme?: { [key: string]: string; };
    lastChoreCompletionDate?: string;
    choreStreakCount?: number;
    google_refresh_token?: string;
    screenTimeBalance?: number;
    favoriteColor?: string;
    favoriteFood?: string;
    favoriteAnimal?: string;
    hobbies?: string;
    aboutMe?: string;
    dashboardLayout?: { page: PageView, visible: boolean }[];
    navBarLayout?: { page: PageView; label: string; icon: string }[];
    completedLiteracyTopics?: string[];
    firstName?: string;
    lastName?: string;
    status?: 'active' | 'disabled';
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    birthday?: string;
    income?: number;
}