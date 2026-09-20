
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { PersonalizationData } from '../types';

interface ChoreSettingsViewProps {
    onSave: (data: Partial<PersonalizationData>) => Promise<void>;
    onCreateTemplates: (choreNames: string) => Promise<void>;
}

export default function ChoreSettingsView({ onSave, onCreateTemplates }: ChoreSettingsViewProps) {
    const { personalizationData, addToast, onNavigate } = useAppContext();
    const [gamifyTasks, setGamifyTasks] = useState(personalizationData?.gamifyTasks ?? true);
    const [specificChores, setSpecificChores] = useState(personalizationData?.specificChores || '');
    
    const handleSave = () => {
        onSave({ gamifyTasks, specificChores });
        addToast("Chore settings saved!", 'badge');
        onNavigate('settings');
    };
    
    const handleGenerateTemplates = () => {
        onCreateTemplates(specificChores);
        addToast("Generating templates based on your list...", 'badge');
    };

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', {
            onClick: () => onNavigate('settings'),
            style: { ...styles.backButton, float: 'left' },
            'aria-label': "Back to Settings"
        }, "← Back to Settings"),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "📋 Chore Settings"),
        
        React.createElement('section', { style: styles.section },
            React.createElement('div', { style: styles.formGroup },
                React.createElement('label', { style: styles.checkboxLabel },
                    React.createElement('input', {
                        type: 'checkbox',
                        style: styles.checkbox,
                        checked: gamifyTasks,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setGamifyTasks(e.target.checked)
                    }),
                    "Enable Chore Gamification (Points & Badges)"
                )
            ),
            React.createElement('div', { style: styles.formGroup },
                React.createElement('label', {htmlFor: 'common-chores', style: styles.label }, 'Common Chores in Your Household (one per line)'),
                React.createElement('textarea', {
                    id: 'common-chores',
                    style: styles.textarea,
                    rows: 6,
                    value: specificChores,
                    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setSpecificChores(e.target.value),
                    placeholder: 'e.g.,\nWalk the dog\nSet the table\nClean your room'
                }),
                React.createElement('button', {
                    onClick: handleGenerateTemplates,
                    style: {...styles.button, ...styles.buttonInfo, marginTop: '10px'}
                }, "Create Chore Templates from this List")
            )
        ),

        React.createElement('button', { onClick: handleSave, style: styles.button }, "Save Chore Settings")
    );
}
