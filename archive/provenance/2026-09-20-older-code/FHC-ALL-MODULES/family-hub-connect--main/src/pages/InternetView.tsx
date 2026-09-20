
import React, { useMemo } from 'react';
import { useAppState } from '../AppContext.tsx';
import { ArrowLeftIcon, HubTile } from '../components.tsx';
import { PageView } from '../types.ts';

interface InternetViewProps {
    onNavigate: (page: PageView) => void;
    onBack: () => void;
}

export default function InternetView({ onNavigate, onBack }: InternetViewProps) {
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const isParent = currentViewingProfile?.role === 'Admin' || currentViewingProfile?.role === 'Parent';

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={onBack} aria-label="Back to Dashboard">
                    <ArrowLeftIcon />
                </button>
                <h2>🌐 Internet & Media</h2>
                <div className="header-placeholder"></div>
            </header>
            <main className="main">
                <div className="hub-grid">
                    <HubTile
                        icon="🛡️"
                        title="Safe Web Browser"
                        description="Browse the web using a list of parent-approved websites."
                        onClick={() => onNavigate('webBrowser')}
                    />
                    <HubTile
                        icon="🧑‍🤝‍🧑"
                        title="Social Media"
                        description={isParent ? 'Manage social media settings and monitoring for your children.' : 'View your social media hub.'}
                        onClick={() => onNavigate('socialMedia')}
                    />
                    {isParent && (
                        <HubTile
                            icon="⚙️"
                            title="Manage Safe Websites"
                            description="Add or remove websites from the approved list for the Safe Web Browser."
                            onClick={() => onNavigate('settings')}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}