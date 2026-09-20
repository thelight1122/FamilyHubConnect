
import React from 'react';
import { useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components';

export default function PantryView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('theFridge')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🥫 Pantry Inventory</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to track your pantry items is coming soon!"
                />
            </main>
            <BottomNavbar activePage="pantry" onNavigate={onNavigate} />
        </div>
    );
}
