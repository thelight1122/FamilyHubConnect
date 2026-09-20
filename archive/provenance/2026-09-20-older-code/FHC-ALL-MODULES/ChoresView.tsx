import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { Chore, ChoreStatus, ChoreRecurrence, Profile, AllowanceTransaction } from './types';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Ensure date is parsed in local timezone
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
};


// --- Chore Form Modal ---
const ChoreForm = ({
    onClose, onSave, editingChore, profiles
}: {
    onClose: () => void;
    onSave: (choreData: Omit<Chore, 'id' | 'createdAt' | 'status'>, id?: string) => void;
    editingChore: Chore | null;
    profiles: Profile[];
}) => {
    const [title, setTitle] = useState(editingChore?.title || '');
    const [description, setDescription] = useState(editingChore?.description || '');
    const [assignedTo, setAssignedTo] = useState(editingChore?.assignedTo || '');
    const [reward, setReward] = useState(editingChore?.reward.toString() || '');
    const [dueDate, setDueDate] = useState(editingChore?.dueDate || new Date().toISOString().split('T')[0]);
    const [recurrence, setRecurrence] = useState<ChoreRecurrence>(editingChore?.recurrence || 'none');
    
    const children = profiles.filter(p => p.role === 'Child');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !assignedTo || !reward) {
            alert('Please fill out all required fields.');
            return;
        }
        const choreData = {
            title, description, assignedTo,
            reward: parseFloat(reward),
            dueDate, recurrence,
        };
        onSave(choreData, editingChore?.id);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="chore-title">Chore Title</label>
                <input style={styles.input} id="chore-title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="chore-desc">Description (Optional)</label>
                <textarea style={styles.textarea} id="chore-desc" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
             <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="chore-assignee">Assign To</label>
                <select style={styles.selectInput} id="chore-assignee" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} required>
                    <option value="">Select a child</option>
                    {children.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label} htmlFor="chore-reward">Reward ($)</label>
                    <input style={styles.input} id="chore-reward" type="number" step="0.01" value={reward} onChange={e => setReward(e.target.value)} required />
                </div>
                <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label} htmlFor="chore-due">Due Date</label>
                    <input style={styles.input} id="chore-due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                </div>
            </div>
             <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="chore-recurrence">Recurrence</label>
                <select style={styles.selectInput} id="chore-recurrence" value={recurrence} onChange={e => setRecurrence(e.target.value as ChoreRecurrence)}>
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>
            <div style={styles.formActions}>
                <button type="button" onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button type="submit" style={styles.button}>Save Chore</button>
            </div>
        </form>
    );
};


// --- Chore Item Component ---
const ChoreItem = ({
    chore, onApprove, onMarkDone, getProfileName
}: {
    chore: Chore;
    onApprove: (choreId: string) => void;
    onMarkDone: (choreId: string) => void;
    getProfileName: (id: string) => string;
}) => {
    const { currentViewingProfile } = useAppContext();
    const isParentView = currentViewingProfile.role !== 'Child';
    
    const statusColors = {
        'to-do': '#3498db',
        'pending-approval': '#f1c40f',
        'done': '#2ecc71',
    };
    
    const itemStyle = {
        ...styles.choreItem,
        borderLeftColor: statusColors[chore.status]
    };

    return (
        <div style={itemStyle}>
            <div style={styles.choreItemHeader}>
                <h4 style={styles.choreTitle}>{chore.title}</h4>
                <span style={styles.choreReward}>{formatCurrency(chore.reward)}</span>
            </div>
            {chore.description && <p style={{margin: 0, color: '#555'}}>{chore.description}</p>}
            <div style={styles.choreMeta}>
                <span>👤 {getProfileName(chore.assignedTo)}</span>
                <span>🗓️ Due: {formatDate(chore.dueDate)}</span>
                {chore.recurrence !== 'none' && <span>🔄 {chore.recurrence.charAt(0).toUpperCase() + chore.recurrence.slice(1)}</span>}
            </div>
            <div style={styles.choreActions}>
                {isParentView && chore.status === 'pending-approval' && (
                    <button style={{...styles.button, ...styles.buttonSuccess}} onClick={() => onApprove(chore.id)}>Approve</button>
                )}
                {!isParentView && chore.status === 'to-do' && (
                    <button style={styles.button} onClick={() => onMarkDone(chore.id)}>Mark as Done</button>
                )}
            </div>
        </div>
    );
};


