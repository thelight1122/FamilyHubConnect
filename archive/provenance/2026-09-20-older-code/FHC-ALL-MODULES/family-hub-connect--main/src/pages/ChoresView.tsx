import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { EmptyState, ArrowLeftIcon, BottomNavbar, Modal, AIHelperWidget, LoadingSpinner } from '../components.tsx';
import type { Chore, Profile } from '../types';
import { isDateToday, isDatePast } from '../utils/utils.ts';

// Helper component for the chore creation/editing form
const ChoreFormModal = ({
    isOpen,
    onClose,
    onSave,
    editingChore,
    profiles,
    currentProfileId,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (chore: Partial<Chore>) => void;
    editingChore: Chore | null;
    profiles: Profile[];
    currentProfileId: string | null;
}) => {
    const [name, setName] = useState('');
    const [assignedTo, setAssignedTo] = useState<string | null>(null);
    const [points, setPoints] = useState(10);
    const [dueDate, setDueDate] = useState('');
    const [requiresPhoto, setRequiresPhoto] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const { addToast } = useAppDispatch();

    useEffect(() => {
        if (editingChore) {
            setName(editingChore.name);
            setAssignedTo(editingChore.assignedTo);
            setPoints(editingChore.points);
            setDueDate(editingChore.dueDate);
            setRequiresPhoto(editingChore.requiresPhoto);
        } else {
            // Reset form for new chore
            setName('');
            setAssignedTo(null);
            setPoints(10);
            setDueDate(new Date().toISOString().split('T')[0]);
            setRequiresPhoto(false);
        }
    }, [editingChore, isOpen]);

    const handleSave = () => {
        if (!name.trim()) {
            addToast('Chore name is required.', 'info');
            return;
        }
        onSave({
            id: editingChore?.id,
            name,
            assignedTo,
            points,
            dueDate,
            requiresPhoto,
            status: editingChore?.status || 'pending',
        });
        onClose();
    };

    const handleGenerateSuggestion = async () => {
        const assignedProfile = profiles.find(p => p.id === assignedTo);
        const age = assignedProfile?.age;
        if (!age) {
            addToast("Select a child with a set age to get an AI suggestion.", 'info');
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Suggest one common, simple household chore appropriate for a ${age}-year-old. Output just the chore name, nothing else. For example: "Set the table".`;
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setName((response.text ?? '').trim().replace(/"/g, ''));
        } catch (error) {
            addToast("Couldn't get an AI suggestion right now.", 'info');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editingChore ? 'Edit Chore' : 'Add New Chore'}>
            <div className="form-group">
                <label>Chore Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter chore name" />
                 <AIHelperWidget title="Need an idea?" description="Get an age-appropriate chore suggestion from AI.">
                    <button onClick={handleGenerateSuggestion} className="btn btn-info btn-sm w-auto mt-10" disabled={isGenerating || !assignedTo}>
                        {isGenerating ? "Thinking..." : "Suggest a Chore"}
                    </button>
                    {isGenerating && <LoadingSpinner message=""/>}
                </AIHelperWidget>
            </div>
            <div className="form-group">
                <label>Assign To</label>
                <label htmlFor="assignToSelect">Assign To</label>
                <select id="assignToSelect" value={assignedTo || ''} onChange={(e) => setAssignedTo(e.target.value || null)}>
                    <option value="">Unassigned</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>Points</label>
                <input 
                    type="number" 
                    value={points} 
                    onChange={(e) => setPoints(Number(e.target.value))} 
                    title="Enter the points for the chore" 
                    placeholder="Points" 
                />
            </div>
            <div className="form-group">
                <label>Due Date</label>
                <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    title="Select the due date for the chore" 
                    placeholder="YYYY-MM-DD" 
                />
            </div>
             <div className="form-group">
                <label className="checkbox-label">
                    <input type="checkbox" className="checkbox" checked={requiresPhoto} onChange={e => setRequiresPhoto(e.target.checked)} />
                    Require Photo Proof
                </label>
            </div>
            <div className="form-actions">
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn" onClick={handleSave}>Save Chore</button>
            </div>
        </Modal>
    );
};


// Helper component for displaying a single chore
const ChoreItem = React.memo(({
    chore,
    profile,
    onStatusChange,
    onEdit,
    onDelete,
    getProfileName,
    isParentView
}: {
    chore: Chore;
    profile?: Profile;
    onStatusChange: (choreId: string, status: Chore['status'], rejectionReason?: string) => void;
    onEdit: (chore: Chore) => void;
    onDelete: (choreId: string) => void;
    getProfileName: (id: string | null) => string;
    isParentView: boolean;
}) => {

    const canComplete = profile && (chore.assignedTo === profile.id);
    const statusColors: Record<Chore['status'], string> = {
        pending: 'var(--warning)',
        'in progress': 'var(--info)',
        pending_approval: '#8e44ad',
        completed: 'var(--success)',
        rejected: 'var(--danger)',
    };

    return (
        <div className="list-item" style={{ borderLeft: `5px solid ${statusColors[chore.status]}`}}>
            <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{chore.name}</p>
                <p style={{ fontSize: '0.9em', color: '#666', margin: 0 }}>
                    {`For: ${getProfileName(chore.assignedTo)} | Due: ${chore.dueDate} | ✨ ${chore.points} pts`}
                </p>
                 {chore.status === 'rejected' && chore.rejectionReason && <p className="ai-error m-0 mt-10">{`Reason: ${chore.rejectionReason}`}</p>}
            </div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {isParentView ? (
                    <>
                        {chore.status === 'pending_approval' && (
                            <>
                                <button className="btn btn-success btn-sm" onClick={() => onStatusChange(chore.id, 'completed')}>Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={() => {
                                    const reason = prompt("Reason for rejection:");
                                    onStatusChange(chore.id, 'rejected', reason || 'Not specified');
                                }}>Reject</button>
                            </>
                        )}
                        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(chore)}>Edit</button>
                    </>
                ) : (
                     canComplete && chore.status === 'pending' && (
                        <button className="btn btn-success btn-sm" onClick={() => onStatusChange(chore.id, chore.requiresPhoto ? 'pending_approval' : 'completed')}>Done</button>
                    )
                )}
            </div>
        </div>
    );
});


// Main view
export default function ChoresView() {
    const { choreHandlers, addToast, getProfileName, onNavigate, awardBadgeIfEligible } = useAppDispatch();
    const { chores, profiles, viewingAsProfileId } = useAppState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChore, setEditingChore] = useState<Chore | null>(null);

    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const isParentView = currentViewingProfile?.role === 'Admin' || currentViewingProfile?.role === 'Parent';

    const handleOpenModal = useCallback((chore: Chore | null = null) => {
        setEditingChore(chore);
        setIsModalOpen(true);
    }, []);

    const handleSaveChore = async (choreData: Partial<Chore>) => {
        if (choreData.id) {
            await choreHandlers.update(choreData.id, choreData);
            addToast('Chore updated!', 'badge');
        } else {
            const newChore = {
                ...choreData,
                isRecurring: false,
                recurrenceType: 'none',
                isBonus: false,
                templateChoreId: null,
                recurrenceDays: null
            } as Omit<Chore, 'id'>;
            await choreHandlers.add(newChore);
            addToast('New chore added!', 'badge');
        }
    };
    
    const handleDeleteChore = useCallback(async (choreId: string) => {
        if (window.confirm("Are you sure you want to delete this chore?")) {
            await choreHandlers.delete(choreId);
            addToast('Chore deleted.', 'info');
        }
    }, [choreHandlers, addToast]);

    const handleStatusChange = useCallback(async (choreId: string, status: Chore['status'], rejectionReason?: string) => {
        await choreHandlers.update(choreId, { status, rejectionReason, completed_at: status === 'completed' ? new Date().toISOString() : undefined });
        addToast('Chore status updated!', 'info');
        const chore = chores.find(c => c.id === choreId);
        if (chore && status === 'completed') {
            awardBadgeIfEligible(chore.assignedTo as string, 'FIRST_CHORE_COMPLETED');
        }
    }, [choreHandlers, addToast, awardBadgeIfEligible, chores]);
    
    const [
        pendingApprovalChores,
        todaysChores,
        upcomingChores,
        pastDueChores,
        completedChores
    ] = useMemo(() => {
        const now = new Date();
        const pending: Chore[] = [];
        const today: Chore[] = [];
        const upcoming: Chore[] = [];
        const past: Chore[] = [];
        const completed: Chore[] = [];

        const choresToDisplay = isParentView ? chores : chores.filter(c => c.assignedTo === viewingAsProfileId);

        choresToDisplay.forEach(chore => {
            if (chore.status === 'completed') {
                completed.push(chore);
            } else if (chore.status === 'pending_approval') {
                pending.push(chore);
            } else if (isDateToday(chore.dueDate)) {
                today.push(chore);
            } else if (isDatePast(chore.dueDate)) {
                past.push(chore);
            } else {
                upcoming.push(chore);
            }
        });
        
        return [
            pending.sort((a,b) => a.dueDate.localeCompare(b.dueDate)),
            today.sort((a,b) => a.dueDate.localeCompare(b.dueDate)),
            upcoming.sort((a,b) => a.dueDate.localeCompare(b.dueDate)),
            past.sort((a,b) => a.dueDate.localeCompare(b.dueDate)),
            completed.sort((a,b) => (b.completed_at || '').localeCompare(a.completed_at || '')).slice(0, 5) // only show 5 most recent
        ];
    }, [chores, isParentView, viewingAsProfileId]);

    const renderChoreList = (title: string, choreList: Chore[], emptyMessage: string) => {
        if (choreList.length === 0) return null;
        return (
            <section className="card">
                <h3>{title}</h3>
                {choreList.length > 0 ? (
                    <div className="chore-list">
                        {choreList.map(chore => (
                            <ChoreItem 
                                key={chore.id} 
                                chore={chore} 
                                profile={currentViewingProfile} 
                                onStatusChange={handleStatusChange} 
                                onEdit={handleOpenModal} 
                                onDelete={handleDeleteChore}
                                getProfileName={getProfileName}
                                isParentView={isParentView}
                            />
                        ))}
                    </div>
                ) : (
                    <p>{emptyMessage}</p>
                )}
            </section>
        );
    };

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" title="Go back to dashboard" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>✅ Chores</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 {isParentView && (
                    <button className="btn w-auto mb-20" onClick={() => handleOpenModal()}>+ New Chore</button>
                 )}
                 {chores.length === 0 && !isParentView ? (
                     <EmptyState icon="🎉" title="No Chores!" message="You have no chores assigned. Great job!" />
                 ) : (
                    <>
                        {renderChoreList('Pending Approval', pendingApprovalChores, '')}
                        {renderChoreList('Past Due', pastDueChores, '')}
                        {renderChoreList("Today's Chores", todaysChores, 'No chores due today.')}
                        {renderChoreList('Upcoming', upcomingChores, 'No upcoming chores.')}
                        {renderChoreList('Recently Completed', completedChores, '')}
                    </>
                 )}
            </main>
             <ChoreFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveChore}
                editingChore={editingChore}
                profiles={profiles}
                currentProfileId={viewingAsProfileId}
            />
            <BottomNavbar activePage="chores" onNavigate={onNavigate} />
        </div>
    );
}