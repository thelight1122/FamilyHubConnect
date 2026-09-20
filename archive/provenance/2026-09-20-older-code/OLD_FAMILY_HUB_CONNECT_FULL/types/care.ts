
import type { Contact } from './communication';

export type CareLogType = 'medication' | 'food' | 'activity' | 'mood' | 'general';
export interface CareLog {
    id: string;
    recipientProfileId: string;
    loggedBy: string;
    timestamp: number;
    type: CareLogType;
    notes: string;
    medicationName?: string;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    time: string;
}
export interface Caregiver {
    id: string;
    name: string;
    phone: string;
    email?: string;
    notes?: string;
    userId?: string;
    authorizedFor: string[];
}
export interface CareRecipient {
    id: string;
    profileId: string;
    medications: Medication[];
    allergies: string;
    dietaryConcerns: string;
    bedtimeRoutine: string;
    comfortInstructions: string;
    emergencyContacts: Contact[];
    medicalInstructions: string;
}

export interface HealthLog {
    id: string;
    profileId: string;
    timestamp: number;
    symptoms: string;
    notes?: string;
    temperature?: number;
}

export interface MedicalRecord {
    id: string;
    profileId: string;
    title: string;
    documentUrl?: string;
    documentName?: string;
    notes?: string;
}
