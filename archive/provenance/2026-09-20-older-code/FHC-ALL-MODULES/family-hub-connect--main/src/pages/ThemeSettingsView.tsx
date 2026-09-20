
import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import type { Profile } from '../types';
import { ArrowLeftIcon } from '../components';

export default function ThemeSettingsView() {
    const { updateProfile, addToast, onNavigate } = useAppDispatch();
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);

    if (!currentViewingProfile) {
        return <div className="page">Loading profile...</div>;
    }

    const [theme, setTheme] = useState(currentViewingProfile.theme || {});
    const [backgroundImageUrl, setBackgroundImageUrl] = useState(theme['--background-image'] || '');

    const handleColorChange = (key: string, value: string) => {
        setTheme(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        const finalTheme = { ...theme, '--background-image': backgroundImageUrl };
        await updateProfile(currentViewingProfile.id, { theme: finalTheme });
        addToast("Theme saved!", 'badge');
        onNavigate('profileSettings');
    };

    const themeOptions = [
        { label: 'Primary Color', key: '--primary-color' },
        { label: 'Background Color', key: '--background-color' },
        { label: 'Text Color', key: '--text-color' },
        { label: 'Accent Color', key: '--accent-color' },
        { label: 'Header Background', key: '--header-bg' },
        { label: 'Header Text', key: '--header-text' },
    ];
    
    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('profileSettings')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🎨 Customize My Theme</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    <div className="form-grid-2-col">
                        {themeOptions.map(opt => (
                            <div key={opt.key} className="form-group">
                                <label>{opt.label}</label>
                                <input type='color' value={theme[opt.key] || '#ffffff'} onChange={e => handleColorChange(opt.key, e.target.value)} style={{ height: '40px', padding: '5px' }} />
                            </div>
                        ))}
                    </div>
                    <div className="form-group">
                        <label>Background Image URL (optional)</label>
                        <input value={backgroundImageUrl} onChange={e => setBackgroundImageUrl(e.target.value)} placeholder='https://...' />
                    </div>
                    <button onClick={handleSave} className="btn w-100 mt-20">Save My Theme</button>
                </section>
            </main>
        </div>
    );
}
