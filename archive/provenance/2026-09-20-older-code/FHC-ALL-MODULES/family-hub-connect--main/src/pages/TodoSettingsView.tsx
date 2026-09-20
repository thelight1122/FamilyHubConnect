
import React from 'react';
import { useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon } from '../components';

export default function TodoSettingsView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('settings')}>
                    <ArrowLeftIcon />
                </button>
                <h2>📝 To-Do Settings</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    <EmptyState
                        icon="🚧"
                        title="Coming Soon"
                        message="Advanced settings for the To-Do feature will be available here in a future update."
                    />
                </section>
            </main>
        </div>
    );
}
