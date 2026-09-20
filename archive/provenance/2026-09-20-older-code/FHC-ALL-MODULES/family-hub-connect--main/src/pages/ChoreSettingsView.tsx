import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import { ArrowLeftIcon } from '../components';

export default function ChoreSettingsView() {
    const { onSavePersonalization, createChoreTemplates, addToast, onNavigate } = useAppDispatch();
    const { personalizationData } = useAppState();
    const [gamifyTasks, setGamifyTasks] = useState(personalizationData?.gamifyTasks ?? true);
    const [specificChores, setSpecificChores] = useState(personalizationData?.specificChores || '');
    
    const handleSave = () => {
        onSavePersonalization({ gamifyTasks, specificChores: specificChores });
        addToast("Chore settings saved!", 'badge');
        onNavigate('settings');
    };
    
    const handleGenerateTemplates = () => {
        if (!specificChores.trim()) {
            addToast("Please enter some chore names first.", 'info');
            return;
        }
        createChoreTemplates(specificChores);
        addToast("Generating templates based on your list...", 'info');
    };

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" title="Go back to settings" onClick={() => onNavigate('settings')}>
                    <ArrowLeftIcon />
                </button>
                <h2>📋 Chore Settings</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={gamifyTasks}
                                onChange={(e) => setGamifyTasks(e.target.checked)}
                            />
                            Enable Chore Gamification (Points & Badges)
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor='common-chores'>Common Chores in Your Household (one per line)</label>
                        <textarea
                            id='common-chores'
                            rows={6}
                            value={specificChores}
                            onChange={(e) => setSpecificChores(e.target.value)}
                            placeholder={'e.g.,\nWalk the dog\nSet the table\nClean your room'}
                        />
                        <button
                            onClick={handleGenerateTemplates}
                            className="btn btn-info mt-10 w-auto"
                        >
                            Create Chore Templates from this List
                        </button>
                    </div>
                </section>

                <button onClick={handleSave} className="btn w-100">
                    Save Chore Settings
                </button>
            </main>
        </div>
    );
}