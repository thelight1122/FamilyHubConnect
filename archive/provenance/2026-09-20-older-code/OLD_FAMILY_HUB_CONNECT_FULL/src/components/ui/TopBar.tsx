
import React from 'react';
import type { PageView, AppNotification } from '../../types.ts';
import { styles } from '../../styles.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';

const NavIcon: React.FC<{
    label: string;
    icon: string;
    onClick: () => void;
    hasNotification?: boolean;
}> = ({ label, icon, onClick, hasNotification }) => {
    const iconStyle = { ...styles.topBarIcon };

    return React.createElement('button', {
            title: label,
            'aria-label': `${label}${hasNotification ? ', you have new notifications' : ''}`,
            style: iconStyle,
            onClick: onClick,
            className: 'top-bar-nav-icon' // For CSS hover effects
        },
        icon,
        hasNotification && React.createElement('span', { style: styles.notificationIndicator, 'aria-hidden': 'true' }),
        React.createElement('span', {
            style: styles.topBarIconLabel,
            'aria-hidden': true,
            className: 'top-bar-icon-label'
        }, label)
    );
};


export default function TopBar() {
    const { onNavigate, notifications, personalizationData, goBack, hasHistory } = useAppContext();
    const hasUnread = notifications.some(n => !n.read);
    const branding = personalizationData?.familyBranding;

    return (
        React.createElement('header', { style: styles.topBar },
            React.createElement('div', {style: {justifySelf: 'start', width: '60px'}},
                hasHistory && React.createElement('button', { 
                    onClick: goBack, 
                    style: styles.topBarBackButton, 
                    title: 'Go Back', 
                    'aria-label': 'Go Back',
                    className: 'top-bar-back-button'
                }, '←')
            ),
            
            branding?.crestUrl ? 
                React.createElement('img', {src: branding.crestUrl, alt: 'Family Crest', style: styles.topBarCrest})
                : React.createElement('div', { style: styles.topBarTitle, className: 'top-bar-title' }, "Family Hub Connect 🔗"),
                
            React.createElement('nav', { style: styles.topBarNavIcons },
                React.createElement(NavIcon, { label: "Notifications", icon: "🔔", onClick: () => onNavigate('notificationCenter'), hasNotification: hasUnread }),
                React.createElement(NavIcon, { label: "Settings", icon: "⚙️", onClick: () => onNavigate('settings') })
            )
        )
    );
}
