
//activities.ts
// src/types/activities.ts
// This file defines types related to activities and clubs within the application.  
import type { FamilyEvent } from './planning';
import type { FamilyMessage } from './communication';

export type MasteryLevel = 'beginner' | 'intermediate' | 'expert';
export interface Skill {
    id: string;
    name: string;
    description: string;
}
export interface AssignedSkill {
    id: string;
    skillId: string;
    profileId: string;
    mastery: MasteryLevel;
}

export interface ClubRosterMember {
    profileId: string;
    role: 'Member' | 'Coach' | 'Manager';
}
export interface EquipmentRequest {
    id: string;
    requestedBy: string;
    itemName: string;
    price?: number;
    url?: string;
    status: 'pending' | 'approved' | 'denied';
}
export interface ActivityClub {
    id: string;
    name: string;
    description: string;
    roster: ClubRosterMember[];
    equipmentRequests: EquipmentRequest[];
    calendar: FamilyEvent[];
    messages: FamilyMessage[];
}

export interface Player {
    id: string;
    name: string;
    position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
    team: string;
}
export interface FantasyTeam {
    id: string;
    profileId: string;
    teamName: string;
    roster: Player[];
    wins: number;
    losses: number;
}
export interface Matchup {
    week: number;
    team1Id: string;
    team2Id: string;
    team1Score: number;
    team2Score: number;
}
export interface FantasyLeague {
    id: string;
    name: string;
    teams: FantasyTeam[];
    matchups: Matchup[];
}
