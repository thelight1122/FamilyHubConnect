import React, { useMemo } from 'react';
import { useAppState } from '../AppContext.tsx';
import ChatbotView from './ChatbotView.tsx';
import { ArrowLeftIcon } from '../components.tsx';

interface HomeworkHelperViewProps {
    onBack: () => void;
}

export default function HomeworkHelperView({ onBack }: HomeworkHelperViewProps) {
    const { viewingAsProfileId, profiles } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);

    if (!currentViewingProfile) {
        return <div className="page">Loading profile...</div>;
    }
    
    const helperSystemInstruction = `You are an AI Homework Helper. You can help with a wide range of subjects like math, science, history, and literature. You should guide users to the answer without giving it away directly. Encourage critical thinking. Keep your tone friendly, encouraging, and appropriate for all ages. Start by introducing yourself as an AI tutor.`;

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>💡 AI Homework Helper</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <ChatbotView
                    systemInstruction={helperSystemInstruction}
                    isEmbedded={true}
                />
            </main>
        </div>
    );
}