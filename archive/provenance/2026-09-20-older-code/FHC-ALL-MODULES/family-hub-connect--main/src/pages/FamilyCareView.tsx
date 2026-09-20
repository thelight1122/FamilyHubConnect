

import React, { useMemo } from 'react';
import { useAppDispatch, useAppState } from '../AppContext';
import { ArrowLeftIcon, BottomNavbar, HubTile } from '../components';
import { FAMILY_CARE_MODULES } from '../constants';

const FamilyCareView = () => {
    const { onNavigate } = useAppDispatch();
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const isChildView = currentViewingProfile?.role === 'Child';

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('dashboard')} title="Go back to dashboard">
                    <ArrowLeftIcon />
                    <span className="sr-only">Go back to dashboard</span>
                </button>
                <h2>❤️‍🩹 Family Care</h2>
                <div className="header-placeholder"></div>
            </header>
            <main className="main">
                <div className="hub-grid">
                    {FAMILY_CARE_MODULES.map(module => (
                        <HubTile 
                            key={module.page}
                            title={isChildView && module.childTitle ? module.childTitle : module.title}
                            icon={module.icon}
                            description={module.description}
                            onClick={() => onNavigate(module.page)}
                        />
                    ))}
                </div>
            </main>
            <BottomNavbar activePage="familyCare" onNavigate={onNavigate} />
        </div>
    );
};

export default FamilyCareView;