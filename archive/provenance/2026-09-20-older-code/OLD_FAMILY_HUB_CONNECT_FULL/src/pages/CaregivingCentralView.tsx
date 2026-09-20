
import React from 'react';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import EmptyState from '../components/ui/EmptyState';

export default function CaregivingCentralView() {
    const { onNavigate } = useAppContext();

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', {
            onClick: () => onNavigate('familyCare'),
            style: { ...styles.backButton, float: 'left' },
        }, '← Back to Family Care'),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "🤝 Caregiving Central"),
        React.createElement(EmptyState, {
            icon: '🏗️',
            title: 'Under Construction',
            message: 'This feature to manage caregivers and care plans is coming soon!',
        })
    );
}
