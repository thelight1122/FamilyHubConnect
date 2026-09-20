

import React from 'react';
import { EmptyState, ArrowLeftIcon } from '../components.tsx';

interface MovieNightPickerViewProps {
    onBack: () => void;
}

export default function MovieNightPickerView({ onBack }: MovieNightPickerViewProps) {
    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={onBack} title="Go back to Locker Room">
                    <ArrowLeftIcon />
                </button>
                <h2>🎬 Movie Night Picker</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to help pick a movie for family night is coming soon!"
                />
            </main>
        </div>
    );
}