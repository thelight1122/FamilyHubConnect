import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar } from './components';
import { styles } from './styles';

type Mode = 'explain' | 'summarize' | 'practice';

const HomeworkHelperView = () => {
    const { onNavigate, addToast, currentViewingProfile } = useAppContext();
    const isChildView = currentViewingProfile?.role === 'Child';
    
    const [mode, setMode] = useState<Mode>('explain');
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');

    const handleSubmit = async () => {
        if (!input.trim()) return;
        if (!process.env.API_KEY) {
            addToast("API Key is not configured.", 'info');
            return;
        }
        
        setIsLoading(true);
        setResponse('');

        let prompt = '';
        switch(mode) {
            case 'explain':
                prompt = `You are a helpful and friendly tutor. Explain the following concept in a simple and clear way, as if you were talking to a ${currentViewingProfile.age || 12}-year-old student. Concept: "${input}"`;
                break;
            case 'summarize':
                prompt = `You are a helpful assistant. Summarize the following text into the key points. Make it easy to understand for a ${currentViewingProfile.age || 12}-year-old. Text: "${input}"`;
                break;
            case 'practice':
                prompt = `You are a teacher creating a worksheet. Generate 5 practice questions about the following topic. Include the answers separately at the bottom under a clear "Answers" heading. Topic: "${input}"`;
                break;
        }

        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setResponse(result.text);
        } catch (error) {
            console.error("Error with Homework Helper:", error);
            addToast("The AI couldn't help with that. Please try again.", 'info');
        } finally {
            setIsLoading(false);
        }
    };

    const getPlaceholderText = () => {
        switch(mode) {
            case 'explain': return "e.g., Photosynthesis";
            case 'summarize': return "Paste a paragraph or article here...";
            case 'practice': return "e.g., The American Revolution";
        }
    }
    
    const getButtonText = () => {
        switch(mode) {
            case 'explain': return "Get Explanation";
            case 'summarize': return "Summarize Text";
            case 'practice': return "Get Practice Questions";
        }
    }

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('digitalDesk')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>✏️ {isChildView ? 'Brain Boost' : 'Homework Helper'}</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <div style={styles.homeworkHelperTabs}>
                    <button onClick={() => setMode('explain')} style={mode === 'explain' ? styles.homeworkHelperTabActive : styles.homeworkHelperTab}>Explain</button>
                    <button onClick={() => setMode('summarize')} style={mode === 'summarize' ? styles.homeworkHelperTabActive : styles.homeworkHelperTab}>Summarize</button>
                    <button onClick={() => setMode('practice')} style={mode === 'practice' ? styles.homeworkHelperTabActive : styles.homeworkHelperTab}>Practice</button>
                </div>

                <section style={styles.section}>
                    <textarea 
                        style={{...styles.textarea, minHeight: '150px'}}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={getPlaceholderText()}
                    />
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '15px'}}>
                        <button style={styles.button} onClick={handleSubmit} disabled={isLoading || !input.trim()}>
                            {isLoading ? '🧠 Thinking...' : getButtonText()}
                        </button>
                    </div>
                </section>

                {isLoading && (
                    <div style={{...styles.section, textAlign: 'center'}}>
                        <p>The AI is working on an answer for you...</p>
                    </div>
                )}
                
                {response && !isLoading && (
                    <section style={{...styles.section, whiteSpace: 'pre-wrap', lineHeight: 1.6}}>
                         <h3 style={{marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #f0f2f5'}}>AI Response</h3>
                         <div>{response}</div>
                    </section>
                )}
            </main>
            <BottomNavbar activePage="digitalDesk" onNavigate={onNavigate} />
        </div>
    );
};

export default HomeworkHelperView;
