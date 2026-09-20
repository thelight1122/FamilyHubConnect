import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components.tsx';

export default function HabitTrackerView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>Habit Tracker</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🚧"
                    title="Under Construction"
                    message="This feature is not yet available."
                />
            </main>
            <BottomNavbar activePage="habitTracker" onNavigate={onNavigate} />
        </div>
    );
}