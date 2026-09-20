import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { Skill, SkillMilestone } from './types';

const XP_PER_LEVEL = 500;
const SKILL_LEVELS = ["Novice", "Apprentice", "Adept", "Expert", "Master", "Legend"];
const getLevelName = (level: number) => SKILL_LEVELS[Math.min(level - 1, SKILL_LEVELS.length - 1)];

// --- ProgressBar Component ---
const ProgressBar = ({ value, max, text }: { value: number; max: number; text: string; }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBarFill, width: `${percentage}%`, backgroundColor: '#9b59b6' }}></div>
            <div style={styles.progressBarText}>{text}</div>
        </div>
    );
};

// --- Skill Card Component ---
const SkillCard = ({ skill, onLogProgress, onToggleMilestone }: { skill: Skill, onLogProgress: (skill: Skill) => void, onToggleMilestone: (skillId: string, milestoneId: string) => void }) => {
    const currentLevelXp = skill.xp % XP_PER_LEVEL;
    const progressText = `${currentLevelXp} / ${XP_PER_LEVEL} XP`;

    return (
        <div style={styles.skillCard}>
            <div style={styles.skillHeader}>
                <h3 style={styles.skillTitle}>{skill.name}</h3>
                <span style={styles.levelBadge}>Level {skill.level}: {getLevelName(skill.level)}</span>
            </div>
            
            <p style={styles.xpText}>{progressText}</p>
            <ProgressBar value={currentLevelXp} max={XP_PER_LEVEL} text={progressText} />

            <div style={styles.milestoneList}>
                <h4 style={{marginBottom: '5px'}}>Milestones:</h4>
                {skill.milestones.map(milestone => (
                    <div key={milestone.id} style={styles.milestoneItem}>
                        <input
                            type="checkbox"
                            style={styles.checkbox}
                            checked={milestone.isComplete}
                            onChange={() => onToggleMilestone(skill.id, milestone.id)}
                            id={`milestone-${milestone.id}`}
                        />
                        <label htmlFor={`milestone-${milestone.id}`} style={{...styles.listItemName, ...(milestone.isComplete ? styles.listItemCompleted : {})}}>
                            {milestone.description}
                        </label>
                    </div>
                ))}
                 {skill.milestones.length === 0 && <p style={{color: '#7f8c8d', fontSize: '0.9em'}}>No milestones yet.</p>}
            </div>
            <div style={{...styles.formActions, justifyContent: 'flex-end', marginTop: '15px'}}>
                <button onClick={() => onLogProgress(skill)} style={{...styles.button, ...styles.buttonSecondary}}>+ Log Progress</button>
            </div>
        </div>
    );
};


// --- Modals ---
const AddSkillModal = ({ onClose, onSave, isLoading }: { onClose: () => void; onSave: (name: string) => void; isLoading: boolean; }) => {
    const [name, setName] = useState('');
    return (
        <Modal onClose={onClose} title="Add New Skill">
            <div style={styles.formGroup}>
                <label style={styles.label}>What do you want to learn?</label>
                <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Learn to Cook" />
                <small style={{ color: '#7f8c8d', marginTop: '5px', display: 'block' }}>
                    AI will suggest some starting milestones for you.
                </small>
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button onClick={() => onSave(name)} disabled={isLoading || !name} style={styles.button}>
                    {isLoading ? '🧠 Thinking...' : 'Add Skill'}
                </button>
            </div>
        </Modal>
    );
};

const LogProgressModal = ({ onClose, onSave, skill }: { onClose: () => void, onSave: (xp: number) => void, skill: Skill }) => {
    const [xp, setXp] = useState('');
    return (
        <Modal onClose={onClose} title={`Log Progress for ${skill.name}`}>
            <div style={styles.formGroup}>
                <label style={styles.label}>How much XP did you earn?</label>
                <input type="number" style={styles.input} value={xp} onChange={e => setXp(e.target.value)} placeholder="e.g., 50"/>
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button onClick={() => onSave(parseInt(xp, 10))} style={styles.button} disabled={!xp}>Save Progress</button>
            </div>
        </Modal>
    );
};

