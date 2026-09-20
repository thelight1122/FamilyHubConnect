import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../AppContext.tsx';
import { LoadingSpinner } from '../components.tsx';

export default function GoogleCallbackView() {
    const { onNavigate, addToast, exchangeGoogleCode } = useAppDispatch();
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (code) {
                try {
                    await exchangeGoogleCode(code);
                    setStatus('Success! Redirecting...');
                    addToast('Google Account linked successfully!', 'badge');
                    onNavigate('settings');
                } catch (e: any) {
                    setError(`Failed to link account: ${e.message}`);
                    setStatus('Error');
                }
            } else {
                setError('No authorization code found in URL.');
                setStatus('Error');
            }
        };

        handleCallback();
    }, [onNavigate, addToast, exchangeGoogleCode]);

    return (
        <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <LoadingSpinner message={status} />
            {error && <p className="ai-error">{error}</p>}
        </div>
    );
}