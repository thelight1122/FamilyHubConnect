
import React from 'react';
import { styles } from '../../styles.ts';
import type { PageView } from '../../types.ts';

interface HubTileProps {
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
    notification?: boolean; // Optional notification indicator
}

const HubTile: React.FC<HubTileProps> = ({ icon, title, description, onClick, notification }) => {
    
    const tileStyle = { 
        ...styles.hubTile, 
        position: 'relative' // for notification positioning
    } as React.CSSProperties;

    return React.createElement('button', {
        onClick: onClick,
        style: tileStyle,
        className: 'hub-tile'
    },
        notification && React.createElement('span', { style: styles.hubTileNotificationBadge }),
        React.createElement('h3', { style: styles.hubTileTitle },
            React.createElement('span', {'aria-hidden': 'true', style: styles.hubTileIcon}, icon),
            title
        ),
        React.createElement('p', { style: styles.hubTileDescription }, description)
    );
}

export default HubTile;
