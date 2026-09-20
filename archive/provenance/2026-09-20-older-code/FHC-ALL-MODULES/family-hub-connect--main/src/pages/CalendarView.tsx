import React, { useState, useCallback, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { Modal, BottomNavbar, ArrowLeftIcon } from '../components.tsx';
import { uniqueId, normalizeDateStr } from '../utils/utils.ts';
import type { Chore, Profile, FamilyEvent, PlannedMeal, Trip, PageView } from '../types.ts';

// Calendar item interfaces
interface CalendarItem {
    type: 'chore' | 'event' | 'trip' | 'meal';
    item: Chore | FamilyEvent | Trip | PlannedMeal;
}

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    items: CalendarItem[];
}

export default function CalendarView() {
    const { onNavigate, addEvent, updateEvent, deleteEvent, getProfileName } = useAppDispatch();
    const { profiles, viewingAsProfileId, isGoogleLinked, chores, familyEvents, trips, weeklyMealPlan } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    
    const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<FamilyEvent | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    
    const isAdminOrParent = useMemo(() => {
        const userRole = currentViewingProfile?.role;
        return userRole === 'Admin' || userRole === 'Parent';
    }, [currentViewingProfile]);

    const handleOpenAddModal = (date: Date) => {
        if (!isAdminOrParent) return;
        setEventDate(date.toISOString().split('T')[0]);
        setEditingEvent(null);
        setEventTitle('');
        setEventTime('');
        setEventDescription('');
        setShowEventModal(true);
    };

    const handleOpenEditModal = (event: FamilyEvent) => {
        if (!isAdminOrParent) return;
        if (event.tripId) {
            alert("Trip events must be edited from the Trip Planner.");
            return;
        }
        setEditingEvent(event);
        setEventTitle(event.title || '');
        setEventDate(event.date || '');
        setEventTime(event.time || '');
        setEventDescription(event.description || '');
        setShowEventModal(true);
    };

    const handleCloseModal = () => {
        setShowEventModal(false);
        setEditingEvent(null);
    };

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdminOrParent) { alert("Only adults can manage events."); return; }
        if (!eventTitle.trim() || !eventDate) { alert("Title and date are required."); return; }

        const eventData = {
            title: eventTitle.trim(),
            date: eventDate,
            time: eventTime.trim() || undefined,
            description: eventDescription.trim() || undefined,
        };

        if (editingEvent) {
            await updateEvent({ ...editingEvent, ...eventData });
        } else {
            if (!currentViewingProfile?.id) { alert('Unable to create event - user ID not found.'); return; }
            await addEvent({ ...eventData, createdBy: currentViewingProfile.id });
        }
        handleCloseModal();
    };

    const handleDeleteEvent = async () => {
        if (!editingEvent || !isAdminOrParent) return;
        if (window.confirm("Are you sure you want to delete this event?")) {
            await deleteEvent(editingEvent);
            handleCloseModal();
        }
    };

    const { calendarGrid, monthName } = useMemo(() => {
        const year = currentMonthDate.getFullYear();
        const month = currentMonthDate.getMonth();
        const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        const calendarDays: CalendarDay[] = [];
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const startDayOfWeek = firstDayOfMonth.getDay();
        for (let i = 0; i < startDayOfWeek; i++) {
            const day = new Date(firstDayOfMonth);
            day.setDate(day.getDate() - (startDayOfWeek - i));
            calendarDays.push({ date: day, isCurrentMonth: false, items: [] });
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const day = new Date(year, month, i);
            calendarDays.push({ date: day, isCurrentMonth: true, items: [] });
        }

        const addItemsToDay = (item: any, dateKey: string, type: CalendarItem['type']) => {
            if (!item || !item[dateKey]) return;
            const itemDateUTC = normalizeDateStr(item[dateKey]);
            if (!itemDateUTC) return;
            const itemDate = new Date(itemDateUTC.getUTCFullYear(), itemDateUTC.getUTCMonth(), itemDateUTC.getUTCDate());
            const dayInGrid = calendarDays.find(d => d.isCurrentMonth && d.date.getTime() === itemDate.getTime());
            if (dayInGrid) dayInGrid.items.push({ type, item });
        };
        
        chores.forEach(c => addItemsToDay(c, 'dueDate', 'chore'));
        familyEvents.forEach(e => addItemsToDay(e, 'date', 'event'));
        trips.forEach(t => addItemsToDay(t, 'startDate', 'trip'));
        (weeklyMealPlan || []).forEach(m => {
            calendarDays.forEach(d => {
                if (d.isCurrentMonth && d.date.toLocaleString('en-US', { weekday: 'long' }) === m.dayOfWeek) {
                    d.items.push({ type: 'meal', item: m });
                }
            });
        });

        const endDayOfWeek = lastDayOfMonth.getDay();
        if (endDayOfWeek !== 6) {
            for (let i = 1; i <= 6 - endDayOfWeek; i++) {
                const day = new Date(lastDayOfMonth);
                day.setDate(day.getDate() + i);
                calendarDays.push({ date: day, isCurrentMonth: false, items: [] });
            }
        }

        return { calendarGrid: calendarDays, monthName };
    }, [currentMonthDate, chores, familyEvents, weeklyMealPlan, trips]);

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('dashboard')} title="Go back"><ArrowLeftIcon /></button>
                <h2>📅 Family Calendar</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <section className="card">
                    <div className="calendar-header">
                        <button className="btn" onClick={() => setCurrentMonthDate(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))}>‹ Prev</button>
                        <h3>{monthName}</h3>
                        <button className="btn" onClick={() => setCurrentMonthDate(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))}>Next ›</button>
                    </div>
                    <div className="calendar-grid">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="calendar-day-header">{day}</div>)}
                        {calendarGrid.map(({ date, isCurrentMonth, items }) => {
                            const isToday = new Date().toDateString() === date.toDateString();
                            return (
                                <div
                                    key={date.toISOString()}
                                    className={`calendar-day-cell ${!isCurrentMonth ? 'not-in-month' : ''} ${isToday ? 'today' : ''}`}
                                    onClick={() => handleOpenAddModal(date)}
                                >
                                    <div className={`day-number ${isToday ? 'today-number' : ''}`}>{date.getDate()}</div>
                                    <div className="calendar-items">
                                        {items.map(({ item, type }) => {
                                            const itemId = (item as any)?.id || uniqueId();
                                            let text = '', title = '', className = '', dotColor = '';
                                            if (type === 'chore' && 'name' in item) {
                                                text = item.name; className = 'chore-item';
                                                switch ((item as Chore).status) {
                                                    case 'pending': dotColor = '#ffc107'; break;
                                                    case 'completed': dotColor = '#28a745'; break;
                                                }
                                            } else if (type === 'event' && 'title' in item) { text = item.title; className = 'event-item';
                                            } else if (type === 'trip' && 'name' in item) { text = item.name; className = 'trip-item';
                                            } else if (type === 'meal' && 'meal' in item) { text = `${item.mealType?.substring(0,1)}: ${item.meal?.name}`; className = 'meal-item'; }

                                            return (
                                                <div key={`${type}-${itemId}`} className={`calendar-item ${className}`} title={title || text} onClick={type === 'event' ? e => { e.stopPropagation(); handleOpenEditModal(item as FamilyEvent); } : undefined}>
                                                    {dotColor && <span className="status-dot" style={{ backgroundColor: dotColor }} />}
                                                    {text}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
            <Modal isOpen={showEventModal} onClose={handleCloseModal} title={editingEvent ? 'Edit Event' : 'Add New Event'}>
                <form onSubmit={handleSaveEvent}>
                    {isGoogleLinked && <p>🗓️ This event will be synced with your Google Calendar.</p>}
                    <div className="form-group">
                        <label htmlFor="eventTitle">Title</label>
                        <input id="eventTitle" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="eventDate">Date</label>
                        <input type="date" id="eventDate" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="eventTime">Time (Optional)</label>
                        <input type="time" id="eventTime" value={eventTime} onChange={e => setEventTime(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="eventDesc">Description (Optional)</label>
                        <textarea id="eventDesc" value={eventDescription} onChange={e => setEventDescription(e.target.value)} rows={3} />
                    </div>
                    <div className="form-actions">
                        {editingEvent && <button type="button" onClick={handleDeleteEvent} className="btn btn-danger" style={{ marginRight: 'auto' }}>Delete</button>}
                        <button type="button" onClick={handleCloseModal} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn">Save Event</button>
                    </div>
                </form>
            </Modal>
            <BottomNavbar activePage="calendar" onNavigate={onNavigate} />
        </div>
    );
}