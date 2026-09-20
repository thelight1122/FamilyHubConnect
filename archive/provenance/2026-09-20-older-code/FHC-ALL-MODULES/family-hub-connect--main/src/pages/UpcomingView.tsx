
import React, { useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import { normalizeDateStr } from '../utils/utils';
import type { Chore, FamilyEvent, PageView, Trip } from '../types';
import { EmptyState, ArrowLeftIcon } from '../components';

type UpcomingItem = {
    date: Date;
    type: 'chore' | 'event' | 'trip';
    item: Chore | FamilyEvent | Trip;
    id: string;
};

export default function UpcomingView({ onBackToDashboard }: { onBackToDashboard: () => void }) {
    const { chores, familyEvents, trips } = useAppState();
    const { getProfileName } = useAppDispatch();

    const upcomingItems = useMemo(() => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const combined: UpcomingItem[] = [];

        chores.forEach(chore => {
            if (chore.dueDate) {
                const choreDate = normalizeDateStr(chore.dueDate);
                if (choreDate && choreDate >= today) {
                    combined.push({ date: choreDate, type: 'chore', item: chore, id: `chore-${chore.id}` });
                }
            }
        });
        familyEvents.forEach(event => {
            const eventDate = normalizeDateStr(event.date);
            if (eventDate && eventDate >= today) {
                combined.push({ date: eventDate, type: 'event', item: event, id: `event-${event.id}` });
            }
        });
        trips.forEach(trip => {
            const tripDate = normalizeDateStr(trip.startDate);
            if (tripDate && tripDate >= today) {
                combined.push({ date: tripDate, type: 'trip', item: trip, id: `trip-${trip.id}` });
            }
        });

        return combined.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [chores, familyEvents, trips]);

    const renderItem = (item: UpcomingItem) => {
        const dateString = item.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
        let content;
        switch (item.type) {
            case 'chore':
                const chore = item.item as Chore;
                content = `✅ Chore: ${chore.name} (Assigned to: ${getProfileName(chore.assignedTo)})`;
                break;
            case 'event':
                const event = item.item as FamilyEvent;
                content = `🎉 Event: ${event.title}`;
                break;
            case 'trip':
                const trip = item.item as Trip;
                content = `✈️ Trip: ${trip.name} to ${trip.destination}`;
                break;
        }
        return (
            <div key={item.id} className="list-item" style={{display: 'block'}}>
                <p className="font-bold">{dateString}</p>
                <p>{content}</p>
            </div>
        );
    };

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBackToDashboard}>
                    <ArrowLeftIcon />
                </button>
                <h2>🗓️ Upcoming Schedule</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <div className="card">
                    {upcomingItems.length > 0 ? (
                        upcomingItems.map(renderItem)
                    ) : (
                        <EmptyState icon='🗓️' title='All Clear!' message='You have nothing on the schedule.' />
                    )}
                </div>
            </main>
        </div>
    );
}
