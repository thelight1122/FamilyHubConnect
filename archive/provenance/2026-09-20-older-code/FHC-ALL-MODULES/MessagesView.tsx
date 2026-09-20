import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { Message, MessageChannel } from './types';

const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const DraftAiModal = ({ onClose, onDraft, isLoading }: { onClose: () => void; onDraft: (prompt: string) => void; isLoading: boolean; }) => {
    const [prompt, setPrompt] = useState('');

    return (
        <Modal onClose={onClose} title="Draft with AI">
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="draft-prompt">What's the message about?</label>
                <textarea
                    id="draft-prompt"
                    style={styles.textarea}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g., Remind everyone about pizza night on Friday"
                />
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
                <button onClick={() => onDraft(prompt)} style={styles.button} disabled={isLoading || !prompt}>
                    {isLoading ? '🧠 Thinking...' : 'Generate Draft'}
                </button>
            </div>
        </Modal>
    );
};


const MessagesView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, profiles, currentViewingProfile, addToast } = useAppContext();
    const allMessages = useMemo(() => (personalizationData.messages || []), [personalizationData.messages]);
    const allChannels = useMemo(() => (personalizationData.messageChannels || []), [personalizationData.messageChannels]);
    
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const getProfileName = (id: string) => profiles.find(p => p.id === id)?.name || 'Unknown';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessages, selectedChannelId]);

    const myChannels = useMemo(() => {
        return allChannels.filter(c => c.memberIds.includes(currentViewingProfile.id));
    }, [allChannels, currentViewingProfile.id]);
    
    const getLastMessage = (channelId: string) => {
        return allMessages.filter(m => m.channelId === channelId).sort((a,b) => b.timestamp - a.timestamp)[0];
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChannelId) return;

        const message: Message = {
            id: `msg_${Date.now()}`,
            channelId: selectedChannelId,
            senderId: currentViewingProfile.id,
            content: newMessage.trim(),
            timestamp: Date.now(),
        };
        onSavePersonalization({ messages: [...allMessages, message] });
        setNewMessage('');
    };

    const handleDraftWithAI = async (prompt: string) => {
        if (!process.env.API_KEY) {
            addToast("API Key is not configured.", 'info');
            return;
        }
        setIsLoadingAi(true);
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const fullPrompt = `Based on the following prompt, write a friendly and clear message suitable for a family chat.
            Prompt: "${prompt}"
            Respond with only the message content, no extra text or labels.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
            });
            
            setNewMessage(response.text.trim().replace(/"/g, ''));
            setIsDraftModalOpen(false);

        } catch (error) {
            console.error("Error drafting message with AI:", error);
            addToast("Couldn't generate a draft. Please try again.", 'info');
        } finally {
            setIsLoadingAi(false);
        }
    };

    if (!selectedChannelId) { // Channel List View
        return (
            <div style={styles.pageContainer}>
                <header style={styles.header}>
                    <button style={{ ...styles.navButton, flexShrink: 0, width: 40 }} onClick={() => onNavigate('dashboard')}>
                        <ArrowLeftIcon />
                    </button>
                    <h2 style={styles.pageHeader}>💬 Messages</h2>
                    <div style={{ flexShrink: 0, width: 40 }}></div>
                </header>
                <main style={styles.mainContent}>
                    <div style={styles.channelList}>
                        {myChannels.map(channel => {
                            const lastMsg = getLastMessage(channel.id);
                            return (
                                <div key={channel.id} style={styles.channelListItem} onClick={() => setSelectedChannelId(channel.id)}>
                                    <h3 style={styles.channelName}>{channel.name}</h3>
                                    <p style={styles.lastMessage}>
                                        {lastMsg ? `${getProfileName(lastMsg.senderId)}: ${lastMsg.content}` : 'No messages yet.'}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </main>
                <BottomNavbar activePage="messages" onNavigate={onNavigate} />
            </div>
        );
    }
    
    // Chat View
    const selectedChannel = allChannels.find(c => c.id === selectedChannelId);
    const channelMessages = allMessages.filter(m => m.channelId === selectedChannelId).sort((a,b) => a.timestamp - b.timestamp);

    return (
        <div style={{...styles.pageContainer, height: '100vh', boxSizing: 'border-box'}}>
            <header style={styles.header}>
                <button style={{ ...styles.navButton, flexShrink: 0, width: 40 }} onClick={() => setSelectedChannelId(null)}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>{selectedChannel?.name || 'Chat'}</h2>
                <div style={{ flexShrink: 0, width: 40 }}></div>
            </header>
            <main style={{...styles.mainContent, flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '10px 10px 0', overflowY: 'hidden'}}>
                <div style={styles.messagesContainer}>
                    {channelMessages.map(msg => {
                        const isSelf = msg.senderId === currentViewingProfile.id;
                        const bubbleStyle = isSelf ? {...styles.messageBubble, ...styles.messageBubbleSelf} : {...styles.messageBubble, ...styles.messageBubbleOther};
                        return (
                             <div key={msg.id} style={bubbleStyle}>
                                {!isSelf && <div style={styles.messageSender}>{getProfileName(msg.senderId)}</div>}
                                <p style={styles.messageContent}>{msg.content}</p>
                                <span style={styles.messageTimestamp}>{formatTimestamp(msg.timestamp)}</span>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <form style={styles.chatInputForm} onSubmit={handleSendMessage}>
                    <button type="button" onClick={() => setIsDraftModalOpen(true)} style={{...styles.button, ...styles.buttonSecondary, padding: '0 15px'}}>🤖</button>
                    <input
                        style={styles.chatInput}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit" style={styles.sendButton} aria-label="Send message">➢</button>
                </form>
            </main>
            {isDraftModalOpen && (
                <DraftAiModal
                    onClose={() => setIsDraftModalOpen(false)}
                    onDraft={handleDraftWithAI}
                    isLoading={isLoadingAi}
                />
            )}
        </div>
    );
};

export default MessagesView;