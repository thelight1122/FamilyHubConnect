//collections.ts
// src/types/collections.ts
// This file defines types related to collections and items within the application.
export interface Collection {
    id: string;
    name: string;
    icon: string;
}
export interface CollectionItem {
    id: string;
    collectionId: string;
    name: string;
    description: string;
    purchaseDate?: string;
    notes?: string;
    imageUrl?: string;
}
