

import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';
import { EmptyState, ArrowLeftIcon } from '../components.tsx';

export default function IntegrationsView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('settings')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🔗 Integrations</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to connect with other services is coming soon!"
                />
            </main>
        </div>
    );
}