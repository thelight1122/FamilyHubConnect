
import React from 'react';
import { styles } from '../../styles.ts';

interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
    return (
        React.createElement('div', { style: styles.loadingContainer, 'aria-label': message, role: 'status' },
            React.createElement('div', { style: styles.spinner, 'aria-hidden': 'true' }),
            React.createElement('p', null, message)
        )
    );
};
