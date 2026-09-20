
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAppContext } from '../contexts/AppContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { styles } from '../styles';

export default function GoogleCallbackView() {
    const { onNavigate, addToast } = useAppContext();
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (code) {
                try {
                    const { error: funcError } = await supabase.functions.invoke('google-api-handler', {
                        body: { endpoint: 'exchange-code', code }
                    });

                    if (funcError) throw new Error(funcError.message);

                    setStatus('Success! Redirecting...');
                    addToast('Google Account linked successfully!', 'badge', '✅');
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
    }, [onNavigate, addToast]);

    return (
        React.createElement('div', { style: { ...styles.pageContainer, textAlign: 'center' } },
            React.createElement(LoadingSpinner, { message: status }),
            error && React.createElement('p', { style: styles.aiError }, error)
        )
    );
}
