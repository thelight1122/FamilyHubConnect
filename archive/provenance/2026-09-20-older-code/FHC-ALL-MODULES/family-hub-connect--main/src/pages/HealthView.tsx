

import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import type { HealthLog } from '../types.ts';
import { Modal, EmptyState, AIHelperWidget, LoadingSpinner, ArrowLeftIcon } from '../components.tsx';

const HealthLogForm: React.FC<{
    onSave: (data: Omit<HealthLog, 'id' | 'profileId' | 'timestamp'> & { timestamp: number }) => void;
    onClose: () => void;
    log?: HealthLog | null;
}> = ({ onSave, onClose, log }) => {
    const [symptoms, setSymptoms] = useState(log?.symptoms || '');
    const [temperature, setTemperature] = useState(String(log?.temperature || ''));
    const [notes, setNotes] = useState(log?.notes || '');
    const [logDate, setLogDate] = useState(new Date(log?.timestamp || Date.now()).toISOString().substring(0, 16));
    const [aiSummary, setAiSummary] = useState('');
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    
    const { addToast, getSymptomAnalysis } = useAppDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!symptoms.trim()) { addToast("Symptoms are required.", 'info'); return; }
        onSave({
            symptoms, temperature: temperature ? parseFloat(temperature) : undefined,
            notes, timestamp: new Date(logDate).getTime(),
        });
    };
    
    const handleGetAISummary = async () => {
        if (!symptoms.trim()) { addToast("Please enter symptoms to analyze.", 'info'); return; }
        setIsLoadingAi(true);
        setAiSummary('');
        try {
            const summary = await getSymptomAnalysis(symptoms);
            setAiSummary(summary);
        } catch (e: any) {
            addToast("Could not get AI summary.", 'info');
        } finally {
            setIsLoadingAi(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="logDate">Date & Time</label>
                <input id="logDate" type="datetime-local" value={logDate} onChange={(e) => setLogDate(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="symptoms">Symptoms</label>
                <textarea id="symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} required />
            </div>
            <div className="form-group">
                <label htmlFor="temperature">Temperature (°F) (optional)</label>
                <input id="temperature" type="number" step="0.1" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>
            <AIHelperWidget title="AI Symptom Analyzer" description="Get general information about the entered symptoms. This is not medical advice.">
                <button type="button" onClick={handleGetAISummary} className="btn btn-info w-auto" disabled={isLoadingAi}>
                    {isLoadingAi ? "Analyzing..." : "Get AI Analysis"}
                </button>
                {isLoadingAi && <LoadingSpinner message="" />}
                {aiSummary && (
                    <div className="ai-suggestion-box">
                        <p><strong>AI Summary:</strong> {aiSummary}</p>
                    </div>
                )}
            </AIHelperWidget>
            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn">Save Log</button>
            </div>
        </form>
    );
};

interface HealthViewProps {
  onBack: () => void;
}

export default function HealthView({ onBack }: HealthViewProps) {
    const { addHealthLog } = useAppDispatch();
    const { healthLogs, profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<HealthLog | null>(null);

    const handleOpenModal = (log?: HealthLog) => {
        setEditingLog(log || null);
        setIsModalOpen(true);
    };

    const handleSaveLog = (data: Omit<HealthLog, 'id' | 'profileId'>) => {
        if (!currentViewingProfile) return;
        addHealthLog({ ...data, profileId: currentViewingProfile.id });
        setIsModalOpen(false);
    };
    
    const myHealthLogs = useMemo(() => {
        if (!currentViewingProfile) return [];
        return healthLogs
            .filter(log => log.profileId === currentViewingProfile.id)
            .sort((a, b) => b.timestamp - a.timestamp);
    }, [healthLogs, currentViewingProfile]);

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBack} aria-label="Back">
                    <ArrowLeftIcon />
                </button>
                <h2>🩺 Health Log</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <button onClick={() => handleOpenModal()} className="btn w-auto mb-20">+ Log a Symptom/Event</button>
                {myHealthLogs.length > 0 ? myHealthLogs.map(log => (
                    <div key={log.id} className="card">
                        <p><strong>Symptoms:</strong> {log.symptoms}</p>
                        {log.temperature && <p><strong>Temperature:</strong> {log.temperature}°F</p>}
                        {log.notes && <p><strong>Notes:</strong> {log.notes}</p>}
                        <p className="text-light text-sm">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                )) : (
                    <EmptyState icon="❤️‍🩹" title="No Health Logs" message="Log any symptoms or health events to keep a record." />
                )}
            </main>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLog ? "Edit Health Log" : "New Health Log"}>
                <HealthLogForm log={editingLog} onClose={() => setIsModalOpen(false)} onSave={handleSaveLog} />
            </Modal>
        </div>
    );
}