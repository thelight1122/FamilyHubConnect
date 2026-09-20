//ai.ts
//ai.ts
import type { CSSProperties } from 'react';

export const aiStyles: { [key: string]: CSSProperties } = {
    badgeMakerContainer: {
        borderTop: '2px dashed var(--primary-color, #4a90e2)',
        marginTop: '25px',
        paddingTop: '20px',
    },
    badgeMakerForm: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        gap: '15px',
        alignItems: 'flex-end',
        marginBottom: '20px',
    },
    badgeMakerIconPicker: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: 'var(--border-radius-main, 8px)',
    },
    badgeMakerIconButton: {
        background: 'none',
        border: '1px solid transparent',
        borderRadius: 'var(--border-radius-main, 8px)',
        padding: '5px',
        fontSize: '1.5em',
        cursor: 'pointer',
    },
    badgeMakerIconButtonSelected: {
        borderColor: 'var(--primary-color, #4a90e2)',
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
    },
    aiHelperWidget: {
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
        border: '1px solid var(--primary-color, #4a90e2)',
        borderRadius: 'var(--border-radius-main, 8px)',
        padding: '15px',
        marginTop: '20px',
    },
    aiHelperTitle: {
        fontSize: '1.2em',
        margin: '0 0 10px 0',
        color: 'var(--primary-color, #4a90e2)',
        fontFamily: 'var(--font-family-header, "Nunito", sans-serif)',
    },
    aiSuggestionsContainer: {
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '1px dashed var(--primary-color, #4a90e2)',
    },
    aiSuggestionItem: {
        background: 'white',
        border: '1px solid #b3d7ff',
        padding: '8px 12px',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        color: 'var(--primary-color, #4a90e2)',
    },
    aiError: {
        color: '#721c24',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        padding: '10px 15px',
        borderRadius: 'var(--border-radius-main, 4px)',
        margin: '10px 0',
        textAlign: 'center',
    },
};
