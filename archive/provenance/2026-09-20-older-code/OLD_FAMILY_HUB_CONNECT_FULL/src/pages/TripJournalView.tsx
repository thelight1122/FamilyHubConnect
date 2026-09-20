

import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { Trip, ChecklistItem, TripJournalEntry } from '../types';
import { uniqueId } from '../utils/utils';

interface TripJournalViewProps {
    activeTripId: string | null;
    trips: Trip[];
    updateTrip: (id: string, updates: Partial<Trip>) => Promise<any>;
}

export default function TripJournalView({ activeTripId, trips, updateTrip }: TripJournalViewProps) {
    const { onNavigate, getProfileName, currentViewingProfile } = useAppContext();
    const [newNote, setNewNote] = useState('');

    const trip = useMemo(() => trips.find(t => t.id === activeTripId), [trips, activeTripId]);

    const handleUpdateChecklist = (listName: 'chores' | 'shoppingItems' | 'packingList', itemId: string, completed: boolean) => {
        if (!trip) return;
        const listKey = listName === 'packingList' ? 'packed' : 'completed';
        const updatedList = trip[listName].map(item =>
            item.id === itemId ? { ...item, [listKey]: completed } : item
        );
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
            id: uniqueId(),
            type: 'note',
            timestamp: Date.now(),
            content: newNote.trim(),
            authorId: currentViewingProfile.id
        };
        updateTrip(trip.id, { journal: [...trip.journal, newEntry] });
        setNewNote('');
    };

    if (!trip) {
        return React.createElement('div', { style: styles.loadingMessage }, 'Trip not found. ', React.createElement('a', {href: '#', onClick: () => onNavigate('tripPlanner')}, 'Go back to planner.'));
    }

    const Checklist: React.FC<{ list: ChecklistItem[], name: 'chores'|'shoppingItems'|'packingList', title: string }> = ({ list, name, title }) => {
        const [newItemText, setNewItemText] = useState('');
        const itemKey = name === 'packingList' ? 'packed' : 'completed';
        const placeholder = name === 'packingList' ? 'e.g., Toothbrush' : name === 'shoppingItems' ? 'e.g., Sunscreen' : 'e.g., Water plants';
        
        return React.createElement('div', {style: styles.tripChecklistSection},
            React.createElement('h4', {style: styles.tripChecklistTitle}, title),
            list.map(item => React.createElement('div', {key: item.id, style: styles.tripChecklistItem},
                React.createElement('input', {type: 'checkbox', checked: (item as any)[itemKey], onChange: e => handleUpdateChecklist(name, item.id, (e.target as HTMLInputElement).checked)} as React.HTMLProps<HTMLInputElement>),
                React.createElement('label', {style: {textDecoration: (item as any)[itemKey] ? 'line-through' : 'none'}}, item.text)
            )),
            React.createElement('form', {onSubmit: e => { e.preventDefault(); handleAddChecklistItem(name, newItemText); setNewItemText(''); }, style: {display: 'flex', gap: '5px', marginTop: '10px'}} as React.HTMLProps<HTMLFormElement>,
                React.createElement('input', {value: newItemText, onChange: e => setNewItemText((e.target as HTMLInputElement).value), style: styles.tripChecklistInput, placeholder: placeholder} as React.HTMLProps<HTMLInputElement>),
                React.createElement('button', {type: 'submit', style: {...styles.button, width: 'auto'}}, 'Add')
            )
        );
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', { onClick: () => onNavigate('tripPlanner'), style: { ...styles.backButton, float: 'left' } }, "← All Trips"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, `Journal: ${trip.name}`),

            React.createElement('section', { style: styles.section },
                React.createElement('h3', { style: styles.sectionTitle }, "Checklists"),
                React.createElement('div', {style: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}},
                    React.createElement(Checklist, {list: trip.chores, name: 'chores', title: 'To-Do Before Trip'}),
                    React.createElement(Checklist, {list: trip.shoppingItems, name: 'shoppingItems', title: 'Shopping List'}),
                    React.createElement(Checklist, {list: trip.packingList as any, name: 'packingList', title: 'Packing List'}),
                )
            ),

            React.createElement('section', { style: styles.section },
                React.createElement('h3', { style: styles.sectionTitle }, "Journal Entries"),
                React.createElement('div', {style: {display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px'}},
                    React.createElement('textarea', {value: newNote, onChange: e => setNewNote((e.target as HTMLTextAreaElement).value), style: styles.textarea, rows: 3, placeholder: "Add a new journal entry..."} as React.HTMLProps<HTMLTextAreaElement>),
                    React.createElement('button', {onClick: handleAddNote, style: {...styles.button, width: 'auto', alignSelf: 'flex-end'}}, 'Add Note')
                ),
                trip.journal.map(entry => (
                    React.createElement('div', {key: entry.id, style: styles.listItem}, 
                        React.createElement('div', null,
                            React.createElement('p', {style: {margin: 0}}, entry.content),
                            React.createElement('p', {style: {margin: '5px 0 0 0', fontSize: '0.8em', color: '#666'}}, `by ${getProfileName(entry.authorId)} on ${new Date(entry.timestamp).toLocaleString()}`)
                        )
                    )
                ))
            )
        )
    );
}
