import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';
import { EmptyState, ArrowLeftIcon } from '../components.tsx';

export default function DigitalFridgeView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" title="Go back to dashboard" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>The Fridge</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🚧"
                    title="Under Construction"
                    message="This feature is not yet available."
                />
            </main>
        </div>
    );
}