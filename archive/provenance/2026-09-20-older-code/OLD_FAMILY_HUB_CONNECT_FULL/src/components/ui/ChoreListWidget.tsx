
import React, { useMemo, useState } from 'react';
import type { Chore, Profile } from '../../types.ts';
import { styles } from '../../styles.ts';
import { isDateToday } from '../../utils/utils.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';

interface ChoreListWidgetProps {
    onClick: () => void;
}

const ChoreListWidget: React.FC<ChoreListWidgetProps> = ({ onClick }) => {
    const { chores, currentViewingProfile } = useAppContext();
    const [isHovered, setIsHovered] = useState(false);

    const todaysChores = useMemo(() => {
        if (!currentViewingProfile) return [];
        return chores.filter(c => c.assignedTo === currentViewingProfile.id && isDateToday(c.dueDate) && c.status !== 'completed');
    }, [chores, currentViewingProfile]);

    const tileStyle: React.CSSProperties = {
        ...styles.widgetTile,
        ...(isHovered ? styles.widgetTileHover : {})
    };

    return React.createElement('button', {
        style: tileStyle,
        onClick: onClick,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    },
        React.createElement('h3', { style: styles.widgetTitle }, "✅ Today's Chores"),
        todaysChores.length > 0 ? (
            React.createElement(React.Fragment, null,
                React.createElement('p', { style: styles.widgetSummaryText }, `You have ${todaysChores.length} chore(s) left for today.`),
                React.createElement('ul', { style: styles.widgetContentList }, 
                    todaysChores.slice(0, 2).map(c => React.createElement('li', { key: c.id, style: styles.widgetContentItem }, c.name))
                ),
                todaysChores.length > 2 && React.createElement('p', { style: styles.widgetMoreText }, `+${todaysChores.length - 2} more...`)
            )
        ) : (
            React.createElement('p', { style: styles.widgetSummaryText }, "🎉 All chores for today are done! Great job!")
        )
    );
};

export default ChoreListWidget;
