
import React from 'react';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import EmptyState from '../components/ui/EmptyState';

export default function IntegrationsView() {
    const { onNavigate } = useAppContext();

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', {
            onClick: () => onNavigate('settings'),
            style: { ...styles.backButton, float: 'left' },
        }, '← Back to Settings'),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "🔗 Integrations"),
        React.createElement(EmptyState, {
            icon: '🏗️',
            title: 'Under Construction',
            message: 'This feature to connect with other services is coming soon!',
        })
    );
}
