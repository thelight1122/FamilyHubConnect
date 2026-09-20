
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
