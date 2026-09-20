import React from 'react';
import { EmptyState, ArrowLeftIcon } from '../components';

interface SocialMediaViewProps {
    onBack: () => void;
}

export default function SocialMediaView({ onBack }: SocialMediaViewProps) {
    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>🧑‍🤝‍🧑 Social Media Hub</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to monitor and manage social media is coming soon!"
                />
            </main>
        </div>
    );
}
