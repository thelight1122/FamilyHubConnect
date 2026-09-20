
import React from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import type { AppNotification } from '../types';
import { EmptyState, ArrowLeftIcon } from '../components';

export default function NotificationCenterView() {
    const { appNotifications } = useAppState();
    const { onNavigate } = useAppDispatch();
    
    // In a real app, these would come from context and update state
    const handleMarkAllRead = () => console.log("Marking all as read");
    const handleClearAll = () => console.log("Clearing all");

    const sortedNotifications = [...appNotifications].sort((a, b) => b.timestamp - a.timestamp);

    const getIconForType = (type: AppNotification['type']) => {
        switch (type) {
            case 'new_message': return '💬';
            case 'chore_status': return '✅';
            case 'badge_earned': return '🏆';
            case 'reward_redeemed': return '🛍️';
            case 'event_reminder': return '📅';
            default: return '🔔';
        }
    };

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🔔 Notification Center</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <button className="btn w-auto" onClick={handleMarkAllRead} disabled={!appNotifications.some(n => !n.read)}>Mark All as Read</button>
                        <button className="btn btn-danger w-auto" onClick={handleClearAll} disabled={appNotifications.length === 0}>Clear All</button>
                    </div>

                    {sortedNotifications.length > 0 ? (
                        <>
                            {sortedNotifications.map(n => (
                                <div key={n.id} className="list-item" style={{ backgroundColor: n.read ? 'transparent' : 'var(--accent-color-light)', display: 'block' }}>
                                    <p style={{ margin: 0, fontWeight: n.read ? 'normal' : 'bold' }}>
                                        <span style={{ marginRight: '10px' }}>{getIconForType(n.type)}</span>
                                        {n.message}
                                    </p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8em', color: '#666' }}>
                                        {new Date(n.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <EmptyState icon='📭' title="All Caught Up!" message="You have no new notifications." />
                    )}
                </div>
            </main>
        </div>
    );
}
