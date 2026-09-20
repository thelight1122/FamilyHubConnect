import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import { useAppDispatch } from '../AppContext.tsx';

interface ChatbotViewProps {
    isEmbedded?: boolean;
    systemInstruction?: string;
}

const ChatbotView: React.FC<ChatbotViewProps> = ({ isEmbedded = false, systemInstruction }) => {
    const { onNavigate } = useAppDispatch();
    const [messages, setMessages] = useState<Content[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Automatically send the initial system message if provided
        const sendInitialMessage = async () => {
            if (systemInstruction && messages.length === 0) {
                setIsLoading(true);
                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                     const response: GenerateContentResponse = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: "What should I say first?",
                        config: {
                           systemInstruction: systemInstruction,
                        },
                    });
                    const modelResponse = { role: 'model' as const, parts: [{ text: response.text }] };
                    setMessages([modelResponse]);
                } catch (error: any) {
                    const errorMessage = { role: 'model' as const, parts: [{ text: `Sorry, I encountered an error: ${error.message}` }] };
                    setMessages([errorMessage]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        sendInitialMessage();
    }, [systemInstruction, messages.length]);


    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Content = { role: 'user' as const, parts: [{ text: input }] };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: updatedMessages, // Pass the whole history
                config: {
                   systemInstruction: systemInstruction,
                },
            });
            const modelResponse = { role: 'model' as const, parts: [{ text: response.text }] };
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
        : { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 125px)' };

    return (
        <div style={containerStyle}>
            {!isEmbedded && <h2>🤖 AI Family Assistant</h2>}
            <div className="card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{
                            background: msg.role === 'user' ? 'var(--primary)' : '#e9ecef',
                            color: msg.role === 'user' ? 'white' : 'var(--text)',
                            padding: '10px 15px',
                            borderRadius: '15px',
                            maxWidth: '80%',
                            marginBottom: '10px',
                            marginLeft: msg.role === 'user' ? 'auto' : '0',
                            marginRight: msg.role === 'user' ? '0' : 'auto',
                        }}>
                            {msg.parts?.[0]?.text ?? ''}
                        </div>
                    ))}
                    {isLoading && <div style={{ color: '#666' }}>Thinking...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
                    <input
                        type='text'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your family hub..."
                        disabled={isLoading}
                        className="flex-grow"
                    />
                    <button type='submit' className="btn w-auto" disabled={isLoading}>Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatbotView;