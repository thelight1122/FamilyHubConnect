

import React from 'react';
import { useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components';

export default function ShoutOutsView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('connections')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🎉 Shout-Outs</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🚧"
                    title="Under Construction"
                    message="This feature to give and view shout-outs is coming soon!"
                />
            </main>
            <BottomNavbar activePage="shoutOuts" onNavigate={onNavigate} />
        </div>
    );
}
