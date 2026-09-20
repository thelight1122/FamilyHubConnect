


import React, { useMemo } from 'react';
import { useAppDispatch, useAppState } from '../AppContext';
import { ArrowLeftIcon, BottomNavbar, HubTile } from '../components';
import { LOCKER_ROOM_MODULES } from '../constants';

const LockerRoomView = () => {
    const { onNavigate } = useAppDispatch();
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const isChildView = currentViewingProfile?.role === 'Child';

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🏀 Locker Room</h2>
                <div className="header-placeholder"></div>
            </header>
            <main className="main">
                <div className="hub-grid">
                    {LOCKER_ROOM_MODULES.map(module => (
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
            <BottomNavbar activePage="lockerRoom" onNavigate={onNavigate} />
        </div>
    );
};

export default LockerRoomView;