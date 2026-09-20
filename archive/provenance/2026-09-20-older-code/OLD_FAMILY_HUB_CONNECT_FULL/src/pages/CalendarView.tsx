import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { Chore, Profile, FamilyEvent, PlannedMeal, Trip, PageView } from '../types';
import { styles } from '../styles';
import { uniqueId, normalizeDateStr } from '../utils/utils';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../contexts/AppContext';

interface CalendarViewProps {
    addEvent: (event: Omit<FamilyEvent, 'id' | 'family_id' | 'google_event_id'>) => Promise<any>;
    updateEvent: (event: FamilyEvent) => Promise<void>;
    deleteEvent: (event: FamilyEvent) => Promise<void>;
}


export default function CalendarView({
    addEvent,
    updateEvent,
    deleteEvent,
}: CalendarViewProps) {
    const { currentViewingProfile, getProfileName, isGoogleLinked, chores, familyEvents, trips, weeklyMealPlan, onNavigate } = useAppContext();
    const [currentMonthDate, setCurrentMonthDate] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    // Event Modal State
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<FamilyEvent | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');


    useEffect(() => {
        if (editingEvent) {
            setEventTitle(editingEvent.title);
            setEventDate(editingEvent.date);
            setEventTime(editingEvent.time || '');
            setEventDescription(editingEvent.description || '');
        } else {
            setEventTitle('');
            setEventTime('');
            setEventDescription('');
        }
    }, [editingEvent, showEventModal]);

    const handleOpenAddModal = (date: Date) => {
        if (currentViewingProfile?.role !== 'adult') return;
        setEventDate(date.toISOString().split('T')[0]);
        setEditingEvent(null);
        setShowEventModal(true);
    };

    const handleOpenEditModal = (event: FamilyEvent) => {
        if (currentViewingProfile?.role !== 'adult') return;
        if (event.tripId) {
            alert("Trip events must be edited from the Trip Planner.");
            return;
        }
        setEditingEvent(event);
        setShowEventModal(true);
    };

    const handleCloseModal = () => {
        setShowEventModal(false);
        setEditingEvent(null);
    };

    const validateTime = (timeStr: string): boolean => {
        if (!timeStr) return true; // Optional field
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr);
    };
    
    const validateDate = (dateStr: string): boolean => {
        if (!dateStr) return false;
        return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(new Date(dateStr).getTime());
    };

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentViewingProfile || currentViewingProfile.role !== 'adult') {
            alert("Only adults can manage events.");
            return;
        }
        if (!eventTitle.trim()) { alert("Event title cannot be empty."); return; }
        if (!validateDate(eventDate)) { alert("Please enter a valid date in YYYY-MM-DD format."); return; }
        if (eventTime && !validateTime(eventTime)) { alert("Please enter a valid time in HH:MM format (e.g., 14:30)."); return; }

        const eventData = {
            title: eventTitle.trim(), date: eventDate,
            time: eventTime.trim() || undefined,
            description: eventDescription.trim() || undefined,
        };

        if (editingEvent) {
            await updateEvent({ ...editingEvent, ...eventData });
        } else {
            await addEvent({ ...eventData, createdBy: currentViewingProfile.id });
        }
        handleCloseModal();
    };

    const handleDeleteEvent = async (eventToDelete: FamilyEvent) => {
        if (!currentViewingProfile || currentViewingProfile.role !== 'adult') {
            alert("Only adults can delete events."); return;
        }
        if (window.confirm("Are you sure you want to delete this event?")) {
            await deleteEvent(eventToDelete);
            handleCloseModal(); // Close modal if deleting from it
        }
    };


    const handlePrevMonth = () => {
        setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };
    
    const { calendarGrid, monthName } = useMemo(() => {
        const year = currentMonthDate.getFullYear();
        const month = currentMonthDate.getMonth();
        const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const calendarDays = [];

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
        
        const addItemsToDay = (item: any, dateKey: string, type: string) => {
            const itemDateUTC = normalizeDateStr(item[dateKey]);
            if (!itemDateUTC) return;
            const itemDate = new Date(itemDateUTC.getUTCFullYear(), itemDateUTC.getUTCMonth(), itemDateUTC.getUTCDate());

            const dayInGrid = calendarDays.find(d => 
                d.isCurrentMonth &&
                d.date.getFullYear() === itemDate.getFullYear() &&
                d.date.getMonth() === itemDate.getMonth() &&
                d.date.getDate() === itemDate.getDate()
            );
            if(dayInGrid) {
                (dayInGrid.items as any[]).push({ type, item });
            }
        };
        
        chores.forEach(c => addItemsToDay(c, 'dueDate', 'chore'));
        familyEvents.forEach(e => addItemsToDay(e, 'date', 'event'));
        trips.forEach(t => addItemsToDay(t, 'startDate', 'trip'));

        weeklyMealPlan.forEach(m => {
            calendarDays.forEach(d => {
                if (d.isCurrentMonth && d.date.toLocaleString('en-US', { weekday: 'long' }) === m.dayOfWeek) {
                    (d.items as any[]).push({ type: 'meal', item: m });
                }
            });
        });

        const endDayOfWeek = lastDayOfMonth.getDay();
        if (endDayOfWeek !== 6) {
            const paddingEnd = 6 - endDayOfWeek;
            for (let i = 1; i <= paddingEnd; i++) {
                const day = new Date(lastDayOfMonth);
                day.setDate(day.getDate() + i);
                calendarDays.push({ date: day, isCurrentMonth: false, items: [] });
            }
        }

        return { calendarGrid: calendarDays, monthName };
    }, [currentMonthDate, chores, familyEvents, weeklyMealPlan, trips]);


    const renderCalendarItem = (item: any, type: string, key: string) => {
        let text = '';
        let style = {};
        let dotStyle: React.CSSProperties = {...styles.calendarTodoStatusDot};
        let title = '';
        let showSyncedIcon = false;
    
        if (type === 'chore') {
            const chore = item as Chore;
            text = chore.name;
            title = chore.name;
            style = styles.calendarTodoItem;
            switch(chore.status) {
                case 'pending': dotStyle.backgroundColor = '#ffc107'; break;
                case 'in progress': dotStyle.backgroundColor = '#17a2b8'; break;
                case 'completed': dotStyle.backgroundColor = '#28a745'; break;
                case 'rejected': dotStyle.backgroundColor = '#dc3545'; break;
                case 'pending_approval': dotStyle.backgroundColor = '#fd7e14'; break;
            }
        } else if (type === 'event') {
            const eventItem = item as FamilyEvent;
            text = eventItem.title;
            title = text;
            style = styles.calendarEventItem;
            showSyncedIcon = !!eventItem.google_event_id;
        } else if (type === 'trip') {
            text = (item as Trip).name;
            title = text;
            style = styles.calendarTripItem;
        } else if (type === 'meal') {
            text = `${(item as PlannedMeal).mealType.substring(0,1)}: ${(item as PlannedMeal).meal.name}`;
            title = `${(item as PlannedMeal).mealType}: ${(item as PlannedMeal).meal.name}`;
            style = styles.calendarMealItem;
        }

        return React.createElement('div', { key: key, style: { ...style, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center' }, title: title },
            type === 'chore' && React.createElement('span', { style: dotStyle }),
            showSyncedIcon && React.createElement('span', { style: styles.calendarEventSyncedIcon, 'aria-label': 'Synced with Google Calendar' }, '🗓️'),
            text
        );
    };

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('h2', { style: styles.pageHeader }, "📅 Family Calendar"),
        React.createElement('section', { style: styles.section },
            React.createElement('div', { style: styles.calendarHeader },
                React.createElement('button', { style: styles.calendarNavButton, onClick: handlePrevMonth }, "‹ Prev"),
                React.createElement('h3', { style: styles.calendarMonthYear }, monthName),
                React.createElement('button', { style: styles.calendarNavButton, onClick: handleNextMonth }, "Next ›")
            ),
            React.createElement('div', { style: styles.calendarGrid },
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => React.createElement('div', { key: day, style: styles.calendarDayHeader }, day)),
                calendarGrid.map(({ date, isCurrentMonth, items }) => {
                    const isToday = new Date().toDateString() === date.toDateString();
                    return React.createElement('div', { 
                        key: date.toISOString(), 
                        style: Object.assign({}, 
                            styles.calendarDayCell,
                            !isCurrentMonth && styles.calendarDayCellNotInMonth,
                            isToday && styles.calendarDayToday
                        ),
                        onClick: () => handleOpenAddModal(date)
                    },
                        React.createElement('div', { style: isToday ? styles.calendarDayNumberToday : styles.calendarDayNumber }, date.getDate()),
                        React.createElement('div', {style: {display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '5px'}},
                           items.map(({ item, type }) => renderCalendarItem(item, type, `${type}-${item.id}`))
                        )
                    );
                })
            )
        ),
         React.createElement(Modal, {
            isOpen: showEventModal,
            onClose: handleCloseModal,
            title: editingEvent ? 'Edit Event' : 'Add New Event',
            children: React.createElement('form', { onSubmit: handleSaveEvent },
                isGoogleLinked && React.createElement('p', {style: {fontSize: '0.9em', color: '#666', textAlign: 'center', marginTop: '-10px'}}, '🗓️ This event will be synced with your Google Calendar.'),
                React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: "eventTitle", style: styles.label }, 'Title'),
                    React.createElement('input', { type: 'text', id: 'eventTitle', value: eventTitle, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEventTitle(e.target.value), style: styles.input, required: true })
                ),
                 React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: "eventDate", style: styles.label }, 'Date'),
                    React.createElement('input', { type: 'date', id: 'eventDate', value: eventDate, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEventDate(e.target.value), style: styles.input, required: true })
                ),
                 React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: "eventTime", style: styles.label }, 'Time (Optional)'),
                    React.createElement('input', { type: 'time', id: 'eventTime', value: eventTime, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEventTime(e.target.value), style: styles.input })
                ),
                 React.createElement('div', { style: styles.formGroup },
                    React.createElement('label', { htmlFor: "eventDesc", style: styles.label }, 'Description (Optional)'),
                    React.createElement('textarea', { id: 'eventDesc', value: eventDescription, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setEventDescription(e.target.value), style: styles.textarea, rows: 3 })
                ),
                React.createElement('div', { style: styles.modalActions },
                    editingEvent && React.createElement('button', { type: 'button', onClick: () => handleDeleteEvent(editingEvent), style: {...styles.button, backgroundColor: '#dc3545', marginRight: 'auto'} }, 'Delete'),
                    React.createElement('button', { type: 'button', onClick: handleCloseModal, style: {...styles.button, ...styles.buttonSecondary} }, 'Cancel'),
                    React.createElement('button', { type: 'submit', style: styles.button }, 'Save Event')
                )
            )
        })
    );
}
