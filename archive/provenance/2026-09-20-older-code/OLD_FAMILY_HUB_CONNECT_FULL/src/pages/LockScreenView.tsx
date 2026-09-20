
import React from 'react';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';

interface LockScreenViewProps {
    message: string;
}

export default function LockScreenView({ message }: LockScreenViewProps) {
    const { onNavigate } = useAppContext();

    return (
        React.createElement('div', { style: {
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '100vh', textAlign: 'center', backgroundColor: 'var(--background-color)'
            } },
            React.createElement('div', { style: {fontSize: '4em'}, 'aria-hidden': 'true' }, '🔒'),
            React.createElement('h2', { style: {fontSize: '1.5em', color: 'var(--text-color)'} }, message),
            React.createElement('button', {
                onClick: () => onNavigate('dashboard'),
                style: { ...styles.button, width: 'auto' }
            }, 'Back to Dashboard')
        )
    );
}