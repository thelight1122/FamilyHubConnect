import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { MaintenanceTask } from './types';

const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Prevent timezone issues
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// --- Task Form ---
const TaskForm = ({ onSave, onClose, editingTask }: { onSave: (data: Partial<Omit<MaintenanceTask, 'id'|'isComplete'>>) => void, onClose: () => void, editingTask: MaintenanceTask | null }) => {
    const [name, setName] = useState(editingTask?.name || '');
    const [description, setDescription] = useState(editingTask?.description || '');
    const [category, setCategory] = useState(editingTask?.category || 'General');
    const [recurrence, setRecurrence] = useState(editingTask?.recurrence || 'none');
    const [nextDue, setNextDue] = useState(editingTask?.nextDue || new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, category, recurrence, nextDue });
    };

    const categories: MaintenanceTask['category'][] = ['General', 'HVAC', 'Plumbing', 'Electrical', 'Yard', 'Appliance'];

    return (
        <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}><label style={styles.label}>Task Name</label><input style={styles.input} value={name} onChange={e => setName(e.target.value)} required /></div>
            <div style={styles.formGroup}><label style={styles.label}>Description (Optional)</label><textarea style={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} /></div>
            <div style={styles.formGroup}><label style={styles.label}>Category</label>
                <select style={styles.selectInput} value={category} onChange={e => setCategory(e.target.value as any)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{...styles.formGroup, flex: 1}}><label style={styles.label}>Recurrence</label>
                    <select style={styles.selectInput} value={recurrence} onChange={e => setRecurrence(e.target.value as any)}>
                        <option value="none">None</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                    </select>
                </div>
                <div style={{...styles.formGroup, flex: 1}}><label style={styles.label}>Due Date</label><input type="date" style={styles.input} value={nextDue} onChange={e => setNextDue(e.target.value)} required /></div>
            </div>
            <div style={styles.formActions}>
                <button type="button" onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button type="submit" style={styles.button}>Save Task</button>
            </div>
        </form>
    );
};

// --- Task Item ---
const MaintenanceTaskItem = ({ task, onComplete }: { task: MaintenanceTask, onComplete: (id: string) => void }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.nextDue + 'T00:00:00').getTime();
    const isOverdue = dueDate < today.getTime();

    const taskStyle: React.CSSProperties = {
        ...styles.choreItem, // Re-using chore style for consistency
        borderLeftColor: isOverdue ? styles.buttonDanger.backgroundColor : '#1abc9c'
    };
    
    return (
        <div style={taskStyle}>
            <div style={styles.choreItemHeader}>
                <h4 style={styles.choreTitle}>{task.name}</h4>
                <span style={{...styles.choreReward, backgroundColor: 'rgba(26, 188, 156, 0.1)', color: '#16a085'}}>{task.category}</span>
            </div>
            {task.description && <p style={{margin: '5px 0', color: '#555'}}>{task.description}</p>}
            <div style={styles.choreMeta}>
                <span>🗓️ Due: {formatDate(task.nextDue)}</span>
                {task.recurrence !== 'none' && <span>🔄 {task.recurrence}</span>}
            </div>
            <div style={styles.choreActions}>
                <button style={{...styles.button, ...styles.buttonSuccess}} onClick={() => onComplete(task.id)}>Mark as Complete</button>
            </div>
        </div>
    );
};


