import React from 'react';
import { EmptyState, ArrowLeftIcon } from '../components';

interface PhoneViewProps {
  prefilledNumber: string | null;
  onCallComplete: () => void;
  onBack: () => void;
}

export default function PhoneView({ prefilledNumber, onCallComplete, onBack }: PhoneViewProps) {
    return (
         <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>📱 Phone</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="The phone dialer and call interface is coming soon!"
                />
            </main>
        </div>
    );
}
