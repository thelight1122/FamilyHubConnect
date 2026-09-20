
import React, { useMemo } from 'react';
import type { PageView } from '../../types.ts';
import { styles } from '../../styles.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import { DEFAULT_NAV_ITEMS } from '../../constants.ts';

export default function NavigationBar() {
    const { onNavigate, currentPage, currentViewingProfile } = useAppContext();

    const navItems = useMemo(() => {
        return currentViewingProfile?.navBarLayout || DEFAULT_NAV_ITEMS;
    }, [currentViewingProfile?.navBarLayout]);

    return (
        React.createElement('nav', { style: styles.bottomNavBar, 'aria-label': "Main navigation" },
            navItems.map(item => {
                const isActive = currentPage === item.page;
                const buttonStyle = {
                    ...styles.bottomNavButton,
                    ...(isActive ? styles.bottomNavButtonActive : {})
                };

                return React.createElement('button', {
                    key: item.page,
                    onClick: () => onNavigate(item.page),
                    style: buttonStyle,
                    'aria-current': isActive ? 'page' : undefined,
                },
                    React.createElement('span', { style: styles.bottomNavIcon, 'aria-hidden': 'true' }, item.icon),
                    React.createElement('span', { style: styles.bottomNavLabel }, item.label)
                );
            })
        )
    );
};
