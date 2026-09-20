import React, { useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { useCountdown } from './hooks';
import { FamilyCourtCase, Profile } from './types';
import { styles } from './styles';

const CaseForm = ({ onSave, editingCase, profiles }: { onSave: (data: Partial<FamilyCourtCase>) => void, editingCase: FamilyCourtCase | null, profiles: Profile[] }) => {
    const [title, setTitle] = useState(editingCase?.title || '');
    const [description, setDescription] = useState(editingCase?.description || '');
    const [plaintiffId, setPlaintiffId] = useState(editingCase?.plaintiffId || '');
    const [defendantId, setDefendantId] = useState(editingCase?.defendantId || '');
    const [verdict, setVerdict] = useState(editingCase?.verdict || '');
    const [consequence, setConsequence] = useState(editingCase?.consequence || '');
    const [customConsequence, setCustomConsequence] = useState('');
    const [consequenceDurationHours, setConsequenceDurationHours] = useState(editingCase?.consequenceDurationHours || 0);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalConsequence = consequence === 'Custom' ? customConsequence : consequence;
        onSave({ title, description, plaintiffId, defendantId, verdict, consequence: finalConsequence, consequenceDurationHours });
    };
    
    const consequenceOptions = ["", "Lose phone privileges", "Time Out", "Restriction to room", "Custom"];

    return (
        <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}><label htmlFor="case-title" style={styles.label}>Case Title</label><input id="case-title" style={styles.input} value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div style={styles.formGroup}><label htmlFor="case-desc" style={styles.label}>Description</label><textarea id="case-desc" style={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} /></div>
            <div style={styles.formGroup}><label htmlFor="case-plaintiff" style={styles.label}>Plaintiff (Accuser)</label>
                <select id="case-plaintiff" style={styles.selectInput} value={plaintiffId} onChange={e => setPlaintiffId(e.target.value)}>
                    <option value="">Select a person</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <div style={styles.formGroup}><label htmlFor="case-defendant" style={styles.label}>Defendant (Accused)</label>
                 <select id="case-defendant" style={styles.selectInput} value={defendantId} onChange={e => setDefendantId(e.target.value)}>
                    <option value="">Select a person</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            {editingCase && <>
                <div style={styles.formGroup}>
                    <label htmlFor="case-verdict" style={styles.label}>Verdict</label>
                    <select id="case-verdict" style={styles.selectInput} value={verdict} onChange={e => setVerdict(e.target.value)}>
                        <option value="">-- Select Verdict --</option>
                        <option value="Guilty">Guilty</option>
                        <option value="Not Guilty">Not Guilty</option>
                        <option value="Dismissed">Dismissed</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="case-consequence" style={styles.label}>Consequence</label>
                    <select id="case-consequence" style={styles.selectInput} value={consequence} onChange={e => setConsequence(e.target.value)}>
                        {consequenceOptions.map(opt => <option key={opt} value={opt}>{opt || '-- Select Consequence --'}</option>)}
                    </select>
                </div>
                {consequence === 'Custom' && (
                    <div style={styles.formGroup}><label htmlFor="custom-consequence" style={styles.label}>Custom Consequence</label><input id="custom-consequence" style={styles.input} value={customConsequence} onChange={e => setCustomConsequence(e.target.value)} /></div>
                )}
                <div style={styles.formGroup}><label htmlFor="consequence-duration" style={styles.label}>Consequence Duration (in hours)</label><input id="consequence-duration" style={styles.input} type="number" value={consequenceDurationHours} onChange={e => setConsequenceDurationHours(Number(e.target.value))} /></div>
            </>}
            <button type="submit" style={styles.button}>Save Case</button>
        </form>
    );
};