// --- Main View ---
const MaintenanceScheduleView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, addToast, currentViewingProfile } = useAppContext();
    const isParentView = currentViewingProfile.role !== 'Child';
    const allTasks = useMemo(() => (personalizationData.maintenanceTasks || []).filter(t => !t.isComplete).sort((a,b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime()), [personalizationData.maintenanceTasks]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);

    const handleSaveTask = (data: Partial<Omit<MaintenanceTask, 'id'|'isComplete'>>) => {
        let updatedTasks;
        if (editingTask) {
            updatedTasks = (personalizationData.maintenanceTasks || []).map(t => t.id === editingTask.id ? { ...t, ...data } as MaintenanceTask : t);
            addToast("Task updated!", 'badge');
        } else {
            const newTask: MaintenanceTask = {
                id: `maint_${Date.now()}`,
                name: data.name!,
                description: data.description,
                category: data.category!,
                recurrence: data.recurrence!,
                nextDue: data.nextDue!,
                isComplete: false,
            };
            updatedTasks = [...(personalizationData.maintenanceTasks || []), newTask];
            addToast("Task added!", 'badge');
        }
        onSavePersonalization({ maintenanceTasks: updatedTasks });
        setIsModalOpen(false);
        setEditingTask(null);
    };
    
    const handleCompleteTask = (taskId: string) => {
        const task = (personalizationData.maintenanceTasks || []).find(t => t.id === taskId);
        if (!task) return;

        let updatedTasks;
        let currentTask = { ...task, lastCompleted: new Date().toISOString().split('T')[0] };

        if (task.recurrence === 'none') {
            updatedTasks = (personalizationData.maintenanceTasks || []).map(t => t.id === taskId ? { ...currentTask, isComplete: true } : t);
        } else {
            const newDueDate = new Date(task.nextDue + 'T00:00:00');
            if (task.recurrence === 'monthly') newDueDate.setMonth(newDueDate.getMonth() + 1);
            else if (task.recurrence === 'quarterly') newDueDate.setMonth(newDueDate.getMonth() + 3);
            else if (task.recurrence === 'annually') newDueDate.setFullYear(newDueDate.getFullYear() + 1);

            const nextTask = { ...currentTask, nextDue: newDueDate.toISOString().split('T')[0] };
            updatedTasks = (personalizationData.maintenanceTasks || []).map(t => t.id === taskId ? nextTask : t);
        }

        onSavePersonalization({ maintenanceTasks: updatedTasks });
        addToast(`Completed: ${task.name}`, 'badge');
    };

    if (!isParentView) {
        return (
            <div style={styles.pageContainer}>
                <header style={styles.header}>
                    <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('homeManagement')}><ArrowLeftIcon /></button>
                    <h2 style={styles.pageHeader}>🔧 Maintenance</h2>
                     <div style={{flexShrink: 0, width: 40}}></div>
                </header>
                <main style={styles.mainContent}><div style={styles.section}><p>This feature is for parents only.</p></div></main>
            </div>
        )
    }
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const overdueTasks = allTasks.filter(t => new Date(t.nextDue + 'T00:00:00') < today);
    const dueSoonTasks = allTasks.filter(t => {
        const dueDate = new Date(t.nextDue + 'T00:00:00');
        return dueDate >= today && dueDate <= nextWeek;
    });
    const upcomingTasks = allTasks.filter(t => new Date(t.nextDue + 'T00:00:00') > nextWeek);


    const TaskList = ({ title, tasks }: { title: string, tasks: MaintenanceTask[] }) => {
        if (tasks.length === 0) return null;
        return (
            <section style={styles.section}>
                <h3 style={styles.listHeader}>{title}</h3>
                <div style={styles.choreListContainer}>
                    {tasks.map(task => <MaintenanceTaskItem key={task.id} task={task} onComplete={handleCompleteTask} />)}
                </div>
            </section>
        );
    };

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('homeManagement')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>🔧 Maintenance Schedule</h2>
                <div style={{flexShrink: 0, width: 40}}>
                    <button onClick={() => setIsModalOpen(true)} style={{...styles.navButton, fontSize: '1.8em', color: styles.button.backgroundColor}}>+</button>
                </div>
            </header>
            <main style={styles.mainContent}>
                <TaskList title="Overdue" tasks={overdueTasks} />
                <TaskList title="Due This Week" tasks={dueSoonTasks} />
                <TaskList title="Upcoming" tasks={upcomingTasks} />
                
                {allTasks.length === 0 && (
                    <div style={styles.section}><p>No maintenance tasks scheduled. Click '+' to add one.</p></div>
                )}
            </main>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} title={editingTask ? "Edit Task" : "Add Maintenance Task"}>
                    <TaskForm onSave={handleSaveTask} onClose={() => setIsModalOpen(false)} editingTask={editingTask} />
                </Modal>
            )}
            <BottomNavbar activePage="homeManagement" onNavigate={onNavigate} />
        </div>
    );
};

export default MaintenanceScheduleView;
