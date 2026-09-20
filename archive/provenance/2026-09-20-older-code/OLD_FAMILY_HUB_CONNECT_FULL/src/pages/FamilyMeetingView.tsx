
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { FamilyMeeting, AgendaItem, ActionItem } from '../types';
import Modal from '../components/ui/Modal';
import { uniqueId } from '../utils/utils';

export default function FamilyMeetingView() {
    const { 
        familyMeetings, addFamilyMeeting, updateFamilyMeeting, deleteFamilyMeeting,
        currentViewingProfile, profiles, getProfileName
    } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<FamilyMeeting | null>(null);

    const openModal = (meeting?: FamilyMeeting) => {
        setEditingMeeting(meeting || null);
        setIsModalOpen(true);
    };

    const handleSave = (data: Partial<FamilyMeeting>) => {
        if (editingMeeting) {
            updateFamilyMeeting(editingMeeting.id, data);
        } else {
            addFamilyMeeting(data as Omit<FamilyMeeting, 'id'>);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure?")) {
            deleteFamilyMeeting(id);
        }
    };
    
    const MeetingForm: React.FC<{onSave: (data: Partial<FamilyMeeting>) => void}> = ({onSave}) => {
        const [title, setTitle] = useState(editingMeeting?.title || '');
        const [date, setDate] = useState(editingMeeting?.date || '');
        const [time, setTime] = useState(editingMeeting?.time || '');
        
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave({
                title, date, time, 
                agenda: editingMeeting?.agenda || [],
                actionItems: editingMeeting?.actionItems || [],
            });
        };
        
        return React.createElement('form', {onSubmit: handleSubmit},
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Title'), React.createElement('input', {value: title, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), style: styles.input})),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Date'), React.createElement('input', {type: 'date', value: date, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value), style: styles.input})),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', null, 'Time'), React.createElement('input', {type: 'time', value: time, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value), style: styles.input})),
            React.createElement('button', {type: 'submit', style: styles.button}, 'Save Meeting')
        )
    };

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('h2', { style: styles.pageHeader }, "👨‍👩‍👧‍👦 Family Meetings"),
        React.createElement('button', {onClick: () => openModal(), style: {...styles.button, width: 'auto'}}, '+ Schedule Meeting'),
        
        React.createElement('div', {style: {marginTop: '20px'}},
            familyMeetings.map(meeting => (
                React.createElement('div', {key: meeting.id, style: styles.section},
                    React.createElement('h3', {style: styles.sectionTitle}, meeting.title),
                    React.createElement('p', null, `Scheduled for ${meeting.date} at ${meeting.time}`),
                    React.createElement('button', {onClick: () => openModal(meeting), style: {...styles.button, ...styles.buttonSecondary, width: 'auto'}}, 'Edit Details'),
                    React.createElement('button', {onClick: () => handleDelete(meeting.id), style: {...styles.button, ...styles.buttonDanger, width: 'auto', marginLeft: '10px'}}, 'Delete')
                )
            ))
        ),
        
        isModalOpen && React.createElement(Modal, {
            isOpen: true,
            onClose: () => setIsModalOpen(false),
            title: 'Schedule Meeting', 
            children: React.createElement(MeetingForm, {onSave: handleSave})
        })
    );
}
