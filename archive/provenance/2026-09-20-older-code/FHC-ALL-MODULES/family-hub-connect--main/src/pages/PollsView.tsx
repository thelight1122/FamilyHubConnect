

import React from 'react';
import { useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components';

export default function PollsView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('connections')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🗳️ Family Polls</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🚧"
                    title="Under Construction"
                    message="This feature to create and vote on family polls is coming soon!"
                />
            </main>
            <BottomNavbar activePage="polls" onNavigate={onNavigate} />
        </div>
    );
}
