import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import type { PersonalizationData, Profile } from '../types.ts';
import { ArrowLeftIcon } from '../components.tsx';

export default function FamilySettingsView() {
    const { onSavePersonalization, updateProfile, onNavigate } = useAppDispatch();
    const { personalizationData, profiles } = useAppState();
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
            await onSavePersonalization({ location });
        }
        setIsEditing(false);
    };

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={() => onNavigate('settings')}>
                    <ArrowLeftIcon />
                </button>
                <h2>👨‍👩‍👧‍👦 Family Settings</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <section className="card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3>Family Members</h3>
                        {!isEditing && <button onClick={() => setIsEditing(true)} className="btn w-auto">Edit</button>}
                    </div>
                    {localProfiles.map(profile => (
                        <div key={profile.id} className="list-item">
                            {isEditing ?
                                <input
                                    value={profile.name}
                                    onChange={e => handleProfileChange(profile.id, 'name', e.target.value)}
                                    style={{width: '150px'}}
                                /> :
                                <strong>{profile.name}</strong>
                            }
                            {isEditing && profile.role === 'Child' ? 
                                <input
                                    type='number'
                                    value={profile.age || ''}
                                     onChange={e => handleProfileChange(profile.id, 'age', parseInt(e.target.value) || 0)}
                                     style={{width: '80px'}}
                                /> : 
                                <span>{`${profile.role} ${profile.age ? `(Age ${profile.age})` : ''}`}</span>
                            }
                            {isEditing ?
                                <select value={profile.status || 'active'} onChange={(e) => handleProfileChange(profile.id, 'status', e.target.value)}>
                                   <option value='active'>Active</option>
                                   <option value='disabled'>Disabled</option>
                                </select>
                                : null
                            }
                        </div>
                    ))}
                    <div className="form-group" style={{marginTop: isEditing ? '20px' : '0'}}>
                        <label htmlFor='location'>Location (for Weather):</label>
                        {isEditing ? (
                            <input
                                id='location'
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder='e.g., San Francisco, CA'
                            />
                        ) : (
                            <p style={{margin: '5px 0'}}>{location || 'Not set'}</p>
                        )}
                    </div>
                    {isEditing && (
                        <div className="form-actions">
                            <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={handleSaveChanges} className="btn">Save Changes</button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}