//auth.ts

import type { CSSProperties } from 'react';

export const authStyles: { [key: string]: CSSProperties } = {
    landingPageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '20px',
    },
    header: {
        marginBottom: '30px',
    },
    headerTitle: {
        fontSize: '3em',
        fontFamily: 'var(--font-family-header, "Caveat", cursive)',
        marginBottom: '10px',
        color: 'var(--primary-color, #4a90e2)',
    },
    headerSubtitle: {
        fontSize: '1.2em',
        color: '#666',
    },
    landingNavButtons: {
        display: 'flex',
        gap: '15px',
    },
    landingButton: {
        fontSize: '1.2em',
        padding: '15px 30px',
        border: 'none',
        borderRadius: 'var(--border-radius-main, 8px)',
        color: 'white',
        cursor: 'pointer',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
    },
    featureCard: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
    },
    featureTitle: {
        fontSize: '1.3em',
        marginTop: 0,
    },
    listIcon: {
        color: '#28a745',
    },
    setupStepCard: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px solid #dee2e6',
        marginBottom: '20px',
    },
    authContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    authForm: {
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        backgroundColor: 'var(--section-bg, white)',
        borderRadius: 'var(--border-radius-main, 8px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    authTitle: {
        textAlign: 'center',
        marginBottom: '25px',
    },
    authToggleButton: {
        background: 'none',
        border: 'none',
        color: 'var(--primary-color, #4a90e2)',
        cursor: 'pointer',
        marginTop: '15px',
        width: '100%',
    },
};
