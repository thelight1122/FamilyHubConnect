import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';

interface LockScreenViewProps {
    message: string;
}

export default function LockScreenView({ message }: LockScreenViewProps) {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '4em' }} aria-hidden="true">🔒</div>
            <h2 style={{ fontSize: '1.5em', marginTop: '20px' }}>{message}</h2>
            <button
                onClick={() => onNavigate('dashboard')}
                className="btn w-auto"
                style={{ marginTop: '20px' }}
            >
                Back to Dashboard
            </button>
        </div>
    );
}