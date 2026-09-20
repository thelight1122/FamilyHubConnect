import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ArrowLeftIcon } from '../components.tsx';

export default function EmailView() {
    const { onNavigate, addToast, getGoogleAuthUrl, sendEmail } = useAppDispatch();
    const { isGoogleLinked } = useAppState();
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    const handleGetAuthUrl = async () => {
        try {
            const url = await getGoogleAuthUrl();
            if (url) {
                window.location.href = url;
            } else {
                addToast('Could not get authorization URL.', 'info');
            }
        } catch(e: any) {
            addToast(`Error getting auth URL: ${e.message}`, 'info');
        }
    }

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            await sendEmail({ recipient, subject, body });
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
    
    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" title="Go back to dashboard" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>✉️ Send Email</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <section className="card">
                    {!isGoogleLinked ? (
                        <>
                            <p>To send emails, you need to link your Google Account.</p>
                            <button className="btn" onClick={handleGetAuthUrl}>Link Google Account</button>
                        </>
                    ) : (
                        <form onSubmit={handleSendEmail}>
                            <div className="form-group">
                                <label>To:</label>
                                <input type='email' value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Enter recipient's email" required />
                            </div>
                            <div className="form-group">
                                <label>Subject:</label>
                                <input type='text' value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter email subject" required />
                            </div>
                            <div className="form-group">
                                <label>Body:</label>
                                <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Enter email body" required />
                            </div>
                            <button type='submit' className="btn" disabled={isSending}>{isSending ? 'Sending...' : 'Send Email'}</button>
                        </form>
                    )}
                </section>
            </main>
        </div>
    );
}