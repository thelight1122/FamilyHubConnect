import React from 'react';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import EmptyState from '../components/ui/EmptyState';

export default function EventsView() {
    const { onNavigate } = useAppContext();

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', {
            onClick: () => onNavigate('dashboard'),
            style: { ...styles.backButton, float: 'left' },
        }, '← Back to Dashboard'),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "Events"),
        React.createElement(EmptyState, {
            icon: '🚧',
            title: 'Under Construction',
            message: 'This feature is not yet available.',
        })
    );
}
