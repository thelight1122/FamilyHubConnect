

import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import type { FamilyEvent, FamilyMessage, ClubRosterMember } from '../types.ts';
import { Modal, EmptyState, ArrowLeftIcon, BottomNavbar } from '../components.tsx';
import { uniqueId } from '../utils/utils.ts';

interface ActivityClubDetailViewProps {
    activeClubId: string | null;
    onBack: () => void;
}

export default function ActivityClubDetailView({ activeClubId, onBack }: ActivityClubDetailViewProps) {
    const { updateActivityClub, getProfileName, addEvent, addMessage } = useAppDispatch();
    const { activityClubs, profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const [activeTab, setActiveTab] = useState<'roster' | 'calendar' | 'messages' | 'requests'>('roster');
    
    // Roster state
    const [showRosterModal, setShowRosterModal] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState('');
    
    // Event state
    const [showEventModal, setShowEventModal] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    
    // Message state
    const [newMessageText, setNewMessageText] = useState('');
    
    // Request state
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestItemName, setRequestItemName] = useState('');

    const club = useMemo(() => {
        return activityClubs.find(c => c.id === activeClubId);
    }, [activityClubs, activeClubId]);

    if (!club || !currentViewingProfile) {
        return <div className="page">Loading club...</div>;
    }

    const handleAddMember = async () => {
        if (!selectedProfileId) return;
        const newMember: ClubRosterMember = { profileId: selectedProfileId, role: 'Member' };
        const newRoster = [...club.roster, newMember];
        await updateActivityClub(club.id, { roster: newRoster });
        setShowRosterModal(false);
    };

    const handleAddEvent = async () => {
        if (!eventTitle || !eventDate) return;
        const newEventData = {
            title: eventTitle,
            date: eventDate,
            createdBy: currentViewingProfile.id,
            category: 'club' as const,
            clubId: club.id
        };
        const newEvent = await addEvent(newEventData);
        await updateActivityClub(club.id, { calendar: [...club.calendar, newEvent]});
        setShowEventModal(false);
        setEventTitle('');
        setEventDate('');
    };

    const handleAddMessage = async () => {
        if (!newMessageText.trim()) return;
        const newMessageData = {
            text: newMessageText.trim(),
            authorId: currentViewingProfile.id,
            authorName: currentViewingProfile.name,
            timestamp: Date.now(),
            recipientId: null // Group message
        };
        const newMessage = await addMessage(newMessageData);
        await updateActivityClub(club.id, { messages: [...club.messages, newMessage] });
        setNewMessageText('');
    };
    
    const handleAddRequest = async () => {
        if (!requestItemName.trim()) return;
        const newRequest = {
            id: uniqueId(),
            requestedBy: currentViewingProfile.id,
            itemName: requestItemName.trim(),
            status: 'pending' as const
        };
        await updateActivityClub(club.id, { equipmentRequests: [...club.equipmentRequests, newRequest]});
        setShowRequestModal(false);
        setRequestItemName('');
    };

    const renderRoster = () => (
        <div>
            <button className="btn w-auto mb-20" onClick={() => setShowRosterModal(true)}>+ Add Member</button>
            {club.roster.map(member => (
                <div key={member.profileId} className="list-item">
                    <span>{getProfileName(member.profileId)}</span>
                    <span className="text-light">{member.role}</span>
                </div>
            ))}
        </div>
    );
    
    const renderCalendar = () => (
        <div>
            <button className="btn w-auto mb-20" onClick={() => setShowEventModal(true)}>+ Add Event</button>
            {[...club.calendar].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                <div key={event.id} className="list-item">
                   {`${event.date}: ${event.title}`}
                </div>
            ))}
        </div>
    );
    
    const renderMessages = () => (
            <div className="message-container">
            <div className="message-box">
                {club.messages.map(msg => (
                   <div key={msg.id} className="message-item">
                        <strong>{`${msg.authorName}: `}</strong>
                        {msg.text}
                   </div>
                ))}
            </div>
            <div className="message-input-container">
                <input value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} placeholder="Type a message..." />
                <button onClick={handleAddMessage} className="btn w-auto">Send</button>
            </div>
        </div>
    );

    const renderRequests = () => (
         <div>
            <button className="btn w-auto mb-20" onClick={() => setShowRequestModal(true)}>+ Request Equipment</button>
            {club.equipmentRequests.map(req => (
                <div key={req.id} className="list-item">
                    <span>{`${req.itemName} (requested by ${getProfileName(req.requestedBy)})`}</span>
                    <span className={`request-status ${req.status}`}>
                        {req.status}
                    </span>
                </div>
            ))}
        </div>
    );

    const renderTabContent = () => {
        switch(activeTab) {
            case 'roster': return renderRoster();
            case 'calendar': return renderCalendar();
            case 'messages': return renderMessages();
            case 'requests': return renderRequests();
            default: return null;
        }
    };

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={onBack} title="Go Back">
                    <ArrowLeftIcon />
                </button>
                <h2>{club.name}</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <p className="text-center text-light m-0 mb-20">{club.description}</p>
                 {/* Implement a tab component later */}
                <div className="flex justify-center gap-4 mb-20">
                    <button className={`btn ${activeTab === 'roster' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('roster')}>Roster</button>
                    <button className={`btn ${activeTab === 'calendar' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('calendar')}>Calendar</button>
                    <button className={`btn ${activeTab === 'messages' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('messages')}>Messages</button>
                    <button className={`btn ${activeTab === 'requests' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('requests')}>Requests</button>
                </div>
                
                <div className="card">
                    {renderTabContent()}
                </div>
            </main>
            {showRosterModal && (
                <Modal onClose={() => setShowRosterModal(false)} title="Add Member to Roster">
                    <label htmlFor="profile-select">Select a profile:</label>
                    <select id="profile-select" value={selectedProfileId} onChange={(e) => setSelectedProfileId(e.target.value)}>
                        <option value="">Select a profile...</option>
                        {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <button className="btn mt-10" onClick={handleAddMember}>Add Member</button>
                </Modal>
            )}
            {showEventModal && (
                <Modal onClose={() => setShowEventModal(false)} title="Add Club Event">
                    <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Event Title" />
                    <label htmlFor="event-date" className="sr-only">Event Date</label>
                    <input id="event-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mt-10" placeholder="Select a date" />
                    <button className="btn mt-10" onClick={handleAddEvent}>Add Event</button>
                </Modal>
            )}
            {showRequestModal && (
                <Modal onClose={() => setShowRequestModal(false)} title="Request Equipment">
                    <input value={requestItemName} onChange={(e) => setRequestItemName(e.target.value)} placeholder="e.g., New cleats, size 5" />
                    <button className="btn mt-10" onClick={handleAddRequest}>Submit Request</button>
                </Modal>
            )}
        </div>
    );
}