

import React, { useState } from 'react';
import type { Profile, ToastMessage, PageView } from '../types';
import { BADGE_DEFINITIONS } from '../constants/badges';
import { PARENT_THEMES } from '../constants/misc';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';

interface ProfileSettingsViewProps {
    updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<void>;
}

export default function ProfileSettingsView({ updateProfile }: ProfileSettingsViewProps) {
    const { currentViewingProfile, addToast, onNavigate } = useAppContext();
    
    if (!currentViewingProfile) return React.createElement('p', null, 'Loading profile...');

    const [editableProfile, setEditableProfile] = useState<Profile>(currentViewingProfile);

    const handleInputChange = (field: keyof Profile, value: string | number | undefined) => {
        setEditableProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!editableProfile.name.trim()) {
            addToast("Display Name cannot be empty.", 'info');
            return;
        }
        await updateProfile(currentViewingProfile.id, editableProfile);
        addToast("Profile updated successfully!", 'badge', '✅');
        onNavigate('dashboard');
    };
    
    const renderChildSettings = () => (
        React.createElement('div', { style: {display: 'flex', flexDirection: 'column', gap: '15px'} },
            React.createElement('button', {
                onClick: () => onNavigate('themeSettings'),
                style: {...styles.button, backgroundColor: 'var(--accent-color, #ff69b4)'},
                'aria-label': "Customize my theme"
            },
                "🎨 Customize My Theme"
            ),
             React.createElement('button', {
                onClick: () => onNavigate('aiAvatarCreator'),
                style: {...styles.button, backgroundColor: '#8e44ad'},
                'aria-label': "Create a new avatar"
            },
                "🤖 Create AI Avatar"
            )
        )
    );

    const renderAdultSettings = () => (
        React.createElement('div', { style: styles.formGroup },
            React.createElement('label', { htmlFor: "parentThemeSelect", style: styles.label }, "My UI Theme:"),
            React.createElement('select', {
                id: 'parentThemeSelect',
                style: styles.selectInput,
                value: Object.keys(PARENT_THEMES).find(key => JSON.stringify(PARENT_THEMES[key]) === JSON.stringify(editableProfile.theme)) || 'Default',
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedTheme = PARENT_THEMES[e.target.value as keyof typeof PARENT_THEMES] || {};
                    handleInputChange('theme', selectedTheme as any);
                }
            },
                Object.keys(PARENT_THEMES).map(themeName => 
                    React.createElement('option', { key: themeName, value: themeName }, themeName)
                )
            )
        )
    );
    
    const pageHeaderIcon = currentViewingProfile.role === 'adult' ? '⚙️' : '👤';

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('h2', { style: styles.pageHeader }, `${pageHeaderIcon} My Profile & Settings`),
            React.createElement('section', { style: styles.section },
                React.createElement('h3', {style: styles.sectionTitle}, `Display & Appearance`),
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: "profileNameEdit", style: styles.label }, 'Display Name:'),
                    React.createElement('input', {
                        type: "text",
                        id: "profileNameEdit",
                        style: styles.input,
                        value: editableProfile.name,
                        onChange: (e) => handleInputChange('name', e.target.value)
                    })
                ),
                currentViewingProfile.role === 'adult' ? renderAdultSettings() : renderChildSettings(),
                React.createElement('button', {
                    onClick: handleSave,
                    style: { ...styles.button, marginTop: '20px' }
                }, "Save Changes")
            ),
            
            React.createElement('section', { style: styles.section },
                React.createElement('h3', { style: styles.sectionTitle }, 'My Earned Badges'),
                React.createElement('div', { style: {display: 'flex', flexWrap: 'wrap', gap: '15px'} },
                    currentViewingProfile.earnedBadges.length > 0 ? 
                        currentViewingProfile.earnedBadges.map(badgeId => {
                            const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                            if (!badge) return null;
                            return React.createElement('div', {key: badgeId, style: {textAlign: 'center'}},
                                React.createElement('span', {style: {fontSize: '2.5em'}}, badge.icon),
                                React.createElement('p', {style: {margin: 0, fontSize: '0.9em'}}, badge.name)
                            )
                        }) :
                        React.createElement('p', {style: styles.emptyStateText}, "No badges earned yet. Keep up the great work!")
                )
            )
        )
    );
}