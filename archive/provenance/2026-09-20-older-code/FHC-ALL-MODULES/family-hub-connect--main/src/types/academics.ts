//academics.ts
// src/types/academics.ts
// This file defines types related to academic management within the application.
export interface BookLogEntry {
    id: string;
    family_id: string;
    profileId: string;
    title: string;
    author?: string;
    status: 'reading' | 'finished' | 'to_read';
    startDate?: string;
    finishDate?: string;
    rating?: number;
    notes?: string;
}

export interface AISuggestedBook {
    title: string;
    author: string;
    shortDescription: string;
}

export interface AIDiscussionAndPrompts {
    discussionQuestions: string[];
    creativePrompts: string[];
}

export interface HomeworkAssignment {
    id: string;
    profileId: string;
    subject: string;
    description: string;
    dueDate: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    attachmentUrl?: string;
    eventId?: string;
}

export interface ShoutOut {
    id: string;
    fromProfileId: string;
    toProfileId:string;
    message: string;
    timestamp: number;
}
