import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import type { ManualMemory, Photo, PhotoAlbum, Trip, TripJournalEntry } from '../types.ts';
import { Modal, ArrowLeftIcon, BottomNavbar } from '../components.tsx';

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
            return (
                <div className="card">
                    {memory.imageUrl && <img src={memory.imageUrl} alt={memory.title} style={{width: '100%', borderRadius: '8px', marginBottom: '10px'}}/>}
                    <h4>{memory.title}</h4>
                    <p>{memory.description}</p>
                </div>
            );
        case 'photo':
            const { photo, album } = item.item as { photo: Photo, album: PhotoAlbum | undefined };
            return (
                <div className="card">
                    <img src={photo.imageUrl} alt={photo.caption || 'Family photo'} style={{width: '100%', borderRadius: '8px', marginBottom: '10px'}}/>
                    <h4>{`Photo from ${album?.name || 'an album'}`}</h4>
                    <p>{photo.caption || 'A great memory captured!'}</p>
                </div>
            );
        default: return null;
    }
};

const ManualMemoryForm: React.FC<{ onSave: (data: Omit<ManualMemory, 'id'>) => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        if (!title || !date || !description) return;
        onSave({ title, date, description });
    };
    
    return (
        <div>
            <div className="form-group"><label>Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="form-group"><label>Date</label><input type='date' value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="form-group"><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} /></div>
            <div className="form-actions">
                <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
                <button onClick={handleSave} className="btn">Save Memory</button>
            </div>
        </div>
    );
};

export default function FamilyTimelineView() {
    const { addManualMemory, onNavigate } = useAppDispatch();
    const { manualMemories, familyPhotos, photoAlbums, trips } = useAppState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const timelineItems = useMemo(() => {
        const items: TimelineItem[] = [];
        manualMemories.forEach(m => items.push({ date: new Date(m.date), type: 'manual', item: m, id: m.id }));
        familyPhotos.forEach(p => items.push({ date: new Date(p.timestamp), type: 'photo', item: { photo: p, album: photoAlbums.find(a => a.id === p.albumId) }, id: p.id}));
        return items.sort((a,b) => b.date.getTime() - a.date.getTime());
    }, [manualMemories, familyPhotos, photoAlbums, trips]);
    
    const handleSaveMemory = (data: Omit<ManualMemory, 'id'>) => {
        addManualMemory(data);
        setIsModalOpen(false);
    };
    
    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>⏳ Family Timeline</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <button onClick={() => setIsModalOpen(true)} className="btn w-auto mb-20">+ Add Manual Memory</button>
                
                <div>
                    {timelineItems.map((item) => (
                        <div key={item.id} style={{position: 'relative', paddingLeft: '30px', borderLeft: '2px solid var(--border)', marginBottom: '20px'}}>
                            <div style={{position: 'absolute', left: '-11px', top: '0', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', border: '3px solid var(--bg)'}}></div>
                            <p style={{fontWeight: 'bold', margin: '0 0 10px 0'}}>{item.date.toLocaleDateString()}</p>
                            <TimelineItemCard item={item} />
                        </div>
                    ))}
                </div>
            </main>
            
            {isModalOpen && <Modal isOpen={true} onClose={() => setIsModalOpen(false)} title='Add a Memory'><ManualMemoryForm onSave={handleSaveMemory} onCancel={() => setIsModalOpen(false)} /></Modal>}
            <BottomNavbar activePage="familyTimeline" onNavigate={onNavigate} />
        </div>
    );
}