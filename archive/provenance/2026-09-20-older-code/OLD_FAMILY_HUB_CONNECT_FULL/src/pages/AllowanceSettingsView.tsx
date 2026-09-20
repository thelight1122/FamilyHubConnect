import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { DayOfWeek } from '../types';

export default function AllowanceSettingsView() {
    const { personalizationData, onSavePersonalization, addToast, onNavigate } = useAppContext();
    const [enabled, setEnabled] = useState(personalizationData?.allowanceSettings?.enabled ?? false);
    const [amount, setAmount] = useState(String(personalizationData?.allowanceSettings?.amount ?? '5'));
    const [payday, setPayday] = useState<DayOfWeek>(personalizationData?.allowanceSettings?.payday ?? 'Saturday');

    const handleSave = async () => {
        const numAmount = parseFloat(amount);
        if (enabled && (isNaN(numAmount) || numAmount < 0)) {
            addToast("Please enter a valid, non-negative allowance amount.", 'info');
            return;
        }

        const newSettings = {
            enabled,
            amount: numAmount,
            payday,
            lastPayoutDate: personalizationData?.allowanceSettings?.lastPayoutDate
        };
        await onSavePersonalization({ allowanceSettings: newSettings });
        addToast("Allowance settings saved!", 'badge');
        onNavigate('settings');
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: () => onNavigate('settings'),
                style: { ...styles.backButton, float: 'left' },
                'aria-label': "Back to Settings"
            }, "← Back to Settings"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "💰 Allowance Settings"),

            React.createElement('section', { style: styles.section },
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { style: styles.checkboxLabel },
                        React.createElement('input', {
                            type: "checkbox",
                            style: styles.checkbox,
                            checked: enabled,
                            onChange: e => setEnabled(e.target.checked)
                        }),
                        "Enable Weekly Allowance"
                    )
                ),
                enabled && React.createElement(React.Fragment, null,
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: "allowanceAmount", style: styles.label }, "Weekly Amount ($)"),
                        React.createElement('input', {
                            type: "number",
                            id: "allowanceAmount",
                            style: styles.input,
                            value: amount,
                            onChange: e => setAmount(e.target.value),
                            placeholder: "e.g., 5.00",
                            min: "0",
                            step: "0.50"
                        })
                    ),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: "allowancePayday", style: styles.label }, "Payday"),
                        React.createElement('select', {
                            id: "allowancePayday",
                            style: styles.selectInput,
                            value: payday,
                            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setPayday(e.target.value as DayOfWeek)
                        },
                            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => 
                                React.createElement('option', { key: day, value: day }, day)
                            )
                        )
                    )
                )
            ),
             React.createElement('button', {
                onClick: handleSave,
                style: styles.button,
            }, 'Save Settings')
        )
    );
}