const CaseDetails = ({ caseData, onStartHearing }: { caseData: FamilyCourtCase, onStartHearing: (courtCase: FamilyCourtCase) => void }) => {
    const { profiles } = useAppContext();
    const getProfileName = (id: string) => profiles.find(p => p.id === id)?.name || 'N/A';
    
    const endTime = (caseData.verdictTimestamp || 0) + ((caseData.consequenceDurationHours || 0) * 60 * 60 * 1000);
    const { days, hours, minutes, seconds, isFinished } = useCountdown(endTime);

    return (
        <div>
            <h3>{caseData.title}</h3>
            <p><strong>Plaintiff:</strong> {getProfileName(caseData.plaintiffId)}</p>
            <p><strong>Defendant:</strong> {getProfileName(caseData.defendantId)}</p>
            <p><strong>Description:</strong> {caseData.description}</p>
            <hr style={{margin: '15px 0', border: 'none', borderTop: '1px solid #f0f2f5'}} />
            <h4>Verdict & Consequence</h4>
            {caseData.status === 'Open' ? (
                 <button onClick={() => onStartHearing(caseData)} style={{...styles.button, width: '100%'}}>Start/Resume Hearing</button>
            ) : (
                <>
                    <p><strong>Verdict:</strong> {caseData.verdict || 'Not yet decided'}</p>
                    <p><strong>Consequence:</strong> {caseData.consequence || 'N/A'}</p>
                    {caseData.consequenceDurationHours && caseData.consequenceDurationHours > 0 && (
                        <div>
                            <strong>Time Remaining:</strong>
                            {isFinished ? (
                                <p style={{color: 'green', fontWeight: 'bold'}}>Consequence Served!</p>
                            ) : (
                                <p style={{fontSize: '1.2em', fontWeight: 'bold'}}>{`${days}d ${hours}h ${minutes}m ${seconds}s`}</p>
                            )}
                        </div>
                    )}
                     <button onClick={() => onStartHearing(caseData)} style={{...styles.button, ...styles.buttonSecondary, width: 'auto', marginTop: '10px'}}>Edit Case</button>
                </>
            )}
        </div>
    );
};

const RollCallModal = ({ caseData, onClose, onComplete, onJoinVideoCall }: { caseData: FamilyCourtCase, onClose: () => void, onComplete: () => void, onJoinVideoCall: () => void }) => {
    const { profiles, currentViewingProfile } = useAppContext();
    const parents = profiles.filter(p => p.role === 'Admin' || p.role === 'Parent');
    const defendant = profiles.find(p => p.id === caseData.defendantId);
    const requiredAttendees = [...new Map([...parents, defendant].filter(Boolean).map(item => [item['id'], item])).values()];
    
    const [checkedIn, setCheckedIn] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        const otherAttendees = requiredAttendees.filter(p => p.id !== currentViewingProfile.id);
        otherAttendees.forEach((p, index) => {
            setTimeout(() => {
                setCheckedIn(prev => ({...prev, [p.id]: true}));
            }, (index + 1) * 2000); // Stagger the check-ins
        });
    }, [requiredAttendees, currentViewingProfile.id]);

    const handleCheckIn = (profileId: string) => {
        setCheckedIn(prev => ({...prev, [profileId]: true}));
    };

    const allCheckedIn = requiredAttendees.every(p => checkedIn[p.id]);

    return (
        <Modal onClose={onClose} title={`Roll Call: ${caseData.title}`}>
            <p>Please confirm all required members are present to proceed.</p>
            <button onClick={onJoinVideoCall} style={{...styles.button, ...styles.buttonSuccess, width: '100%', margin: '15px 0'}}>📹 Join Video Call</button>
            <div style={{margin: '20px 0'}}>
                {requiredAttendees.map(p => (
                    <div key={p.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '8px'}}>
                        <span>{p.name} ({p.role})</span>
                        {checkedIn[p.id] ? (
                            <span style={{color: 'green', fontWeight: 'bold'}}>Present</span>
                        ) : (
                            p.id === currentViewingProfile.id ? (
                                <button onClick={() => handleCheckIn(p.id)} style={{...styles.button, padding: '5px 10px'}}>Check-in</button>
                            ) : (
                                <span style={{color: '#95a5a6'}}>Pending...</span>
                            )
                        )}
                    </div>
                ))}
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button onClick={onComplete} disabled={!allCheckedIn} style={styles.button}>Proceed to Hearing</button>
            </div>
        </Modal>
    );
};

const VideoCallModal = ({ caseData, onClose }: { caseData: FamilyCourtCase, onClose: () => void }) => {
    const { profiles } = useAppContext();
    const parents = profiles.filter(p => p.role === 'Admin' || p.role === 'Parent');
    const defendant = profiles.find(p => p.id === caseData.defendantId);
    const attendees = [...new Map([...parents, defendant].filter(Boolean).map(item => [item['id'], item])).values()];

    return (
        <Modal onClose={onClose} title="Video Conference">
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px'}}>
                {attendees.map(p => (
                    <div key={p.id} style={{backgroundColor: '#2c3e50', color: 'white', borderRadius: '8px', padding: '20px', textAlign: 'center'}}>
                        <div style={{fontSize: '3em'}} role="img" aria-label="User avatar">👤</div>
                        <p>{p.name}</p>
                    </div>
                ))}
            </div>
            <div style={{...styles.formActions, justifyContent: 'center'}}>
                <button onClick={onClose} style={{...styles.button, ...styles.buttonDanger}}>Leave Call</button>
            </div>
        </Modal>
    );
};

