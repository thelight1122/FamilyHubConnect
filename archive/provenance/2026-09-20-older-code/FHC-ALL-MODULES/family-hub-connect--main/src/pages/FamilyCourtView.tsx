
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ArrowLeftIcon, BottomNavbar, Modal, LoadingSpinner, AIHelperWidget } from '../components.tsx';
import { useCountdown } from '../hooks/useCountdown.ts';
import type { FamilyCourtCase, Profile } from '../types.ts';

const CaseForm = ({ onSave, editingCase, profiles }: { onSave: (data: Partial<FamilyCourtCase>) => void, editingCase: FamilyCourtCase | null, profiles: Profile[] }) => {
    const [title, setTitle] = useState(editingCase?.title || '');
    const [description, setDescription] = useState(editingCase?.description || '');
    const [plaintiffId, setPlaintiffId] = useState(editingCase?.plaintiffId || '');
    const [defendantId, setDefendantId] = useState(editingCase?.defendantId || '');
    const [verdict, setVerdict] = useState(editingCase?.verdict || '');
    const [consequence, setConsequence] = useState(editingCase?.consequence || '');
    const [customConsequence, setCustomConsequence] = useState('');
    const [consequenceDurationHours, setConsequenceDurationHours] = useState(editingCase?.consequenceDurationHours || 0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalConsequence = consequence === 'Custom' ? customConsequence : consequence;
        onSave({ title, description, plaintiffId, defendantId, verdict, consequence: finalConsequence, consequenceDurationHours });
    };
    
    const consequenceOptions = ["", "Lose phone privileges", "Time Out", "Restriction to room", "Custom"];

    const handleGenerateSuggestion = async () => {
        if (!description) return;
        setIsGenerating(true);
        setAiSuggestion(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Based on the following family issue, suggest a fair and constructive consequence for a child: "${description}". Keep it brief.`;
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setAiSuggestion(response.text ?? null);
        } catch (error) {
            console.error("Error generating consequence suggestion:", error);
            setAiSuggestion("Could not generate a suggestion at this time.");
        } finally {
            setIsGenerating(false);
        }
    };

    const applySuggestion = () => {
        if (aiSuggestion) {
            setConsequence('Custom');
            setCustomConsequence(aiSuggestion);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group"><label htmlFor="case-title">Case Title</label><input id="case-title" value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="form-group"><label htmlFor="case-desc">Description</label><textarea id="case-desc" value={description} onChange={e => setDescription(e.target.value)} /></div>
            <div className="form-group"><label htmlFor="case-plaintiff">Plaintiff (Accuser)</label>
                <select id="case-plaintiff" value={plaintiffId} onChange={e => setPlaintiffId(e.target.value)}>
                    <option value="">Select a person</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <div className="form-group"><label htmlFor="case-defendant">Defendant (Accused)</label>
                <select id="case-defendant" value={defendantId} onChange={e => setDefendantId(e.target.value)}>
                    <option value="">Select a person</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            {editingCase && <>
                <div className="form-group">
                    <label htmlFor="case-verdict">Verdict</label>
                    <select id="case-verdict" value={verdict} onChange={e => setVerdict(e.target.value)}>
                        <option value="">-- Select Verdict --</option>
                        <option value="Guilty">Guilty</option>
                        <option value="Not Guilty">Not Guilty</option>
                        <option value="Dismissed">Dismissed</option>
                    </select>
                </div>

                <AIHelperWidget title="Need an idea?" description="Let AI suggest a fair consequence based on the case description.">
                    <button type="button" onClick={handleGenerateSuggestion} className="btn btn-info w-auto" disabled={isGenerating}>
                        {isGenerating ? "Thinking..." : "Suggest Consequence"}
                    </button>
                    {isGenerating && <LoadingSpinner message="" />}
                    {aiSuggestion && (
                        <div className="ai-suggestion-box">
                            <p><strong>Suggestion:</strong> {aiSuggestion}</p>
                            <button type="button" onClick={applySuggestion} className="btn btn-sm">Use this suggestion</button>
                        </div>
                    )}
                </AIHelperWidget>

                <div className="form-group">
                    <label htmlFor="case-consequence">Consequence</label>
                    <select id="case-consequence" value={consequence} onChange={e => setConsequence(e.target.value)}>
                        {consequenceOptions.map(opt => <option key={opt} value={opt}>{opt || '-- Select Consequence --'}</option>)}
                    </select>
                </div>
                {consequence === 'Custom' && (
                    <div className="form-group"><label htmlFor="custom-consequence">Custom Consequence</label><input id="custom-consequence" value={customConsequence} onChange={e => setCustomConsequence(e.target.value)} /></div>
                )}
                <div className="form-group"><label htmlFor="consequence-duration">Consequence Duration (in hours)</label><input id="consequence-duration" type="number" value={consequenceDurationHours} onChange={e => setConsequenceDurationHours(Number(e.target.value))} /></div>
            </>}
            <button type="submit" className="btn">Save Case</button>
        </form>
    );
};

const CaseDetails = ({ caseData, onStartHearing }: { caseData: FamilyCourtCase, onStartHearing: (courtCase: FamilyCourtCase) => void }) => {
    const { profiles } = useAppState();
    const { getProfileName } = useAppDispatch();
    
    const endTime = (caseData.verdictTimestamp || 0) + ((caseData.consequenceDurationHours || 0) * 60 * 60 * 1000);
    const { days, hours, minutes, seconds, isFinished } = useCountdown(endTime);

    return (
        <div className="case-details">
            <h3>{caseData.title}</h3>
            <p><strong>Plaintiff:</strong> {getProfileName(caseData.plaintiffId)}</p>
            <p><strong>Defendant:</strong> {getProfileName(caseData.defendantId)}</p>
            <p><strong>Description:</strong> {caseData.description}</p>
            <hr />
            <h4>Verdict & Consequence</h4>
            {caseData.status === 'Open' ? (
                 <button onClick={() => onStartHearing(caseData)} className="btn w-100">Start/Resume Hearing</button>
            ) : (
                <>
                    <p><strong>Verdict:</strong> {caseData.verdict || 'Not yet decided'}</p>
                    <p><strong>Consequence:</strong> {caseData.consequence || 'N/A'}</p>
                    {caseData.consequenceDurationHours && caseData.consequenceDurationHours > 0 && (
                        <div>
                            <strong>Time Remaining:</strong>
                            {isFinished ? (
                                <p className="timer-finished">Consequence Served!</p>
                            ) : (
                                <p className="text-large font-bold">{`${days}d ${hours}h ${minutes}m ${seconds}s`}</p>
                            )}
                        </div>
                    )}
                     <button onClick={() => onStartHearing(caseData)} className="btn btn-secondary w-auto mt-10">Edit Case</button>
                </>
            )}
        </div>
    );
};

const RollCallModal = ({ caseData, onClose, onComplete, onJoinVideoCall }: { caseData: FamilyCourtCase, onClose: () => void, onComplete: () => void, onJoinVideoCall: () => void }) => {
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const parents = profiles.filter(p => p.role === 'Admin' || p.role === 'Parent');
    const defendant = profiles.find(p => p.id === caseData.defendantId);
    const requiredAttendees = [...new Map([...parents, defendant].filter((item): item is Profile => !!item).map(item => [item.id, item])).values()];
    
    const [checkedIn, setCheckedIn] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!currentViewingProfile) return;
        const otherAttendees = requiredAttendees.filter(p => p.id !== currentViewingProfile.id);
        otherAttendees.forEach((p, index) => {
            setTimeout(() => {
                setCheckedIn(prev => ({ ...prev, [p.id]: true }));
            }, (index + 1) * 2000); // Stagger the check-ins
        });
    }, [requiredAttendees, currentViewingProfile?.id]);

    const handleCheckIn = (profileId: string) => {
        setCheckedIn(prev => ({ ...prev, [profileId]: true }));
    };

    const allCheckedIn = requiredAttendees.every(p => checkedIn[p.id]);

    if (!currentViewingProfile) return null;

    return (
        <Modal onClose={onClose} title={`Roll Call: ${caseData.title}`}>
            <p>Please confirm all required members are present to proceed.</p>
            <button onClick={onJoinVideoCall} className="btn btn-success w-100" style={{margin: '15px 0'}}>📹 Join Video Call</button>
            <div style={{ margin: '20px 0' }}>
                {requiredAttendees.map(p => (
                    <div key={p.id} className="roll-call-item">
                        <span>{`${p.name} (${p.role})`}</span>
                        {checkedIn[p.id] ? (
                            <span className="roll-call-present">Present</span>
                        ) : (
                            p.id === currentViewingProfile.id ? (
                                <button onClick={() => handleCheckIn(p.id)} className="btn btn-sm">Check-in</button>
                            ) : (
                                <span className="roll-call-pending">Pending...</span>
                            )
                        )}
                    </div>
                ))}
            </div>
            <div className="form-actions">
                <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button onClick={onComplete} disabled={!allCheckedIn} className="btn">Proceed to Hearing</button>
            </div>
        </Modal>
    );
};

const VideoCallModal = ({ caseData, onClose }: { caseData: FamilyCourtCase, onClose: () => void }) => {
    const { profiles } = useAppState();
    const parents = profiles.filter(p => p.role === 'Admin' || p.role === 'Parent');
    const defendant = profiles.find(p => p.id === caseData.defendantId);
    const attendees = [...new Map([...parents, defendant].filter((item): item is Profile => item !== undefined).map(item => [item.id, item])).values()];

    return (
        <Modal onClose={onClose} title="Video Conference">
            <div className="video-grid">
                {attendees.map(p => (
                    <div key={p.id} className="video-participant">
                        <div className="video-avatar" role="img" aria-label="User avatar">👤</div>
                        <p>{p.name}</p>
                    </div>
                ))}
            </div>
            <div className="form-actions justify-center">
                <button onClick={onClose} className="btn btn-danger">Leave Call</button>
            </div>
        </Modal>
    );
};

const FamilyCourtView = () => {
    const { onNavigate, onSavePersonalization, addToast, getProfileName } = useAppDispatch();
    const { personalizationData, profiles } = useAppState();
    const [isCaseFormOpen, setIsCaseFormOpen] = useState(false);
    const [isRollCallOpen, setIsRollCallOpen] = useState(false);
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<FamilyCourtCase | null>(null);
    const [selectedCase, setSelectedCase] = useState<FamilyCourtCase | null>(personalizationData?.familyCourtCases ? personalizationData.familyCourtCases[0] : null);

    const familyCourtCases = personalizationData?.familyCourtCases || [];

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

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" title="Go back to Family Matters" onClick={() => onNavigate('familyMatters')}>
                    <ArrowLeftIcon />
                </button>
                <h2>⚖️ Family Court</h2>
                <div className="header-placeholder"></div>
            </header>
            <main className="main">
                <button onClick={() => openCaseForm()} className="btn w-auto mb-20">+ File a New Case</button>
                
                <div className="court-grid">
                    <div className="case-list">
                        {familyCourtCases.length > 0 ?
                        familyCourtCases.map(courtCase => (
                            <div key={courtCase.id} className={`card no-mb case-list-item ${selectedCase?.id === courtCase.id ? 'selected' : ''}`} onClick={() => setSelectedCase(courtCase)}>
                                <h3>{courtCase.title}</h3>
                                <p><strong>Status:</strong> {courtCase.status}</p>
                                <p>{`${getProfileName(courtCase.plaintiffId)} vs. ${getProfileName(courtCase.defendantId)}`}</p>
                            </div>
                        )) : <p>The docket is clear! No cases have been filed.</p>
                        }
                    </div>
                    
                    <div className="card">
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