
import React from 'react';
import { useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon } from '../components';
import type { PersonalizationData } from '../types';

interface RewardSettingsViewProps {
    onSave: (updates: Partial<PersonalizationData>) => void;
}

export default function RewardSettingsView({ onSave }: RewardSettingsViewProps) {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('settings')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🏆 Reward Settings</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to manage available rewards is coming soon!"
                />
            </main>
        </div>
    );
}
