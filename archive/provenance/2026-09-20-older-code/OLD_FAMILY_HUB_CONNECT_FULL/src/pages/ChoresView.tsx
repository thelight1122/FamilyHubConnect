import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Profile, Chore, ChoreStatus, AppNotification, ToastMessage, PersonalizationData, BadgeType } from '../types/index.ts';
import { uniqueId, normalizeDateStr, isDateToday, isDateThisWeek, isDatePast } from '../utils/utils.ts';
import { styles } from '../styles/index.ts';
import Modal from '../components/ui/Modal.tsx';
import ChoreItem from '../components/ui/ChoreItem.tsx';
import ChoreManagementPanel from '../components/ui/ChoreManagementPanel.tsx';
import { supabase } from '../services/supabaseClient.ts';
import { useAppContext } from '../contexts/AppContext.tsx';

interface AIAssigneeSuggestionState {
    choreId: string | null;
    isLoading: boolean;
    suggestedProfileId: string | null;
    error: string | null;
}

interface ChoresViewProps {}


export default function ChoresView(props: ChoresViewProps) {
    const { 
        profiles, currentViewingProfile, addToast, getProfileName, onNavigate,
        chores, choreHandlers, addAppNotification, awardBadgeIfEligible, updateProfile, IS_TESTING_MODE
    } = useAppContext();
    
    if (!currentViewingProfile) return React.createElement('div', {style: styles.loadingMessage}, 'Loading user profile...');

    // State for Quick Task Modal
    const [isQuickTaskModalOpen, setIsQuickTaskModalOpen] = useState(false);
    const [quickTaskName, setQuickTaskName] = useState('');
    const [quickTaskAssignee, setQuickTaskAssignee] = useState<string | null>(currentViewingProfile.id);
    const [quickTaskPoints, setQuickTaskPoints] = useState('10');

    // State for various modals and filters
    const [choreForPhotoUploadId, setChoreForPhotoUploadId] = useState<string | null>(null);
    const [currentPhotoFile, setCurrentPhotoFile] = useState<File | null>(null);
    type DateFilter = 'today' | 'this_week' | 'all_upcoming' | 'past_due' | 'all';
    type StatusFilter = ChoreStatus | 'all';
    type AssigneeFilter = string | 'all';
    const [choreDateFilter, setChoreDateFilter] = useState<DateFilter>('all_upcoming');
    const [choreStatusFilter, setChoreStatusFilter] = useState<StatusFilter>('all');
    const [choreAssignedToFilter, setChoreAssignedToFilter] = useState<AssigneeFilter>(currentViewingProfile.role === 'child' ? currentViewingProfile.id : 'all');
    
    // AI and Rejection State
    const [aiAssigneeSuggestionState, setAiAssigneeSuggestionState] = useState<AIAssigneeSuggestionState>({ choreId: null, isLoading: false, suggestedProfileId: null, error: null });
    const [rejectingChore, setRejectingChore] = useState<Chore | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    
    useEffect(() => {
        if (currentViewingProfile?.role === 'child' && currentViewingProfile.id) {
            setChoreAssignedToFilter(currentViewingProfile.id);
        } else if (currentViewingProfile?.role === 'adult' && choreAssignedToFilter !== 'all' && !profiles.find(p => p.id === choreAssignedToFilter)) {
            setChoreAssignedToFilter('all');
        }
    }, [currentViewingProfile, profiles, choreAssignedToFilter]);
    
    const displayedChores = useMemo(() => {
        let filtered = chores.filter(chore => !chore.isRecurring || chore.templateChoreId !== null);
        filtered = filtered.filter(c => !c.isBonus); // Exclude bonus chores from main list
        if (choreDateFilter !== 'all') {
            const today = new Date();
            today.setUTCHours(0,0,0,0);
            filtered = filtered.filter(chore => {
                if (!chore.dueDate) return choreDateFilter === 'all_upcoming';
                switch (choreDateFilter) {
                    case 'today': return isDateToday(chore.dueDate);
                    case 'this_week': return isDateThisWeek(chore.dueDate);
                    case 'all_upcoming':
                        const d = normalizeDateStr(chore.dueDate);
                        return d ? d >= today : false;
                    case 'past_due': return isDatePast(chore.dueDate) && chore.status !== 'completed';
                    default: return true;
                }
            });
        }
        if (choreStatusFilter !== 'all') {
            filtered = filtered.filter(chore => chore.status === choreStatusFilter);
        }
        if (choreAssignedToFilter !== 'all') {
            filtered = filtered.filter(chore => chore.assignedTo === choreAssignedToFilter);
        }
        return filtered.sort((a,b) => (normalizeDateStr(a.dueDate)?.getTime() || Infinity) - (normalizeDateStr(b.dueDate)?.getTime() || Infinity));
    }, [chores, choreDateFilter, choreStatusFilter, choreAssignedToFilter]);

    const availableBonusChores = useMemo(() => chores.filter(c => c.isBonus && !c.assignedTo), [chores]);
    
    const handleAddQuickTask = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!quickTaskName.trim()) {
            addToast("Chore name cannot be empty.", 'info'); return;
        }
        const points = parseInt(quickTaskPoints, 10);
        if (currentViewingProfile.role === 'adult' && (isNaN(points) || points < 0)) {
            addToast("Please enter valid points.", 'info'); return;
        }

        const newChore: Omit<Chore, 'id' | 'family_id'> = {
            name: quickTaskName.trim(), assignedTo: quickTaskAssignee, status: 'pending' as ChoreStatus,
            requiresPhoto: false, photoProofUrl: null, points: currentViewingProfile.role === 'adult' ? points : 0,
            dueDate: new Date().toISOString().split('T')[0], isRecurring: false, recurrenceType: 'none' as const, recurrenceDays: null,
            templateChoreId: null, isBonus: false,
        };
        
        await choreHandlers.add(newChore);

        addToast(`Quick chore "${newChore.name}" added!`, 'info');
        setIsQuickTaskModalOpen(false);
    };

    const awardPoints = useCallback(async (choreId: string) => {
        const chore = chores.find(c => c.id === choreId);
        if (chore && chore.assignedTo) {
            const profileToUpdate = profiles.find(p => p.id === chore.assignedTo);
            if (!profileToUpdate) return;
            
            addToast(`+${chore.points || 0} points for ${profileToUpdate.name}!`, 'points', '✨');
            
            const newPoints = (profileToUpdate.points || 0) + (chore.points || 0);
            
            await updateProfile(chore.assignedTo, { points: newPoints });
            
            // The awardBadgeIfEligible function from App.tsx handles the logic of checking and updating.
            await awardBadgeIfEligible(chore.assignedTo, 'FIRST_CHORE_COMPLETED');
            // In a real app, you'd chain these checks
        }
    }, [profiles, chores, addToast, awardBadgeIfEligible, updateProfile]);
    
    const handleChangeChoreStatus = useCallback(async (choreId: string, newStatus: ChoreStatus) => {
        const currentChore = chores.find(c => c.id === choreId);
        if (!currentChore) return;
        const originalStatus = currentChore.status;

        const updates: Partial<Chore> = { status: newStatus, rejectionReason: undefined, photoProofUrl: null };
        if (newStatus === 'completed' && originalStatus !== 'completed') {
            updates.completed_at = new Date().toISOString();
        }

        await choreHandlers.update(choreId, updates);

        if (newStatus === 'completed' && originalStatus !== 'completed') {
            await awardPoints(choreId);
        } else if (originalStatus === 'completed' && newStatus !== 'completed') {
            // Deduct points
            const profileToUpdate = profiles.find(p => p.id === currentChore.assignedTo);
            if(profileToUpdate) {
                await updateProfile(profileToUpdate.id, { points: (profileToUpdate.points || 0) - (currentChore.points || 0) });
            }
        }
    }, [chores, awardPoints, choreHandlers, updateProfile, profiles]);
    
    const handleTriggerPhotoUpload = (choreId: string) => setChoreForPhotoUploadId(choreId);

    const handleSubmitPhotoForApproval = async (choreId: string) => {
        if (!currentPhotoFile) { addToast("Please select a photo to upload.", 'info'); return; }
        const choreToSubmit = chores.find(c => c.id === choreId);
        if (!choreToSubmit) return;

        try {
            // This logic will be moved to a storage-based upload later
            const reader = new FileReader();
            reader.readAsDataURL(currentPhotoFile);
            reader.onloadend = async () => {
                await choreHandlers.update(choreId, { status: 'pending_approval', photoProofUrl: reader.result as string });
                addAppNotification(`Chore '${choreToSubmit.name}' submitted for approval by ${getProfileName(choreToSubmit.assignedTo)}.`, 'chore_status');
                setChoreForPhotoUploadId(null); 
                setCurrentPhotoFile(null);
            };
        } catch(e) {
            addToast("Failed to upload photo.", 'info');
        }
    };

    const handleApproveChore = useCallback(async (choreId: string) => {
        const chore = chores.find(c => c.id === choreId);
        if (!chore || !chore.assignedTo) return;
        
        await handleChangeChoreStatus(choreId, 'completed');
        addAppNotification(`Your chore '${chore.name}' was approved! Great job, ${getProfileName(chore.assignedTo)}!`, 'chore_status', chore.assignedTo || undefined);

    }, [chores, handleChangeChoreStatus, addAppNotification, getProfileName]);

    const handleTriggerRejection = (choreId: string) => {
        const chore = chores.find(c => c.id === choreId);
        if (chore) { setRejectingChore(chore); setRejectionReason(''); }
    };

    const handleSubmitRejection = async () => {
        if (!rejectingChore) return;
        await choreHandlers.update(rejectingChore.id, { status: 'rejected', rejectionReason: rejectionReason.trim() });
        addAppNotification(`Your chore '${rejectingChore.name}' needs attention. Please check it.`, 'chore_status', rejectingChore.assignedTo || undefined);
        addToast("Chore rejected with feedback.", 'info');
        setRejectingChore(null);
    };

    const handleGetAIAssigneeSuggestion = async (chore: Chore) => {
        setAiAssigneeSuggestionState({ choreId: chore.id, isLoading: true, suggestedProfileId: null, error: null });

        if (IS_TESTING_MODE) {
            const childProfiles = profiles.filter(p => p.role === 'child');
            if (childProfiles.length > 0) {
                const randomChild = childProfiles[Math.floor(Math.random() * childProfiles.length)];
                setTimeout(() => {
                    setAiAssigneeSuggestionState({ choreId: chore.id, isLoading: false, suggestedProfileId: randomChild.id, error: null });
                }, 500);
            } else {
                 setAiAssigneeSuggestionState({ choreId: chore.id, isLoading: false, suggestedProfileId: null, error: "No children available to suggest." });
            }
            return;
        }

        const childProfiles = profiles.filter(p => p.role === 'child').map(c => ({ id: c.id, name: c.name, age: c.age || 'unknown' }));

        try {
            const { data, error } = await supabase.functions.invoke('ai-handler', {
                body: { 
                    endpoint: 'suggestChoreAssignment',
                    choreName: chore.name,
                    children: childProfiles,
                }
            });
            if (error) throw error;
            setAiAssigneeSuggestionState({ choreId: chore.id, isLoading: false, suggestedProfileId: data.profileId, error: null });
        } catch (error: any) {
            console.error("Error getting AI assignee suggestion:", error);
            setAiAssigneeSuggestionState({ choreId: chore.id, isLoading: false, suggestedProfileId: null, error: error.message || "Could not get suggestion." });
        }
    };
    
    const handleApplyAISuggestion = (choreId: string, profileId: string) => {
        choreHandlers.update(choreId, { assignedTo: profileId });
        setAiAssigneeSuggestionState({ choreId: null, isLoading: false, suggestedProfileId: null, error: null });
    };
    
    const handleAcceptBonusChore = async (chore: Chore) => {
        if (!currentViewingProfile || currentViewingProfile.role !== 'child') return;
        await choreHandlers.update(chore.id, { assignedTo: currentViewingProfile.id, dueDate: new Date().toISOString().split('T')[0] });
        addToast(`You have accepted the bonus chore: "${chore.name}"!`, 'info');
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('h2', { style: styles.pageHeader }, "✅ Chore Chart"),
            
            currentViewingProfile.role === 'adult' && React.createElement('button', { onClick: () => setIsQuickTaskModalOpen(true), style: {...styles.button, width: 'auto', marginBottom: '20px'} }, "+ Add Quick One-Off Chore"),

            currentViewingProfile.role === 'adult' && React.createElement(ChoreManagementPanel, {}),

            React.createElement('section', { style: styles.section, 'aria-labelledby': "chores-view-title" },
                 React.createElement('h3', { id: "chores-view-title", style: styles.sectionTitle }, "Filtered Chores"),
                React.createElement('div', { style: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '20px'} },
                    React.createElement('div', { style: styles.formGroup }, React.createElement('label', { htmlFor: "choresViewDateFilter", style: styles.label }, "Date:"), React.createElement('select', { id: "choresViewDateFilter", value: choreDateFilter, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setChoreDateFilter(e.target.value as DateFilter), style: styles.selectInput }, React.createElement('option', { value: "all_upcoming" }, "All Upcoming"), React.createElement('option', { value: "today" }, "Today"), React.createElement('option', { value: "this_week" }, "This Week"), React.createElement('option', { value: "past_due" }, "Past Due"), React.createElement('option', { value: "all" }, "All Dates"))),
                    React.createElement('div', { style: styles.formGroup }, React.createElement('label', { htmlFor: "choresViewStatusFilter", style: styles.label }, "Status:"), React.createElement('select', { id: "choresViewStatusFilter", value: choreStatusFilter, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setChoreStatusFilter(e.target.value as StatusFilter), style: styles.selectInput }, React.createElement('option', { value: "all" }, "All Statuses"), (['pending', 'in progress', 'pending_approval', 'completed', 'rejected'] as ChoreStatus[]).map(s => React.createElement('option', { key: s, value: s, style: {textTransform: 'capitalize'} }, s.replace(/_/g, ' '))))),
                    currentViewingProfile.role === 'adult' && React.createElement('div', { style: styles.formGroup }, React.createElement('label', { htmlFor: "choresViewAssigneeFilter", style: styles.label }, "Assignee:"), React.createElement('select', { id: "choresViewAssigneeFilter", value: choreAssignedToFilter, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setChoreAssignedToFilter(e.target.value as AssigneeFilter), style: styles.selectInput }, React.createElement('option', { value: "all" }, "All Members"), profiles.filter(p=>p.role==='child').map(p => React.createElement('option', { key: p.id, value: p.id }, p.name))))
                ),
                 (displayedChores.length > 0 ? (
                    React.createElement('ul', {style: {listStyle: 'none', padding: 0}, 'aria-live': "polite" },
                        displayedChores.map(chore => React.createElement(ChoreItem, {
                            key: chore.id, chore, viewingProfile: currentViewingProfile, profiles, getProfileName,
                            onAssign: (choreId, profileId) => choreHandlers.update(choreId, { assignedTo: profileId }), 
                            onChangeStatus: handleChangeChoreStatus, 
                            onApprove: handleApproveChore, 
                            onReject: handleTriggerRejection,
                            onTriggerPhotoUpload: handleTriggerPhotoUpload, 
                            onGetAIAssigneeSuggestion: handleGetAIAssigneeSuggestion, 
                            onApplyAISuggestion: handleApplyAISuggestion, 
                            aiSuggestionState: aiAssigneeSuggestionState, 
                            onAcceptBonusChore: handleAcceptBonusChore
                        }))
                    )
                 ) : React.createElement('p', {style: styles.emptyStateText}, "No chores match the current filters."))
            ),
             currentViewingProfile.role === 'child' && availableBonusChores.length > 0 && (
                 React.createElement('section', { style: styles.bonusTodoSection },
                     React.createElement('h3', { style: styles.sectionTitle }, "Available Bonus Chores"),
                     React.createElement('ul', { style: {listStyle: 'none', padding: 0} }, availableBonusChores.map(chore => React.createElement(ChoreItem, { 
                         key: chore.id, chore, viewingProfile: currentViewingProfile, profiles, getProfileName, 
                         onAssign: (choreId, profileId) => choreHandlers.update(choreId, { assignedTo: profileId }), 
                         onChangeStatus: handleChangeChoreStatus, onApprove: handleApproveChore, onReject: handleTriggerRejection, 
                         onTriggerPhotoUpload: handleTriggerPhotoUpload, 
                         onGetAIAssigneeSuggestion: handleGetAIAssigneeSuggestion, 
                         onApplyAISuggestion: handleApplyAISuggestion, 
                         aiSuggestionState: aiAssigneeSuggestionState, 
                         onAcceptBonusChore: handleAcceptBonusChore })))
                 )
            ),

            React.createElement(Modal, {
                isOpen: isQuickTaskModalOpen,
                onClose: () => setIsQuickTaskModalOpen(false),
                title: "Add a Quick Chore",
                children: React.createElement('form', { onSubmit: handleAddQuickTask },
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'quickTaskName', style: styles.label }, 'Chore Name:'),
                        React.createElement('input', { type: 'text', id: 'quickTaskName', value: quickTaskName, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQuickTaskName(e.target.value), style: styles.input, required: true })
                    ),
                    currentViewingProfile.role === 'adult' && React.createElement(React.Fragment, null,
                        React.createElement('div', { style: styles.formGroup },
                            React.createElement('label', { htmlFor: 'quickTaskAssignee', style: styles.label }, 'Assign To:'),
                            React.createElement('select', { id: 'quickTaskAssignee', value: quickTaskAssignee || '', onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setQuickTaskAssignee(e.target.value), style: styles.selectInput },
                                React.createElement('option', { value: currentViewingProfile.id }, "Myself"),
                                ...profiles.filter(p => p.id !== currentViewingProfile.id).map(p => React.createElement('option', { key: p.id, value: p.id }, p.name))
                            )
                        ),
                        React.createElement('div', { style: styles.formGroup },
                            React.createElement('label', { htmlFor: 'quickTaskPoints', style: styles.label }, 'Points Awarded:'),
                            React.createElement('input', { type: 'number', id: 'quickTaskPoints', value: quickTaskPoints, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQuickTaskPoints(e.target.value), style: styles.input, required: true })
                        )
                    ),
                    React.createElement('div', { style: styles.modalActions },
                        React.createElement('button', { type: 'submit', style: {...styles.button, width: 'auto'} }, 'Add Chore')
                    )
                )
            }),
            
             React.createElement(Modal, {
                isOpen: !!rejectingChore,
                onClose: () => setRejectingChore(null),
                title: "Reject Chore",
                children: React.createElement('form', {onSubmit: handleSubmitRejection},
                    React.createElement('p', null, `Why are you rejecting "${rejectingChore?.name}"? Provide feedback for ${getProfileName(rejectingChore?.assignedTo || null)}.` ),
                    React.createElement('div', {style: styles.formGroup},
                        React.createElement('label', {htmlFor: 'rejectionReason', style: styles.label}, 'Reason:'),
                        React.createElement('textarea', {id: 'rejectionReason', value: rejectionReason, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value), style: styles.textarea, rows: 3, required: true})
                    ),
                    React.createElement('div', {style: styles.modalActions}, React.createElement('button', {type: 'submit', style: styles.button}, 'Submit Rejection'))
                )
            }),
            
            React.createElement(Modal, {
                isOpen: !!choreForPhotoUploadId,
                onClose: () => setChoreForPhotoUploadId(null),
                title: 'Upload Photo Proof',
                children: React.createElement('form', { onSubmit: (e) => { e.preventDefault(); handleSubmitPhotoForApproval(choreForPhotoUploadId!); } },
                     React.createElement('div', {style: styles.formGroup}, 
                        React.createElement('label', {htmlFor: 'chorePhoto', style: styles.label}, 'Select Photo:'),
                        React.createElement('input', {type: 'file', id: 'chorePhoto', accept: 'image/*', style: styles.input, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCurrentPhotoFile(e.target.files ? e.target.files[0] : null)})
                    ),
                    currentPhotoFile && React.createElement('img', { src: URL.createObjectURL(currentPhotoFile), alt: "Photo proof preview", style: { maxWidth: '100%', borderRadius: '4px', marginTop: '10px' }}),
                    React.createElement('div', {style: styles.modalActions}, React.createElement('button', {type: 'submit', style: styles.button}, 'Submit for Approval'))
                )
            })
        )
    );
}
