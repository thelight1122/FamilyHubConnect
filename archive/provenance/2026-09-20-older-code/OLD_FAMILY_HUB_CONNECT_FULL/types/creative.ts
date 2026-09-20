
export interface PhotoAlbum {
    id: string;
    family_id: string;
    name: string;
    description?: string;
    createdBy: string;
    timestamp: number;
}
export interface Photo {
    id: string;
    family_id: string;
    albumId: string;
    imageUrl: string;
    caption?: string;
    uploadedBy: string;
    timestamp: number;
}

export type MadLibTheme =
    | "Fantasy Adventure"
    | "Silly School Day"
    | "Outer Space Mystery"
    | "Pirate Treasure Hunt"
    | "Talking Animals Farm";

export interface MadLibPrompt {
    id: string;
    label: string;
}

export interface AIStoryTemplate {
    story: string;
    prompts: MadLibPrompt[];
}

export type MysteryPrizeType = 'points' | 'privilege';
export interface MysteryBoxPrize {
    id: string;
    type: MysteryPrizeType;
    value: string;
    weight: number;
}
export interface MysteryBoxTier {
    id: string;
    name: string;
    cost: number;
    color: string;
    prizes: MysteryBoxPrize[];
}

export interface Medal {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface AwardedMedal {
    id: string;
    medalId: string;
    profileId: string;
    awardedBy: string;
    reason?: string;
    timestamp: number;
}
