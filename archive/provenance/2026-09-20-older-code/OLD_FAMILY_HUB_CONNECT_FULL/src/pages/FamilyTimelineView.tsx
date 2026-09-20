
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { ManualMemory, Photo, PhotoAlbum, Trip, TripJournalEntry } from '../types';
import Modal from '../components/ui/Modal';
import { uniqueId } from '../utils/utils';

type TimelineItem = {
    date: Date;
    type: 'manual' | 'photo' | 'trip';
    item: ManualMemory | { photo: Photo, album: PhotoAlbum | undefined } | { trip: Trip, entry: TripJournalEntry };
    id: string;
};

const TimelineItemCard: React.FC<{item: TimelineItem}> = ({item}) => {
    switch(item.type) {
        case 'manual':
            const memory = item.item as ManualMemory;
            return React.createElement('div', {style: styles.timelineCard}, 
                memory.imageUrl && React.createElement('img', {src: memory.imageUrl, alt: memory.title, style: styles.timelineImage}),
                React.createElement('div', {style: styles.timelineContent},
                    React.createElement('h4', {style: styles.timelineTitle}, memory.title),
                    React.createElement('p', null, memory.description)
                )
            );
        case 'photo':
            const { photo, album } = item.item as { photo: Photo, album: PhotoAlbum | undefined };
            return React.createElement('div', {style: styles.timelineCard}, 
                React.createElement('img', {src: photo.imageUrl, alt: photo.caption || 'Family photo', style: styles.timelineImage}),
                React.createElement('div', {style: styles.timelineContent},
                    React.createElement('h4', {style: styles.timelineTitle}, `Photo from ${album?.name || 'an album'}`),
                    React.createElement('p', null, photo.caption || 'A great memory captured!')
                )
            );
        // Add trip case later
        default: return null;
    }
};

export default function FamilyTimelineView() {
    const { manualMemories, familyPhotos: photos, photoAlbums, trips, addManualMemory, onNavigate } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const timelineItems = useMemo(() => {
        const items: TimelineItem[] = [];
        manualMemories.forEach(m => items.push({ date: new Date(m.date), type: 'manual', item: m, id: m.id }));
        photos.forEach(p => items.push({ date: new Date(p.timestamp), type: 'photo', item: { photo: p, album: photoAlbums.find(a => a.id === p.albumId) }, id: p.id}));
        // Add trips later
        
        return items.sort((a,b) => b.date.getTime() - a.date.getTime());
    }, [manualMemories, photos, photoAlbums, trips]);
    
    const ManualMemoryForm: React.FC = () => {
        const [title, setTitle] = useState('');
        const [date, setDate] = useState('');
        const [description, setDescription] = useState('');

        const handleSave = () => {
            if (!title || !date || !description) return;
            addManualMemory({ title, date, description });
            setIsModalOpen(false);
        };
        
        return React.createElement('div', null,
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Title'), React.createElement('input', {value: title, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), style: styles.input} as React.HTMLProps<HTMLInputElement>)),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Date'), React.createElement('input', {type: 'date', value: date, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value), style: styles.input} as React.HTMLProps<HTMLInputElement>)),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Description'), React.createElement('textarea', {value: description, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value), style: styles.textarea, rows: 4} as React.HTMLProps<HTMLTextAreaElement>)),
            React.createElement('button', {onClick: handleSave, style: styles.button}, 'Save Memory')
        )
    };
    
    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', {
            onClick: () => onNavigate('dashboard'),
            style: { ...styles.backButton, float: 'left' },
        }, '← Back'),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "⏳ Family Timeline"),
        React.createElement('button', {onClick: () => setIsModalOpen(true), style: {...styles.button, width: 'auto', marginBottom: '20px'}}, '+ Add Manual Memory'),
        
        React.createElement('div', { style: styles.timelineContainer },
            timelineItems.map((item, index) => (
                React.createElement('div', { key: item.id, style: styles.timelineItemWrapper },
                    React.createElement('div', { style: styles.timelineDate }, item.date.toLocaleDateString()),
                    React.createElement(TimelineItemCard, {item: item})
                )
            ))
        ),
        
        isModalOpen && React.createElement(Modal, {isOpen: true, onClose: () => setIsModalOpen(false), title: 'Add a Memory', children: React.createElement(ManualMemoryForm, null)})
    );
}
