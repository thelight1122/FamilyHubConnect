//calendar.ts

import type { CSSProperties } from 'react';

export const calendarStyles: { [key: string]: CSSProperties } = {
    calendarHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    calendarMonthYear: {
        fontSize: '1.5em',
        margin: 0,
    },
    calendarNavButton: {
        background: 'none',
        border: '1px solid #ccc',
        borderRadius: 'var(--border-radius-main, 8px)',
        padding: '8px 12px',
        cursor: 'pointer',
    },
    calendarGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '5px',
    },
    calendarDayHeader: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingBottom: '10px',
    },
    calendarDayCell: {
        border: '1px solid #eee',
        minHeight: '120px',
        padding: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    calendarDayCellNotInMonth: {
        backgroundColor: '#f9f9f9',
        color: '#ccc',
    },
    calendarDayToday: {
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
    },
    calendarDayNumber: {
        textAlign: 'right',
        fontSize: '0.9em',
    },
    calendarDayNumberToday: {
        textAlign: 'right',
        fontWeight: 'bold',
        color: 'var(--primary-color, #4a90e2)',
    },
    calendarTodoItem: {
        fontSize: '0.8em',
        padding: '3px 5px',
        borderRadius: '4px',
        backgroundColor: '#fffbe6',
        border: '1px solid #ffe58f',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    calendarEventItem: {
        fontSize: '0.8em',
        padding: '3px 5px',
        borderRadius: '4px',
        backgroundColor: '#e9f5ff',
        border: '1px solid #b3d7ff',
        fontWeight: 'bold',
    },
    calendarTodoStatusDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        flexShrink: 0,
    },
    calendarTripItem: {
        fontSize: '0.8em',
        padding: '3px 5px',
        borderRadius: '4px',
        backgroundColor: '#e4f9e4',
        border: '1px solid #a3e9a3',
        fontWeight: 'bold',
    },
    calendarMealItem: {
        fontSize: '0.8em',
        padding: '3px 5px',
        borderRadius: '4px',
        backgroundColor: '#fdeaea',
        border: '1px solid #f9c5c5',
    },
    calendarEventSyncedIcon: {
        marginRight: '5px',
    },
};
