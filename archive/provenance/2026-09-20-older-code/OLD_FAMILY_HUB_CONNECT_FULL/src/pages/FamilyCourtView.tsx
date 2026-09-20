import React, { useState, useMemo, useEffect } from 'react';
import { styles } from '../styles/index.ts';
import { useAppContext } from '../contexts/AppContext.tsx';
import type { Infraction, FamilyCourtCase, RestorativeTask } from '../types/index.ts';
import Modal from '../components/ui/Modal.tsx';
import { uniqueId } from '../utils/utils.ts';
import EmptyState from '../components/ui/EmptyState.tsx';
import { supabase } from '../services/supabaseClient.ts';
import AIHelperWidget from '../components/ui/AIHelperWidget.tsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.tsx';

const CaseDetailModal: React.FC<{
    courtCase: FamilyCourtCase;
    infraction: Infraction;
    onClose: () => void;
}> = ({ courtCase, infraction, onClose }) => {
    const { 
        updateFamilyCourtCase, currentViewingProfile, getProfileName, 
        addFamilyCourtCase, addToast, updateInfraction, addAppNotification,
        profiles, IS_TESTING_MODE
    } = useAppContext();
    const [newTaskText, setNewTaskText] = useState('');
    const [notes, setNotes] = useState(courtCase.notes || '');
    const [aiSuggestions, setAiSuggestions] = useState<{ tasks: string[], isLoading: boolean, error: string | null }>({ tasks: [], isLoading: false, error: null });


    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        const newTask: RestorativeTask = { id: uniqueId(), text: newTaskText.trim(), completed: false };
        const updatedTasks = [...courtCase.tasks, newTask];
        
        const caseExists = !!courtCase.id; // Check if it's a real case from the context
        if (caseExists) {
            updateFamilyCourtCase(courtCase.id, { tasks: updatedTasks });
        } else {
            addFamilyCourtCase({ ...courtCase, tasks: updatedTasks });
        }
        setNewTaskText('');
    };
    
    const handleToggleTask = (taskId: string) => {
        const updatedTasks = courtCase.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        updateFamilyCourtCase(courtCase.id, { tasks: updatedTasks });
    };

    const handleSaveNotes = () => {
        updateFamilyCourtCase(courtCase.id, { notes });
        addToast("Case notes saved.", 'info');
    };
    
    const isParent = currentViewingProfile?.role === 'adult';
    const allTasksCompleted = courtCase.tasks.every(t => t.completed);

    useEffect(() => {
        // Auto-complete infraction when the last task is checked off
        if (allTasksCompleted && infraction.status !== 'completed' && courtCase.tasks.length > 0) {
            updateInfraction(infraction.id, { status: 'completed', completed_at: new Date().toISOString() });
            addAppNotification(
                `All restorative tasks for the case regarding "${infraction.reason}" have been completed by ${getProfileName(infraction.child_id)}.`,
                'chore_status', // Re-using notification type
                infraction.created_by
            );
            addToast("All tasks complete! Infraction resolved.", 'badge', '✅');
        }
    }, [allTasksCompleted, infraction, courtCase.tasks.length]);

    const handleGetAiSuggestions = async () => {
        const childProfile = profiles.find(p => p.id === infraction.child_id);
        if (!childProfile) {
            addToast("Child profile not found.", 'info');
            return;
        }

        setAiSuggestions({ tasks: [], isLoading: true, error: null });

        if (IS_TESTING_MODE) {
            setTimeout(() => {
                setAiSuggestions({ tasks: ["Write an apology letter", "Do an extra chore to help out", "Talk about why the behavior was hurtful"], isLoading: false, error: null });
            }, 500);
            return;
        }

        try {
            const { data, error } = await supabase.functions.invoke('ai-handler', {
                body: {
                    endpoint: 'suggestRestorativeTasks',
                    reason: infraction.reason,
                    age: childProfile.age
                }
            });
            if (error) throw error;
            setAiSuggestions({ tasks: data.tasks, isLoading: false, error: null });
        } catch (e: any) {
            setAiSuggestions({ tasks: [], isLoading: false, error: `Could not get suggestions: ${e.message}` });
        }
    };

    return (
        React.createElement(Modal, {
            isOpen: true, onClose, title: `Case: ${infraction.reason}`, contentStyle: {maxWidth: '800px'},
            children: React.createElement('div', { style: styles.caseModalGrid },
                React.createElement('div', {style: styles.caseDetailSection},
                    React.createElement('h4', {style: styles.caseDetailTitle}, 'Case Details'),
                    React.createElement('p', null, React.createElement('strong', null, 'Filed by: '), getProfileName(infraction.created_by)),
                    React.createElement('p', null, React.createElement('strong', null, 'Regarding: '), getProfileName(infraction.child_id)),
                    React.createElement('p', null, React.createElement('strong', null, 'Reason: '), infraction.reason),
                    infraction.evidence_urls && infraction.evidence_urls.length > 0 &&
                        React.createElement('div', { style: {marginTop: '10px'} },
                            React.createElement('strong', null, 'Evidence:'),
                            infraction.evidence_urls.map(url => React.createElement('img', {
                                key: url,
                                src: url,
                                alt: "Infraction evidence",
                                style: { maxWidth: '100%', borderRadius: '4px', marginTop: '5px' }
                            }))
                        ),
                    React.createElement('p', null, React.createElement('strong', null, 'Verdict: '), courtCase.verdict || 'Pending...'),
                ),
                React.createElement('div', {style: styles.caseDetailSection},
                    React.createElement('h4', {style: styles.caseDetailTitle}, 'Restorative Tasks'),
                     courtCase.tasks.map(task => (
                        React.createElement('div', { key: task.id, style: styles.restorativeTask },
                            React.createElement('input', { type: 'checkbox', checked: task.completed, onChange: () => handleToggleTask(task.id), disabled: !isParent }),
                            React.createElement('label', { style: task.completed ? styles.restorativeTaskCompleted : {} }, task.text)
                        )
                    )),
                    isParent && React.createElement('form', { onSubmit: handleAddTask, style: {display: 'flex', gap: '5px', marginTop: '10px'} },
                        React.createElement('input', {value: newTaskText, onChange: e => setNewTaskText(e.target.value), style: styles.input, placeholder: 'New task...'}),
                        React.createElement('button', {type: 'submit', style: {...styles.button, width: 'auto'}}, 'Add')
                    ),
                    isParent && React.createElement(AIHelperWidget, {
                        title: "AI Task Suggester",
                        description: "Get age-appropriate, restorative task ideas.",
                        children: React.createElement(React.Fragment, null,
                            React.createElement('button', {
                                type: 'button',
                                onClick: handleGetAiSuggestions,
                                disabled: aiSuggestions.isLoading,
                                style: { ...styles.button, width: 'auto' }
                            }, aiSuggestions.isLoading ? '🧠 Thinking...' : '✨ Get Suggestions'),
                            aiSuggestions.isLoading && React.createElement(LoadingSpinner, { message: "" }),
                            aiSuggestions.error && React.createElement('p', { style: styles.aiError }, aiSuggestions.error),
                            aiSuggestions.tasks.length > 0 && React.createElement('div', { style: styles.aiSuggestionsContainer },
                                React.createElement('p', { style: { fontWeight: 'bold' } }, "Click a suggestion to add it:"),
                                React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
                                    aiSuggestions.tasks.map((task, i) => React.createElement('button', {
                                        key: i,
                                        type: 'button',
                                        onClick: () => setNewTaskText(task),
                                        style: styles.aiSuggestionItem
                                    }, task))
                                )
                            )
                        )
                    })
                ),
                React.createElement('div', {style: {...styles.caseDetailSection, gridColumn: '1 / -1'}},
                    React.createElement('h4', {style: styles.caseDetailTitle}, 'Case Notes'),
                    isParent ?
                        React.createElement(React.Fragment, null,
                            React.createElement('textarea', {value: notes, onChange: (e:React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value), style: styles.textarea, rows: 4, placeholder: 'Add private notes...'}),
                            React.createElement('button', {style: {...styles.button, width: 'auto', marginTop: '10px'}, onClick: handleSaveNotes}, 'Save Notes')
                        )
                        : React.createElement('p', null, courtCase.notes || 'No notes added.')
                ),
                isParent && React.createElement('div', {style: {...styles.caseDetailSection, gridColumn: '1 / -1'}},
                     React.createElement('h4', {style: styles.caseDetailTitle}, 'Resolution'),
                     React.createElement('select', { 
                        value: courtCase.verdict || 'pending',
                        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateFamilyCourtCase(courtCase.id, { verdict: e.target.value}),
                        style: styles.selectInput,
                        } as React.HTMLProps<HTMLSelectElement>,
                        React.createElement('option', {value: 'pending'}, 'Pending'),
                        React.createElement('option', {value: 'responsible'}, 'Responsible'),
                        React.createElement('option', {value: 'not_responsible'}, 'Not Responsible'),
                     ),
                     React.createElement('button', {
                        disabled: !allTasksCompleted,
                        style: {...styles.button, marginTop: '10px'},
                        onClick: () => updateFamilyCourtCase(courtCase.id, {status: 'closed'})
                     }, 'Close Case (Requires All Tasks Completed)')
                )
            )
        })
    );
}

