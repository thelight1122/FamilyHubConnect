
import React, { useState, useEffect, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ALL_NAV_ITEMS, DEFAULT_NAV_ITEMS } from '../constants.ts';
import type { PageView } from '../types.ts';
import { ArrowLeftIcon, BottomNavbar } from '../components.tsx';

interface NavItem {
    page: PageView;
    label: string;
    icon: string;
}

export default function NavigationSettingsView() {
    const { updateProfile, onNavigate, addToast } = useAppDispatch();
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    
    const [visibleItems, setVisibleItems] = useState<NavItem[]>([]);
    const [hiddenItems, setHiddenItems] = useState<NavItem[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    useEffect(() => {
        if (currentViewingProfile) {
            const userNav = currentViewingProfile.navBarLayout && currentViewingProfile.navBarLayout.length > 0 ? currentViewingProfile.navBarLayout : DEFAULT_NAV_ITEMS;
            const visiblePageViews = new Set(userNav.map(item => item.page));
            
            const visible = userNav
                .map(item => ALL_NAV_ITEMS.find(i => i.page === item.page))
                .filter((item): item is NavItem => !!item);
            
            const hidden = ALL_NAV_ITEMS.filter(item => !visiblePageViews.has(item.page));

            setVisibleItems(visible);
            setHiddenItems(hidden);
        }
    }, [currentViewingProfile]);
    
    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (dropIndex: number) => {
        if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
            setDraggedItemIndex(null);
            return;
        }

        const newVisibleItems = [...visibleItems];
        const [draggedItem] = newVisibleItems.splice(draggedItemIndex, 1);
        newVisibleItems.splice(dropIndex, 0, draggedItem);
        
        setVisibleItems(newVisibleItems);
        setDraggedItemIndex(null);
    };

    const moveToVisible = (item: NavItem) => {
        if (visibleItems.length >= 5) {
            addToast("You can only have 5 items in your navigation bar.", 'info');
            return;
        }
        setHiddenItems(prev => prev.filter(i => i.page !== item.page));
        setVisibleItems(prev => [...prev, item]);
    };

    const moveToHidden = (item: NavItem) => {
        setVisibleItems(prev => prev.filter(i => i.page !== item.page));
        setHiddenItems(prev => {
            const newHidden = [...prev, item];
            newHidden.sort((a, b) => a.label.localeCompare(b.label));
            return newHidden;
        });
    };

    const handleSaveChanges = async () => {
        if (!currentViewingProfile) return;
        await updateProfile(currentViewingProfile.id, { navBarLayout: visibleItems });
        addToast("Navigation settings updated!", 'badge');
        onNavigate('settings');
    };

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate