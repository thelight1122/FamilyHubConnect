import React from 'react';
import type { PageView } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import HubTile from '../components/ui/HubTile';

export default function ConnectionsView() {
    const { onNavigate } = useAppContext();

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: () => onNavigate('dashboard'),
                style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' },
                'aria-label': "Back to Dashboard"
            }, "← Back to Dashboard"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "💬 Connections"),

            React.createElement('div', { style: styles.hubGrid },
                React.createElement(HubTile, {
                    icon: '💬',
                    title: 'Family Messages',
                    description: 'Send and receive direct or group messages with family members.',
                    onClick: () => onNavigate('messages')
                }),
                React.createElement(HubTile, {
                    icon: '📅',
                    title: 'Shared Calendar',
                    description: 'View and manage all family events, appointments, and important dates.',
                    onClick: () => onNavigate('calendar')
                }),
                React.createElement(HubTile, {
                    icon: '🗳️',
                    title: 'Family Polls',
                    description: 'Create polls to let everyone have a say in family decisions.',
                    onClick: () => onNavigate('polls')
                }),
                React.createElement(HubTile, {
                    icon: '🎉',
                    title: 'Shout-Outs Board',
                    description: 'Share praise and positive messages to celebrate each other\'s successes.',
                    onClick: () => onNavigate('shoutOuts')
                })
            )
        )
    );
}
