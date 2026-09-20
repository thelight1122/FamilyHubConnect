
export interface AppNotification {
    id: string;
    family_id: string;
    message: string;
    type: 'new_message' | 'chore_status' | 'badge_earned' | 'reward_redeemed' | 'event_reminder' | 'new_trip' | 'new_book_log' | 'allowance_paid' | 'new_photo' | 'allowance_request' | 'goal_achieved' | 'hearing_request' | 'hearing_scheduled' | 'shout_out' | 'automation_triggered';
    timestamp: number;
    read: boolean;
    relatedProfileId?: string;
}

export interface FamilyMessage {
    id: string;
    family_id: string;
    text?: string;
    authorId: string;
    authorName: string;
    timestamp: number;
    recipientId: string | null;
    isPriority?: boolean;
    readBy?: string[];
    subject?: string;
    audioUrl?: string;
    audioType?: string;
}

export interface AuthorizedApp {
    id: string;
    name: string;
    urlScheme: string;
    icon: string;
}

export interface SafeWebsite {
    id: string;
    family_id: string;
    name: string;
    url: string;
}

export type PhoneLogType = 'call' | 'sms';
export interface PhoneLog {
    id: string;
    type: PhoneLogType;
    profileId: string;
    contact: string;
    contactNumber: string;
    direction: 'incoming' | 'outgoing';
    durationSeconds?: number;
    content?: string;
    timestamp: number;
}

export interface Contact {
    id: string;
    profileId?: string;
    name: string;
    number: string;
    avatarUrl?: string;
    isAuthorized: boolean;
}

export interface TimeLockSetting {
    moduleId: string; // PageView
    limitMinutes: number;
}
