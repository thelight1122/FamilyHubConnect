import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar } from './components';
import { styles } from './styles';

const FamilyFoundationsView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, currentViewingProfile, profiles, addToast } = useAppContext();
    const [isEditMode, setIsEditMode] = useState(false);
    const [content, setContent] = useState(personalizationData.familyFoundations?.content || '');

    const familyFoundations = personalizationData.familyFoundations || { content: '', acknowledgements: {} };

    const isAcknowledged = currentViewingProfile && familyFoundations.acknowledgements[currentViewingProfile.id];
    const isParent = currentViewingProfile?.role === 'Admin' || currentViewingProfile?.role === 'Parent';
    
    const handleSave = () => {
        onSavePersonalization({ familyFoundations: { ...familyFoundations, content } });
        addToast("Constitution saved!", 'badge');
        setIsEditMode(false);
    };

    const handleAcknowledge = () => {
        if (!currentViewingProfile) return;
        const newAcks = { ...familyFoundations.acknowledgements, [currentViewingProfile.id]: Date.now() };
        onSavePersonalization({ familyFoundations: { ...familyFoundations, acknowledgements: newAcks } });
        addToast("Thank you for acknowledging!", 'badge');
    };

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                 <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('familyMatters')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>📜 Family Foundations</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <section style={styles.section}>
                    {isEditMode ? (
                        <>
                            <label htmlFor="constitution-editor" style={styles.label}>Family Constitution</label>
                            <textarea id="constitution-editor" style={{...styles.textarea, minHeight: 300}} value={content} onChange={(e) => setContent(e.target.value)} />
                            <div style={styles.formActions}>
                                <button onClick={() => setIsEditMode(false)} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                                <button onClick={handleSave} style={styles.button}>Save Constitution</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{whiteSpace: 'pre-wrap', padding: '10px', border: '1px solid #eee', borderRadius: '8px', minHeight: '200px', backgroundColor: '#fdfdfd' }}>
                                {familyFoundations.content || "No constitution written yet."}
                            </div>
                            <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                {isParent && <button onClick={() => setIsEditMode(true)} style={{...styles.button, ...styles.buttonSecondary}}>Edit</button>}
                                {!isAcknowledged && <button onClick={handleAcknowledge} style={{...styles.button, ...styles.buttonSuccess}}>Acknowledge & Agree</button>}
                            </div>
                        </>
                    )}
                </section>
                <section style={styles.section}>
                    <h3>Acknowledgements</h3>
                    {profiles.map(p => {
                        const ackDate = familyFoundations.acknowledgements[p.id];
                        return (
                            <p key={p.id} style={{borderBottom: '1px solid #f0f2f5', paddingBottom: '8px', marginBottom: '8px'}}>
                                <span style={{fontWeight: 'bold'}}>{p.name}: </span>
                                {ackDate ? `Acknowledged on ${new Date(ackDate).toLocaleDateString()}` : 'Not yet acknowledged'}
                            </p>
                        )
                    })}
                </section>
            </main>
            <BottomNavbar activePage="familyFoundations" onNavigate={onNavigate} />
        </div>
    );
}

export default FamilyFoundationsView;