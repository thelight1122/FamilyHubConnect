import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { styles } from '../styles';
import type { PageView } from '../types';
import { useAppContext } from '../contexts/AppContext';

export default function AuthView() {
    const { onNavigate, addToast } = useAppContext();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuthAction = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                addToast('Sign up successful! Please log in now to continue.', 'badge', '✅');
                setIsLogin(true);
            }
            // onAuthStateChange in App.tsx will handle navigation
        } catch (err: any) {
            setError(err.error_description || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        React.createElement('div', { style: styles.authContainer },
            React.createElement('div', { style: styles.authForm },
                React.createElement('h2', { style: styles.authTitle }, isLogin ? 'Login to FamilyHub' : 'Create Your FamilyHub Account'),
                React.createElement('form', { onSubmit: handleAuthAction },
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'authEmail', style: styles.label }, 'Email'),
                        React.createElement('input', {
                            id: 'authEmail',
                            type: 'email',
                            style: styles.input,
                            value: email,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                            required: true,
                            placeholder: 'you@example.com'
                        })
                    ),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'authPassword', style: styles.label }, 'Password'),
                        React.createElement('input', {
                            id: 'authPassword',
                            type: 'password',
                            style: styles.input,
                            value: password,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
                            required: true,
                            minLength: 6,
                            placeholder: '••••••••'
                        })
                    ),
                    React.createElement('button', {
                        type: 'submit',
                        style: styles.button,
                        disabled: loading,
                        'aria-live': 'polite'
                    }, loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')),
                    error && React.createElement('p', { style: styles.aiError, role: 'alert' }, error)
                ),
                React.createElement('button', {
                    onClick: () => setIsLogin(!isLogin),
                    style: styles.authToggleButton
                }, isLogin ? "Need an account? Sign Up" : "Already have an account? Login")
            )
        )
    );
}
