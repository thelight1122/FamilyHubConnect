
import React, { useMemo } from 'react';
import type { Chore, FamilyEvent, PageView } from '../../types';
import { styles } from '../../styles';
import { normalizeDateStr } from '../../utils/utils';
import { useAppContext } from '../../contexts/AppContext';

interface UpcomingBannerWidgetProps {
    onNavigate: (page: PageView) => void;
}

type UpcomingItem = {
    date: Date;
    type: 'chore' | 'event';
    item: Chore | FamilyEvent;
};

export default function UpcomingBannerWidget({
    onNavigate,
}: UpcomingBannerWidgetProps) {
    const { chores, familyEvents, getProfileName } = useAppContext();

    const upcomingItems = useMemo(() => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);

        const combined: UpcomingItem[] = [];

        chores.forEach(chore => {
            if (chore.dueDate) {
                const choreDate = normalizeDateStr(chore.dueDate);
                if (choreDate && choreDate >= today && choreDate < endOfWeek) {
                    combined.push({ date: choreDate, type: 'chore', item: chore });
                }
            }
        });

        familyEvents.forEach(event => {
            const eventDate = normalizeDateStr(event.date);
            if (eventDate && eventDate >= today && eventDate < endOfWeek) {
                combined.push({ date: eventDate, type: 'event', item: event });
            }
        });

        return combined.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [chores, familyEvents]);

    return React.createElement('button', {
        style: styles.widgetTile,
        className: 'widget-tile',
        onClick: () => onNavigate('upcoming'),
    },
        React.createElement('h3', { style: styles.widgetTitle }, "🗓️ Upcoming This Week"),
        upcomingItems.length > 0 ? (
            React.createElement(React.Fragment, null,
                React.createElement('p', { style: styles.widgetSummaryText }, `You have ${upcomingItems.length} item(s) on the calendar.`),
                React.createElement('ul', { style: styles.widgetContentList }, 
                    upcomingItems.slice(0, 3).map(item => React.createElement('li', { key: item.item.id, style: styles.widgetContentItem }, 
                        item.type === 'chore' 
                            ? `✅ Chore: ${(item.item as Chore).name}` 
                            : `🎉 Event: ${(item.item as FamilyEvent).title}`
                    )),
                    upcomingItems.length > 3 && React.createElement('p', { style: styles.widgetMoreText }, `+${upcomingItems.length - 3} more...`)
                )
            )
        ) : (
            React.createElement('p', { style: styles.widgetSummaryText }, "Nothing on the calendar for this week.")
        )
    );
};
