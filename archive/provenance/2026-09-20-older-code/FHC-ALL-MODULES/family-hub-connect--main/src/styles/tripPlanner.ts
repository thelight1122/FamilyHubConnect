//tripPlanner.ts
//tripPlanner.ts
import type { CSSProperties } from 'react';

export const tripPlannerStyles: { [key: string]: CSSProperties } = {
    tripCard: {
        backgroundColor: 'var(--section-bg, white)',
        padding: '15px',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px solid #dee2e6',
    },
    tripCardTitle: {
        margin: '0 0 10px 0',
        fontSize: '1.4em',
    },
    tripCardDetails: {
        margin: '0 0 5px 0',
        color: '#666',
    },
    tripCardActions: {
        marginTop: '15px',
        display: 'flex',
        gap: '10px',
    },
    tripChecklistSection: {
        marginBottom: '20px',
    },
    tripChecklistTitle: {
        fontSize: '1.1em',
        marginBottom: '10px',
    },
    tripChecklistItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '8px',
    },
    tripChecklistInput: {
        flexGrow: 1,
        border: 'none',
        borderBottom: '1px solid #ccc',
        padding: '5px',
        outline: 'none',
    },
    tripChecklistAddButton: {
        background: 'none',
        border: '1px dashed #ccc',
        color: '#666',
        width: '100%',
        padding: '8px',
        borderRadius: 'var(--border-radius-main, 8px)',
        cursor: 'pointer',
    },
};
