import React from 'react';
import { EmptyState, ArrowLeftIcon } from '../components';

interface PhoneSettingsViewProps {
  onBack: () => void;
}

export default function PhoneSettingsView({ onBack }: PhoneSettingsViewProps) {
    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>📱 Phone Settings</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to manage phone settings is coming soon!"
                />
            </main>
        </div>
    );
}
