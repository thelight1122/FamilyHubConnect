import React from 'react';
import { EmptyState, ArrowLeftIcon } from '../components.tsx';

interface GpsTrackingViewProps {
  onBack: () => void;
}

export default function GpsTrackingView({ onBack }: GpsTrackingViewProps) {
    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={onBack} aria-label="Go Back">
                    <ArrowLeftIcon />
                </button>
                <h2>🗺️ GPS Location</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🚧"
                    title="Under Construction"
                    message="This feature to view family member locations on a map is coming soon!"
                />
            </main>
        </div>
    );
}