interface FamilyCourtViewProps {
    onBack: () => void;
}

export default function FamilyCourtView({ onBack }: FamilyCourtViewProps) {
    const { 
        infractions, familyCourtCases, onNavigate,
        currentViewingProfile
    } = useAppContext();

    const [viewingCase, setViewingCase] = useState<FamilyCourtCase | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');
    
    const relevantInfractions = useMemo(() => {
        const targetStatus = activeTab === 'active' ? ['active', 'pending'] : ['closed'];
        return infractions.filter(i => targetStatus.includes(i.status as any));
    }, [infractions, activeTab]);

    const findOrCreateCase = (infraction: Infraction): FamilyCourtCase => {
        let courtCase = familyCourtCases.find(c => c.infractionId === infraction.id);
        if (!courtCase) {
            courtCase = {
                id: uniqueId(),
                infractionId: infraction.id,
                tasks: [],
                participants: [infraction.created_by, infraction.child_id],
                status: 'pending_review',
            };
        }
        return courtCase;
    };

    const handleOpenCase = (infraction: Infraction) => {
        const courtCase = findOrCreateCase(infraction);
        setViewingCase(courtCase);
    }
    
    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', { onClick: onBack, style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' } }, "← Back to Family Matters"),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "⚖️ Family Court"),
        
        React.createElement('section', { style: styles.section },
            React.createElement('div', {style: {display: 'flex', justifyContent: 'space-between'}},
                React.createElement('div', { style: styles.meetingTabs },
                    React.createElement('button', { style: activeTab === 'active' ? {...styles.meetingTab, ...styles.meetingTabActive} : styles.meetingTab, onClick: () => setActiveTab('active')}, 'Active Cases'),
                    React.createElement('button', { style: activeTab === 'archive' ? {...styles.meetingTab, ...styles.meetingTabActive} : styles.meetingTab, onClick: () => setActiveTab('archive')}, 'Closed Case Archive'),
                ),
                React.createElement('button', {
                    onClick: () => onNavigate('timeOut'),
                    style: { ...styles.button, width: 'auto' }
                }, '➕ Create New Infraction')
            )
        ),
        
        React.createElement('section', { style: styles.section },
            relevantInfractions.length > 0
                ? relevantInfractions.map(infraction => {
                    const isHearingRequest = infraction.consequence_type === 'hearing_request';
                    const cardStyle = isHearingRequest 
                        ? { ...styles.infractionCard, ...styles.infractionCardHearingRequest }
                        : styles.infractionCard;
                    
                    return React.createElement('button', { 
                        key: infraction.id, 
                        style: cardStyle,
                        onClick: () => handleOpenCase(infraction)
                    },
                         React.createElement('h4', { style: styles.infractionHeader }, `Case: ${infraction.reason}`)
                    )
                })
                : React.createElement(EmptyState, { icon: '🥳', title: `No ${activeTab} cases!`, message: 'All clear on this front.' })
        ),
        
        viewingCase && React.createElement(CaseDetailModal, {
            courtCase: viewingCase,
            infraction: infractions.find(i => i.id === viewingCase.infractionId)!,
            onClose: () => setViewingCase(null),
        })
    );
}
