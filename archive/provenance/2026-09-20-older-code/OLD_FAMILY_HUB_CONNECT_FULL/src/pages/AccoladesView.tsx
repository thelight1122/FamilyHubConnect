
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { Medal, AwardedMedal, Profile } from '../types';
import Modal from '../components/ui/Modal';

export default function AccoladesView() {
    const { 
        profiles, currentViewingProfile, medals, awardedMedals, 
        addMedal, updateMedal, deleteMedal, addAwardedMedal, getProfileName, onNavigate
    } = useAppContext();

    const [isMedalModalOpen, setIsMedalModalOpen] = useState(false);
    const [editingMedal, setEditingMedal] = useState<Medal | null>(null);
    const [medalName, setMedalName] = useState('');
    const [medalDescription, setMedalDescription] = useState('');
    const [medalIcon, setMedalIcon] = useState('🏅');
    
    const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
    const [awardingMedal, setAwardingMedal] = useState<Medal | null>(null);
    const [awardToProfileId, setAwardToProfileId] = useState('');
    const [awardReason, setAwardReason] = useState('');

    const openMedalModal = (medal?: Medal) => {
        if (medal) {
            setEditingMedal(medal);
            setMedalName(medal.name);
            setMedalDescription(medal.description);
            setMedalIcon(medal.icon);
        } else {
            setEditingMedal(null);
            setMedalName('');
            setMedalDescription('');
            setMedalIcon('🏅');
        }
        setIsMedalModalOpen(true);
    };

    const handleSaveMedal = () => {
        if (!medalName || !medalDescription || !medalIcon) return;
        const medalData = { name: medalName, description: medalDescription, icon: medalIcon };
        if (editingMedal) {
            updateMedal(editingMedal.id, medalData);
        } else {
            addMedal(medalData);
        }
        setIsMedalModalOpen(false);
    };
    
    const handleDeleteMedal = () => {
        if(editingMedal && window.confirm("Are you sure you want to delete this medal template?")) {
            deleteMedal(editingMedal.id);
            setIsMedalModalOpen(false);
        }
    };

    const openAwardModal = (medal: Medal) => {
        setAwardingMedal(medal);
        setAwardToProfileId('');
        setAwardReason('');
        setIsAwardModalOpen(true);
    };

    const handleAwardMedal = () => {
        if (!awardingMedal || !awardToProfileId || !currentViewingProfile) return;
        const awardedMedalData = { 
            medalId: awardingMedal.id,
            profileId: awardToProfileId,
            awardedBy: currentViewingProfile.id,
            reason: awardReason,
            timestamp: Date.now()
        };
        addAwardedMedal(awardedMedalData);
        setIsAwardModalOpen(false);
    };
    
    const myMedals = awardedMedals.filter(am => am.profileId === currentViewingProfile?.id);
    const childProfiles = profiles.filter(p => p.role === 'child');

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: () => onNavigate('rewards'),
                style: { ...styles.backButton, float: 'left' },
            }, "← Back to Rewards"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "🏅 Medals & Accolades"),

            currentViewingProfile?.role === 'child' && (
                React.createElement('section', { style: styles.section },
                    React.createElement('h3', { style: styles.sectionTitle }, "My Medals"),
                    myMedals.length > 0 ? (
                        myMedals.map(am => {
                            const medal = medals.find(m => m.id === am.medalId);
                            return medal ? React.createElement('div', { key: am.id, style: styles.accoladeItem },
                                React.createElement('span', { style: styles.accoladeIcon }, medal.icon),
                                React.createElement('div', null,
                                    React.createElement('h4', { style: styles.accoladeName }, medal.name),
                                    React.createElement('p', { style: styles.accoladeDescription }, medal.description),
                                    React.createElement('p', { style: styles.accoladeReason }, `Awarded by ${getProfileName(am.awardedBy)} for: ${am.reason}`)
                                )
                            ) : null
                        })
                    ) : React.createElement('p', null, "You haven't been awarded any special medals yet. Keep up the great work!")
                )
            ),

            currentViewingProfile?.role === 'adult' && (
                React.createElement('section', { style: styles.section },
                    React.createElement('h3', { style: styles.sectionTitle }, "Medal Management"),
                    React.createElement('button', { onClick: () => openMedalModal(), style: { ...styles.button, width: 'auto', marginBottom: '15px' } }, "+ Create New Medal"),
                    medals.map(medal => (
                        React.createElement('div', { key: medal.id, style: styles.accoladeItem },
                           React.createElement('span', { style: styles.accoladeIcon }, medal.icon),
                            React.createElement('div', null,
                                React.createElement('h4', { style: styles.accoladeName }, medal.name),
                                React.createElement('p', { style: styles.accoladeDescription }, medal.description)
                            ),
                            React.createElement('div', {style: {marginLeft: 'auto', display: 'flex', gap: '5px'}},
                                React.createElement('button', { onClick: () => openMedalModal(medal), style: { ...styles.button, ...styles.buttonSecondary, width: 'auto'} }, "Edit"),
                                React.createElement('button', { onClick: () => openAwardModal(medal), style: { ...styles.button, ...styles.buttonSuccess, width: 'auto'}}, "Award")
                            )
                        )
                    ))
                )
            ),

            isMedalModalOpen && React.createElement(Modal, {
                isOpen: isMedalModalOpen,
                onClose: () => setIsMedalModalOpen(false),
                title: editingMedal ? "Edit Medal" : "Create Medal",
                children: React.createElement('div', null,
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.label}, 'Medal Name', React.createElement('input', {value: medalName, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMedalName(e.target.value), style: styles.input}))),
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.label}, 'Description', React.createElement('input', {value: medalDescription, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMedalDescription(e.target.value), style: styles.input}))),
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.label}, 'Icon', React.createElement('input', {value: medalIcon, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMedalIcon(e.target.value), style: styles.input}))),
                    React.createElement('div', {style: styles.modalActions}, 
                        editingMedal && React.createElement('button', {onClick: handleDeleteMedal, style: {...styles.button, ...styles.buttonDanger, marginRight: 'auto'}}, 'Delete'),
                        React.createElement('button', {onClick: handleSaveMedal, style: styles.button}, 'Save')
                    )
                )
            }),
            
            isAwardModalOpen && React.createElement(Modal, {
                isOpen: isAwardModalOpen,
                onClose: () => setIsAwardModalOpen(false),
                title: `Award "${awardingMedal?.name}"`,
                children: React.createElement('div', null,
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'awardTo', style: styles.label}, 'Award To', React.createElement('select', {id: 'awardTo', value: awardToProfileId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setAwardToProfileId(e.target.value), style: styles.selectInput},
                        React.createElement('option', {value: ''}, 'Select a child...'),
                        childProfiles.map(p => React.createElement('option', {key: p.id, value: p.id}, p.name))
                    ))),
                    React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'awardReason', style: styles.label}, 'Reason for Award', React.createElement('textarea', {id: 'awardReason', value: awardReason, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setAwardReason(e.target.value), style: styles.textarea, rows: 3}))),
                    React.createElement('div', {style: styles.modalActions}, React.createElement('button', {onClick: handleAwardMedal, style: styles.button}, 'Award Medal'))
                )
            })
        )
    );
}
