import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import type { AutomationRule, SmartScene } from '../types.ts';
import { Modal, ArrowLeftIcon } from '../components.tsx';

const RuleForm: React.FC<{
    onSave: (data: Omit<AutomationRule, 'id'>) => void;
    editingRule: AutomationRule | null;
}> = ({ onSave, editingRule }) => {
    const { smartScenes, profiles } = useAppState();
    const [triggerType, setTriggerType] = useState(editingRule?.trigger.type || 'all_chores_complete');
    const [triggerProfileId, setTriggerProfileId] = useState(editingRule?.trigger.forProfileId || 'any_child');
    const [actionType, setActionType] = useState(editingRule?.action.type || 'activate_scene');
    const [actionSceneId, setActionSceneId] = useState(editingRule?.action.sceneId || '');
    const [enabled, setEnabled] = useState(editingRule?.enabled ?? true);

    const childProfiles = profiles.filter(p => p.role === 'Child');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            enabled,
            trigger: { type: triggerType as any, forProfileId: triggerProfileId },
            action: { type: actionType as any, sceneId: actionSceneId }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="checkbox-label">
                    <input type='checkbox' className="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> 
                    Enabled
                </label>
            </div>
            <h4>Trigger ("When this happens...")</h4>
            <div className="form-group">
                <label>Event:</label>
                <select id="triggerType" value={triggerType} onChange={(e) => setTriggerType(e.target.value as any)} aria-label="Trigger Event">
                    <option value='all_chores_complete'>All chores for a day are completed</option>
                </select>
            </div>
            <div className="form-group">
                <label>For Child:</label>
                <select value={triggerProfileId} onChange={(e) => setTriggerProfileId(e.target.value)} aria-label="Select child profile">
                    <option value='any_child'>Any Child</option>
                    {childProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <h4>Action ("...do this")</h4>
            <div className="form-group">
                <label>Action:</label>
                <select value={actionType} onChange={(e) => setActionType(e.target.value as any)} aria-label="Select action type">
                    <option value='activate_scene'>Activate a Smart Scene</option>
                </select>
            </div>
            <div className="form-group">
                <label>Scene:</label>
                <select value={actionSceneId} onChange={(e) => setActionSceneId(e.target.value)} aria-label="Select a scene">
                    <option value=''>Select a scene...</option>
                    {smartScenes.map(s => <option key={s.id} value={s.id}>{`${s.icon} ${s.name}`}</option>)}
                </select>
            </div>
            <div className="form-actions">
                <button type='submit' className="btn">Save Rule</button>
            </div>
        </form>
    );
};

export default function AutomationSettingsView({ onBack }: { onBack: () => void }) {
    const { addAutomationRule, updateAutomationRule, deleteAutomationRule } = useAppDispatch();
    const { automationRules, smartScenes, profiles } = useAppState();
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
    
    const getRuleDescription = (rule: AutomationRule) => {
        const triggerProfile = rule.trigger.forProfileId === 'any_child' ? 'any child' : profiles.find(p => p.id === rule.trigger.forProfileId)?.name || '...';
        const actionScene = smartScenes.find(s => s.id === rule.action.sceneId);
        return `When ${triggerProfile} completes all chores, activate scene: "${actionScene?.name || '...'}"`;
    };

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={onBack} title="Go back">
                    <ArrowLeftIcon />
                </button>
                <h2>⚙️ Automation Settings</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    <button onClick={() => handleOpenModal()} className="btn w-auto mb-20">+ New Automation Rule</button>
                    {automationRules.map(rule => (
                        <div key={rule.id} className="list-item" style={{backgroundColor: rule.enabled ? '#e8f5e9' : '#f5f5f5'}}>
                            <span>{getRuleDescription(rule)}</span>
                            <div style={{display: 'flex', gap: '5px'}}>
                                <button onClick={() => handleOpenModal(rule)} className="btn btn-sm">Edit</button>
                                <button onClick={() => handleDelete(rule.id)} className="btn btn-danger btn-sm">Delete</button>
                            </div>
                        </div>
                    ))}
                </section>
                
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title={editingRule ? 'Edit Automation Rule' : 'New Automation Rule'}
                    >
                        <RuleForm onSave={handleSave} editingRule={editingRule} />
                    </Modal>
                )}
            </main>
        </div>
    );
}