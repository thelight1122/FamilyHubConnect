
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { ActivityClub, FamilyEvent, FamilyMessage, ClubRosterMember } from '../types';
import Modal from '../components/ui/Modal';
import { uniqueId } from '../utils/utils';

interface ActivityClubDetailViewProps {
    activeClubId: string | null;
    addEvent: (event: Omit<FamilyEvent, 'id' | 'family_id' | 'google_event_id'>) => Promise<any>;
    addMessage: (message: Omit<FamilyMessage, 'id' | 'family_id'>) => Promise<any>;
    onBack: () => void;
}

export default function ActivityClubDetailView({ activeClubId, addEvent, addMessage, onBack }: ActivityClubDetailViewProps) {
    const { activityClubs, updateActivityClub, profiles, currentViewingProfile, getProfileName } = useAppContext();
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

    const isMember = useMemo(() => {
        return club?.roster.some(m => m.profileId === currentViewingProfile?.id);
    }, [club, currentViewingProfile]);

    if (!club || !currentViewingProfile) {
        return React.createElement('div', {style: styles.loadingMessage}, 'Loading club...');
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
    
    const renderTabContent = () => {
        switch(activeTab) {
            case 'roster':
                return React.createElement('div', null,
                    React.createElement('button', { style: { ...styles.button, width: 'auto', marginBottom: '10px' }, onClick: () => setShowRosterModal(true) }, "+ Add Member"),
                    club.roster.map(member => (
                        React.createElement('div', { key: member.profileId, style: styles.listItem },
                            React.createElement('span', null, getProfileName(member.profileId)),
                            React.createElement('span', { style: { color: '#666' } }, member.role)
                        )
                    ))
                );
            case 'calendar':
                 return React.createElement('div', null,
                    React.createElement('button', { style: { ...styles.button, width: 'auto', marginBottom: '10px' }, onClick: () => setShowEventModal(true) }, "+ Add Event"),
                    [...club.calendar].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                        React.createElement('div', { key: event.id, style: styles.listItem },
                           `${event.date}: ${event.title}`
                        )
                    ))
                );
            case 'messages':
                return React.createElement('div', null,
                     React.createElement('div', { style: { maxHeight: '300px', overflowY: 'auto', marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' } },
                        club.messages.map(msg => (
                           React.createElement('div', { key: msg.id, style: { marginBottom: '8px' } },
                                React.createElement('strong', null, `${msg.authorName}: `),
                                msg.text
                           )
                        ))
                    ),
                    React.createElement('div', { style: { display: 'flex', gap: '5px' } },
                        React.createElement('input', { value: newMessageText, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewMessageText(e.target.value), style: styles.input, placeholder: 'Type a message...' }),
                        React.createElement('button', { onClick: handleAddMessage, style: { ...styles.button, width: 'auto' } }, "Send")
                    )
                );
            case 'requests':
                return React.createElement('div', null,
                    React.createElement('button', { style: { ...styles.button, width: 'auto', marginBottom: '10px' }, onClick: () => setShowRequestModal(true) }, "+ Request Equipment"),
                    club.equipmentRequests.map(req => (
                        React.createElement('div', { key: req.id, style: styles.listItem },
                            `${req.itemName} (requested by ${getProfileName(req.requestedBy)})`,
                            React.createElement('span', { style: { padding: '3px 8px', borderRadius: '12px', backgroundColor: req.status === 'approved' ? '#28a745' : req.status === 'denied' ? '#dc3545' : '#ffc107', color: 'white', fontSize: '0.8em' } }, req.status)
                        )
                    ))
                );
            default: return null;
        }
    };

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', { onClick: onBack, style: { ...styles.backButton, float: 'left' } }, "← Back to The Locker Room"),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, club.name),
        React.createElement('p', { style: { textAlign: 'center', marginTop: '-15px' } }, club.description),

        React.createElement('div', { style: styles.meetingTabs },
            React.createElement('button', { style: activeTab === 'roster' ? {...styles.meetingTab, ...styles.meetingTabActive} : styles.meetingTab, onClick: () => setActiveTab('roster')}, 'Roster'),
            React.createElement('button', { style: activeTab === 'calendar' ? {...styles.meetingTab, ...styles.meetingTabActive} : styles.meetingTab, onClick: () => setActiveTab('calendar')}, 'Calendar'),
            React.createElement('button', { style: activeTab === 'messages' ? {...styles.meetingTab, ...styles.meetingTabActive} : styles.meetingTab, onClick: () => setActiveTab('messages')}, 'Messages'),
            React.createElement('button', { style: activeTab === 'requests' ? {...styles.meetingTab, ...styles.meetingTabActive} : styles.meetingTab, onClick: () => setActiveTab('requests')}, 'Equipment Requests'),
        ),
        
        React.createElement('div', null, renderTabContent()),
        
        showRosterModal && React.createElement(Modal, {isOpen: true, onClose: () => setShowRosterModal(false), title: 'Add Member to Roster', children: 
            React.createElement('div', null,
                React.createElement('select', {value: selectedProfileId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProfileId(e.target.value), style: styles.selectInput} as React.HTMLProps<HTMLSelectElement>,
                    React.createElement('option', {value: ''}, 'Select a profile...'),
                    profiles.map(p => React.createElement('option', {key: p.id, value: p.id}, p.name))
                ),
                React.createElement('button', {style: {...styles.button, marginTop: '10px'}, onClick: handleAddMember}, 'Add Member')
            )
        }),
        showEventModal && React.createElement(Modal, {isOpen: true, onClose: () => setShowEventModal(false), title: 'Add Club Event', children: 
            React.createElement('div', null,
                 React.createElement('input', { value: eventTitle, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEventTitle(e.target.value), style: styles.input, placeholder: 'Event Title' }),
                 React.createElement('input', { type: 'date', value: eventDate, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEventDate(e.target.value), style: {...styles.input, marginTop: '10px'} }),
                React.createElement('button', {style: {...styles.button, marginTop: '10px'}, onClick: handleAddEvent}, 'Add Event')
            )
        }),
        showRequestModal && React.createElement(Modal, {isOpen: true, onClose: () => setShowRequestModal(false), title: 'Request Equipment', children: 
            React.createElement('div', null,
                 React.createElement('input', { value: requestItemName, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRequestItemName(e.target.value), style: styles.input, placeholder: 'e.g., New cleats, size 5' }),
                React.createElement('button', {style: {...styles.button, marginTop: '10px'}, onClick: handleAddRequest}, 'Submit Request')
            )
        })
    );
}
