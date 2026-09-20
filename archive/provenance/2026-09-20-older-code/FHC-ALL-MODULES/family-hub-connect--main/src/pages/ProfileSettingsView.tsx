
import React, { useState, useMemo } from 'react';
import type { Profile } from '../types';
import { BADGE_DEFINITIONS, PARENT_THEMES } from '../constants';
import { useAppState, useAppDispatch } from '../AppContext';
import { ArrowLeftIcon, BottomNavbar } from '../components';

export default function ProfileSettingsView() {
    const { addToast, onNavigate, updateProfile } = useAppDispatch();
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    
    if (!currentViewingProfile) {
        return <div className="page"><p>Loading profile...</p></div>;
    }

    const [editableProfile, setEditableProfile] = useState<Profile>(currentViewingProfile);

    const handleInputChange = (field: keyof Profile, value: any) => {
        setEditableProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!editableProfile.name.trim()) {
            addToast("Display Name cannot be empty.", 'info');
            return;
        }
        await updateProfile(currentViewingProfile.id, editableProfile);
        addToast("Profile updated successfully!", 'badge');
        onNavigate('settings');
    };
    
    const renderChildSettings = () => (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <button
                onClick={() => onNavigate('themeSettings')}
                className="btn"
                style={{backgroundColor: 'var(--accent-color, #ff69b4)'}}
                aria-label="Customize my theme"
            >
                🎨 Customize My Theme
            </button>
             <button
                onClick={() => onNavigate('aiAvatarCreator')}
                className="btn"
                style={{backgroundColor: '#8e44ad'}}
                aria-label="Create a new avatar"
            >
                🤖 Create AI Avatar
            </button>
        </div>
    );

    const renderAdultSettings = () => (
        <div className="form-group">
            <label htmlFor="parentThemeSelect">My UI Theme:</label>
            <select
                id="parentThemeSelect"
                value={Object.keys(PARENT_THEMES).find(key => JSON.stringify(PARENT_THEMES[key as keyof typeof PARENT_THEMES]) === JSON.stringify(editableProfile.theme)) || 'Default'}
                onChange={(e) => {
                    const selectedThemeKey = e.target.value as keyof typeof PARENT_THEMES;
                    const selectedTheme = PARENT_THEMES[selectedThemeKey] || {};
                    handleInputChange('theme', selectedTheme);
                }}
            >
                {Object.keys(PARENT_THEMES).map(themeName => 
                    <option key={themeName} value={themeName}>{themeName}</option>
                )}
            </select>
        </div>
    );
    
    const isParent = currentViewingProfile.role === 'Admin' || currentViewingProfile.role === 'Parent';
    const pageHeaderIcon = isParent ? '⚙️' : '👤';

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('settings')}>
                    <ArrowLeftIcon />
                </button>
                <h2>{pageHeaderIcon} My Profile</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    <h3 className="font-bold text-large mt-0">Display & Appearance</h3>
                    <div className="form-group">
                        <label htmlFor="profileNameEdit">Display Name:</label>
                        <input
                            type="text"
                            id="profileNameEdit"
                            value={editableProfile.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    </div>
                    {isParent ? renderAdultSettings() : renderChildSettings()}
                    <button
                        onClick={handleSave}
                        className="btn mt-20 w-100"
                    >
                        Save Changes
                    </button>
                </section>
                
                <section className="card">
                    <h3 className="font-bold text-large mt-0">My Earned Badges</h3>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
                        {currentViewingProfile.earnedBadges && currentViewingProfile.earnedBadges.length > 0 ? 
                            currentViewingProfile.earnedBadges.map(badgeId => {
                                const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                                if (!badge) return null;
                                return (
                                    <div key={badgeId} className="text-center">
                                        <span style={{fontSize: '2.5em'}}>{badge.icon}</span>
                                        <p style={{margin: 0, fontSize: '0.9em'}}>{badge.name}</p>
                                    </div>
                                )
                            }) :
                            <p>No badges earned yet. Keep up the great work!</p>
                        }
                    </div>
                </section>
            </main>
            <BottomNavbar activePage="profileSettings" onNavigate={onNavigate} />
        </div>
    );
}
