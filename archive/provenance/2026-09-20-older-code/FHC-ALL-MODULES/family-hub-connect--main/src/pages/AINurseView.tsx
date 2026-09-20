

import React, { useMemo } from 'react';
import { useAppState } from '../AppContext.tsx';
import ChatbotView from './ChatbotView.tsx';
import { ArrowLeftIcon } from '../components.tsx';

interface AINurseViewProps {
    onBack: () => void;
}

export default function AINurseView({ onBack }: AINurseViewProps) {
    const { viewingAsProfileId, profiles } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);

    if (!currentViewingProfile) {
        return <div className="page">Loading profile...</div>;
    }
    
    const nurseSystemInstruction = `You are an AI Nurse assistant. You MUST start every single conversation by stating: "I am an AI assistant and not a medical professional. For any medical advice, please consult a real doctor." This is a safety requirement. After that disclaimer, you can provide helpful, general information about health and wellness topics. You are not a real doctor. Do not provide diagnoses or prescribe treatments. Keep answers concise and easy to understand for all ages.`;

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>🤖 AI Nurse-Bot</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <ChatbotView
                    systemInstruction={nurseSystemInstruction}
                    isEmbedded={true}
                />
            </main>
        </div>
    );
}