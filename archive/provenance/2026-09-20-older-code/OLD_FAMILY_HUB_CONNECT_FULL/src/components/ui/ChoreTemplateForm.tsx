

import React, { useState } from 'react';
import type { Chore } from '../../types/index.ts';
import { styles } from '../../styles/index.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ChoreTemplateFormProps {
    initialData?: Chore | null;
    onSave: (data: Partial<Chore>) => Promise<void>;
    onClose?: () => void;
    onDelete?: (id: string) => Promise<void>;
}

export default function ChoreTemplateForm({ initialData, onSave, onClose, onDelete }: ChoreTemplateFormProps) {
    const { addToast } = useAppContext();
    const [name, setName] = useState(initialData?.name || '');
    const [points, setPoints] = useState(String(initialData?.points || '10'));
    const [requiresPhoto, setRequiresPhoto] = useState(initialData?.requiresPhoto || false);
    const [isBonus, setIsBonus] = useState(initialData?.isBonus || false);
    const [bonusAmount, setBonusAmount] = useState(String(initialData?.bonusAmount || '5'));
    const [minAge, setMinAge] = useState(String(initialData?.minAge || ''));
    const [maxAge, setMaxAge] = useState(String(initialData?.maxAge || ''));
    const [recurrenceType, setRecurrenceType] = useState<'none' | 'daily' | 'weekly'>(initialData?.recurrenceType || 'none');
    const [recurrenceDays, setRecurrenceDays] = useState<number[]>(initialData?.recurrenceDays || []);

    const handleRecurrenceDayToggle = (dayIndex: number) => {
        setRecurrenceDays(prev => 
            prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort()
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) { addToast("Template name is required.", 'info'); return; }
        
        const numPoints = parseInt(points, 10);
        const numBonusAmount = parseFloat(bonusAmount);

        if (!isBonus && (isNaN(numPoints) || numPoints < 0)) { addToast("Please enter valid, non-negative points.", 'info'); return; }
        if (isBonus && (isNaN(numBonusAmount) || numBonusAmount <= 0)) { addToast("Please enter a valid, positive bonus amount.", 'info'); return; }

        const numMinAge = minAge ? parseInt(minAge, 10) : undefined;
        const numMaxAge = maxAge ? parseInt(maxAge, 10) : undefined;
        if (numMinAge !== undefined && numMaxAge !== undefined && numMinAge > numMaxAge) { addToast("Min age cannot be greater than max age.", 'info'); return; }
        
        if (recurrenceType === 'weekly' && recurrenceDays.length === 0) {
            addToast("Please select at least one day for weekly recurring chores.", 'info'); return;
        }

        const choreData: Partial<Chore> = {
            name: name.trim(),
            points: isBonus ? 0 : numPoints,
            requiresPhoto,
            isBonus,
            bonusAmount: isBonus ? numBonusAmount : undefined,
            minAge: numMinAge,
            maxAge: numMaxAge,
            isRecurring: recurrenceType !== 'none',
            recurrenceType,
            recurrenceDays: recurrenceType === 'weekly' ? recurrenceDays : (recurrenceType === 'daily' ? [0,1,2,3,4,5,6] : []),
        };

        if (!initialData) {
            Object.assign(choreData, {
                assignedTo: null, status: 'pending', photoProofUrl: null, templateChoreId: null, dueDate: null,
            });
        }

        await onSave(choreData);
        if(!initialData) {
            // Reset form only on creation
            setName(''); setPoints('10'); setRequiresPhoto(false); setIsBonus(false);
            setBonusAmount('5'); setMinAge(''); setMaxAge(''); setRecurrenceType('none');
            setRecurrenceDays([]);
        }
    };

    return (
        React.createElement('form', { onSubmit: handleSubmit, style: {display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'flex-start'} },
            React.createElement('div', {style:{...styles.formGroup, gridColumn: '1 / -1'}}, React.createElement('label', {htmlFor: 'templateName', style: styles.label}, 'Template Name:'), React.createElement('input', {type: 'text', id: 'templateName', value: name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value), style: styles.input, required: true})),
            !isBonus && React.createElement('div', {style:styles.formGroup}, React.createElement('label', {htmlFor: 'templatePoints', style: styles.label}, 'Points:'), React.createElement('input', {type: 'number', id: 'templatePoints', value: points, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPoints(e.target.value), style: styles.input, required: !isBonus})),
            isBonus && React.createElement('div', {style:styles.formGroup}, React.createElement('label', {htmlFor: 'templateBonus', style: styles.label}, 'Bonus Amount ($):'), React.createElement('input', {type: 'number', id: 'templateBonus', value: bonusAmount, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setBonusAmount(e.target.value), style: styles.input, required: isBonus, min: "0.01", step: "0.01"})),
            React.createElement('div', {style:styles.formGroup}, React.createElement('label', {style: styles.checkboxLabel}, React.createElement('input', {type: 'checkbox', checked: requiresPhoto, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRequiresPhoto(e.target.checked)}), 'Requires Photo Proof?')),
            React.createElement('div', {style:styles.formGroup}, React.createElement('label', {style: styles.checkboxLabel}, React.createElement('input', {type: 'checkbox', checked: isBonus, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setIsBonus(e.target.checked)}), 'Is Bonus ($) Chore?')),
            React.createElement('div', {style:styles.formGroup}, React.createElement('label', {htmlFor: 'templateMinAge', style: styles.label}, 'Min Age (Opt.):'), React.createElement('input', {type: 'number', id: 'templateMinAge', value: minAge, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMinAge(e.target.value), style: styles.input})),
            React.createElement('div', {style:styles.formGroup}, React.createElement('label', {htmlFor: 'templateMaxAge', style: styles.label}, 'Max Age (Opt.):'), React.createElement('input', {type: 'number', id: 'templateMaxAge', value: maxAge, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMaxAge(e.target.value), style: styles.input})),
            React.createElement('div', {style:styles.formGroup}, 
                React.createElement('label', {htmlFor: 'templateRecurrenceType', style: styles.label}, 'Repeats:'), 
                React.createElement('select', {id: 'templateRecurrenceType', value: recurrenceType, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setRecurrenceType(e.target.value as any), style: styles.selectInput}, 
                    React.createElement('option', {value: 'none'}, 'Does not repeat'),
                    React.createElement('option', {value: 'weekly'}, 'Weekly'), 
                    React.createElement('option', {value: 'daily'}, 'Daily')
                )
            ),
            recurrenceType === 'weekly' && React.createElement('div', {style:{...styles.formGroup, gridColumn: '1 / -1'}}, React.createElement('label', {style: styles.label}, 'On Days:'), React.createElement('div', {style:{display: 'flex', flexWrap: 'wrap', gap: '5px'}}, DAYS_OF_WEEK.map((day, i) => React.createElement('button', {type: 'button', key: i, onClick: () => handleRecurrenceDayToggle(i), style:{...styles.button, width: 'auto', padding: '8px 12px', fontSize: '0.9em', backgroundColor: recurrenceDays.includes(i) ? '#007bff' : '#ccc'}}, day.substring(0,3))))),
            
            React.createElement('div', {style:{gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px'}},
                 onClose && React.createElement('button', {type: 'button', onClick: onClose, style: {...styles.button, ...styles.buttonSecondary, ...styles.modalButton}}, 'Cancel'),
                 onDelete && initialData && React.createElement('button', {type: 'button', onClick: () => onDelete(initialData.id), style: {...styles.button, backgroundColor: '#dc3545', color: 'white', marginRight: 'auto', ...styles.modalButton}}, 'Delete'),
                 React.createElement('button', {type: 'submit', style: {...styles.button, ...styles.modalButton}}, initialData ? 'Save Changes' : 'Add New Chore Template')
            )
        )
    );
}
