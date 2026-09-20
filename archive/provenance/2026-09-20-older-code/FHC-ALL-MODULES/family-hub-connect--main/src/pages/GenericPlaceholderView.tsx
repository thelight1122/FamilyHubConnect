

import React, { useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ArrowLeftIcon, BottomNavbar } from '../components.tsx';
import { ALL_MODULES } from '../constants.ts';
import type { PageView } from '../types.ts';

interface GenericPlaceholderViewProps {
    pageId: PageView;
}

const GenericPlaceholderView = ({ pageId }: GenericPlaceholderViewProps) => {
    const { onNavigate } = useAppDispatch();
    const { viewingAsProfileId, profiles } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const isChildView = currentViewingProfile?.role === 'Child';
    
    const moduleInfo = ALL_MODULES.find(m => m.page === pageId);
    const title = isChildView && moduleInfo?.childTitle ? moduleInfo.childTitle : moduleInfo?.title || pageId;

    return (
         <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>{title}</h2>
                <div className="header-placeholder"></div>
            </header>
            <main className="main">
                <div className="card">
                    <p>This feature is coming soon!</p>
                    {pageId === 'settings' && (
                        <button className="btn mt-20" onClick={() => onNavigate('settings')}>
                            🤖 AI Safety Settings
                        </button>
                    )}
                </div>
            </main>
            <BottomNavbar activePage={moduleInfo?.page || ''} onNavigate={onNavigate} />
        </div>
    );
};

export default GenericPlaceholderView;