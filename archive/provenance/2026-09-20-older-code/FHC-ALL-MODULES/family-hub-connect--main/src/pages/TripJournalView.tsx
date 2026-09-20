
import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import type { Trip, ChecklistItem, TripJournalEntry } from '../types';
import { uniqueId } from '../utils/utils';
import { ArrowLeftIcon } from '../components';

interface TripJournalViewProps {
    activeTripId: string | null;
}

export default function TripJournalView({ activeTripId }: TripJournalViewProps) {
    const { updateTrip, onNavigate, getProfileName } = useAppDispatch();
    const { trips, profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);

    const [newNote, setNewNote] = useState('');

    const trip = useMemo(() => trips.find(t => t.id === activeTripId), [trips, activeTripId]);

    const handleUpdateChecklist = (listName: 'chores' | 'shoppingItems' | 'packingList', itemId: string, completed: boolean) => {
        if (!trip) return;
        const listKey = listName === 'packingList' ? 'packed' : 'completed';
        const updatedList = trip[listName].map(item => item.id === itemId ? { ...item, [listKey]: completed } : item);
        updateTrip(trip.id, { [listName]: updatedList });
    };
    
    const handleAddChecklistItem = (listName: 'chores' | 'shoppingItems' | 'packingList', text: string) => {
        if (!trip || !text.trim()) return;
        const listKey = listName === 'packingList' ? 'packed' : 'completed';
        const newItem = { id: uniqueId(), text: text.trim(), [listKey]: false };
        const updatedList = [...trip[listName], newItem];
        updateTrip(trip.id, { [listName]: updatedList });
    };

    const handleAddNote = () => {
        if (!trip || !newNote.trim() || !currentViewingProfile) return;
        const newEntry: TripJournalEntry = {
            id: uniqueId(), type: 'note', timestamp: Date.now(),
            content: newNote.trim(), authorId: currentViewingProfile.id
        };
        updateTrip(trip.id, { journal: [...trip.journal, newEntry] });
        setNewNote('');
    };

    if (!trip) {
        return <div className="page">Trip not found. <a href="#" onClick={() => onNavigate('tripPlanner')}>Go back to planner.</a></div>;
    }

    const Checklist: React.FC<{ list: ChecklistItem[], name: 'chores'|'shoppingItems'|'packingList', title: string }> = ({ list, name, title }) => {
        const [newItemText, setNewItemText] = useState('');
        const itemKey = name === 'packingList' ? 'packed' : 'completed';
        const placeholder = name === 'packingList' ? 'e.g., Toothbrush' : name === 'shoppingItems' ? 'e.g., Sunscreen' : 'e.g., Water plants';
        
        return (
            <div>
                <h4>{title}</h4>
                {list.map(item => (
                    <div key={item.id} className="checkbox-label">
                        <input type='checkbox' className="checkbox" checked={(item as any)[itemKey]} onChange={e => handleUpdateChecklist(name, item.id, e.target.checked)} />
                        <label style={{ textDecoration: (item as any)[itemKey] ? 'line-through' : 'none' }}>{item.text}</label>
                    </div>
                ))}
                <form onSubmit={e => { e.preventDefault(); handleAddChecklistItem(name, newItemText); setNewItemText(''); }} className="flex gap-2 mt-10">
                    <input value={newItemText} onChange={e => setNewItemText(e.target.value)} placeholder={placeholder} />
                    <button type='submit' className="btn btn-sm w-auto">Add</button>
                </form>
            </div>
        );
    };

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('tripPlanner')}>
                    <ArrowLeftIcon />
                </button>
                <h2>Journal: {trip.name}</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    <h3>Checklists</h3>
                    <div className="hub-grid" style={{alignItems: 'flex-start'}}>
                        <Checklist list={trip.chores} name='chores' title='To-Do Before Trip' />
                        <Checklist list={trip.shoppingItems} name='shoppingItems' title='Shopping List' />
                        <Checklist list={trip.packingList as any} name='packingList' title='Packing List' />
                    </div>
                </section>
                <section className="card">
                    <h3>Journal Entries</h3>
                    <div className="flex flex-col gap-2 mb-20">
                        <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={3} placeholder="Add a new journal entry..." />
                        <button onClick={handleAddNote} className="btn w-auto" style={{alignSelf: 'flex-end'}}>Add Note</button>
                    </div>
                    {trip.journal.map(entry => (
                        <div key={entry.id} className="list-item" style={{display: 'block'}}>
                            <p>{entry.content}</p>
                            <p className="text-sm text-light">{`by ${getProfileName(entry.authorId)} on ${new Date(entry.timestamp).toLocaleString()}`}</p>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
