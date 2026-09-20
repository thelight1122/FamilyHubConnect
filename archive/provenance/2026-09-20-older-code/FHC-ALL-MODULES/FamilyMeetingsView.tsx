import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { FamilyMeeting } from './types';
import { styles } from './styles';

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
            <div style={styles.formGroup}><label htmlFor="meet-title" style={styles.label}>Title</label><input id="meet-title" style={styles.input} value={title} onChange={e => setTitle(e.target.value)} required /></div>
            <div style={styles.formGroup}><label htmlFor="meet-date" style={styles.label}>Date</label><input id="meet-date" type="date" style={styles.input} value={date} onChange={e => setDate(e.target.value)} required /></div>
            <div style={styles.formGroup}><label htmlFor="meet-time" style={styles.label}>Time</label><input id="meet-time" type="time" style={styles.input} value={time} onChange={e => setTime(e.target.value)} required /></div>
            <div style={styles.formActions}>
                <button type="button" onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button type="submit" style={styles.button}>Save Meeting</button>
            </div>
        </form>
    );
};


const FamilyMeetingsView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, addToast } = useAppContext();
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
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                 <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('familyMatters')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>👨‍👩‍👧‍👦 Family Meetings</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <button onClick={() => openModal()} style={{...styles.button, width: 'auto', marginBottom: '20px'}}>+ Schedule Meeting</button>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {familyMeetings.map(meeting => (
                        <div key={meeting.id} style={styles.section}>
                            <h3>{meeting.title}</h3>
                            <p>Scheduled for {new Date(meeting.date).toLocaleDateString()} at {meeting.time}</p>
                            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                                <button onClick={() => openModal(meeting)} style={{...styles.button, ...styles.buttonSecondary, padding: '8px 16px'}}>Edit Details</button>
                                <button onClick={() => confirmDelete(meeting.id)} style={{...styles.button, ...styles.buttonDanger, padding: '8px 16px'}}>Delete</button>
                            </div>
                        </div>
                    ))}
                    {familyMeetings.length === 0 && <div style={styles.section}><p>No meetings scheduled. Time to plan one!</p></div>}
                </div>
                
                {isModalOpen && (
                    <Modal onClose={() => setIsModalOpen(false)} title={editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}>
                        <MeetingForm onSave={handleSave} editingMeeting={editingMeeting} onClose={() => setIsModalOpen(false)} />
                    </Modal>
                )}
                {showConfirm && (
                    <Modal onClose={() => setShowConfirm(false)} title="Confirm Deletion">
                        <p>Are you sure you want to delete this meeting?</p>
                        <div style={styles.formActions}>
                            <button onClick={() => setShowConfirm(false)} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                            <button onClick={handleDelete} style={{...styles.button, ...styles.buttonDanger}}>Yes, Delete</button>
                        </div>
                    </Modal>
                )}
            </main>
            <BottomNavbar activePage="familyMeeting" onNavigate={onNavigate} />
        </div>
    );
};

export default FamilyMeetingsView;