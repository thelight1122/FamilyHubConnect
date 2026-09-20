
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import ChatbotView from './ChatbotView';

interface HomeworkHelperViewProps {
    onBack: () => void;
}

export default function HomeworkHelperView({ onBack }: HomeworkHelperViewProps) {
    const { currentViewingProfile } = useAppContext();

    if (!currentViewingProfile) {
        return React.createElement('div', {style: styles.loadingMessage}, 'Loading profile...');
    }
    
    const tutorSystemInstruction = `You are a friendly and encouraging academic tutor. Your goal is to help students understand concepts, not just give them the answers. When asked a question, guide them with leading questions, break down the problem, or explain the underlying concepts. Never provide the final answer directly. For example, if asked "What is 25*4?", respond with "That's a great question! What's 25*2? Can you do that twice?". If asked for an essay, help them brainstorm and structure it, but do not write it for them.`;

    return (
        React.createElement('div', { style: { ...styles.pageContainer, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' } },
            React.createElement('div', null,
                React.createElement('button', {
                    onClick: onBack,
                    style: { ...styles.backButton, float: 'left' },
                    'aria-label': "Back"
                }, "← Back"),
                React.createElement('div', { style: { clear: 'both' } })
            ),
            React.createElement('h2', { style: styles.pageHeader }, "💡 Homework Helper"),
            React.createElement(ChatbotView, {
                systemInstruction: tutorSystemInstruction,
                isEmbedded: true
            })
        )
    );
}
