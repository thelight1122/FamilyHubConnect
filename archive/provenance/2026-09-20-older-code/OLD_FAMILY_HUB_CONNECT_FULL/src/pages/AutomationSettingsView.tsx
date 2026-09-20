
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { AutomationRule, SmartScene } from '../types';
import Modal from '../components/ui/Modal';

export default function AutomationSettingsView({ onBack }: { onBack: () => void }) {
    const { 
        automationRules, addAutomationRule, updateAutomationRule, deleteAutomationRule, 
        smartScenes, profiles
    } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

    const handleOpenModal = (rule?: AutomationRule) => {
        setEditingRule(rule || null);
        setIsModalOpen(true);
    };
    
    const handleSave = (ruleData: Omit<AutomationRule, 'id'>) => {
        if (editingRule) {
            updateAutomationRule(editingRule.id, ruleData);
        } else {
            addAutomationRule(ruleData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this automation rule?")) {
            deleteAutomationRule(id);
        }
    };
    
    const childProfiles = profiles.filter(p => p.role === 'child');

    const RuleForm: React.FC<{onSave: (data: Omit<AutomationRule, 'id'>) => void}> = ({ onSave }) => {
        const [triggerType, setTriggerType] = useState(editingRule?.trigger.type || 'all_chores_complete');
        const [triggerProfileId, setTriggerProfileId] = useState(editingRule?.trigger.forProfileId || 'any_child');
        const [actionType, setActionType] = useState(editingRule?.action.type || 'activate_scene');
        const [actionSceneId, setActionSceneId] = useState(editingRule?.action.sceneId || '');
        const [enabled, setEnabled] = useState(editingRule?.enabled ?? true);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave({
                enabled,
                trigger: { type: triggerType, forProfileId: triggerProfileId },
                action: { type: actionType, sceneId: actionSceneId }
            });
        };

        return React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.checkboxLabel}, React.createElement('input', {type: 'checkbox', checked: enabled, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEnabled(e.target.checked)}), 'Enabled')),
            React.createElement('h4', null, 'Trigger ("When this happens...")'),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.label}, 'Event:', React.createElement('select', {value: triggerType, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setTriggerType(e.target.value as any), style: styles.selectInput}, React.createElement('option', {value: 'all_chores_complete'}, 'All chores for a day are completed')))),
            React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.label}, 'For Child:', React.createElement('select', {value: triggerProfileId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setTriggerProfileId(e.target.value), style: styles.selectInput},
                React.createElement('option', {value: 'any_child'}, 'Any Child'),
                ...childProfiles.map(p => React.createElement('option', {key: p.id, value: p.id}, p.name))
            ))),
            React.createElement('h4', null, 'Action ("...do this")'),
             React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.label}, 'Action:', React.createElement('select', {value: actionType, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setActionType(e.target.value as any), style: styles.selectInput}, React.createElement('option', {value: 'activate_scene'}, 'Activate a Smart Scene')))),
             React.createElement('div', {style: styles.formGroup}, React.createElement('label', {style: styles.label}, 'Scene:', React.createElement('select', {value: actionSceneId, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setActionSceneId(e.target.value), style: styles.selectInput},
                React.createElement('option', {value: ''}, 'Select a scene...'),
                ...smartScenes.map(s => React.createElement('option', {key: s.id, value: s.id}, `${s.icon} ${s.name}`))
            ))),
            React.createElement('div', {style: styles.modalActions}, React.createElement('button', {type: 'submit', style: styles.button}, 'Save Rule'))
        );
    };

    const getRuleDescription = (rule: AutomationRule) => {
        const triggerProfile = rule.trigger.forProfileId === 'any_child' ? 'any child' : profiles.find(p => p.id === rule.trigger.forProfileId)?.name || '...';
        const actionScene = smartScenes.find(s => s.id === rule.action.sceneId);
        return `When ${triggerProfile} completes all chores, activate scene: "${actionScene?.name || '...'}"`;
    };

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', { onClick: onBack, style: { ...styles.backButton, float: 'left' } }, "← Back to Smart Home"),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "⚙️ Automation Settings"),

        React.createElement('section', { style: styles.section },
            React.createElement('button', { onClick: () => handleOpenModal(), style: { ...styles.button, width: 'auto', marginBottom: '15px' } }, "+ New Automation Rule"),
            automationRules.map(rule => (
                React.createElement('div', {key: rule.id, style: {...styles.listItem, backgroundColor: rule.enabled ? '#e8f5e9' : '#f5f5f5'}},
                    React.createElement('span', null, getRuleDescription(rule)),
                    React.createElement('div', {style: {display: 'flex', gap: '5px'}},
                        React.createElement('button', {onClick: () => handleOpenModal(rule), style: {...styles.button, width: 'auto'}}, "Edit"),
                        React.createElement('button', {onClick: () => handleDelete(rule.id), style: {...styles.button, ...styles.buttonDanger, width: 'auto'}}, "Delete"),
                    )
                )
            ))
        ),
        
        isModalOpen && React.createElement(Modal, {
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            title: editingRule ? 'Edit Automation Rule' : 'New Automation Rule',
            children: React.createElement(RuleForm, {onSave: handleSave})
        })
    );
}
