

import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import type { Skill, AssignedSkill } from '../types';
import { Modal, EmptyState, AIHelperWidget, LoadingSpinner, ArrowLeftIcon } from '../components';

interface SkillsTrackerViewProps {
    onBack: () => void;
}

const masteryLevels: AssignedSkill['mastery'][] = ['beginner', 'intermediate', 'expert'];
const masteryColors: Record<AssignedSkill['mastery'], string> = {
    beginner: '#f0ad4e',
    intermediate: '#5bc0de',
    expert: '#5cb85c'
};

const SkillForm: React.FC<{
    onSave: (skillData: Omit<Skill, 'id'>) => void;
    onClose: () => void;
    skill?: Skill | null;
}> = ({ onSave, onClose, skill }) => {
    const [name, setName] = useState(skill?.name || '');
    const [description, setDescription] = useState(skill?.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) return;
        onSave({ name, description });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="skillName">Skill Name</label>
                <input id="skillName" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="skillDesc">Description</label>
                <textarea id="skillDesc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
            </div>
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn">Save Skill</button>
            </div>
        </form>
    );
};

export default function SkillsTrackerView({ onBack }: SkillsTrackerViewProps) {
    const {
        addSkill, updateSkill, deleteSkill, assignSkill,
        updateAssignedSkill, addToast, getProfileName
    } = useAppDispatch();
    const { skills, assignedSkills, profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);

    const isParent = currentViewingProfile?.role === 'Admin' || currentViewingProfile?.role === 'Parent';
    const childProfiles = useMemo(() => profiles.filter(p => p.role === 'Child'), [profiles]);
    const [selectedChildId, setSelectedChildId] = useState<string>(isParent ? (childProfiles[0]?.id || '') : (currentViewingProfile?.id || ''));
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const profileToShowSkillsFor = isParent ? selectedChildId : currentViewingProfile?.id;

    const myAssignedSkills = useMemo(() => assignedSkills.filter(as => as.profileId === profileToShowSkillsFor), [assignedSkills, profileToShowSkillsFor]);
    const availableSkills = useMemo(() => {
        const assignedSkillIds = new Set(myAssignedSkills.map(as => as.skillId));
        return skills.filter(s => !assignedSkillIds.has(s.id));
    }, [skills, myAssignedSkills]);

    const handleOpenSkillModal = (skill?: Skill) => {
        setEditingSkill(skill || null);
        setIsSkillModalOpen(true);
    };

    const handleSaveSkill = async (skillData: Omit<Skill, 'id'>) => {
        if (editingSkill) {
            await updateSkill(editingSkill.id, skillData);
            addToast("Skill updated!", 'badge');
        } else {
            await addSkill(skillData);
            addToast("Skill added!", 'badge');
        }
        setIsSkillModalOpen(false);
    };
    
    const handleDeleteSkill = async (skillId: string) => {
        if (window.confirm("Are you sure? This will remove the skill for everyone.")) {
            await deleteSkill(skillId);
            addToast("Skill deleted.", 'info');
        }
    }

    const handleStartLearning = async (skillId: string) => {
        if (!profileToShowSkillsFor) return;
        await assignSkill(skillId, profileToShowSkillsFor);
        addToast("Started learning a new skill!", 'badge');
    };
    
    const handleUpdateMastery = async (assignedSkillId: string, newMastery: AssignedSkill['mastery']) => {
        await updateAssignedSkill(assignedSkillId, { mastery: newMastery });
        addToast("Mastery level updated!", 'info');
    };

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>🎯 Skills Tracker</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                {isParent && (
                    <div className="form-group mb-20">
                        <label htmlFor="child-select-skills">Viewing Skills For:</label>
                        <select id="child-select-skills" value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)}>
                            {childProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                )}
                
                <section className="card">
                    <h3>{`${getProfileName(profileToShowSkillsFor)}'s Current Skills`}</h3>
                    {myAssignedSkills.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {myAssignedSkills.map(as => {
                                const skill = skills.find(s => s.id === as.skillId);
                                if (!skill) return null;
                                const masteryIndex = masteryLevels.indexOf(as.mastery);
                                return (
                                    <div key={as.id} className="card">
                                        <h4>{skill.name}</h4>
                                        <p>{skill.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                            <strong>Mastery:</strong>
                                            {masteryLevels.map((level, index) => (
                                                <button key={level} onClick={() => isParent && handleUpdateMastery(as.id, level)} disabled={!isParent} className="btn" style={{ backgroundColor: masteryIndex >= index ? masteryColors[level] : '#ccc' }}>
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState icon="🤔" title="No Skills Yet" message="Start learning a new skill from the list below!" />
                    )}
                </section>
                
                <section className="card">
                    <h3>Available Skills to Learn</h3>
                    {isParent && <button className="btn w-auto mb-20" onClick={() => handleOpenSkillModal()}>+ Add New Skill to Master List</button>}
                    {availableSkills.length > 0 ? (
                        availableSkills.map(skill => (
                            <div key={skill.id} className="list-item">
                                <div>
                                    <strong>{skill.name}</strong>
                                    <p>{skill.description}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button className="btn btn-sm" onClick={() => handleStartLearning(skill.id)}>Start Learning</button>
                                    {isParent && <button className="btn btn-sm btn-secondary" onClick={() => handleOpenSkillModal(skill)}>Edit</button>}
                                    {isParent && <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSkill(skill.id)}>X</button>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>All available skills are being learned.</p>
                    )}
                </section>
            </main>
            <Modal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} title={editingSkill ? "Edit Skill" : "Add New Skill"}>
                <SkillForm onSave={handleSaveSkill} onClose={() => setIsSkillModalOpen(false)} skill={editingSkill} />
            </Modal>
        </div>
    );
}