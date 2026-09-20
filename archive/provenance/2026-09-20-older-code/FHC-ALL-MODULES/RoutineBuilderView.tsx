import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { Routine, RoutineLog } from './types';

const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

// --- Calendar Heatmap ---
const CalendarHeatmap = ({ logs, routineId }: { logs: RoutineLog[], routineId: string }) => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    const loggedDates = new Set(logs.filter(log => log.routineId === routineId).map(log => log.date));
    
    const cells = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
        const dateKey = formatDateKey(date);
        const isCompleted = loggedDates.has(dateKey);
        const cellStyle: React.CSSProperties = { ...styles.heatmapCell };
        if (isCompleted) {
            cellStyle.backgroundColor = '#2ecc71';
            cellStyle.opacity = 1;
        } else if (date > today) {
             cellStyle.backgroundColor = '#f8f9fa';
        }
        return <div key={dateKey} style={cellStyle} title={dateKey}></div>;
    });

    return (
        <div style={styles.heatmapContainer}>
            <h4 style={{textAlign: 'center', margin: '0 0 10px 0'}}>{today.toLocaleDateString('en-us', {month: 'long'})}</h4>
            <div style={styles.heatmapGrid}>{cells}</div>
        </div>
    );
};


// --- Routine Card ---
const RoutineCard = ({ routine, logs, onCheckIn }: { routine: Routine, logs: RoutineLog[], onCheckIn: (routineId: string) => void }) => {
    const todayKey = formatDateKey(new Date());
    const isCheckedInToday = logs.some(log => log.routineId === routine.id && log.date === todayKey);
    
    const calculateStreak = useMemo(() => {
        const sortedLogs = logs
            .filter(log => log.routineId === routine.id)
            .map(log => new Date(log.date + 'T00:00:00'))
            .sort((a, b) => b.getTime() - a.getTime());
        
        if (sortedLogs.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0,0,0,0);
        
        // If not checked in today, start from yesterday
        if (!isCheckedInToday) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        for (const logDate of sortedLogs) {
            if (logDate.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break; // Streak is broken
            }
        }
        return streak;
    }, [logs, routine.id, isCheckedInToday]);

    return (
        <div style={styles.routineCard}>
            <div style={styles.routineInfo}>
                <h3 style={styles.routineTitle}>{routine.name}</h3>
                {routine.description && <p style={{color: '#7f8c8d', margin: 0}}>{routine.description}</p>}
                <p style={styles.streakCounter}>🔥 {calculateStreak} day streak</p>
            </div>
            <button
                style={isCheckedInToday ? {...styles.button, ...styles.buttonSuccess} : styles.button}
                onClick={() => onCheckIn(routine.id)}
                disabled={isCheckedInToday}
            >
                {isCheckedInToday ? 'Done ✔' : 'Check In'}
            </button>
        </div>
    );
};

// --- Add Routine Modal ---
const AddRoutineModal = ({ onClose, onSave }: { onClose: () => void, onSave: (data: Partial<Omit<Routine, 'id' | 'addedBy'>>) => void }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, frequency: 'daily' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}><label style={styles.label}>Routine Name</label><input style={styles.input} value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Morning Workout"/></div>
            <div style={styles.formGroup}><label style={styles.label}>Description (Optional)</label><textarea style={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} /></div>
            <div style={styles.formActions}>
                <button type="button" onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                <button type="submit" style={styles.button}>Save Routine</button>
            </div>
        </form>
    );
};


// --- Main View ---
const RoutineBuilderView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, currentViewingProfile, addToast } = useAppContext();
    const isChildView = currentViewingProfile.role === 'Child';

    const allRoutines = useMemo(() => personalizationData.routines || [], [personalizationData.routines]);
    const allLogs = useMemo(() => personalizationData.routineLogs || [], [personalizationData.routineLogs]);
    const myRoutines = useMemo(() => allRoutines.filter(r => r.addedBy === currentViewingProfile.id), [allRoutines, currentViewingProfile.id]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCheckIn = (routineId: string) => {
        const todayKey = formatDateKey(new Date());
        const alreadyLogged = allLogs.some(log => log.routineId === routineId && log.date === todayKey);
        
        if (alreadyLogged) {
            addToast("Already checked in today!", 'info');
            return;
        }

        const newLog: RoutineLog = { routineId, date: todayKey };
        onSavePersonalization({ routineLogs: [...allLogs, newLog] });
        addToast("Great job! Keep it up.", 'badge');
    };
    
    const handleSaveRoutine = (data: Partial<Omit<Routine, 'id'|'addedBy'>>) => {
        const newRoutine: Routine = {
            id: `routine_${Date.now()}`,
            name: data.name!,
            description: data.description,
            frequency: 'daily',
            addedBy: currentViewingProfile.id,
        };
        onSavePersonalization({ routines: [...allRoutines, newRoutine] });
        addToast("New routine added!", 'badge');
        setIsModalOpen(false);
    };

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{ ...styles.navButton, flexShrink: 0, width: 40 }} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>🔄 {isChildView ? 'My Routines' : 'Routine Builder'}</h2>
                 <div style={{ flexShrink: 0, width: 40 }}>
                    <button onClick={() => setIsModalOpen(true)} style={{...styles.navButton, fontSize: '1.8em', color: styles.button.backgroundColor}}>+</button>
                 </div>
            </header>
            <main style={styles.mainContent}>
                {myRoutines.map(routine => (
                    <div key={routine.id}>
                        <RoutineCard routine={routine} logs={allLogs} onCheckIn={handleCheckIn} />
                        <CalendarHeatmap logs={allLogs} routineId={routine.id} />
                    </div>
                ))}

                {myRoutines.length === 0 && (
                    <div style={styles.section}>
                        <p>No routines created yet. Click the '+' button to build your first one!</p>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} title="Add New Routine">
                    <AddRoutineModal onSave={handleSaveRoutine} onClose={() => setIsModalOpen(false)} />
                </Modal>
            )}

            <BottomNavbar activePage="habitTracker" onNavigate={onNavigate} />
        </div>
    );
};

export default RoutineBuilderView;
