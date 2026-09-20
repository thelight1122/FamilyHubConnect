import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { ShoutOut, Profile } from './types';

// --- MODALS ---
const ShoutOutModal = ({ onClose, onSave, profiles }: { onClose: () => void; onSave: (toProfileId: string, message: string) => void; profiles: Profile[]; }) => {
    const { currentViewingProfile } = useAppContext();
    const [toProfileId, setToProfileId] = useState('');
    const [message, setMessage] = useState('');

    const otherProfiles = profiles.filter(p => p.id !== currentViewingProfile.id);

    return (
        <Modal onClose={onClose} title="Give a Shout-Out">
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="shout-out-to">To:</label>
                <select id="shout-out-to" style={styles.selectInput} value={toProfileId} onChange={e => setToProfileId(e.target.value)} required>
                    <option value="">Select a family member</option>
                    {otherProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="shout-out-message">Message:</label>
                <textarea id="shout-out-message" style={{...styles.textarea, minHeight: 120}} value={message} onChange={e => setMessage(e.target.value)} placeholder="What did they do that was awesome?" required />
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button onClick={() => onSave(toProfileId, message)} style={styles.button} disabled={!toProfileId || !message}>Send Shout-Out</button>
            </div>
        </Modal>
    );
};

// --- EMOJI PICKER ---
const EmojiPicker = ({ onSelectEmoji }: { onSelectEmoji: (emoji: string) => void }) => {
    const emojis = ['❤️', '👍', '🎉', '🙌', '😄'];
    return (
        <div style={styles.emojiPicker}>
            {emojis.map(emoji => (
                <button key={emoji} onClick={() => onSelectEmoji(emoji)} style={styles.emojiButton}>
                    {emoji}
                </button>
            ))}
        </div>
    );
};

// --- MAIN VIEW ---
const ShoutOutsView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, profiles, currentViewingProfile, addToast } = useAppContext();
    const allShoutOuts = useMemo(() => (personalizationData.shoutOuts || []).sort((a, b) => b.timestamp - a.timestamp), [personalizationData.shoutOuts]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reactingTo, setReactingTo] = useState<string | null>(null);

    const getProfile = (id: string): Profile | undefined => profiles.find(p => p.id === id);

    const handleSaveShoutOut = (toProfileId: string, message: string) => {
        const newShoutOut: ShoutOut = {
            id: `shout_${Date.now()}`,
            fromProfileId: currentViewingProfile.id,
            toProfileId,
            message,
            timestamp: Date.now(),
            reactions: {}
        };
        onSavePersonalization({ shoutOuts: [...allShoutOuts, newShoutOut] });
        addToast("Shout-out sent!", 'badge');
        setIsModalOpen(false);
    };

    const handleAddReaction = (shoutOutId: string, emoji: string) => {
        const updatedShoutOuts = allShoutOuts.map(so => {
            if (so.id === shoutOutId) {
                const newReactions = { ...so.reactions, [currentViewingProfile.id]: emoji };
                return { ...so, reactions: newReactions };
            }
            return so;
        });
        onSavePersonalization({ shoutOuts: updatedShoutOuts });
        setReactingTo(null);
    };

    const formatTimestamp = (ts: number) => {
        const seconds = Math.floor((Date.now() - ts) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>📣 Shout-Outs</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <button onClick={() => setIsModalOpen(true)} style={{...styles.button, width: '100%', marginBottom: '20px'}}>+ Give a Shout-Out</button>
                
                {allShoutOuts.map(so => {
                    const fromProfile = getProfile(so.fromProfileId);
                    const toProfile = getProfile(so.toProfileId);

                    if (!fromProfile || !toProfile) return null;

                    return (
                        <div key={so.id} style={styles.shoutOutCard}>
                            <div style={styles.shoutOutHeader}>
                                <div style={styles.shoutOutAvatar}>{fromProfile.name.charAt(0)}</div>
                                <p style={styles.shoutOutHeaderText}>{fromProfile.name} gave a shout-out to {toProfile.name}!</p>
                            </div>
                            <blockquote style={styles.shoutOutMessage}>{so.message}</blockquote>
                            <div style={styles.shoutOutFooter}>
                                <div style={styles.reactionsContainer}>
                                    {Object.entries(so.reactions).map(([profileId, emoji]) => (
                                        <div key={profileId} style={styles.reactionBubble} title={getProfile(profileId)?.name}>
                                            {emoji}
                                        </div>
                                    ))}
                                    {reactingTo === so.id ? (
                                        <EmojiPicker onSelectEmoji={(emoji) => handleAddReaction(so.id, emoji)} />
                                    ) : (
                                        <button onClick={() => setReactingTo(so.id)} style={{...styles.button, padding: '5px 10px', fontSize: '0.9em', ...styles.buttonSecondary}}>
                                            +😄
                                        </button>
                                    )}
                                </div>
                                <span style={{fontSize: '0.85em', color: '#7f8c8d'}}>{formatTimestamp(so.timestamp)}</span>
                            </div>
                        </div>
                    );
                })}
                {allShoutOuts.length === 0 && (
                    <div style={styles.section}>
                        <p>No shout-outs yet. Be the first to praise someone in the family!</p>
                    </div>
                )}
            </main>
            
            {isModalOpen && <ShoutOutModal onClose={() => setIsModalOpen(false)} onSave={handleSaveShoutOut} profiles={profiles} />}
            <BottomNavbar activePage="shoutOuts" onNavigate={onNavigate} />
        </div>
    );
};

export default ShoutOutsView;