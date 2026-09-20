//chores.ts
//chores.ts
import type { CSSProperties } from 'react';

export const choreStyles: { [key: string]: CSSProperties } = {
    choreCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '10px',
        borderLeft: '5px solid #ccc',
        transition: 'all 0.2s',
    },
    choreCardContent: {
        display: 'flex',
        justifyContent: 'space-between',
        flexGrow: 1,
        alignItems: 'center',
    },
    choreCardDetails: {
        flexGrow: 1,
    },
    choreCardTitle: {
        fontSize: '1.2em',
        fontWeight: 600,
        margin: '0 0 5px 0',
    },
    choreCardMeta: {
        fontSize: '0.9em',
        color: '#666',
        margin: '0 0 5px 0',
    },
    choreCardStatus: {
        color: 'white',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '0.8em',
        fontWeight: 'bold',
        textTransform: 'capitalize',
        marginBottom: '10px',
    },
    choreCardActions: {
        marginTop: '10px',
    },
    choreRejectionReason: {
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        color: '#721c24',
        borderTop: '2px solid #dc3545',
        padding: '10px',
        marginTop: '10px',
        borderRadius: '0 0 8px 8px',
        margin: '10px -15px -15px',
    },
    bonusTodoSection: {
        backgroundColor: '#fffbe6',
        border: '1px solid #ffe58f',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        marginBottom: '20px',
    },
};
