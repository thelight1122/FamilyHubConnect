
import React from 'react';
import type { PageView } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import HubTile from '../components/ui/HubTile';

export default function HomeManagementView() {
    const { onNavigate } = useAppContext();

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: () => onNavigate('dashboard'),
                style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' },
                'aria-label': "Back to Dashboard"
            }, "← Back to Dashboard"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "🏠 Home Management"),
            React.createElement('p', { style: { textAlign: 'center', color: '#666', marginTop: '-15px', marginBottom: '25px' } }, "Your central command for managing household assets and analytics."),

            React.createElement('div', { style: styles.hubGrid },
                React.createElement(HubTile, {
                    icon: '🚗',
                    title: 'Vehicle Maintenance',
                    description: 'Manage your family cars, log services, and view upcoming maintenance.',
                    onClick: () => onNavigate('vehicleMaintenance')
                }),
                React.createElement(HubTile, {
                    icon: '💡',
                    title: 'Smart Home Control',
                    description: 'Connect and manage your smart home devices and create automated scenes.',
                    onClick: () => onNavigate('smartHome')
                }),
                React.createElement(HubTile, {
                    icon: '📊',
                    title: 'Weekly Reports',
                    description: 'View and generate summaries of family activity, chores, and achievements.',
                    onClick: () => onNavigate('weeklyReport')
                })
            )
        )
    );
}
