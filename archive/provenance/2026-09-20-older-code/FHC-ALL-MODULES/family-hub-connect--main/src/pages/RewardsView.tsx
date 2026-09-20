
import React, { useMemo } from 'react';
import { useAppDispatch, useAppState } from '../AppContext';
import { ArrowLeftIcon, BottomNavbar } from '../components';

const RewardsView = () => {
    const { onNavigate } = useAppDispatch();
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);

    // Mock data for display purposes
    const availableRewards = [
        { id: 1, name: "Extra TV Time (30 mins)", cost: 50 },
        { id: 2, name: "Ice Cream Trip", cost: 200 },
        { id: 3, name: "New Video Game", cost: 1000 }
    ];

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🏆 Rewards</h2>
                <div className="header-placeholder"></div>
            </header>
            <main className="main">
                 <div className="card">
                    <p>This feature is still under construction, but here is a preview of what's to come!</p>
                </div>
                <div className="card text-center">
                    <h3 className="text-large font-bold mt-0">Your Points: {currentViewingProfile?.points || 0} ✨</h3>
                    <p className="text-light m-0">Complete chores to earn more points!</p>
                </div>
                <div className="card">
                    <h3 className="font-bold text-large mt-0">Available Prizes</h3>
                    <div className="reward-list">
                        {availableRewards.map(reward => (
                            <div key={reward.id} className="reward-item">
                                <span>{reward.name}</span>
                                <button className="btn btn-sm">{reward.cost} pts</button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <BottomNavbar activePage="rewards" onNavigate={onNavigate} />
        </div>
    );
};

export default RewardsView;