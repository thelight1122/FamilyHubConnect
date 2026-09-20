import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { ExtracurricularActivity, Profile, ActivityScheduleItem, ActivityGearItem, ActivityType } from './types';

// --- HELPER: Find Next Activity ---
const getNextActivity = (activities: ExtracurricularActivity[]) => {
    if (!activities || activities.length === 0) return null;

    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDayIndex = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const allInstances: { activity: ExtracurricularActivity; schedule: ActivityScheduleItem; dayIndex: number }[] = [];
    activities.forEach(activity => {
        activity.schedule.forEach(scheduleItem => {
            allInstances.push({ activity, schedule: scheduleItem, dayIndex: dayOrder.indexOf(scheduleItem.dayOfWeek) });
        });
    });

    const upcomingInstances = allInstances.filter(inst => {
        const isToday = inst.dayIndex === currentDayIndex;
        if (isToday && inst.schedule.endTime < currentTime) {
            return false; // Already passed today
        }
        return true;
    });

    upcomingInstances.sort((a, b) => {
        const dayDiffA = (a.dayIndex - currentDayIndex + 7) % 7;
        const dayDiffB = (b.dayIndex - currentDayIndex + 7) % 7;

        if (dayDiffA !== dayDiffB) return dayDiffA - dayDiffB;
        return a.schedule.startTime.localeCompare(b.schedule.startTime);
    });

    return upcomingInstances[0] || null;
};

