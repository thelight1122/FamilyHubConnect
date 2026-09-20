
import type { Chore } from './chores';
import type { FamilyMessage } from './communication';

export interface ChoreHandlers {
    add: (item: Omit<Chore, 'id' | 'family_id'>) => Promise<Chore | null>;
    update: (itemId: string, updates: Partial<Chore>) => Promise<void>;
    delete: (itemId: string) => Promise<void>;
    generateWeeklyChores: () => Promise<void>;
    complete: (choreId: string) => Promise<void>;
}

export interface MessageHandlers {
    add: (item: Omit<FamilyMessage, 'id' | 'family_id'>) => Promise<FamilyMessage | null>;
    markAsRead: (messageIds: string[]) => Promise<void>;
}
