
import React from 'react';
import { useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon } from '../components';

export default function SecuritySettingsView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('settings')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🔒 Security Settings</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to manage app security is coming soon!"
                />
            </main>
        </div>
    );
}
