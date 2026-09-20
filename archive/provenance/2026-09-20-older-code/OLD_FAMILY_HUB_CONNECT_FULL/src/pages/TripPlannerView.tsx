

import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { Trip, TripMode, FamilyEvent, ShoppingListItem } from '../types';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

interface TripPlannerViewProps {
    trips: Trip[];
    addTrip: (trip: Omit<Trip, 'id'|'family_id'>) => Promise<any>;
    updateTrip: (id: string, updates: Partial<Trip>) => Promise<any>;
    deleteTrip: (id: string) => Promise<any>;
    addShoppingListItem: (item: Omit<ShoppingListItem, 'id'|'family_id'>) => Promise<any>;
    addEvent: (event: Omit<FamilyEvent, 'id'|'family_id'|'google_event_id'>) => Promise<any>;
    onNavigateToJournal: (tripId: string) => void;
}

export default function TripPlannerView({ trips, addTrip, updateTrip, deleteTrip, addShoppingListItem, addEvent, onNavigateToJournal }: TripPlannerViewProps) {
    const { onNavigate, currentViewingProfile } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

    const openModal = (trip?: Trip) => {
        setEditingTrip(trip || null);
        setIsModalOpen(true);
    };

    const handleSave = async (data: Partial<Omit<Trip, 'id'|'family_id'>>) => {
        if (!data.name || !data.startDate || !data.endDate) {
            alert("Name, start date, and end date are required.");
            return;
        }
        
        if (editingTrip) {
            await updateTrip(editingTrip.id, data);
        } else {
            const newTripData: Omit<Trip, 'id'|'family_id'> = {
                name: data.name,
                destination: data.destination || '',
                startDate: data.startDate,
                endDate: data.endDate,
                modeOfTransport: data.modeOfTransport || 'Driving',
                chores: [],
                shoppingItems: [],
                packingList: [],
                journal: []
            };
            const newTrip = await addTrip(newTripData);
            if (newTrip && currentViewingProfile) {
                await addEvent({
                    title: `Trip: ${newTrip.name}`,
                    date: newTrip.startDate,
                    endDate: newTrip.endDate,
                    createdBy: currentViewingProfile.id,
                    tripId: newTrip.id
                });
            }
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this trip?")) {
            await deleteTrip(id);
        }
    };

    const TripForm: React.FC<{ onSave: (data: Partial<Omit<Trip, 'id'|'family_id'>>) => void }> = ({ onSave }) => {
        const [name, setName] = useState(editingTrip?.name || '');
        const [destination, setDestination] = useState(editingTrip?.destination || '');
        const [startDate, setStartDate] = useState(editingTrip?.startDate || '');
        const [endDate, setEndDate] = useState(editingTrip?.endDate || '');
        const [mode, setMode] = useState<TripMode>(editingTrip?.modeOfTransport || 'Driving');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave({ name, destination, startDate, endDate, modeOfTransport: mode });
        };
        
        return React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Trip Name', React.createElement('input', {value: name, onChange: e => setName(e.target.value), style: styles.input, required: true}))),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Destination', React.createElement('input', {value: destination, onChange: e => setDestination(e.target.value), style: styles.input}))),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Start Date', React.createElement('input', {type: 'date', value: startDate, onChange: e => setStartDate(e.target.value), style: styles.input, required: true}))),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'End Date', React.createElement('input', {type: 'date', value: endDate, onChange: e => setEndDate(e.target.value), style: styles.input, required: true}))),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Mode of Transport', 
                React.createElement('select', {value: mode, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setMode(e.target.value as TripMode), style: styles.selectInput} as React.HTMLProps<HTMLSelectElement>,
                    ['Driving', 'Flying', 'Train', 'Bus'].map(m => React.createElement('option', {key: m, value: m}, m))
                )
            )),
            React.createElement('div', {style: styles.modalActions}, React.createElement('button', {type: 'submit', style: styles.button}, 'Save Trip'))
        );
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('h2', { style: styles.pageHeader }, "✈️ Trip Planner"),
            React.createElement('button', { style: { ...styles.button, width: 'auto', marginBottom: '20px' }, onClick: () => openModal() }, "+ Plan a New Trip"),
            trips.length > 0 ? (
                React.createElement('div', { style: { display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' } },
                    trips.map(trip => (
                        React.createElement('div', { key: trip.id, style: styles.tripCard },
                            React.createElement('h3', { style: styles.tripCardTitle }, trip.name),
                            React.createElement('p', { style: styles.tripCardDetails }, `Destination: ${trip.destination}`),
                            React.createElement('p', { style: styles.tripCardDetails }, `Dates: ${trip.startDate} to ${trip.endDate}`),
                            React.createElement('div', { style: styles.tripCardActions },
                                React.createElement('button', { style: { ...styles.button, flex: 1 }, onClick: () => onNavigateToJournal(trip.id) }, "View Journal"),
                                React.createElement('button', { style: { ...styles.button, ...styles.buttonSecondary }, onClick: () => openModal(trip) }, "Edit"),
                                React.createElement('button', { style: { ...styles.button, ...styles.buttonDanger }, onClick: () => handleDelete(trip.id) }, "Delete")
                            )
                        )
                    ))
                )
            ) : (
                React.createElement(EmptyState, { icon: '✈️', title: 'No Trips Planned', message: 'Time for a vacation? Plan your next family adventure here!' })
            ),
            isModalOpen && React.createElement(Modal, { isOpen: true, onClose: () => setIsModalOpen(false), title: editingTrip ? "Edit Trip" : "Plan a New Trip", children: React.createElement(TripForm, { onSave: handleSave }) })
        )
    );
}
