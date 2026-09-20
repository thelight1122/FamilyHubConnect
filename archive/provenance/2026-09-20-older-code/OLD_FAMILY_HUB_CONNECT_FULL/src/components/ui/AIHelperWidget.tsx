

import React from 'react';
import { styles } from '../../styles/index.ts';

interface AIHelperWidgetProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const AIHelperWidget: React.FC<AIHelperWidgetProps> = ({ title, description, children }) => {
    return (
        React.createElement('div', { style: styles.aiHelperWidget },
            React.createElement('h4', { style: styles.aiHelperTitle }, title),
            React.createElement('p', { style: { color: '#666' } }, description),
            children
        )
    );
};

export default AIHelperWidget;
