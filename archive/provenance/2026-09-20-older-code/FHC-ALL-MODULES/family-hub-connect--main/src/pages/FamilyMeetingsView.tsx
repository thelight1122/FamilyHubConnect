
import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ArrowLeftIcon, BottomNavbar, Modal } from '../components.tsx';
import type { FamilyMeeting } from '../types.ts';

const MeetingForm = ({ onSave, editingMeeting, onClose }: { onSave: (data: Partial<FamilyMeeting>) => void, editingMeeting: FamilyMeeting | null, onClose: () => void }) => {
    const [title, setTitle] = useState(editingMeeting?.title || '');
    const [date, setDate] = useState(editingMeeting?.date || '');
    const [time, setTime] = useState(editingMeeting?.time || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, date, time });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group"><label htmlFor="meet-title">Title</label><input id="meet-title" value={title} onChange={e => setTitle(e.target.value)} required /></div>
            <div className="form-group"><label htmlFor="meet-date">Date</label><input id="meet-date" type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
            <div className="form-group"><label htmlFor="meet-time">Time</label><input id="meet-time" type="time" value={time} onChange={e => setTime(e.target.value)} required /></div>
            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn">Save Meeting</button>
            </div>
        </form>
    );
};


const FamilyMeetingsView = () => {
    const { onNavigate, onSavePersonalization, addToast } = useAppDispatch();
    const { personalizationData } = useAppState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<FamilyMeeting | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);

    const familyMeetings = personalizationData.familyMeetings || [];

    const openModal = (meeting?: FamilyMeeting) => {
        setEditingMeeting(meeting || null);
        setIsModalOpen(true);
    };

    const handleSave = (data: Partial<FamilyMeeting>) => {
        let newMeetings;
        if (editingMeeting) {
            newMeetings = familyMeetings.map(m => m.id === editingMeeting.id ? { ...m, ...data } : m);
            addToast("Meeting updated!", 'badge');
        } else {
            const newMeeting = { ...data, id: `meet_${Date.now()}`, agenda: [], actionItems: [] } as FamilyMeeting;
            newMeetings = [...familyMeetings, newMeeting];
            addToast("Meeting scheduled!", 'badge');
        }
        onSavePersonalization({ familyMeetings: newMeetings });
        setIsModalOpen(false);
    };

    const confirmDelete = (id: string) => {
        setMeetingToDelete(id);
        setShowConfirm(true);
    };

    const handleDelete = () => {
        if (!meetingToDelete) return;
        const newMeetings = familyMeetings.filter(m => m.id !== meetingToDelete);
        onSavePersonalization({ familyMeetings: newMeetings });
        addToast("Meeting deleted.", 'info');
        setShowConfirm(false);
        setMeetingToDelete(null);
    };

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('familyMatters')}>
                    <ArrowLeftIcon />
                </button>
                <h2>👨‍👩‍👧‍👦 Family Meetings</h2>
                <div className="header-placeholder"></div>
            </header>
            <main className="main">
                <button onClick={() => openModal()} className="btn w-auto mb-20">+ Schedule Meeting</button>
                
                <div className="meeting-list">
                    {familyMeetings.length > 0 ? (
                        familyMeetings.map(meeting => (
                            <div key={meeting.id} className="card">
                                <h3>{meeting.title}</h3>
                                <p>{`Scheduled for ${new Date(meeting.date).toLocaleDateString()} at ${meeting.time}`}</p>
                                <div className="card-actions">
                                    <button onClick={() => openModal(meeting)} className="btn btn-secondary btn-sm">Edit Details</button>
                                    <button onClick={() => confirmDelete(meeting.id)} className="btn btn-danger btn-sm">Delete</button>
                                </div>
                            </div>
                        ))
                    ) : <div className="card"><p>No meetings scheduled. Time to plan one!</p></div>}
                </div>
                
                {isModalOpen && (
                    <Modal onClose={() => setIsModalOpen(false)} title={editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}>
                        <MeetingForm onSave={handleSave} editingMeeting={editingMeeting} onClose={() => setIsModalOpen(false)} />
                    </Modal>
                )}
                {showConfirm && (
                    <Modal onClose={() => setShowConfirm(false)} title="Confirm Deletion">
                        <p>Are you sure you want to delete this meeting?</p>
                        <div className="form-actions">
                            <button onClick={() => setShowConfirm(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={handleDelete} className="btn btn-danger">Yes, Delete</button>
                        </div>
                    </Modal>
                )}
            </main>
            <BottomNavbar activePage="familyMeeting" onNavigate={onNavigate} />
        </div>
    );
};

export default FamilyMeetingsView;