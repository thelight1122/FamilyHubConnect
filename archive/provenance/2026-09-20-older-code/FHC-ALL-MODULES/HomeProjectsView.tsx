import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { HomeProject, HomeProjectTask } from './types';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// --- ProgressBar Component ---
const ProgressBar = ({ value, max, text }: { value: number; max: number; text: string; }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBarFill, width: `${percentage}%`, backgroundColor: '#3498db' }}></div>
            <div style={styles.progressBarText}>{text}</div>
        </div>
    );
};

// --- Project Form Modal ---
const ProjectForm = ({ onSave, onClose, editingProject }: { onSave: (data: Partial<Omit<HomeProject, 'id' | 'tasks'>>) => void, onClose: () => void, editingProject: HomeProject | null }) => {
    const [name, setName] = useState(editingProject?.name || '');
    const [description, setDescription] = useState(editingProject?.description || '');
    const [status, setStatus] = useState(editingProject?.status || 'Planning');
    const [budget, setBudget] = useState(editingProject?.budget?.toString() || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, status: status as HomeProject['status'], budget: budget ? parseFloat(budget) : undefined });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Project Name</label>
                <input style={styles.input} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea style={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label}>Status</label>
                    <select style={styles.selectInput} value={status} onChange={e => setStatus(e.target.value as HomeProject['status'])}>
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label}>Budget ($)</label>
                    <input type="number" style={styles.input} value={budget} onChange={e => setBudget(e.target.value)} placeholder="Optional" />
                </div>
            </div>
            <div style={styles.formActions}>
                <button type="button" onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button type="submit" style={styles.button}>Save Project</button>
            </div>
        </form>
    );
};

// --- Project Card Component ---
const ProjectCard = ({ project, onToggleTask }: { project: HomeProject, onToggleTask: (projectId: string, taskId: string) => void }) => {
    const completedTasks = project.tasks.filter(t => t.isComplete).length;
    const totalTasks = project.tasks.length;
    const progressText = `${completedTasks} / ${totalTasks} Tasks Completed`;
    
    const statusColors: { [key in HomeProject['status']]: string } = {
        'Planning': '#3498db',
        'In Progress': '#f1c40f',
        'Completed': '#2ecc71'
    };
    const statusBadgeStyle = {...styles.statusBadge, backgroundColor: statusColors[project.status]};

    return (
        <div style={styles.projectCard}>
            <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>{project.name}</h3>
                <span style={statusBadgeStyle}>{project.status}</span>
            </div>
            <p style={styles.projectDescription}>{project.description}</p>
            {project.budget && <p><strong>Budget:</strong> {formatCurrency(project.budget)}</p>}
            
            <p style={styles.projectProgressText}>{progressText}</p>
            <ProgressBar value={completedTasks} max={totalTasks} text={progressText} />

            <div style={styles.projectTaskList}>
                {project.tasks.map(task => (
                    <div key={task.id} style={styles.projectTaskItem}>
                        <input
                            type="checkbox"
                            style={styles.checkbox}
                            checked={task.isComplete}
                            onChange={() => onToggleTask(project.id, task.id)}
                            id={`task-${task.id}`}
                        />
                        <label htmlFor={`task-${task.id}`} style={{...styles.listItemName, ...(task.isComplete ? styles.listItemCompleted : {})}}>
                            {task.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main View ---
const HomeProjectsView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, addToast, currentViewingProfile } = useAppContext();
    const isParentView = currentViewingProfile.role !== 'Child';
    const allProjects = useMemo(() => personalizationData.homeProjects || [], [personalizationData.homeProjects]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<HomeProject | null>(null);

    const handleSaveProject = (data: Partial<Omit<HomeProject, 'id'|'tasks'>>) => {
        let updatedProjects;
        if (editingProject) {
            updatedProjects = allProjects.map(p => p.id === editingProject.id ? { ...p, ...data } as HomeProject : p);
            addToast("Project updated!", 'badge');
        } else {
            const newProject: HomeProject = {
                id: `proj_${Date.now()}`,
                name: data.name!,
                description: data.description || '',
                status: data.status || 'Planning',
                budget: data.budget,
                tasks: [], // Tasks must be added separately in a real app
            };
            updatedProjects = [...allProjects, newProject];
            addToast("Project added!", 'badge');
        }
        onSavePersonalization({ homeProjects: updatedProjects });
        setIsModalOpen(false);
        setEditingProject(null);
    };
    
    const handleToggleTask = (projectId: string, taskId: string) => {
        const updatedProjects = allProjects.map(p => {
            if (p.id === projectId) {
                const updatedTasks = p.tasks.map(t => {
                    if (t.id === taskId) {
                        return { ...t, isComplete: !t.isComplete };
                    }
                    return t;
                });
                return { ...p, tasks: updatedTasks };
            }
            return p;
        });
        onSavePersonalization({ homeProjects: updatedProjects });
    };
    
    if (!isParentView) {
        return (
            <div style={styles.pageContainer}>
                <header style={styles.header}>
                    <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('homeManagement')}><ArrowLeftIcon /></button>
                    <h2 style={styles.pageHeader}>🔨 Home Projects</h2>
                     <div style={{flexShrink: 0, width: 40}}></div>
                </header>
                <main style={styles.mainContent}><div style={styles.section}><p>This feature is for parents only.</p></div></main>
            </div>
        )
    }

    const projectsByStatus = useMemo(() => {
        return allProjects.reduce((acc, proj) => {
            const status = proj.status;
            if (!acc[status]) acc[status] = [];
            acc[status].push(proj);
            return acc;
        }, {} as { [key in HomeProject['status']]?: HomeProject[] });
    }, [allProjects]);
    
    const statusOrder: HomeProject['status'][] = ['In Progress', 'Planning', 'Completed'];

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('homeManagement')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>🔨 Home Projects</h2>
                <div style={{flexShrink: 0, width: 40}}>
                    <button onClick={() => setIsModalOpen(true)} style={{...styles.navButton, fontSize: '1.8em', color: styles.button.backgroundColor}}>+</button>
                </div>
            </header>
            <main style={styles.mainContent}>
                {statusOrder.map(status => (
                    projectsByStatus[status] && (
                        <div key={status}>
                            <h2 style={styles.listHeader}>{status}</h2>
                            {projectsByStatus[status]?.map(project => (
                                <ProjectCard key={project.id} project={project} onToggleTask={handleToggleTask} />
                            ))}
                        </div>
                    )
                ))}

                {allProjects.length === 0 && (
                    <div style={styles.section}><p>No projects yet. Click '+' to add one.</p></div>
                )}
            </main>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} title={editingProject ? "Edit Project" : "Add New Project"}>
                    <ProjectForm onSave={handleSaveProject} onClose={() => setIsModalOpen(false)} editingProject={editingProject} />
                </Modal>
            )}
            <BottomNavbar activePage="homeManagement" onNavigate={onNavigate} />
        </div>
    );
};

export default HomeProjectsView;