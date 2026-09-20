
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import EmptyState from '../components/ui/EmptyState';

export default function TodoSettingsView() {
    const { onNavigate } = useAppContext();

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', { onClick: () => onNavigate('settings'), style: { ...styles.backButton, float: 'left' } }, "← Back to Settings"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "📝 To-Do Settings"),
            React.createElement('section', { style: styles.section },
                React.createElement(EmptyState, {
                    icon: '🚧',
                    title: 'Coming Soon',
                    message: 'Advanced settings for the To-Do feature will be available here in a future update.'
                })
            )
        )
    );
}
