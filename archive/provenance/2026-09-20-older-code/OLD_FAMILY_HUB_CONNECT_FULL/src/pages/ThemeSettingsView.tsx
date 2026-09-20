
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { Profile } from '../types';

export default function ThemeSettingsView({ updateProfile }: { updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<void> }) {
    const { currentViewingProfile, addToast, onNavigate } = useAppContext();

    if (!currentViewingProfile) {
        return React.createElement('div', {style: styles.loadingMessage}, 'Loading profile...');
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
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', { onClick: () => onNavigate('profileSettings'), style: { ...styles.backButton, float: 'left' } }, "← Back"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "🎨 Customize My Theme"),
            React.createElement('section', { style: styles.section },
                React.createElement('div', { style: styles.formGrid2Col },
                    themeOptions.map(opt => (
                        React.createElement('div', { key: opt.key, style: styles.formGroup },
                            React.createElement('label', { style: styles.label }, opt.label),
                            React.createElement('input', { type: 'color', value: theme[opt.key] || '#ffffff', onChange: e => handleColorChange(opt.key, e.target.value), style: { ...styles.input, height: '40px', padding: '5px' } })
                        )
                    ))
                ),
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { style: styles.label }, 'Background Image URL (optional)'),
                    React.createElement('input', { value: backgroundImageUrl, onChange: e => setBackgroundImageUrl(e.target.value), style: styles.input, placeholder: 'https://...' })
                ),
                React.createElement('button', { onClick: handleSave, style: { ...styles.button, marginTop: '20px' } }, "Save My Theme")
            )
        )
    );
}
