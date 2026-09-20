import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components.tsx';

export default function ActivitiesView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" title="Go back to dashboard" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>Activities</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🚧"
                    title="Under Construction"
                    message="This feature is not yet available."
                />
            </main>
            <BottomNavbar activePage="activities" onNavigate={onNavigate} />
        </div>
    );
}