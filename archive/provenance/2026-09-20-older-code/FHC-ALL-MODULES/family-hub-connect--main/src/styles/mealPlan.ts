//mealPlan.ts
//mealplan.ts
import type { CSSProperties } from 'react';

export const mealPlanStyles: { [key: string]: CSSProperties } = {
    mealPlanGrid: {
        display: 'grid',
        gridTemplateColumns: 'auto repeat(7, 1fr)',
        gap: '5px',
        marginTop: '20px',
    },
    mealPlanGridHeader: {
        padding: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'var(--accent-color-light, #e9f5ff)',
        borderRadius: '4px',
        minWidth: '80px',
    },
    mealPlanCell: {
        border: '1px solid #eee',
        minHeight: '80px',
        padding: '8px',
        borderRadius: '4px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    mealPlanCellContent: {
        textAlign: 'center',
        width: '100%',
        position: 'relative',
    },
    mealPlanClearButton: {
        position: 'absolute',
        top: '2px',
        right: '2px',
        background: 'rgba(0,0,0,0.4)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        lineHeight: '20px',
        textAlign: 'center',
        fontSize: '1em',
        transition: 'background-color 0.2s',
    },
    mealPlanAddButton: {
        background: 'none',
        border: '2px dashed #ccc',
        borderRadius: '50%',
        color: '#ccc',
        width: '30px',
        height: '30px',
        fontSize: '1.5em',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
};
