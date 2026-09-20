
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { FamilyMessage } from '../types';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

interface MessagesViewProps {
    initialRecipientId?: string | null;
    onClearInitialRecipient: () => void;
}

export default function MessagesView({ initialRecipientId, onClearInitialRecipient }: MessagesViewProps) {
    const { 
        familyMessages, profiles, currentViewingProfile, getProfileName, 
        messageHandlers, onNavigateToMessages, onNavigate 
    } = useAppContext();

    if (!currentViewingProfile) {
        return React.createElement('div', {style: styles.loadingMessage}, 'Loading profile...');
    }

    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
    const [newRecipientId, setNewRecipientId] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversations = useMemo(() => {
        const convos: Record<string, { participants: string[], lastMessage: FamilyMessage, unread: boolean }> = {};
        
        // Family Chat
        const familyMessagesList = familyMessages.filter(m => m.recipientId === null);
        if (familyMessagesList.length > 0) {
            const lastMessage = [...familyMessagesList].sort((a,b) => b.timestamp - a.timestamp)[0];
            convos['family'] = {
                participants: ['family'],
                lastMessage,
                unread: !lastMessage.readBy?.includes(currentViewingProfile.id)
            };
        }

        // Direct Messages
        familyMessages.forEach(msg => {
            if (msg.recipientId) {
                const otherParticipantId = msg.authorId === currentViewingProfile.id ? msg.recipientId : msg.authorId;
                if (!convos[otherParticipantId] || msg.timestamp > convos[otherParticipantId].lastMessage.timestamp) {
                    convos[otherParticipantId] = {
                        participants: [msg.authorId, msg.recipientId],
                        lastMessage: msg,
                        unread: !msg.readBy?.includes(currentViewingProfile.id) && msg.authorId !== currentViewingProfile.id
                    };
                }
            }
        });

        return Object.entries(convos).sort(([, a], [, b]) => b.lastMessage.timestamp - a.lastMessage.timestamp);

    }, [familyMessages, currentViewingProfile.id]);

    useEffect(() => {
        if (initialRecipientId) {
            setSelectedConversationId(initialRecipientId);
            onClearInitialRecipient();
        } else if (conversations.length > 0 && !selectedConversationId) {
            setSelectedConversationId(conversations[0][0]);
        }
    }, [initialRecipientId, conversations, onClearInitialRecipient, selectedConversationId]);

    const activeConversationMessages = useMemo(() => {
        if (!selectedConversationId) return [];
        const isFamilyChat = selectedConversationId === 'family';
        
        const messages = familyMessages.filter(msg => {
            if (isFamilyChat) return msg.recipientId === null;
            return (msg.authorId === currentViewingProfile.id && msg.recipientId === selectedConversationId) ||
                   (msg.authorId === selectedConversationId && msg.recipientId === currentViewingProfile.id);
        }).sort((a, b) => a.timestamp - b.timestamp);
        
        // Mark as read
        const unreadMessageIds = messages
            .filter(m => m.authorId !== currentViewingProfile.id && !m.readBy?.includes(currentViewingProfile.id))
            .map(m => m.id);
        if (unreadMessageIds.length > 0) {
            messageHandlers.markAsRead(unreadMessageIds);
        }

        return messages;
    }, [selectedConversationId, familyMessages, currentViewingProfile.id, messageHandlers]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversationMessages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessageText.trim() || !selectedConversationId) return;

        await messageHandlers.add({
            text: newMessageText.trim(),
            authorId: currentViewingProfile.id,
            authorName: currentViewingProfile.name,
            timestamp: Date.now(),
            recipientId: selectedConversationId === 'family' ? null : selectedConversationId,
            readBy: [currentViewingProfile.id]
        });
        setNewMessageText('');
    };
    
    const handleStartNewConversation = () => {
        if (!newRecipientId) return;
        onNavigateToMessages(newRecipientId);
        setIsNewMessageModalOpen(false);
    };

    const getConversationTitle = (convoId: string): string => {
        if (convoId === 'family') return "👨‍👩‍👧‍👦 Family Chat";
        return getProfileName(convoId);
    };

    return (
        React.createElement('div', { style: { ...styles.pageContainer, display: 'flex', gap: '20px', height: 'calc(100vh - 60px)' } },
            React.createElement('div', { style: { flex: '0 0 300px', display: 'flex', flexDirection: 'column' } },
                React.createElement('h3', { style: { ...styles.sectionTitle, marginTop: 0 } }, "Conversations"),
                React.createElement('button', {onClick: () => setIsNewMessageModalOpen(true), style: {...styles.button, marginBottom: '10px'}}, 'New Message'),
                React.createElement('div', { style: { overflowY: 'auto', flexGrow: 1 } },
                    conversations.map(([convoId, convo]) => (
                        React.createElement('div', {
                            key: convoId,
                            onClick: () => setSelectedConversationId(convoId),
                            style: {
                                padding: '10px',
                                cursor: 'pointer',
                                borderLeft: `4px solid ${selectedConversationId === convoId ? 'var(--primary-color)' : 'transparent'}`,
                                backgroundColor: selectedConversationId === convoId ? 'var(--accent-color-light)' : 'transparent',
                                fontWeight: convo.unread ? 'bold' : 'normal'
                            }
                        }, getConversationTitle(convoId))
                    ))
                )
            ),
            React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--section-bg)', borderRadius: 'var(--border-radius-main)', overflow: 'hidden' } },
                selectedConversationId ? (
                    React.createElement(React.Fragment, null,
                        React.createElement('div', { style: { padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold' } }, getConversationTitle(selectedConversationId)),
                        React.createElement('div', { style: { flexGrow: 1, overflowY: 'auto', padding: '15px' } },
                            activeConversationMessages.map((msg, index) => (
                                React.createElement('div', { 
                                    key: index, 
                                    style: msg.authorId === currentViewingProfile.id ? styles.chatbotUserMessage : styles.chatbotModelMessage 
                                },
                                    msg.authorId !== currentViewingProfile.id && React.createElement('strong', {style: {display: 'block', fontSize: '0.8em', marginBottom: '3px'}}, msg.authorName),
                                    msg.text
                                )
                            )),
                            React.createElement('div', {ref: messagesEndRef})
                        ),
                        React.createElement('form', { onSubmit: handleSendMessage, style: styles.chatbotInputForm },
                            React.createElement('input', { type: 'text', value: newMessageText, onChange: e => setNewMessageText(e.target.value), style: styles.input, placeholder: 'Type your message...' }),
                            React.createElement('button', { type: 'submit', style: styles.chatbotSendButton }, "Send")
                        )
                    )
                ) : (
                    React.createElement(EmptyState, {icon: '💬', title: 'Select a conversation', message: 'Choose a chat from the left to get started.'})
                )
            ),
            isNewMessageModalOpen && React.createElement(Modal, {isOpen: true, onClose: () => setIsNewMessageModalOpen(false), title: 'New Message', children:
                React.createElement('div', null,
                    React.createElement('div', {style: styles.formGroup},
                        React.createElement('label', {htmlFor: 'recipient'}, 'To:'),
                        React.createElement('select', {id: 'recipient', value: newRecipientId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setNewRecipientId(e.target.value), style: styles.selectInput},
                            React.createElement('option', {value: ''}, 'Select a person...'),
                            profiles.filter(p => p.id !== currentViewingProfile.id).map(p => React.createElement('option', {key: p.id, value: p.id}, p.name))
                        )
                    ),
                    React.createElement('button', {onClick: handleStartNewConversation, style: styles.button}, 'Start Conversation')
                )
            })
        )
    );
}
