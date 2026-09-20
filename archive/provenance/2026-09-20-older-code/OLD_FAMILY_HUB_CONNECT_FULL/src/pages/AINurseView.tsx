import React from 'react';
import type { PageView } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import ChatbotView from './ChatbotView';

interface AINurseViewProps {
    onBack: () => void;
}

export default function AINurseView({ onBack }: AINurseViewProps) {
    const { currentViewingProfile } = useAppContext();

    if (!currentViewingProfile) {
        return React.createElement('div', {style: styles.loadingMessage}, 'Loading profile...');
    }
    
    // Customize the chatbot for the AI Nurse context
    const nurseSystemInstruction = `You are an AI Nurse assistant. Provide helpful, general information about health and wellness topics. You are not a real doctor. You must start every conversation by stating: "I am an AI assistant and not a medical professional. For any medical advice, please consult a real doctor." Do not provide diagnoses or prescribe treatments. Keep answers concise and easy to understand.`;

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: onBack,
                style: { ...styles.backButton, float: 'left' },
                'aria-label': "Back to Health Hub"
            }, "← Back to Health Hub"),
             React.createElement('div', {style: {clear: 'both'}}),
            React.createElement('h2', { style: styles.pageHeader }, "🤖 AI Nurse-Bot"),
            React.createElement(ChatbotView, {
                systemInstruction: nurseSystemInstruction,
                isEmbedded: true
            })
        )
    );
}
