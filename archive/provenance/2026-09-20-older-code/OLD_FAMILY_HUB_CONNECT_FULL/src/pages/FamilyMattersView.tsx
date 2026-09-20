import React from 'react';
import type { PageView } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import HubTile from '../components/ui/HubTile';

export default function FamilyMattersView() {
    const { onNavigate } = useAppContext();

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: () => onNavigate('dashboard'),
                style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' },
                'aria-label': "Back to Dashboard"
            }, "← Back to Dashboard"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "⚖️ Family Matters"),
            React.createElement('p', { style: { textAlign: 'center', color: '#666', marginTop: '-15px', marginBottom: '25px' } }, "Your hub for family governance and positive communication."),


            React.createElement('div', { style: styles.hubGrid },
                React.createElement(HubTile, {
                    icon: '🏛️',
                    title: 'Family Court',
                    description: 'Manage infractions and work through issues with restorative justice.',
                    onClick: () => onNavigate('familyCourt')
                }),
                React.createElement(HubTile, {
                    icon: '📜',
                    title: 'Family Foundations',
                    description: 'Review and acknowledge your family\'s constitution and shared values.',
                    onClick: () => onNavigate('familyFoundations')
                }),
                React.createElement(HubTile, {
                    icon: '👨‍👩‍👧‍👦',
                    title: 'Family Meetings',
                    description: 'Schedule, plan, and document important family discussions.',
                    onClick: () => onNavigate('familyMeeting')
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