// --- Main View ---
const SkillsTrackerView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, currentViewingProfile, addToast } = useAppContext();
    const isChildView = currentViewingProfile.role === 'Child';
    
    const allSkills = useMemo(() => personalizationData.skills || [], [personalizationData.skills]);
    const mySkills = useMemo(() => allSkills.filter(s => s.addedBy === currentViewingProfile.id), [allSkills, currentViewingProfile.id]);

    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isLogModalOpen, setLogModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    const handleAddSkill = async (name: string) => {
        if (!process.env.API_KEY) return addToast("API Key not configured.", 'info');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const milestoneResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Create a list of 5 beginner-friendly milestones for learning the skill "${name}".`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            milestones: { type: Type.ARRAY, items: { type: Type.STRING } },
                        }
                    }
                }
            });

            const milestoneData = JSON.parse(milestoneResponse.text);
            const newMilestones: SkillMilestone[] = milestoneData.milestones.map((desc: string, i: number) => ({
                id: `ms_${Date.now()}_${i}`,
                description: desc,
                isComplete: false,
            }));

            const newSkill: Skill = {
                id: `skill_${Date.now()}`,
                name,
                level: 1,
                xp: 0,
                milestones: newMilestones,
                addedBy: currentViewingProfile.id,
            };
            onSavePersonalization({ skills: [...allSkills, newSkill] });
            addToast("New skill added!", 'badge');
            setAddModalOpen(false);

        } catch (error) {
            console.error("AI Add Skill Failed:", error);
            addToast("Couldn't generate milestones for that skill. Try adding one manually.", 'info');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogProgress = (skill: Skill) => {
        setSelectedSkill(skill);
        setLogModalOpen(true);
    };

    const handleSaveProgress = (xp: number) => {
        if (!selectedSkill || isNaN(xp)) return;

        const newXp = selectedSkill.xp + xp;
        const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
        
        const updatedSkills = allSkills.map(s => s.id === selectedSkill.id ? {...s, xp: newXp, level: newLevel} : s);
        onSavePersonalization({ skills: updatedSkills });

        if (newLevel > selectedSkill.level) {
            addToast(`LEVEL UP! You've reached Level ${newLevel} in ${selectedSkill.name}!`, 'badge');
        } else {
            addToast(`${xp} XP added to ${selectedSkill.name}!`, 'badge');
        }
        setLogModalOpen(false);
        setSelectedSkill(null);
    };

    const handleToggleMilestone = (skillId: string, milestoneId: string) => {
        const updatedSkills = allSkills.map(s => {
            if (s.id === skillId) {
                let milestoneCompleted = false;
                const updatedMilestones = s.milestones.map(m => {
                    if (m.id === milestoneId) {
                        milestoneCompleted = !m.isComplete;
                        return { ...m, isComplete: !m.isComplete };
                    }
                    return m;
                });

                const xpGained = milestoneCompleted ? 100 : -100; // Add/remove XP for milestone completion
                const newXp = s.xp + xpGained;
                const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

                if (milestoneCompleted) addToast(`Milestone complete! +100 XP!`, 'badge');

                return { ...s, milestones: updatedMilestones, xp: newXp, level: newLevel };
            }
            return s;
        });
        onSavePersonalization({ skills: updatedSkills });
    };

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}><ArrowLeftIcon /></button>
                <h2 style={styles.pageHeader}>🌱 {isChildView ? 'Level Up!' : 'Skills Tracker'}</h2>
                <div style={{flexShrink: 0, width: 40}}>
                    <button onClick={() => setAddModalOpen(true)} style={{...styles.navButton, fontSize: '1.8em', color: styles.button.backgroundColor}}>+</button>
                </div>
            </header>
            <main style={styles.mainContent}>
                {mySkills.map(skill => (
                    <SkillCard 
                        key={skill.id}
                        skill={skill}
                        onLogProgress={handleLogProgress}
                        onToggleMilestone={handleToggleMilestone}
                    />
                ))}

                {mySkills.length === 0 && (
                     <div style={styles.section}>
                        <p>No skills being tracked. Click '+' to add a new skill to learn!</p>
                     </div>
                )}
            </main>

            {isAddModalOpen && <AddSkillModal onClose={() => setAddModalOpen(false)} onSave={handleAddSkill} isLoading={isLoading} />}
            {isLogModalOpen && selectedSkill && <LogProgressModal onClose={() => setLogModalOpen(false)} onSave={handleSaveProgress} skill={selectedSkill} />}

            <BottomNavbar activePage="skillsTracker" onNavigate={onNavigate} />
        </div>
    );
};

export default SkillsTrackerView;
