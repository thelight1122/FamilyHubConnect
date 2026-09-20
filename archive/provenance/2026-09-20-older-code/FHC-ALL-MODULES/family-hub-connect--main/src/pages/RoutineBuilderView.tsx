
import React from 'react';
import { useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon } from '../components';

export default function RoutineBuilderView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('digitalDesk')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🎯 Routine Builder</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to create and track daily routines is coming soon!"
                />
            </main>
        </div>
    );
}
