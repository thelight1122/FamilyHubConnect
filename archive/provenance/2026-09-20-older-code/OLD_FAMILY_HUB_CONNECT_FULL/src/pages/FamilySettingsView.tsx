import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { PersonalizationData, Profile, AdultDetailForm, ChildDetailForm } from '../types';

export default function FamilySettingsView({ onSave }: { onSave: (data: Partial<PersonalizationData>) => void }) {
    const { personalizationData, profiles, updateProfile, onNavigate } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [localProfiles, setLocalProfiles] = useState(profiles);
    const [location, setLocation] = useState(personalizationData?.location || '');

    const handleProfileChange = (id: string, field: keyof Profile, value: string | number) => {
        setLocalProfiles(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleSaveChanges = async () => {
        for (const profile of localProfiles) {
            const originalProfile = profiles.find(p => p.id === profile.id);
            if (JSON.stringify(profile) !== JSON.stringify(originalProfile)) {
                await updateProfile(profile.id, profile);
            }
        }
        if (location !== personalizationData?.location) {
            await onSave({ location });
        }
        setIsEditing(false);
    };

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', {
            onClick: () => onNavigate('settings'),
            style: { ...styles.backButton, float: 'left' },
            'aria-label': "Back to Settings"
        }, "← Back to Settings"),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "👨‍👩‍👧‍👦 Family Settings"),

        React.createElement('section', { style: styles.section },
            React.createElement('div', {style: {display: 'flex', justifyContent: 'space-between', alignItems: 'center'}},
                React.createElement('h3', { style: styles.sectionTitle }, "Family Members"),
                !isEditing && React.createElement('button', {onClick: () => setIsEditing(true), style: {...styles.button, width: 'auto'}}, 'Edit'),
            ),
            localProfiles.map(profile => (
                React.createElement('div', { key: profile.id, style: styles.listItem },
                    isEditing ?
                        React.createElement('input', {
                            value: profile.name,
                            onChange: e => handleProfileChange(profile.id, 'name', e.target.value),
                            style: {...styles.input, width: '150px'}
                        }) :
                        React.createElement('strong', null, profile.name),
                    isEditing && profile.role === 'child' ? 
                        React.createElement('input', {
                            type: 'number',
                            value: profile.age || '',
                             onChange: e => handleProfileChange(profile.id, 'age', parseInt(e.target.value) || 0),
                             style: {...styles.input, width: '80px'}
                        }) : 
                        React.createElement('span', null, `${profile.role} ${profile.age ? `(Age ${profile.age})` : ''}`),
                    isEditing ?
                        React.createElement('select', {value: profile.status || 'active', onChange: (e: React.ChangeEvent<HTMLSelectElement>) => handleProfileChange(profile.id, 'status', e.target.value), style: styles.selectInput},
                           React.createElement('option', {value: 'active'}, 'Active'),
                           React.createElement('option', {value: 'disabled'}, 'Disabled')
                        )
                        : null
                )
            )),
             React.createElement('div', { style: styles.formGroup, marginTop: isEditing ? '20px' : '0' },
                React.createElement('label', {htmlFor: 'location', style: styles.label}, 'Location (for Weather):'),
                isEditing ? React.createElement('input', {
                    id: 'location',
                    value: location,
                    onChange: e => setLocation(e.target.value),
                    style: styles.input,
                    placeholder: 'e.g., San Francisco, CA'
                }) : React.createElement('p', null, location || 'Not set')
            ),
            isEditing && React.createElement('button', {onClick: handleSaveChanges, style: {...styles.button, marginTop: '10px'}}, 'Save Changes')
        )
    );
}
