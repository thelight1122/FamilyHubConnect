

import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ArrowLeftIcon, BottomNavbar } from '../components.tsx';

export default function FamilyConstitutionView() {
    const { onSavePersonalization, onNavigate, addToast } = useAppDispatch();
    const { personalizationData, viewingAsProfileId, profiles } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const [isEditMode, setIsEditMode] = useState(false);
    
    const familyFoundations = personalizationData?.familyFoundations || { content: '', acknowledgements: {} };
    const [content, setContent] = useState(familyFoundations.content);


    const isAcknowledged = currentViewingProfile && familyFoundations?.acknowledgements[currentViewingProfile.id];
    const isParent = currentViewingProfile?.role === 'Admin' || currentViewingProfile?.role === 'Parent';
    
    const handleSave = () => {
        onSavePersonalization({ familyFoundations: { ...familyFoundations, content } });
        addToast("Constitution saved!", 'badge');
        setIsEditMode(false);
    };

    const handleAcknowledge = () => {
        if (!currentViewingProfile) return;
        const newAcks = { ...(familyFoundations?.acknowledgements || {}), [currentViewingProfile.id]: Date.now() };
        onSavePersonalization({ familyFoundations: { ...familyFoundations, acknowledgements: newAcks } });
        addToast("Thank you for acknowledging!", 'badge');
    };

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" title="Go back to Family Matters" onClick={() => onNavigate('familyMatters')}>
                    <ArrowLeftIcon />
                </button>
                <h2>📜 Family Constitution</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    {isEditMode ? (
                        <>
                            <label htmlFor="constitution-content" className="visually-hidden">Edit Family Constitution</label>
                            <textarea 
                                id="constitution-content" 
                                value={content} 
                                onChange={(e) => setContent(e.target.value)} 
                                rows={15} 
                                placeholder="Write your family constitution here..." 
                            />
                            <div className="form-actions">
                                <button onClick={() => setIsEditMode(false)} className="btn btn-secondary">Cancel</button>
                                <button onClick={handleSave} className="btn">Save</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="constitution-content">{familyFoundations?.content || "No constitution written yet."}</div>
                            <div className="card-actions">
                                {isParent && <button onClick={() => setIsEditMode(true)} className="btn btn-secondary">Edit</button>}
                                {!isAcknowledged && <button onClick={handleAcknowledge} className="btn btn-success">Acknowledge & Agree</button>}
                            </div>
                        </>
                    )}
                </section>
                <section className="card">
                    <h3>Acknowledgements</h3>
                    {profiles.map(p => {
                        const ackDate = familyFoundations.acknowledgements[p.id];
                        return (
                            <p key={p.id} className="ack-item">
                                <span className="ack-name">{`${p.name}: `}</span>
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