// --- Main Chores View Component ---
const ChoresView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, profiles, currentViewingProfile, addToast } = useAppContext();
    const isParentView = currentViewingProfile.role !== 'Child';
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChore, setEditingChore] = useState<Chore | null>(null);

    const allChores = useMemo(() => (personalizationData.chores || []).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()), [personalizationData.chores]);

    const getProfileName = (id: string) => profiles.find(p => p.id === id)?.name || 'N/A';
    
    const handleSaveChore = (choreData: Omit<Chore, 'id' | 'createdAt' | 'status'>, id?: string) => {
        let updatedChores: Chore[];
        if (id) { // Editing
            updatedChores = allChores.map(c => c.id === id ? { ...c, ...choreData } : c);
            addToast("Chore updated!", 'badge');
        } else { // Creating new
            const newChore: Chore = {
                ...choreData,
                id: `chore_${Date.now()}`,
                createdAt: Date.now(),
                status: 'to-do',
            };
            updatedChores = [...allChores, newChore];
            addToast("Chore added!", 'badge');
        }
        onSavePersonalization({ chores: updatedChores });
        setIsModalOpen(false);
        setEditingChore(null);
    };

    const handleMarkDone = (choreId: string) => {
        const updatedChores = allChores.map(c => c.id === choreId ? { ...c, status: 'pending-approval' as ChoreStatus, completedAt: Date.now() } : c);
        onSavePersonalization({ chores: updatedChores });
        addToast("Great job! Submitted for approval.", 'badge');
    };

    const handleApprove = (choreId: string) => {
        const chore = allChores.find(c => c.id === choreId);
        if (!chore) return;

        let updatedChores = allChores.map(c => c.id === choreId ? { ...c, status: 'done' as ChoreStatus, approvedAt: Date.now() } : c);
        
        // Add new recurring chore if needed
        if (chore.recurrence !== 'none') {
            const newDueDate = new Date(chore.dueDate + 'T00:00:00');
            if (chore.recurrence === 'daily') {
                newDueDate.setDate(newDueDate.getDate() + 1);
            } else if (chore.recurrence === 'weekly') {
                newDueDate.setDate(newDueDate.getDate() + 7);
            }
            
            const newChore: Chore = {
                ...chore,
                id: `chore_${Date.now()}`,
                dueDate: newDueDate.toISOString().split('T')[0],
                status: 'to-do',
                createdAt: Date.now(),
                completedAt: undefined,
                approvedAt: undefined
            };
            updatedChores.push(newChore);
        }
        
        // Add allowance transaction
        const newTransaction: AllowanceTransaction = {
            id: `txn_${Date.now()}`,
            profileId: chore.assignedTo,
            date: Date.now(),
            amount: chore.reward,
            description: `Chore: ${chore.title}`,
            category: 'chore'
        };
        const updatedTransactions = [...(personalizationData.allowanceTransactions || []), newTransaction];
        
        onSavePersonalization({ chores: updatedChores, allowanceTransactions: updatedTransactions });
        addToast(`${getProfileName(chore.assignedTo)} earned ${formatCurrency(chore.reward)}!`, 'badge');
    };
    
    const choresToDisplay = isParentView ? allChores : allChores.filter(c => c.assignedTo === currentViewingProfile.id);

    const pendingApprovalChores = choresToDisplay.filter(c => c.status === 'pending-approval');
    const todoChores = choresToDisplay.filter(c => c.status === 'to-do');
    const doneChores = choresToDisplay.filter(c => c.status === 'done');
    
    const ChoreList = ({ title, chores }: { title: string; chores: Chore[] }) => {
        if (chores.length === 0) return null;
        return (
            <section style={styles.section}>
                <h3 style={styles.listHeader}>{title}</h3>
                <div style={styles.choreListContainer}>
                    {chores.map(chore => (
                        <ChoreItem key={chore.id} chore={chore} onApprove={handleApprove} onMarkDone={handleMarkDone} getProfileName={getProfileName} />
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>{isParentView ? '🧹 Chores' : 'My Jobs'}</h2>
                <div style={{flexShrink: 0, width: 40}}>
                    {isParentView && (
                        <button onClick={() => setIsModalOpen(true)} style={{...styles.navButton, fontSize: '1.8em', color: styles.button.backgroundColor}}>+</button>
                    )}
                </div>
            </header>
            <main style={styles.mainContent}>
                {isParentView ? (
                    <>
                        <ChoreList title="Pending Approval" chores={pendingApprovalChores} />
                        <ChoreList title="To-Do" chores={todoChores} />
                        <ChoreList title="Completed" chores={doneChores} />
                    </>
                ) : (
                    <>
                        <ChoreList title="My To-Do" chores={todoChores} />
                        <ChoreList title="Waiting for Approval" chores={pendingApprovalChores} />
                        <ChoreList title="Completed Jobs" chores={doneChores} />
                    </>
                )}
                {choresToDisplay.length === 0 && (
                     <div style={styles.section}>
                        <p>No chores to show right now. {isParentView ? "Click the '+' to add one!" : "Ask a parent to assign you a job."}</p>
                     </div>
                )}
            </main>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} title={editingChore ? 'Edit Chore' : 'Add New Chore'}>
                    <ChoreForm 
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveChore}
                        editingChore={editingChore}
                        profiles={profiles}
                    />
                </Modal>
            )}
            
            <BottomNavbar activePage="chores" onNavigate={onNavigate} />
        </div>
    );
};

export default ChoresView;