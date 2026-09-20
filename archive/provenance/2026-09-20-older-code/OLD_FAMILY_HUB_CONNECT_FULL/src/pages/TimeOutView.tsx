
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { Infraction, ConsequenceType } from '../types';

export default function TimeOutView({ onBack }: { onBack: () => void }) {
    const { profiles, currentViewingProfile, addInfraction } = useAppContext();
    const [childId, setChildId] = useState('');
    const [reason, setReason] = useState('');
    const [consequenceType, setConsequenceType] = useState<ConsequenceType>('time_out');
    const [consequenceValue, setConsequenceValue] = useState('');
    const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

    const childProfiles = profiles.filter(p => p.role === 'child');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!childId || !reason || !consequenceType || !consequenceValue) {
            alert('Please fill out all required fields.');
            return;
        }

        if (!currentViewingProfile) {
             alert('Could not identify the user creating the infraction.');
            return;
        }

        const newInfraction: Omit<Infraction, 'id' | 'family_id' | 'created_at' | 'completed_at' | 'evidence_urls'> = {
            child_id: childId,
            created_by: currentViewingProfile.id,
            reason,
            consequence_type: consequenceType,
            consequence_value: consequenceValue,
            status: 'active'
        };
        
        await addInfraction(newInfraction, evidenceFile || undefined);
        onBack();
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', { onClick: onBack, style: { ...styles.backButton, float: 'left' } }, "← Back"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "⏳ Create Infraction"),
            React.createElement('form', { onSubmit: handleSubmit, style: styles.section },
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { style: styles.label }, 'Child'),
                    React.createElement('select', { value: childId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setChildId(e.target.value), style: styles.selectInput, required: true },
                        React.createElement('option', { value: '' }, 'Select a child...'),
                        childProfiles.map(p => React.createElement('option', { key: p.id, value: p.id }, p.name))
                    )
                ),
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { style: styles.label }, 'Reason for Infraction'),
                    React.createElement('input', { value: reason, onChange: e => setReason(e.target.value), style: styles.input, required: true })
                ),
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { style: styles.label }, 'Consequence Type'),
                    React.createElement('select', { value: consequenceType, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setConsequenceType(e.target.value as ConsequenceType), style: styles.selectInput, required: true },
                        React.createElement('option', { value: 'time_out' }, 'Time Out'),
                        React.createElement('option', { value: 'restriction' }, 'Restriction'),
                        React.createElement('option', { value: 'hearing_request' }, 'Request Family Court Hearing')
                    )
                ),
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { style: styles.label }, 'Consequence Details'),
                    React.createElement('input', { value: consequenceValue, onChange: e => setConsequenceValue(e.target.value), style: styles.input, required: true, placeholder: consequenceType === 'time_out' ? 'e.g., 15 minutes' : 'e.g., No TV for one day' })
                ),
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { style: styles.label }, 'Evidence (optional)'),
                    React.createElement('input', { type: 'file', accept: 'image/*', onChange: e => setEvidenceFile(e.target.files ? e.target.files[0] : null), style: styles.input })
                ),
                React.createElement('button', { type: 'submit', style: styles.button }, 'Create Infraction')
            )
        )
    );
}
