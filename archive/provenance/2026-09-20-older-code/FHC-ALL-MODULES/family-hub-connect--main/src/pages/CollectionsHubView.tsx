import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import type { Collection } from '../types.ts';
import { Modal, HubTile, ArrowLeftIcon, BottomNavbar } from '../components.tsx';

const CollectionForm: React.FC<{
    onSave: (data: Omit<Collection, 'id'>) => void;
    editingCollection: Collection | null;
}> = ({ onSave, editingCollection }) => {
    const [name, setName] = useState(editingCollection?.name || '');
    const [icon, setIcon] = useState(editingCollection?.icon || '📦');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, icon });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Collection Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter collection name" />
            </div>
            <div className="form-group">
                <label>Icon</label>
                <input 
                    value={icon} 
                    onChange={e => setIcon(e.target.value)} 
                    title="Icon for the collection" 
                    placeholder="Enter an icon (e.g., 📦)" 
                />
            </div>
            <div className="form-actions">
                <button type='submit' className="btn">Save Collection</button>
            </div>
        </form>
    );
};

export default function CollectionsHubView() {
    const { addCollection, updateCollection, onNavigate, setActiveCollectionId } = useAppDispatch();
    const { collections } = useAppState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
    
    const handleOpenModal = (collection?: Collection) => {
        setEditingCollection(collection || null);
        setIsModalOpen(true);
    };

    const handleSave = (collectionData: Omit<Collection, 'id'>) => {
        if (editingCollection) {
            updateCollection(editingCollection.id, collectionData);
        } else {
            addCollection(collectionData);
        }
        setIsModalOpen(false);
    };
    
    const handleNavigateToCollection = (id: string) => {
        setActiveCollectionId(id);
        onNavigate('collectionView');
    };
    
    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')} title="Go back to dashboard">
                    <ArrowLeftIcon />
                </button>
                <h2>📦 Collections Hub</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <button onClick={() => handleOpenModal()} className="btn w-auto mb-20">+ New Collection</button>
                <div className="hub-grid">
                    {collections.map(collection => (
                        <HubTile
                            key={collection.id}
                            icon={collection.icon}
                            title={collection.name}
                            description='View and manage items in this collection.'
                            onClick={() => handleNavigateToCollection(collection.id)}
                        />
                    ))}
                </div>
            </main>
            
            {isModalOpen && (
                <Modal
                    isOpen={true}
                    onClose={() => setIsModalOpen(false)}
                    title={editingCollection ? 'Edit Collection' : 'New Collection'}
                >
                    <CollectionForm onSave={handleSave} editingCollection={editingCollection} />
                </Modal>
            )}
            <BottomNavbar activePage="collectionsHub" onNavigate={onNavigate} />
        </div>
    );
}