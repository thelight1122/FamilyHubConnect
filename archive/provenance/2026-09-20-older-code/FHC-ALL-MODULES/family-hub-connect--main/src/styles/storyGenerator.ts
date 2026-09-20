//storyGenerator.ts
//storyGenerator.ts
import type { CSSProperties } from 'react';

export const storyGeneratorStyles: { [key: string]: CSSProperties } = {
    storyPromptForm: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        backgroundColor: 'var(--section-bg, white)',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px solid #d1d9e6',
    },
    storyGeneratorButtonPrimary: {
        gridColumn: '1 / -1',
        backgroundColor: 'var(--primary-color, #4a90e2)',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: 'var(--border-radius-main, 6px)',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 600,
    },
    storyGeneratorButtonSecondary: {
        gridColumn: '1 / -1',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: 'var(--border-radius-main, 6px)',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 600,
    },
    storyResultContainer: {
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '20px',
        marginTop: '20px',
        backgroundColor: 'var(--section-bg, white)',
        padding: '20px',
        borderRadius: 'var(--border-radius-main, 8px)',
        border: '1px solid #d1d9e6',
    },
    storyImageColumn: {},
    storyTextColumn: {},
    storyResultHeader: {
        marginTop: 0,
    },
    storyImagePlaceholder: {
        width: '100%',
        aspectRatio: '1 / 1',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ccc',
        borderRadius: 'var(--border-radius-main, 8px)',
    },
    storyImage: {
        width: '100%',
        height: 'auto',
        borderRadius: 'var(--border-radius-main, 8px)',
    },
    storyTextPlaceholder: {
        backgroundColor: '#f0f0f0',
        minHeight: '200px',
        borderRadius: 'var(--border-radius-main, 8px)',
        padding: '15px',
        color: '#ccc'
    },
    storyTextArea: {
        whiteSpace: 'pre-wrap',
        lineHeight: 1.7,
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '10px',
    },
};
