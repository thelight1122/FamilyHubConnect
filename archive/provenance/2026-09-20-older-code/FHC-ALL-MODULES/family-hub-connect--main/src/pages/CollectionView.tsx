import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import type { Collection, CollectionItem } from '../types.ts';
import { Modal, ArrowLeftIcon, BottomNavbar } from '../components.tsx';

const ItemForm: React.FC<{
    onSave: (data: Omit<CollectionItem, 'id' | 'collectionId'>) => void;
    editingItem: CollectionItem | null;
}> = ({ onSave, editingItem }) => {
    const [name, setName] = useState(editingItem?.name || '');
    const [description, setDescription] = useState(editingItem?.description || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor='itemName'>Item Name</label>
                <input id='itemName' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor='itemDesc'>Description</label>
                <textarea id='itemDesc' value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            </div>
            <div className="form-actions">
                <button type='submit' className="btn">Save Item</button>
            </div>
        </form>
    );
};

export default function CollectionView({ activeCollectionId }: { activeCollectionId: string }) {
    const { addCollectionItem, updateCollectionItem, onNavigate, setActiveCollectionId } = useAppDispatch();
    const { collections, collectionItems } = useAppState();
    
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);

    const activeCollection = useMemo(() => {
        return collections.find(c => c.id === activeCollectionId);
    }, [collections, activeCollectionId]);
    
    const itemsInCollection = useMemo(() => {
        return collectionItems.filter(i => i.collectionId === activeCollectionId)
            .sort((a,b) => a.name.localeCompare(b.name));
    }, [collectionItems, activeCollectionId]);

    const handleOpenItemModal = (item?: CollectionItem) => {
        setEditingItem(item || null);
        setIsItemModalOpen(true);
    };
    
    const handleSaveItem = (itemData: Omit<CollectionItem, 'id' | 'collectionId'>) => {
        if (!activeCollectionId) return;
        if (editingItem) {
            updateCollectionItem(editingItem.id, itemData);
        } else {
            addCollectionItem({ ...itemData, collectionId: activeCollectionId });
        }
        setIsItemModalOpen(false);
    };
    
    if (!activeCollection) {
        return <div className="page">Loading collection...</div>;
    }

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" title="Go back to collections hub" onClick={() => { setActiveCollectionId(null); onNavigate('collectionsHub'); }}>
                    <ArrowLeftIcon />
                </button>
                <h2>{`${activeCollection.icon} ${activeCollection.name}`}</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <button onClick={() => handleOpenItemModal()} className="btn w-auto mb-20">+ Add New Item</button>
                <div className="hub-grid">
                    {itemsInCollection.map(item => (
                        <div key={item.id} className="hub-tile" onClick={() => handleOpenItemModal(item)}>
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </main>
            {isItemModalOpen && (
                <Modal
                    isOpen={true}
                    onClose={() => setIsItemModalOpen(false)}
                    title={editingItem ? 'Edit Item' : 'New Item'}
                >
                    <ItemForm onSave={handleSaveItem} editingItem={editingItem} />
                </Modal>
            )}
        </div>
    );
}