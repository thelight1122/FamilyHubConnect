
export interface RestorativeTask {
    id: string;
    text: string;
    completed: boolean;
}

export type ConsequenceType = 'time_out' | 'restriction' | 'hearing_request';

export interface Infraction {
    id: string;
    family_id: string;
    child_id: string;
    created_by: string;
    reason: string;
    evidence_urls: string[];
    consequence_type: ConsequenceType;
    consequence_value: string;
    status: 'active' | 'completed' | 'pending';
    created_at: string;
    completed_at: string | null;
}

export interface FamilyCourtCase {
    id: string;
    infractionId: string;
    tasks: RestorativeTask[];
    participants: string[];
    status: 'pending_review' | 'in_progress' | 'closed';
    verdict?: 'responsible' | 'not_responsible' | string;
    notes?: string;
    evidenceUrls?: string[];
}

export interface Pet {
    id: string;
    name: string;
    species: string;
    avatarUrl?: string;
    notes?: string;
}

export type PetLogType = 'food' | 'walk' | 'medicine' | 'grooming' | 'other';
export interface PetLog {
    id: string;
    petId: string;
    type: PetLogType;
    notes?: string;
    timestamp: number;
    loggedBy: string;
}

export interface ManualMemory {
    id: string;
    title: string;
    description: string;
    date: string;
    imageUrl?: string;
}

export interface PollOption {
  id: string;
  text: string;
  voterIds: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdAt: number;
  isClosed: boolean;
  allowMultipleVotes?: boolean;
}

export interface FamilyBranding {
    motto?: string;
    crestUrl?: string | null;
    headerFont?: string;
    bodyFont?: string;
    borderRadius?: string;
}

export interface ActionItem {
    id: string;
    text: string;
    assignedTo: string;
    isCompleted: boolean;
}

export interface AgendaItem {
    id: string;
    text: string;
    addedBy: string;
}

export interface FamilyMeeting {
    id: string;
    title: string;
    date: string;
    time: string;
    agenda: AgendaItem[];
    minutes?: string;
    actionItems: ActionItem[];
    eventId?: string;
}
