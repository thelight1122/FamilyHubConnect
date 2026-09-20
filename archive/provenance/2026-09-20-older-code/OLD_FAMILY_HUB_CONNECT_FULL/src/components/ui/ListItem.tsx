
import React from 'react';
import { styles } from '../../styles.ts';

interface ListItemProps {
    children: React.ReactNode;
    actions?: React.ReactNode;
    onClick?: () => void;
    style?: React.CSSProperties;
}

const ListItem: React.FC<ListItemProps> = ({ children, actions, onClick, style }) => {
    
    const finalStyle: React.CSSProperties = {
        ...styles.listItem,
        ...(onClick && { cursor: 'pointer' }),
        ...style
    };

    const componentType = onClick ? 'button' : 'div';
    
    const props: React.HTMLProps<HTMLButtonElement | HTMLDivElement> = {
        style: finalStyle,
        className: 'list-item',
        ...(onClick && { onClick }),
    };

    return React.createElement(componentType, props,
        React.createElement('div', { style: styles.listItemContent }, children),
        actions && React.createElement('div', { style: styles.listItemActions }, actions)
    );
};

export default ListItem;