const FamilyCourtView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, addToast, profiles } = useAppContext();
    const [isCaseFormOpen, setIsCaseFormOpen] = useState(false);
    const [isRollCallOpen, setIsRollCallOpen] = useState(false);
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<FamilyCourtCase | null>(null);
    const [selectedCase, setSelectedCase] = useState<FamilyCourtCase | null>(personalizationData.familyCourtCases ? personalizationData.familyCourtCases[0] : null);

    const familyCourtCases = personalizationData.familyCourtCases || [];

    const openCaseForm = (courtCase?: FamilyCourtCase) => {
        setEditingCase(courtCase || null);
        setIsCaseFormOpen(true);
    };
    
    const startHearing = (courtCase: FamilyCourtCase) => {
        setSelectedCase(courtCase);
        setIsRollCallOpen(true);
    };
    
    const handleRollCallComplete = () => {
        setIsRollCallOpen(false);
        if (selectedCase) {
           openCaseForm(selectedCase);
        }
    };

    const handleSave = (data: Partial<FamilyCourtCase>) => {
        let newCases;
        let savedCase: FamilyCourtCase;
        if (editingCase) {
            const newStatus: "Open" | "Closed" = data.verdict ? 'Closed' : 'Open';
            const updates = { ...data, status: newStatus, verdictTimestamp: data.verdict ? Date.now() : editingCase.verdictTimestamp };
            savedCase = { ...editingCase, ...updates };
            newCases = familyCourtCases.map(c => c.id === editingCase.id ? savedCase : c);
            addToast("Case updated!", 'badge');
        } else {
            savedCase = { ...data, id: `case_${Date.now()}`, status: 'Open' } as FamilyCourtCase;
            newCases = [...familyCourtCases, savedCase];
            addToast("Case filed!", 'badge');
        }
        onSavePersonalization({ familyCourtCases: newCases });
        setSelectedCase(savedCase);
        setIsCaseFormOpen(false);
    };

    const getProfileName = (id: string) => profiles.find(p => p.id === id)?.name || 'N/A';

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                 <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('familyMatters')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>⚖️ Family Court</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <button onClick={() => openCaseForm()} style={{...styles.button, width: 'auto', marginBottom: '20px'}}>+ File a New Case</button>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px'}}>
                        {familyCourtCases.map(courtCase => (
                            <div key={courtCase.id} style={{...styles.section, marginBottom: 0, cursor: 'pointer', border: selectedCase?.id === courtCase.id ? '2px solid #3498db' : '1px solid transparent'}} onClick={() => setSelectedCase(courtCase)}>
                                <h3>{courtCase.title}</h3>
                                <p><strong>Status:</strong> {courtCase.status}</p>
                                <p>{getProfileName(courtCase.plaintiffId)} vs. {getProfileName(courtCase.defendantId)}</p>
                            </div>
                        ))}
                        {familyCourtCases.length === 0 && <p>The docket is clear! No cases have been filed.</p>}
                    </div>
                    
                    <div style={styles.section}>
                        {selectedCase ? <CaseDetails caseData={selectedCase} onStartHearing={startHearing} /> : <p>Select a case to view details.</p>}
                    </div>
                </div>
                
                {isRollCallOpen && selectedCase && (
                    <RollCallModal 
                        caseData={selectedCase}
                        onClose={() => setIsRollCallOpen(false)}
                        onComplete={handleRollCallComplete}
                        onJoinVideoCall={() => setIsVideoCallOpen(true)}
                    />
                )}

                {isVideoCallOpen && selectedCase && (
                    <VideoCallModal
                        caseData={selectedCase}
                        onClose={() => setIsVideoCallOpen(false)}
                    />
                )}

                {isCaseFormOpen && (
                    <Modal onClose={() => setIsCaseFormOpen(false)} title={editingCase ? 'Edit Case' : 'File a New Case'}>
                        <CaseForm onSave={handleSave} editingCase={editingCase} profiles={profiles} />
                    </Modal>
                )}
            </main>
            <BottomNavbar activePage="familyCourt" onNavigate={onNavigate} />
        </div>
    );
};

export default FamilyCourtView;