// --- MODAL: Activity Form ---
const ActivityForm = ({ onSave, onClose, editingActivity, profileId }: { onSave: (data: any, id?: string) => void; onClose: () => void; editingActivity: ExtracurricularActivity | null; profileId: string }) => {
    const [name, setName] = useState(editingActivity?.name || '');
    const [type, setType] = useState<ActivityType>(editingActivity?.type || 'Sport');
    const [location, setLocation] = useState(editingActivity?.location || '');
    const [notes, setNotes] = useState(editingActivity?.notes || '');
    // Simple schedule input for now; could be expanded
    const [day, setDay] = useState<ActivityScheduleItem['dayOfWeek']>(editingActivity?.schedule[0]?.dayOfWeek || 'Monday');
    const [startTime, setStartTime] = useState(editingActivity?.schedule[0]?.startTime || '');
    const [endTime, setEndTime] = useState(editingActivity?.schedule[0]?.endTime || '');
    const [gear, setGear] = useState(editingActivity?.gear.map(g => g.name).join(', ') || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const gearItems: ActivityGearItem[] = gear.split(',').map(g => g.trim()).filter(Boolean).map(g => ({ id: `gear_${Math.random()}`, name: g, packed: false }));
        const scheduleItem: ActivityScheduleItem = { dayOfWeek: day, startTime, endTime };
        
        const data = { name, type, location, notes, profileId, schedule: [scheduleItem], gear: gearItems };
        onSave(data, editingActivity?.id);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}><label style={styles.label}>Activity Name</label><input style={styles.input} value={name} onChange={e => setName(e.target.value)} required /></div>
            <div style={styles.formGroup}><label style={styles.label}>Type</label>
                <select style={styles.selectInput} value={type} onChange={e => setType(e.target.value as ActivityType)}>
                    {['Sport', 'Music', 'Art', 'Academic', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
            <div style={styles.formGroup}><label style={styles.label}>Location</label><input style={styles.input} value={location} onChange={e => setLocation(e.target.value)} /></div>
            <div style={styles.formGroup}><label style={styles.label}>Schedule</label>
                <div style={{display: 'flex', gap: '10px'}}>
                    <select style={{...styles.selectInput, flex: 2}} value={day} onChange={e => setDay(e.target.value as ActivityScheduleItem['dayOfWeek'])}>
                         {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input type="time" style={{...styles.input, flex: 1}} value={startTime} onChange={e => setStartTime(e.target.value)} required/>
                    <input type="time" style={{...styles.input, flex: 1}} value={endTime} onChange={e => setEndTime(e.target.value)} required/>
                </div>
            </div>
            <div style={styles.formGroup}><label style={styles.label}>Gear Needed (comma-separated)</label><input style={styles.input} value={gear} onChange={e => setGear(e.target.value)} placeholder="e.g., Cleats, Water Bottle, Notebook"/></div>
            <div style={styles.formGroup}><label style={styles.label}>Notes</label><textarea style={styles.textarea} value={notes} onChange={e => setNotes(e.target.value)} /></div>
            <div style={styles.formActions}><button type="button" onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button><button type="submit" style={styles.button}>Save Activity</button></div>
        </form>
    );
};


// --- VIEW: Locker Room ---
const LockerRoomView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, currentViewingProfile, profiles, addToast } = useAppContext();
    const isParentView = currentViewingProfile.role !== 'Child';
    const allActivities = useMemo(() => personalizationData.extracurricularActivities || [], [personalizationData.extracurricularActivities]);
    const children = useMemo(() => profiles.filter(p => p.role === 'Child'), [profiles]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<ExtracurricularActivity | null>(null);
    const [modalProfileId, setModalProfileId] = useState<string | null>(null);

    const handleOpenModal = (profileId: string, activity?: ExtracurricularActivity) => {
        setEditingActivity(activity || null);
        setModalProfileId(profileId);
        setIsModalOpen(true);
    };
    
    const handleSaveActivity = (data: Omit<ExtracurricularActivity, 'id'>, id?: string) => {
        let updatedActivities;
        if (id) {
            updatedActivities = allActivities.map(act => act.id === id ? { ...act, ...data } : act);
            addToast("Activity updated!", 'badge');
        } else {
            const newActivity: ExtracurricularActivity = { ...data, id: `act_${Date.now()}` };
            updatedActivities = [...allActivities, newActivity];
            addToast("Activity added!", 'badge');
        }
        onSavePersonalization({ extracurricularActivities: updatedActivities });
        setIsModalOpen(false);
    };

    const handleToggleGear = (activityId: string, gearId: string) => {
        const updatedActivities = allActivities.map(act => {
            if (act.id === activityId) {
                const newGear = act.gear.map(g => g.id === gearId ? { ...g, packed: !g.packed } : g);
                return { ...act, gear: newGear };
            }
            return act;
        });
        onSavePersonalization({ extracurricularActivities: updatedActivities });
    };

    const WhatsNextCard = ({ activities }: { activities: ExtracurricularActivity[] }) => {
        const nextActivityInfo = useMemo(() => getNextActivity(activities), [activities]);
        if (!nextActivityInfo) {
            return (
                <div style={styles.whatsNextCard}>
                    <h3 style={styles.whatsNextTitle}>What's Next?</h3>
                    <p style={styles.whatsNextActivity}>No upcoming activities!</p>
                </div>
            )
        }
        const { activity, schedule } = nextActivityInfo;
        return (
            <div style={styles.whatsNextCard}>
                <h3 style={styles.whatsNextTitle}>What's Next?</h3>
                <p style={styles.whatsNextActivity}>{activity.name}</p>
                <p style={styles.whatsNextDetails}>{schedule.dayOfWeek} at {schedule.startTime} - {activity.location}</p>
            </div>
        );
    };

    const ActivityCard = ({ activity }: { activity: ExtracurricularActivity }) => (
        <div style={styles.activityCard}>
            <div style={styles.activityHeader}>
                <h3 style={styles.activityTitle}>{activity.name}</h3>
                <span style={{...styles.activityTypeBadge, backgroundColor: styles.buttonSecondary.backgroundColor}}>{activity.type}</span>
            </div>
            <div style={styles.activityDetailsGrid}>
                <div style={styles.activityDetailItem}><span>🗓️</span> <span>{activity.schedule.map(s => `${s.dayOfWeek} ${s.startTime}-${s.endTime}`).join(', ')}</span></div>
                <div style={styles.activityDetailItem}><span>📍</span> <span>{activity.location}</span></div>
            </div>
            {activity.notes && <p style={styles.activityDetailItem}><span>📝</span> <span>{activity.notes}</span></p>}
            
            <div style={styles.gearChecklist}>
                <h4 style={styles.gearChecklistTitle}>🎒 Gear Checklist</h4>
                {activity.gear.map(g => (
                    <div key={g.id} style={styles.gearItem}>
                        <input type="checkbox" style={styles.checkbox} checked={g.packed} onChange={() => handleToggleGear(activity.id, g.id)} id={`gear-${g.id}`}/>
                        <label htmlFor={`gear-${g.id}`} style={{ ...styles.gearItemName, ...(g.packed ? styles.gearItemPacked : {}) }}>{g.name}</label>
                    </div>
                ))}
                {activity.gear.length === 0 && <p style={{color: '#7f8c8d'}}>No gear listed for this activity.</p>}
            </div>
             {isParentView && <div style={{...styles.formActions, justifyContent: 'flex-end'}}><button onClick={() => handleOpenModal(activity.profileId, activity)} style={{...styles.button, ...styles.buttonSecondary}}>Edit</button></div>}
        </div>
    );

    const ChildSection = ({ profile }: { profile: Profile }) => {
        const childActivities = allActivities.filter(act => act.profileId === profile.id);
        return (
            <div key={profile.id}>
                {isParentView && <h2 style={styles.listHeader}>{profile.name}'s Locker</h2>}
                <WhatsNextCard activities={childActivities} />
                {childActivities.map(act => <ActivityCard key={act.id} activity={act} />)}
                {isParentView && <button style={{...styles.button, width: '100%'}} onClick={() => handleOpenModal(profile.id)}>+ Add Activity for {profile.name}</button>}
            </div>
        )
    };
    
    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}><ArrowLeftIcon /></button>
                <h2 style={styles.pageHeader}>{isParentView ? '🎒 Locker Room' : 'My Locker'}</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                {isParentView ? (
                    children.map(child => <ChildSection key={child.id} profile={child} />)
                ) : (
                    <ChildSection profile={currentViewingProfile} />
                )}
            </main>
            {isModalOpen && modalProfileId && (
                <Modal onClose={() => setIsModalOpen(false)} title={editingActivity ? 'Edit Activity' : 'Add Activity'}>
                    <ActivityForm onSave={handleSaveActivity} onClose={() => setIsModalOpen(false)} editingActivity={editingActivity} profileId={modalProfileId} />
                </Modal>
            )}
            <BottomNavbar activePage="lockerRoom" onNavigate={onNavigate} />
        </div>
    );
};

export default LockerRoomView;