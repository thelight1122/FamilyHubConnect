import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import type { Medal, AwardedMedal, Profile } from '../types';
import { Modal, EmptyState, ArrowLeftIcon, BottomNavbar } from '../components';

export default function AccoladesView() {
    const { 
        addMedal, updateMedal, deleteMedal, addAwardedMedal, getProfileName, onNavigate
    } = useAppDispatch();
    const { profiles, viewingAsProfileId, medals, awardedMedals } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);

    const [isMedalModalOpen, setIsMedalModalOpen] = useState(false);
    const [editingMedal, setEditingMedal] = useState<Medal | null>(null);
    const [medalName, setMedalName] = useState('');
    const [medalDescription, setMedalDescription] = useState('');
    const [medalIcon, setMedalIcon] = useState('🏅');
    
    const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
    const [awardingMedal, setAwardingMedal] = useState<Medal | null>(null);
    const [awardToProfileId, setAwardToProfileId] = useState('');
    const [awardReason, setAwardReason] = useState('');

    const openMedalModal = (medal?: Medal) => {
        if (medal) {
            setEditingMedal(medal);
            setMedalName(medal.name);
            setMedalDescription(medal.description);
            setMedalIcon(medal.icon);
        } else {
            setEditingMedal(null);
            setMedalName('');
            setMedalDescription('');
            setMedalIcon('🏅');
        }
        setIsMedalModalOpen(true);
    };

    const handleSaveMedal = () => {
        if (!medalName || !medalDescription || !medalIcon) return;
        const medalData = { name: medalName, description: medalDescription, icon: medalIcon };
        if (editingMedal) {
            updateMedal(editingMedal.id, medalData);
        } else {
            addMedal(medalData);
        }
        setIsMedalModalOpen(false);
    };
    
    const handleDeleteMedal = () => {
        if(editingMedal && window.confirm("Are you sure you want to delete this medal template?")) {
            deleteMedal(editingMedal.id);
            setIsMedalModalOpen(false);
        }
    };

    const openAwardModal = (medal: Medal) => {
        setAwardingMedal(medal);
        setAwardToProfileId('');
        setAwardReason('');
        setIsAwardModalOpen(true);
    };

    const handleAwardMedal = () => {
        if (!awardingMedal || !awardToProfileId || !currentViewingProfile) return;
        const awardedMedalData = { 
            medalId: awardingMedal.id,
            profileId: awardToProfileId,
            awardedBy: currentViewingProfile.id,
            reason: awardReason,
            timestamp: Date.now()
        };
        addAwardedMedal(awardedMedalData);
        setIsAwardModalOpen(false);
    };
    
    const myMedals = awardedMedals.filter(am => am.profileId === currentViewingProfile?.id);
    const childProfiles = profiles.filter(p => p.role === 'Child');
    const isParentView = currentViewingProfile?.role === 'Admin' || currentViewingProfile?.role === 'Parent';

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('rewards')} title="Go back to rewards">
                    <ArrowLeftIcon />
                </button>
                <h2>🏅 Medals & Accolades</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 {!isParentView && (
                    <section className="card">
                        <h3>My Medals</h3>
                        {myMedals.length > 0 ? (
                            myMedals.map(am => {
                                const medal = medals.find(m => m.id === am.medalId);
                                return medal ? (
                                    <div key={am.id} className="accolade-item">
                                        <span className="accolade-icon">{medal.icon}</span>
                                        <div>
                                            <h4 className="accolade-name">{medal.name}</h4>
                                            <p className="accolade-description">{medal.description}</p>
                                            <p className="accolade-reason">Awarded by {getProfileName(am.awardedBy)} for: {am.reason}</p>
                                        </div>
                                    </div>
                                ) : null
                            })
                        ) : (
                            <EmptyState icon="🏅" title="No Medals Yet" message="You haven't been awarded any special medals yet. Keep up the great work!" />
                        )}
                    </section>
                        )}

                {isParentView && (
                    <section className="card">
                        <h3>Medal Management</h3>
                        <button onClick={() => openMedalModal()} className="btn w-auto mb-20">+ Create New Medal</button>
                        {medals.map(medal => (
                            <div key={medal.id} className="accolade-item">
                               <span className="accolade-icon">{medal.icon}</span>
                                <div>
                                    <h4 className="accolade-name">{medal.name}</h4>
                                    <p className="accolade-description">{medal.description}</p>
                                    <div className="accolade-actions">
                                        <div className="accolade-actions-container">
                                            <button onClick={() => openMedalModal(medal)} className="btn btn-secondary btn-sm">Edit</button>
                                            <button onClick={() => openAwardModal(medal)} className="btn btn-success btn-sm">Award</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                    )}
            </main>
            {isMedalModalOpen && (
                <Modal
                    isOpen={isMedalModalOpen}
                    onClose={() => setIsMedalModalOpen(false)}
                    title={editingMedal ? "Edit Medal" : "Create Medal"}
                >
                    <div className="form-group">
                        <label>Medal Name</label>
                        <input value={medalName} onChange={(e) => setMedalName(e.target.value)} placeholder="Enter medal name" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input value={medalDescription} onChange={(e) => setMedalDescription(e.target.value)} placeholder="Enter medal description" />
                    </div>
                    <div className="form-group">
                        <label>Icon</label>
                        <input 
                            value={medalIcon} 
                            onChange={(e) => setMedalIcon(e.target.value)} 
                            title="Medal Icon" 
                            placeholder="Enter medal icon" 
                        />
                    </div>
                    <div className="form-actions"> 
                        {editingMedal && <button onClick={handleDeleteMedal} className="btn btn-danger delete-button">Delete</button>}
                        <button onClick={() => setIsMedalModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button onClick={handleSaveMedal} className="btn">Save</button>
                    </div>
                </Modal>
            )}
            
            {isAwardModalOpen && (
                <Modal
                    isOpen={isAwardModalOpen}
                    onClose={() => setIsAwardModalOpen(false)}
                    title={`Award "${awardingMedal?.name}"`}
                >
                    <div className="form-group">
                        <label htmlFor="awardTo">Award To</label>
                        <select id="awardTo" value={awardToProfileId} onChange={(e) => setAwardToProfileId(e.target.value)}>
                            <option value="">Select a child...</option>
                            {childProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="awardReason">Reason for Award</label>
                        <textarea id="awardReason" value={awardReason} onChange={(e) => setAwardReason(e.target.value)} rows={3}/>
                    </div>
                    <div className="form-actions">
                        <button onClick={() => setIsAwardModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button onClick={handleAwardMedal} className="btn">Award Medal</button>
                    </div>
                </Modal>
            )}

            <BottomNavbar activePage="accolades" onNavigate={onNavigate} />
        </div>
    );
}