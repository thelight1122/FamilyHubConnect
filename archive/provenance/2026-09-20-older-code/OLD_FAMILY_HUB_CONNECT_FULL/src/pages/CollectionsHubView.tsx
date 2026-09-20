import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { Collection } from '../types';
import Modal from '../components/ui/Modal';
import HubTile from '../components/ui/HubTile';

export default function CollectionsHubView() {
    const { collections, addCollection, updateCollection, onNavigate, setActiveCollectionId } = useAppContext();
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
    
    const CollectionForm: React.FC<{onSave: (data: Omit<Collection, 'id'>) => void}> = ({ onSave }) => {
        const [name, setName] = useState(editingCollection?.name || '');
        const [icon, setIcon] = useState(editingCollection?.icon || '📦');
        
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave({ name, icon });
        };
        
        return React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Collection Name'), React.createElement('input', {value: name, onChange: e => setName(e.target.value), style: styles.input})),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Icon'), React.createElement('input', {value: icon, onChange: e => setIcon(e.target.value), style: styles.input})),
            React.createElement('button', {type: 'submit', style: styles.button}, 'Save Collection')
        );
    };
    
    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', {
            onClick: () => onNavigate('dashboard'),
            style: { ...styles.backButton, float: 'left' }
        }, '← Back to Dashboard'),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "📦 Collections Hub"),
        
        React.createElement('section', { style: styles.section },
            React.createElement('button', { onClick: () => handleOpenModal(), style: { ...styles.button, width: 'auto', marginBottom: '15px' } }, "+ New Collection"),
            React.createElement('div', { style: styles.hubGrid },
                collections.map(collection => (
                    React.createElement(HubTile, {
                        key: collection.id,
                        icon: collection.icon,
                        title: collection.name,
                        description: 'View and manage items in this collection.',
                        onClick: () => handleNavigateToCollection(collection.id)
                    })
                ))
            )
        ),
        
        isModalOpen && React.createElement(Modal, {
            isOpen: true,
            onClose: () => setIsModalOpen(false),
            title: editingCollection ? 'Edit Collection' : 'New Collection',
            children: React.createElement(CollectionForm, { onSave: handleSave })
        })
    );
}
