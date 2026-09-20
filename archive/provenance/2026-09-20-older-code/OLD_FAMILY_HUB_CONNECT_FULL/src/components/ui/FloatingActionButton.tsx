
import React from 'react';
import { styles } from '../../styles.ts';

interface FabProps {
    onClick: () => void;
    icon: string;
    ariaLabel: string;
}

const FloatingActionButton: React.FC<FabProps> = ({ onClick, icon, ariaLabel }) => {
    
    return (
        React.createElement('button', {
            onClick: onClick,
            style: styles.fab,
            className: 'fab',
            'aria-label': ariaLabel,
        }, icon)
    );
};

export default FloatingActionButton;
