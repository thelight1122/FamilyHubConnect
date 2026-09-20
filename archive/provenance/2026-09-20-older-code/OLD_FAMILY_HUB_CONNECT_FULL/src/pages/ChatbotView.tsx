import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import { supabase } from '../services/supabaseClient';

interface ChatbotViewProps {
    isEmbedded?: boolean;
    systemInstruction?: string;
}

const ChatbotView: React.FC<ChatbotViewProps> = ({ isEmbedded = false, systemInstruction }) => {
    const { 
        currentViewingProfile, onNavigate, IS_TESTING_MODE, ...fullContext 
    } = useAppContext();
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, parts: [{ text: input }] };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const history = [...messages, userMessage];

        if (IS_TESTING_MODE) {
            setTimeout(() => {
                const mockResponse = { role: 'model' as const, parts: [{ text: `This is a mock response to: "${input}"` }] };
                setMessages(prev => [...prev, mockResponse]);
                setIsLoading(false);
            }, 500);
            return;
        }

        try {
            const { data, error } = await supabase.functions.invoke('ai-handler', {
                body: {
                    endpoint: 'chatbot',
                    prompt: input,
                    history: history,
                    context: {
                        currentViewingProfile,
                        personalizationData: fullContext.personalizationData,
                        chores: fullContext.chores,
                        familyEvents: fullContext.familyEvents,
                        shoppingListItems: fullContext.shoppingListItems,
                        familyProfiles: fullContext.profiles,
                        weeklyMealPlan: fullContext.weeklyMealPlan,
                    },
                    ...(systemInstruction && { systemInstruction })
                }
            });

            if (error) throw error;
            
            const modelResponse = { role: 'model' as const, parts: [{ text: data.text }] };
            setMessages(prev => [...prev, modelResponse]);

        } catch (error: any) {
            const errorMessage = { role: 'model' as const, parts: [{ text: `Sorry, I encountered an error: ${error.message}` }] };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const containerStyle: React.CSSProperties = isEmbedded 
        ? { height: '100%', display: 'flex', flexDirection: 'column' }
        : { ...styles.pageContainer, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 125px)' };

    return React.createElement('div', { style: containerStyle },
        !isEmbedded && React.createElement('h2', { style: styles.pageHeader }, "🤖 AI Family Assistant"),
        React.createElement('div', { style: { ...styles.chatbotMessageContainer, flexGrow: 1 } },
            React.createElement('div', { ref: messagesEndRef }),
            messages.map((msg, index) => (
                React.createElement('div', { key: index, style: msg.role === 'user' ? styles.chatbotUserMessage : styles.chatbotModelMessage },
                    msg.parts[0].text
                )
            )),
            isLoading && React.createElement('div', { style: styles.chatbotModelMessage }, 'Thinking...')
        ),
        React.createElement('form', { onSubmit: handleSendMessage, style: styles.chatbotInputForm },
            React.createElement('input', {
                type: 'text',
                value: input,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
                style: styles.input,
                placeholder: "Ask about your family hub...",
                disabled: isLoading
            }),
            React.createElement('button', { type: 'submit', style: styles.chatbotSendButton, disabled: isLoading }, 'Send')
        )
    );
};

export default ChatbotView;

// Add chatbot specific styles to the main stylesheet object
Object.assign(styles, {
    chatbotMessageContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: 'var(--section-bg)',
        borderRadius: '8px',
        border: '1px solid #eee',
        marginBottom: '10px'
    },
    chatbotUserMessage: {
        backgroundColor: 'var(--primary-color, #4a90e2)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '15px 15px 0 15px',
        maxWidth: '80%',
        alignSelf: 'flex-end',
        marginBottom: '10px',
        marginLeft: 'auto'
    },
    chatbotModelMessage: {
        backgroundColor: '#e9ecef',
        color: 'var(--text-color)',
        padding: '10px 15px',
        borderRadius: '15px 15px 15px 0',
        maxWidth: '80%',
        alignSelf: 'flex-start',
        marginBottom: '10px',
        marginRight: 'auto'
    },
    chatbotInputForm: {
        display: 'flex',
        gap: '10px',
    },
    chatbotSendButton: {
        ...styles.button,
        width: 'auto'
    }
});
