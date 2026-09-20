
import React from 'react';
import { useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon } from '../components';

export default function ScreenTimeBankView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('finance')}>
                    <ArrowLeftIcon />
                </button>
                <h2>📱 Screen Time Bank</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to earn and spend screen time minutes is coming soon!"
                />
            </main>
        </div>
    );
}
