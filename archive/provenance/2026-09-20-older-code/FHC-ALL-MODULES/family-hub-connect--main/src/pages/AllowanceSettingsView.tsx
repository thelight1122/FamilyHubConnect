import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import type { DayOfWeek } from '../types.ts';
import { ArrowLeftIcon } from '../components.tsx';

export default function AllowanceSettingsView() {
    const { onSavePersonalization, addToast, onNavigate } = useAppDispatch();
    const { personalizationData } = useAppState();
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
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={() => onNavigate('settings')}>
                    <ArrowLeftIcon />
                </button>
                <h2>💰 Allowance Settings</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={enabled}
                                onChange={e => setEnabled(e.target.checked)}
                            />
                            Enable Weekly Allowance
                        </label>
                    </div>
                    {enabled && (
                        <>
                            <div className="form-group">
                                <label htmlFor="allowanceAmount">Weekly Amount ($)</label>
                                <input
                                    type="number"
                                    id="allowanceAmount"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="e.g., 5.00"
                                    min="0"
                                    step="0.50"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="allowancePayday">Payday</label>
                                <select
                                    id="allowancePayday"
                                    value={payday}
                                    onChange={(e) => setPayday(e.target.value as DayOfWeek)}
                                >
                                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => 
                                        <option key={day} value={day}>{day}</option>
                                    )}
                                </select>
                            </div>
                        </>
                    )}
                </section>
                <button
                    onClick={handleSave}
                    className="btn w-100"
                >
                    Save Settings
                </button>
            </main>
        </div>
    );
}