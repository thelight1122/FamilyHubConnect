// src/constants/badges.ts
// This file defines the badge system for the application, including badge definitions and their properties.
import type { Badge } from '../types';

export const BADGE_DEFINITIONS: Badge[] = [
    {
        id: 'FIRST_CHORE_COMPLETED',
        name: 'First Chore Complete!',
        description: 'Awarded for completing your very first chore.',
        icon: '🥇',
    },
    {
        id: 'FIVE_CHORES_COMPLETED',
        name: 'Five Chore Finisher',
        description: 'Awarded for completing five chores.',
        icon: '🌟',
    },
    {
        id: 'POINT_COLLECTOR_50',
        name: 'Point Collector (50)',
        description: 'Awarded for earning 50 points.',
        icon: '💰',
    },
    {
        id: 'POINT_COLLECTOR_100',
        name: 'Point Collector (100)',
        description: 'Awarded for earning 100 points.',
        icon: '🏅',
    },
    {
        id: 'POINT_COLLECTOR_250',
        name: 'Point Collector (250)',
        description: 'Awarded for earning 250 points.',
        icon: '🎖️',
    },
    {
        id: 'SUPER_READER',
        name: 'Super Reader',
        description: 'Awarded for finishing 5 books.',
        icon: '🧑‍🏫',
    },
    {
        id: 'TRIP_PLANNER_PRO',
        name: 'Trip Planner Pro',
        description: 'Awarded for planning a family trip.',
        icon: '🗺️',
    },
    {
        id: 'MASTER_CHEF',
        name: 'Master Chef',
        description: 'Awarded for creating a full weekly meal plan.',
        icon: '🧑‍🍳',
    },
    {
        id: 'MEMORY_MAKER',
        name: 'Memory Maker',
        description: 'Awarded for uploading your first photo to the family album.',
        icon: '📸',
    },
    {
        id: 'PERFECT_WEEK',
        name: 'Perfect Week!',
        description: 'Awarded for completing all your chores for 7 days in a row.',
        icon: '🗓️',
    },
    {
        id: 'SAVINGS_STARTER',
        name: 'Savings Starter',
        description: 'Awarded for creating your first savings goal.',
        icon: '🌱',
    },
    {
        id: 'GOAL_GETTER',
        name: 'Goal Getter!',
        description: 'Awarded for completing a savings goal.',
        icon: '🎯',
    },
    {
        id: 'STREAK_STARTER_3',
        name: 'Streak Starter',
        description: 'Awarded for completing chores 3 days in a row.',
        icon: '🥉'
    },
    {
        id: 'WEEKLY_WARRIOR_7',
        name: 'Weekly Warrior',
        description: 'Awarded for completing chores 7 days in a row.',
        icon: '🥈'
    },
    {
        id: 'MONTHLY_MASTER_30',
        name: 'Monthly Master',
        description: 'Awarded for completing chores 30 days in a row.',
        icon: '🥇'
    }
];
