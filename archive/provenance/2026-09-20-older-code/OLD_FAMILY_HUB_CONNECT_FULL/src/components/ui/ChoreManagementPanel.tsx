

import React, { useState, useMemo } from 'react';
import type { Chore } from '../../types/index.ts';
import { styles as appStyles } from '../../styles/index.ts';
import { isDateThisWeek } from '../../utils/utils.ts';
import Modal from './Modal.tsx';
import ChoreTemplateForm from './ChoreTemplateForm.tsx';
import { useAppContext } from '../../contexts/AppContext.tsx';

interface ChoreManagementPanelProps {
}

const EditTemplateForm: React.FC<{
    template: Chore,
    onClose: () => void,
}> = ({ template, onClose }) => {
    const { addToast, choreHandlers } = useAppContext();

    const handleSaveChanges = async (updates: Partial<Chore>) => {
        await choreHandlers.update(template.id, updates);
        addToast("Template updated!", 'info');
        onClose();
    };
    
    const handleDeleteWithConfirm = async (id: string) => {
        if(window.confirm("Are you sure? This will delete the template and all future instances of this chore.")) {
            await choreHandlers.delete(id);
            addToast("Template deleted.", 'info');
            onClose();
        }
    }

    return React.createElement(ChoreTemplateForm, {
        initialData: template,
        onSave: handleSaveChanges,
        onClose: onClose,
        onDelete: handleDeleteWithConfirm,
    });
};

