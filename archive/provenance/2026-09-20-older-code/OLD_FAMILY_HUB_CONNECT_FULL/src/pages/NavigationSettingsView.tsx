
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import { ALL_NAV_ITEMS, DEFAULT_NAV_ITEMS } from '../constants';
import type { PageView } from '../types';

interface NavItem {
    page: PageView;
    label: string;
    icon: string;
}

const DraggableItem: React.FC<{
    item: NavItem;
    index: number;
    onDragStart: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
    onClick: () => void;
    buttonLabel: string;
    buttonIcon: string;
}> = ({ item, index, onDragStart, onClick, buttonLabel, buttonIcon }) => {
    return React.createElement('li',
        {
            draggable: true,
            onDragStart: (e: React.DragEvent<HTMLLIElement>) => onDragStart(e, index),
            style: styles.navSettingsDraggableItem,
            'aria-label': `${item.label}, draggable item`,
        },
        React.createElement('span', null, `${item.icon} ${item.label}`),
        React.createElement('button', {
            onClick,
            style: styles.navSettingsItemButton,
            'aria-label': `${buttonLabel} ${item.label}`,
            title: buttonLabel
        }, buttonIcon)
    );
};


export default function NavigationSettingsView() {
    const { currentViewingProfile, updateProfile, onNavigate, addToast } = useAppContext();
    
    const [visibleItems, setVisibleItems] = useState<NavItem[]>([]);
    const [hiddenItems, setHiddenItems] = useState<NavItem[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    useEffect(() => {
        if (currentViewingProfile) {
            const userNav = currentViewingProfile.navBarLayout && currentViewingProfile.navBarLayout.length > 0 ? currentViewingProfile.navBarLayout : DEFAULT_NAV_ITEMS;
            const visiblePageViews = new Set(userNav.map(item => item.page));
            
            const visible = userNav.map(item => ALL_NAV_ITEMS.find(i => i.page === item.page)).filter(Boolean) as NavItem[];
            const hidden = ALL_NAV_ITEMS.filter(item => !visiblePageViews.has(item.page));

            setVisibleItems(visible);
            setHiddenItems(hidden);
        }
    }, [currentViewingProfile]);
    
    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLUListElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLUListElement>) => {
        e.preventDefault();
        if (draggedItemIndex === null) return;
        
        const draggedItem = visibleItems[draggedItemIndex];
        let newVisibleItems = visibleItems.filter((_, i) => i !== draggedItemIndex);
        
        const dropTarget = (e.target as HTMLElement).closest('li');
        if (dropTarget && dropTarget.parentElement === e.currentTarget) {
            const dropIndex = Array.from(e.currentTarget.children).indexOf(dropTarget);
            newVisibleItems.splice(dropIndex, 0, draggedItem);
        } else {
            newVisibleItems.push(draggedItem);
        }
        
        setVisibleItems(newVisibleItems);
        setDraggedItemIndex(null);
    };
    
    const moveToVisible = (item: NavItem) => {
        if (visibleItems.length >= 5) {
            addToast("You can only have up to 5 items in your navigation bar.", 'info');
            return;
        }
        setVisibleItems(prev => [...prev, item]);
        setHiddenItems(prev => prev.filter(i => i.page !== item.page));
    };

    const moveToHidden = (item: NavItem) => {
        if (visibleItems.length <= 1) {
            addToast("You must have at least one item in your navigation bar.", 'info');
            return;
        }
        setHiddenItems(prev => [...prev, item].sort((a,b) => a.label.localeCompare(b.label)));
        setVisibleItems(prev => prev.filter(i => i.page !== item.page));
    };

    const handleSaveChanges = async () => {
        if (!currentViewingProfile) return;
        const newNavBarLayout = visibleItems.map(item => ({ page: item.page, label: item.label, icon: item.icon }));
        await updateProfile(currentViewingProfile.id, { navBarLayout: newNavBarLayout });
        addToast("Navigation bar updated!", 'badge');
        onNavigate('settings');
    };
    
    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', {
            onClick: () => onNavigate('settings'),
            style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' },
        }, '← Back to Settings'),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "🔧 Navigation Settings"),

        React.createElement('section', { style: styles.section },
            React.createElement('p', {style: {color: '#666', textAlign: 'center'}}, 'Drag and drop to reorder your main navigation bar. You can have a maximum of 5 visible items.'),
            React.createElement('div', { style: styles.navSettingsContainer },
                React.createElement('div', { style: styles.navSettingsColumn },
                    React.createElement('h3', { style: styles.navSettingsColumnTitle }, `Visible Items (${visibleItems.length}/5)`),
                    React.createElement('ul', { style: styles.navSettingsItemList, onDragOver: handleDragOver, onDrop: handleDrop },
                        visibleItems.map((item, index) => React.createElement(DraggableItem, {
                            key: item.page,
                            item,
                            index,
                            onDragStart: handleDragStart,
                            onClick: () => moveToHidden(item),
                            buttonLabel: 'Hide',
                            buttonIcon: '−'
                        }))
                    )
                ),
                 React.createElement('div', { style: styles.navSettingsColumn },
                    React.createElement('h3', { style: styles.navSettingsColumnTitle }, "Hidden Items"),
                    React.createElement('ul', { style: styles.navSettingsItemList },
                        hiddenItems.map((item, index) => React.createElement('li', { key: item.page, style: styles.navSettingsDraggableItem },
                           React.createElement('span', null, `${item.icon} ${item.label}`),
                            React.createElement('button', {
                                onClick: () => moveToVisible(item),
                                style: styles.navSettingsItemButton,
                                'aria-label': `Show ${item.label}`
                            }, '＋')
                        ))
                    )
                ),
                React.createElement('div', { style: styles.navPreviewContainer },
                     React.createElement('h3', { style: styles.navSettingsColumnTitle }, "Live Preview"),
                     React.createElement('nav', { style: styles.navPreviewBar, 'aria-label': "Navigation bar preview" },
                        visibleItems.map(item => React.createElement('div', {
                            key: item.page,
                            style: {...styles.bottomNavButton, color: 'white'},
                        },
                            React.createElement('span', { style: styles.bottomNavIcon, 'aria-hidden': 'true' }, item.icon),
                            React.createElement('span', { style: styles.bottomNavLabel }, item.label)
                        ))
                    )
                )
            ),
             React.createElement('button', {
                onClick: handleSaveChanges,
                style: { ...styles.button, marginTop: '20px' }
            }, 'Save Changes')
        )
    );
}
