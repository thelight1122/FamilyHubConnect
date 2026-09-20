import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import { ALL_MODULES } from '../constants';
import type { PageView } from '../types';

interface DashboardLayoutItem {
    page: PageView;
    visible: boolean;
}

const DraggableItem: React.FC<{
    item: { page: PageView; title: string; icon: string; };
    isVisible: boolean;
    onToggle: () => void;
    onDragStart: (e: React.DragEvent<HTMLLIElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLLIElement>) => void;
    onDrop: (e: React.DragEvent<HTMLLIElement>) => void;
}> = ({ item, isVisible, onToggle, onDragStart, onDragOver, onDrop }) => {
    return React.createElement('li',
        {
            draggable: true,
            onDragStart,
            onDragOver,
            onDrop,
            style: styles.dashboardSettingsItem,
            'aria-label': `${item.title}, draggable item`,
        },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
            React.createElement('span', { style: { cursor: 'grab' } }, '⠿'),
            React.createElement('span', null, `${item.icon} ${item.title}`)
        ),
        React.createElement('div', { style: styles.toggleSwitchContainer, onClick: onToggle },
            React.createElement('input', { type: 'checkbox', checked: isVisible, readOnly: true, style: { display: 'none' } }),
            React.createElement('span', { style: { ...styles.toggleSwitchSlider, ...(isVisible ? styles.toggleSwitchSliderChecked : {}) } })
        )
    );
};

export default function DashboardSettingsView() {
    const { currentViewingProfile, updateProfile, onNavigate, addToast } = useAppContext();
    const [layout, setLayout] = useState<DashboardLayoutItem[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    
    const modulesForUser = React.useMemo(() => {
        if (!currentViewingProfile) return [];
        return ALL_MODULES.filter(module => {
            if (currentViewingProfile.role === 'adult') return !module.childOnly;
            if (currentViewingProfile.role === 'child') return !module.parentOnly;
            return true;
        });
    }, [currentViewingProfile]);


    useEffect(() => {
        if (currentViewingProfile) {
            const userLayout = currentViewingProfile.dashboardLayout || [];
            const userLayoutMap = new Map(userLayout.map(item => [item.page, item.visible]));

            const fullLayout = modulesForUser.map(module => ({
                page: module.page,
                visible: userLayoutMap.has(module.page) ? userLayoutMap.get(module.page)! : true,
            }));
            
            // Re-order based on saved layout if it exists
            const orderedLayout = userLayout.map(l_item => fullLayout.find(f_item => f_item.page === l_item.page)).filter(Boolean) as DashboardLayoutItem[];
            const newItems = fullLayout.filter(f_item => !orderedLayout.some(l_item => l_item.page === f_item.page));

            setLayout([...orderedLayout, ...newItems]);
        }
    }, [currentViewingProfile, modulesForUser]);

    const handleToggleVisibility = (page: PageView) => {
        setLayout(prev =>
            prev.map(item =>
                item.page === page ? { ...item, visible: !item.visible } : item
            )
        );
    };

    const handleDragStart = (index: number) => {
        setDraggedItemIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault();
    };
    
    const handleDrop = (dropIndex: number) => {
        if (draggedItemIndex === null) return;
        const draggedItem = layout[draggedItemIndex];
        const newLayout = [...layout];
        newLayout.splice(draggedItemIndex, 1);
        newLayout.splice(dropIndex, 0, draggedItem);
        
        setLayout(newLayout);
        setDraggedItemIndex(null);
    };

    const handleSaveChanges = async () => {
        if (!currentViewingProfile) return;
        await updateProfile(currentViewingProfile.id, { dashboardLayout: layout });
        addToast("Dashboard layout updated!", 'badge');
        onNavigate('settings');
    };

    if (!currentViewingProfile) {
        return React.createElement('div', null, "Loading profile...");
    }

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', {
            onClick: () => onNavigate('settings'),
            style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' },
        }, '← Back to Settings'),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "🎨 Dashboard Settings"),

        React.createElement('section', { style: styles.section },
            React.createElement('p', { style: { color: '#666', textAlign: 'center' } }, 'Toggle visibility and drag to reorder your dashboard widgets.'),
            React.createElement('ul', { style: styles.dashboardSettingsList },
                layout.map((layoutItem, index) => {
                    const module = ALL_MODULES.find(m => m.page === layoutItem.page);
                    if (!module) return null;

                    return React.createElement(DraggableItem, {
                        key: module.page,
                        item: module,
                        isVisible: layoutItem.visible,
                        onToggle: () => handleToggleVisibility(module.page),
                        onDragStart: () => handleDragStart(index),
                        onDragOver: handleDragOver,
                        onDrop: () => handleDrop(index),
                    });
                })
            ),
            React.createElement('button', {
                onClick: handleSaveChanges,
                style: { ...styles.button, marginTop: '20px' }
            }, 'Save Changes')
        )
    );
}
