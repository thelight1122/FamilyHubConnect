
import React from 'react';
import { styles } from '../../styles.ts';

interface EmptyStateProps {
    icon: string;
    title: string;
    message: string;
    children?: React.ReactNode;
}

export default function EmptyState({ icon, title, message, children }: EmptyStateProps) {
    return (
        React.createElement('div', { style: styles.emptyStateContainer, role: "region", "aria-live": "polite" },
            React.createElement('div', { style: styles.emptyStateIcon, 'aria-hidden': true }, icon),
            React.createElement('h4', { style: styles.emptyStateTitle }, title),
            React.createElement('p', { style: styles.emptyStateMessage }, message),
            children && React.createElement('div', { style: { marginTop: '15px' } }, children)
        )
    );
}
