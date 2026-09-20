

import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import type { Infraction, ConsequenceType } from '../types';
import { ArrowLeftIcon } from '../components';

export default function TimeOutView({ onBack }: { onBack: () => void }) {
    const { profiles, viewingAsProfileId } = useAppState();
    const { addInfraction } = useAppDispatch();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const [childId, setChildId] = useState('');
    const [reason, setReason] = useState('');
    const [consequenceType, setConsequenceType] = useState<ConsequenceType>('time_out');
    const [consequenceValue, setConsequenceValue] = useState('');
    const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

    const childProfiles = profiles.filter(p => p.role === 'Child');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!childId || !reason || !consequenceType || !consequenceValue || !currentViewingProfile) {
            alert('Please fill out all required fields.');
            return;
        }

        await addInfraction({
            child_id: childId,
            created_by: currentViewingProfile.id,
            reason,
            consequence_type: consequenceType,
            consequence_value: consequenceValue,
            status: 'active',
            evidence_urls: [], // In a real app, upload file first to get URL
            created_at: new Date().toISOString(),
            completed_at: null,
        });
        
        onBack();
    };

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>⏳ Create Infraction</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <form onSubmit={handleSubmit} className="card">
                    <div className="form-group">
                        <label>Child</label>
                        <select value={childId} onChange={(e) => setChildId(e.target.value)} required>
                            <option value="">Select a child...</option>
                            {childProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Reason for Infraction</label>
                        <input value={reason} onChange={e => setReason(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Consequence Type</label>
                        <select value={consequenceType} onChange={(e) => setConsequenceType(e.target.value as ConsequenceType)} required>
                            <option value="time_out">Time Out</option>
                            <option value="restriction">Restriction</option>
                            <option value="hearing_request">Request Family Court Hearing</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Consequence Details</label>
                        <input value={consequenceValue} onChange={e => setConsequenceValue(e.target.value)} required placeholder={consequenceType === 'time_out' ? 'e.g., 15 minutes' : 'e.g., No TV for one day'} />
                    </div>
                    <div className="form-group">
                        <label>Evidence (optional)</label>
                        <input type='file' accept='image/*' onChange={e => setEvidenceFile(e.target.files ? e.target.files[0] : null)} />
                    </div>
                    <button type="submit" className="btn w-100">Create Infraction</button>
                </form>
            </main>
        </div>
    );
}