export default function ChoreManagementPanel() {
    const { profiles, addToast, chores, choreHandlers } = useAppContext();
    const [showTemplates, setShowTemplates] = useState(false);
    
    // Assign single chore state
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignModalTemplateId, setAssignModalTemplateId] = useState<string>('');
    const [assignModalChildId, setAssignModalChildId] = useState<string>('');
    const [assignModalDueDate, setAssignModalDueDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Template editing state
    const [editingTemplate, setEditingTemplate] = useState<Chore | null>(null);
    
    // State for weekly generation
    const [isGenerating, setIsGenerating] = useState(false);
    
    const childProfiles = useMemo(() => profiles.filter(p => p.role === 'child'), [profiles]);
    const choreTemplates = useMemo(() => chores.filter(c => !c.templateChoreId).sort((a,b)=>a.name.localeCompare(b.name)), [chores]);
    
    const getProfileName = (id: string | null) => profiles.find(p => p.id === id)?.name || 'Unassigned';
    
    const handleGenerateClick = async () => {
        setIsGenerating(true);
        await choreHandlers.generateWeeklyChores();
        setIsGenerating(false);
    };

    const handleAssignSingleChoreSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const template = choreTemplates.find(t => t.id === assignModalTemplateId);
        if (!template || !assignModalChildId || !assignModalDueDate) { addToast("Please select a chore, child, and due date.", 'info'); return; }
        const { id, ...templateData } = template;
        const newInstance: Omit<Chore, 'id' | 'family_id'> = { ...templateData, isRecurring: false, recurrenceType: 'none', recurrenceDays: [], templateChoreId: template.id, dueDate: assignModalDueDate, assignedTo: assignModalChildId, status: 'pending', photoProofUrl: null };
        await choreHandlers.add(newInstance);
        addToast(`Assigned "${template.name}" to ${getProfileName(assignModalChildId)} for ${assignModalDueDate}.`, 'info', '🎯');
        setIsAssignModalOpen(false);
    };
    
    const handleAddChoreTemplate = async (newChoreData: Partial<Chore>) => {
        await choreHandlers.add(newChoreData as Omit<Chore, 'id' | 'family_id'>);
        addToast(`Template '${newChoreData.name}' added!`, 'info');
    };

    const handleOpenEditTemplateModal = (template: Chore) => {
        setEditingTemplate(template);
    };

    const formatRecurrenceDays = (days?: number[] | null): string => {
        if (!days || days.length === 0) return 'Not set';
        if (days.length === 7) return 'Daily';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.map(dayIndex => dayNames[dayIndex]).join(', ');
    };

    const renderManageTemplates = () => (
        React.createElement('div', {style: {padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee', marginTop: '15px'}},
             React.createElement('h4', {style: {...appStyles.sectionTitle, fontSize: '1.2em'}}, 'Add New Chore Template'),
             React.createElement(ChoreTemplateForm, { onSave: handleAddChoreTemplate }),
             React.createElement('h4', {style: {...appStyles.sectionTitle, fontSize: '1.2em', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ddd'}}, 'Existing Templates:'),
             choreTemplates.length > 0 ? React.createElement('ul', {style: {listStyle: 'none', padding: 0}}, choreTemplates.map(template => React.createElement('li', {key: template.id, style: appStyles.definedRewardItem}, React.createElement('div', null, `${template.name} (${template.points} pts, Repeats: ${formatRecurrenceDays(template.recurrenceDays)})`), React.createElement('button', {onClick: () => handleOpenEditTemplateModal(template), style: {...appStyles.button, ...appStyles.buttonSecondary, width: 'auto', marginTop: 0}}, 'Edit')))) : React.createElement('p', null, 'No templates created yet.')
        )
    );

    return (
        React.createElement('section', { style: appStyles.section, 'aria-labelledby': "chores-management-title" },
            React.createElement('h3', { id: "chores-management-title", style: appStyles.sectionTitle }, "Parent Controls"),
            React.createElement('div', { style: {display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px'} },
                React.createElement('button', { onClick: () => setShowTemplates(p => !p), style: {...appStyles.button, backgroundColor: '#6c757d', width: 'auto', marginTop: 0}, 'aria-expanded': showTemplates }, showTemplates ? '➖ Hide Templates' : '➕ Manage Templates'),
                React.createElement('button', { onClick: () => setIsAssignModalOpen(true), style: {...appStyles.button, backgroundColor: '#17a2b8', width: 'auto', marginTop: 0}, 'aria-haspopup': 'dialog' }, '🎯 Assign a Single Chore'),
                React.createElement('button', { onClick: handleGenerateClick, style: {...appStyles.button, backgroundColor: '#ffc107', color: '#333', width: 'auto', marginTop: 0}, disabled: isGenerating }, isGenerating ? '🗓️ Generating...' : '🗓️ Generate Next Week\'s Chores')
            ),
            
            showTemplates && renderManageTemplates(),

            React.createElement(Modal, {
                isOpen: isAssignModalOpen,
                onClose: () => setIsAssignModalOpen(false),
                title: "Assign Single Chore",
                children: React.createElement('form', {onSubmit: handleAssignSingleChoreSubmit},
                    React.createElement('div', {style: appStyles.formGroup}, React.createElement('label', {htmlFor: 'assignChoreSelect', style: appStyles.label}, 'Chore:'), React.createElement('select', {id: 'assignChoreSelect', value: assignModalTemplateId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setAssignModalTemplateId(e.target.value), style: appStyles.selectInput, required: true}, React.createElement('option', {value: ''}, 'Select a chore...'), choreTemplates.map(t => React.createElement('option', {key: t.id, value: t.id}, t.name)))),
                    React.createElement('div', {style: appStyles.formGroup}, React.createElement('label', {htmlFor: 'assignChildSelect', style: appStyles.label}, 'Child:'), React.createElement('select', {id: 'assignChildSelect', value: assignModalChildId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setAssignModalChildId(e.target.value), style: appStyles.selectInput, required: true}, React.createElement('option', {value: ''}, 'Select a child...'), childProfiles.map(c => React.createElement('option', {key: c.id, value: c.id}, c.name)))),
                    React.createElement('div', {style: appStyles.formGroup}, React.createElement('label', {htmlFor: 'assignDueDate', style: appStyles.label}, 'Due Date:'), React.createElement('input', {type: 'date', id: 'assignDueDate', value: assignModalDueDate, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAssignModalDueDate(e.target.value), style: appStyles.input, required: true})),
                    React.createElement('div', {style: appStyles.modalActions}, React.createElement('button', {type: 'submit', style: {...appStyles.button, width: 'auto'}}, 'Assign Chore'))
                )
            }),
            
            editingTemplate && React.createElement(Modal, {
                isOpen: !!editingTemplate,
                onClose: () => setEditingTemplate(null),
                title: "Edit Template",
                children: React.createElement(EditTemplateForm, { template: editingTemplate, onClose: () => setEditingTemplate(null) })
            })
        )
    );
};
