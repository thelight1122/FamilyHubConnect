
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { Collection, CollectionItem } from '../types';
import Modal from '../components/ui/Modal';

interface CollectionViewProps {
    activeCollectionId: string;
}

export default function CollectionView({ activeCollectionId }: CollectionViewProps) {
    const { 
        collections, collectionItems, addCollectionItem, updateCollectionItem, deleteCollectionItem, 
        onNavigate, setActiveCollectionId
    } = useAppContext();
    
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
    
    const ItemForm: React.FC<{onSave: (data: Omit<CollectionItem, 'id' | 'collectionId'>) => void}> = ({ onSave }) => {
        const [name, setName] = useState(editingItem?.name || '');
        const [description, setDescription] = useState(editingItem?.description || '');
        
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave({ name, description });
        };
        
        return React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'itemName'}, 'Item Name'), React.createElement('input', {id: 'itemName', value: name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value), style: styles.input} as React.HTMLProps<HTMLInputElement>)),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'itemDesc'}, 'Description'), React.createElement('textarea', {id: 'itemDesc', value: description, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value), style: styles.textarea, rows: 4} as React.HTMLProps<HTMLTextAreaElement>)),
            React.createElement('button', {type: 'submit', style: styles.button}, 'Save Item')
        );
    };

    if (!activeCollection) {
        return React.createElement('div', {style: styles.loadingMessage}, 'Loading collection...');
    }

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', {
            onClick: () => { setActiveCollectionId(null); onNavigate('collectionsHub'); },
            style: { ...styles.backButton, float: 'left' }
        }, '← Back to Collections'),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, `${activeCollection.icon} ${activeCollection.name}`),
        
        React.createElement('section', { style: styles.section },
            React.createElement('button', {onClick: () => handleOpenItemModal(), style: {...styles.button, width: 'auto', marginBottom: '15px'}}, '+ Add New Item'),
            React.createElement('div', { style: styles.hubGrid },
                itemsInCollection.map(item => (
                    React.createElement('div', { key: item.id, style: styles.hubTile, onClick: () => handleOpenItemModal(item) },
                        React.createElement('h4', { style: styles.hubTileTitle }, item.name),
                        React.createElement('p', { style: styles.hubTileDescription }, item.description)
                    )
                ))
            )
        ),
        
        isItemModalOpen && React.createElement(Modal, {
            isOpen: true,
            onClose: () => setIsItemModalOpen(false),
            title: editingItem ? 'Edit Item' : 'New Item',
            children: React.createElement(ItemForm, { onSave: handleSaveItem })
        })
    );
}
