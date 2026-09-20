
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import { supabase } from '../services/supabaseClient';

export default function EmailView() {
    const { onNavigate, addToast, isGoogleLinked } = useAppContext();
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    const handleGetAuthUrl = async () => {
        try {
            const { data, error } = await supabase.functions.invoke('google-api-handler', {
                body: { endpoint: 'google-oauth-url' }
            });
            if (error) throw error;
            window.location.href = data.url;
        } catch(e: any) {
            addToast(`Error getting auth URL: ${e.message}`, 'info');
        }
    }

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const { error } = await supabase.functions.invoke('google-api-handler', {
                body: {
                    endpoint: 'send-email',
                    recipient,
                    subject,
                    body
                }
            });
            if (error) throw error;
            addToast('Email sent successfully!', 'badge');
            setRecipient('');
            setSubject('');
            setBody('');
        } catch (e: any) {
            addToast(`Error sending email: ${e.message}`, 'info');
        } finally {
            setIsSending(false);
        }
    };
    
    if (!isGoogleLinked) {
        return (
            React.createElement('div', {style: styles.pageContainer},
                React.createElement('h2', {style: styles.pageHeader}, "✉️ Send Email"),
                 React.createElement('section', {style: styles.section},
                    React.createElement('p', null, "To send emails, you need to link your Google Account."),
                    React.createElement('button', {style: styles.button, onClick: handleGetAuthUrl}, "Link Google Account")
                )
            )
        );
    }
    
    return (
        React.createElement('div', {style: styles.pageContainer},
            React.createElement('h2', {style: styles.pageHeader}, "✉️ Send Email"),
            React.createElement('section', {style: styles.section},
                React.createElement('form', {onSubmit: handleSendEmail},
                    React.createElement('div', {style: styles.formGroup},
                        React.createElement('label', {style: styles.label}, 'To:', React.createElement('input', {type: 'email', style: styles.input, value: recipient, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value), required: true}))
                    ),
                    React.createElement('div', {style: styles.formGroup},
                        React.createElement('label', {style: styles.label}, 'Subject:', React.createElement('input', {type: 'text', style: styles.input, value: subject, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value), required: true}))
                    ),
                    React.createElement('div', {style: styles.formGroup},
                        React.createElement('label', {style: styles.label}, 'Body:', React.createElement('textarea', {style: styles.textarea, rows: 8, value: body, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value), required: true}))
                    ),
                    React.createElement('button', {type: 'submit', style: styles.button, disabled: isSending}, isSending ? 'Sending...' : 'Send Email')
                )
            )
        )
    );
}
