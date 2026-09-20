

import React, { useState, useEffect, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ALL_MODULES } from '../constants/navigation.ts';
import type { PageView } from '../types.ts';
import { ArrowLeftIcon } from '../components.tsx';

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
    return (
        <li
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="list-item"
            aria-label={`${item.title}, draggable item`}
        >
            <div className="draggable-item-container">
                <span className="grab-handle">⠿</span>
                <span>{`${item.icon} ${item.title}`}</span>
            </div>
            {/* Basic Toggle Switch */}
            <label className="checkbox-label" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" className="checkbox" checked={isVisible} onChange={onToggle} />
                <span>{isVisible ? 'Visible' : 'Hidden'}</span>
            </label>
        </li>
    );
};

export default function DashboardSettingsView() {
    const { updateProfile, onNavigate, addToast } = useAppDispatch();
    const { viewingAsProfileId, profiles } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const [layout, setLayout] = useState<DashboardLayoutItem[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    
    const modulesForUser = React.useMemo(() => {
        if (!currentViewingProfile) return [];
        return ALL_MODULES.filter(module => {
            if (currentViewingProfile.role === 'Admin' || currentViewingProfile.role === 'Parent') return !module.childOnly;
            if (currentViewingProfile.role === 'Child') return !module.parentOnly;
            return true;
        });
    }, [currentViewingProfile]);


    useEffect(() => {
        if (currentViewingProfile) {
            const userLayout = currentViewingProfile.dashboardLayout || [];
            const userLayoutMap: Map<PageView, boolean> = new Map(userLayout.map(item => [item.page, item.visible]));

            const fullLayout = modulesForUser.map(module => ({
                page: module.page as PageView,
                visible: userLayoutMap.get(module.page as PageView) ?? true,
            }));
            
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

    const handleDragOver = (e: React.DragEvent) => {
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
        return <div className="page">Loading profile...</div>;
    }

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" title="Go back to settings" onClick={() => onNavigate('settings')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🎨 Dashboard Settings</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <section className="card">
                    <p className="text-center text-light">Toggle visibility and drag to reorder your dashboard widgets.</p>
                    <ul onDragOver={handleDragOver}>
                        {layout.map((layoutItem, index) => {
                            const module = ALL_MODULES.find(m => m.page === layoutItem.page);
                            if (!module) return null;

                            return (
                                <DraggableItem
                                    key={module.page}
                                    item={module as any}
                                    isVisible={layoutItem.visible}
                                    onToggle={() => handleToggleVisibility(module.page as PageView)}
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(index)}
                                />
                            );
                        })}
                    </ul>
                    <button
                        onClick={handleSaveChanges}
                        className="btn w-100 mt-20"
                    >
                        Save Changes
                    </button>
                </section>
            </main>
        </div>
    );
}