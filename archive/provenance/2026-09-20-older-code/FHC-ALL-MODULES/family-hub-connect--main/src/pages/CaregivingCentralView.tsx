import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';
import { EmptyState, ArrowLeftIcon } from '../components.tsx';

export default function CaregivingCentralView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" title="Go back to Family Care" onClick={() => onNavigate('familyCare')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🤝 Caregiving Central</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to manage caregivers and care plans is coming soon!"
                />
            </main>
        </div>
    );
}