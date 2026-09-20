import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';

export default function FamilyFoundationsView() {
    const { 
        familyFoundations, onSavePersonalization, currentViewingProfile,
        profiles, getProfileName
    } = useAppContext();
    const [isEditMode, setIsEditMode] = useState(false);
    const [content, setContent] = useState(familyFoundations?.content || '');

    const isAcknowledged = currentViewingProfile && familyFoundations?.acknowledgements[currentViewingProfile.id];
    const isParent = currentViewingProfile?.role === 'adult';
    
    const handleSave = () => {
        onSavePersonalization({ familyFoundations: { ...familyFoundations, content } });
        setIsEditMode(false);
    };

    const handleAcknowledge = () => {
        if (!currentViewingProfile) return;
        const newAcks = { ...(familyFoundations?.acknowledgements || {}), [currentViewingProfile.id]: Date.now() };
        onSavePersonalization({ familyFoundations: { ...familyFoundations, acknowledgements: newAcks } });
    };

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('h2', { style: styles.pageHeader }, "📜 Family Foundations"),
        React.createElement('section', { style: styles.section },
            isEditMode ? 
                React.createElement(React.Fragment, null,
                    React.createElement('textarea', {value: content, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value), style: styles.textarea, rows: 15} as React.HTMLProps<HTMLTextAreaElement>),
                    React.createElement('button', {onClick: handleSave, style: styles.button}, 'Save')
                )
                :
                React.createElement('div', {style: {whiteSpace: 'pre-wrap'}}, familyFoundations?.content || "No constitution written yet."),
            
            isParent && !isEditMode && React.createElement('button', {onClick: () => setIsEditMode(true), style: {...styles.button, width: 'auto', marginTop: '10px'}}, 'Edit'),
            
            !isAcknowledged && React.createElement('button', {onClick: handleAcknowledge, style: {...styles.button, backgroundColor: '#28a745', marginTop: '10px'}}, 'Acknowledge & Agree')
        ),
        React.createElement('section', { style: styles.section },
            React.createElement('h3', {style: styles.sectionTitle}, 'Acknowledgements'),
            profiles.map(p => {
                const ackDate = familyFoundations?.acknowledgements[p.id];
                return React.createElement('p', {key: p.id}, `${p.name}: ${ackDate ? `Acknowledged on ${new Date(ackDate).toLocaleDateString()}` : 'Not yet acknowledged'}`)
            })
        )
    );
}
