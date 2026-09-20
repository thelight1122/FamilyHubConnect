
import React from 'react';
import type { PageView } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import HubTile from '../components/ui/HubTile';

interface InternetViewProps {
    onNavigate: (page: PageView) => void;
    onBack: () => void;
}

export default function InternetView({ onNavigate, onBack }: InternetViewProps) {
    const { currentViewingProfile } = useAppContext();
    const isParent = currentViewingProfile?.role === 'adult';
    
    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: onBack,
                style: { ...styles.backButton, float: 'left' },
                'aria-label': "Back to Dashboard"
            }, "← Back"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "🌐 Internet & Media"),

            React.createElement('div', { style: styles.hubGrid, className: 'internet-hub-grid' },
                React.createElement(HubTile, {
                    icon: '🛡️',
                    title: 'Safe Web Browser',
                    description: 'Browse the web using a list of parent-approved websites.',
                    onClick: () => onNavigate('webBrowser')
                }),
                React.createElement(HubTile, {
                    icon: '🧑‍🤝‍🧑',
                    title: 'Social Media',
                    description: isParent ? 'Manage social media settings and monitoring for your children.' : 'View your social media hub.',
                    onClick: () => onNavigate('socialMedia')
                }),
                isParent && React.createElement(HubTile, {
                    icon: '⚙️',
                    title: 'Manage Safe Websites',
                    description: 'Add or remove websites from the approved list for the Safe Web Browser.',
                    onClick: () => onNavigate('settings') // This can be refined later to a more specific settings page
                })
            )
        )
    );
}
