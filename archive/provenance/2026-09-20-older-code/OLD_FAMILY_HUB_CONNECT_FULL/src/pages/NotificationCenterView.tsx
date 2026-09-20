
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { AppNotification } from '../types';
import EmptyState from '../components/ui/EmptyState';

interface NotificationCenterViewProps {
    notifications: AppNotification[];
    setNotifications: (updater: (prev: AppNotification[]) => AppNotification[]) => void;
}

export default function NotificationCenterView({ notifications, setNotifications }: NotificationCenterViewProps) {
    const { onNavigate } = useAppContext();

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all notifications?")) {
            setNotifications(() => []);
        }
    };
    
    const sortedNotifications = [...notifications].sort((a,b) => b.timestamp - a.timestamp);

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
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('h2', { style: styles.pageHeader }, "🔔 Notification Center"),
            React.createElement('section', { style: styles.section },
                React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' } },
                    React.createElement('button', { style: { ...styles.button, width: 'auto' }, onClick: handleMarkAllRead, disabled: !notifications.some(n => !n.read) }, "Mark All as Read"),
                    React.createElement('button', { style: { ...styles.button, ...styles.buttonDanger, width: 'auto' }, onClick: handleClearAll, disabled: notifications.length === 0 }, "Clear All")
                ),
                sortedNotifications.length > 0 ? (
                    sortedNotifications.map(n => (
                        React.createElement('div', {
                            key: n.id,
                            style: {
                                padding: '15px',
                                borderBottom: '1px solid #eee',
                                backgroundColor: n.read ? 'transparent' : 'var(--accent-color-light)'
                            }
                        },
                            React.createElement('p', { style: { margin: 0, fontWeight: n.read ? 'normal' : 'bold' } },
                                React.createElement('span', { style: { marginRight: '10px' } }, getIconForType(n.type)),
                                n.message
                            ),
                            React.createElement('p', { style: { margin: '5px 0 0 0', fontSize: '0.8em', color: '#666' } },
                                new Date(n.timestamp).toLocaleString()
                            )
                        )
                    ))
                ) : (
                    React.createElement(EmptyState, {icon: '📭', title: "All Caught Up!", message: "You have no new notifications."})
                )
            )
        )
    );
}
