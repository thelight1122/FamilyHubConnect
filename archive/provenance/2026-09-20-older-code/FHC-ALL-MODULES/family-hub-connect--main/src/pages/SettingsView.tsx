
import React, { useMemo } from 'react';
import { useAppDispatch, useAppState } from '../AppContext';
import { HubTile, ArrowLeftIcon, BottomNavbar } from '../components';


const SettingsView = () => {
    const { onNavigate } = useAppDispatch();
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const isParent = currentViewingProfile?.role === 'Admin' || currentViewingProfile?.role === 'Parent';

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>⚙️ Settings</h2>
                <div className="header-placeholder"></div>
            </header>
            <main className="main">
                <div className="hub-grid">
                    <HubTile icon='👤' title='My Profile' description='Change your name, avatar, and theme.' onClick={() => onNavigate('profileSettings')} />
                    {isParent && <HubTile icon='👨‍👩‍👧‍👦' title='Family Management' description='Manage family members and their roles.' onClick={() => onNavigate('familySettings')} />}
                    {isParent && <HubTile icon='🎨' title='Family Branding' description='Set your family motto, crest, and app fonts.' onClick={() => onNavigate('familyBranding')} />}
                    {isParent && <HubTile icon='📋' title='Chore Settings' description='Set up chore templates and gamification.' onClick={() => onNavigate('choreSettings')} />}
                    {isParent && <HubTile icon='🏆' title='Reward Settings' description='Manage available prizes and point costs.' onClick={() => onNavigate('rewardSettings')} />}
                    {isParent && <HubTile icon='💰' title='Allowance Settings' description='Configure weekly allowance for children.' onClick={() => onNavigate('allowanceSettings')} />}
                    <HubTile icon='🧭' title='Navigation Settings' description='Customize your bottom navigation bar.' onClick={() => onNavigate('navigationSettings')} />
                    <HubTile icon='🏠' title='Dashboard Settings' description='Customize your dashboard layout.' onClick={() => onNavigate('dashboardSettings')} />
                    {isParent && <HubTile icon='🔗' title='Integrations' description='Connect to external services like Google Calendar.' onClick={() => onNavigate('integrations')} />}
                    {isParent && <HubTile icon='🔒' title='Security' description='Manage app lock and other security features.' onClick={() => onNavigate('securitySettings')} />}
                </div>
            </main>
            <BottomNavbar activePage="settings" onNavigate={onNavigate} />
        </div>
    );
};

export default SettingsView;