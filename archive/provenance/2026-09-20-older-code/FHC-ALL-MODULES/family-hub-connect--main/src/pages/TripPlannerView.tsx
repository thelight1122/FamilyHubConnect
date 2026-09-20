

import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import type { Trip, TripMode, FamilyEvent, ShoppingListItem } from '../types';
import { Modal, EmptyState, ArrowLeftIcon } from '../components';

export default function TripPlannerView() {
    const { trips } = useAppState();
    const { addTrip, updateTrip, deleteTrip, onNavigate } = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

    const onNavigateToJournal = (tripId: string) => {
        // This should be handled by a context method if it needs to set global state
        console.log("Navigating to journal for trip:", tripId);
        onNavigate('tripJournal'); // Assuming tripJournal view can get the active trip ID from context
    };

    const openModal = (trip?: Trip) => {
        setEditingTrip(trip || null);
        setIsModalOpen(true);
    };

    const handleSave = async (data: Partial<Omit<Trip, 'id' | 'family_id'>>) => {
        if (!data.name || !data.startDate || !data.endDate) {
            alert("Name, start date, and end date are required.");
            return;
        }
        
        if (editingTrip) {
            await updateTrip(editingTrip.id, data);
        } else {
            const newTripData: Omit<Trip, 'id' | 'family_id'> = {
                name: data.name,
                destination: data.destination || '',
                startDate: data.startDate,
                endDate: data.endDate,
                modeOfTransport: data.modeOfTransport || 'Driving',
                chores: [],
                shoppingItems: [],
                packingList: [],
                journal: [],
            };
            await addTrip(newTripData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this trip?")) {
            await deleteTrip(id);
        }
    };

    const TripForm: React.FC<{ onSave: (data: Partial<Omit<Trip, 'id' | 'family_id'>>) => void }> = ({ onSave }) => {
        const [name, setName] = useState(editingTrip?.name || '');
        const [destination, setDestination] = useState(editingTrip?.destination || '');
        const [startDate, setStartDate] = useState(editingTrip?.startDate || '');
        const [endDate, setEndDate] = useState(editingTrip?.endDate || '');
        const [mode, setMode] = useState<TripMode>(editingTrip?.modeOfTransport || 'Driving');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave({ name, destination, startDate, endDate, modeOfTransport: mode });
        };
        
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Trip Name<input value={name} onChange={e => setName(e.target.value)} required /></label></div>
                <div className="form-group"><label>Destination<input value={destination} onChange={e => setDestination(e.target.value)} /></label></div>
                <div className="form-group"><label>Start Date<input type='date' value={startDate} onChange={e => setStartDate(e.target.value)} required /></label></div>
                <div className="form-group"><label>End Date<input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} required /></label></div>
                <div className="form-group">
                    <label>Mode of Transport
                        <select value={mode} onChange={(e) => setMode(e.target.value as TripMode)}>
                            {['Driving', 'Flying', 'Train', 'Bus'].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </label>
                </div>
                <div className="form-actions"><button type='submit' className="btn">Save Trip</button></div>
            </form>
        );
    };

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>✈️ Trip Planner</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <button className="btn w-auto mb-20" onClick={() => openModal()}>+ Plan a New Trip</button>
                {trips.length > 0 ? (
                    <div className="hub-grid">
                        {trips.map(trip => (
                            <div key={trip.id} className="card">
                                <h3>{trip.name}</h3>
                                <p>Destination: {trip.destination}</p>
                                <p>Dates: {trip.startDate} to {trip.endDate}</p>
                                <div className="card-actions">
                                    <button className="btn" onClick={() => onNavigateToJournal(trip.id)}>View Journal</button>
                                    <button className="btn btn-secondary" onClick={() => openModal(trip)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(trip.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState icon='✈️' title='No Trips Planned' message='Time for a vacation? Plan your next family adventure here!' />
                )}
            </main>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTrip ? "Edit Trip" : "Plan a New Trip"}>
                <TripForm onSave={handleSave} />
            </Modal>
        </div>
    );
}
