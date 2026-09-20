import React from 'react';
import { EmptyState, ArrowLeftIcon } from '../components';

interface PhoneLogsViewProps {
  onBack: () => void;
}

export default function PhoneLogsView({ onBack }: PhoneLogsViewProps) {
    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>📞 Phone Logs</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to view call and SMS logs is coming soon!"
                />
            </main>
        </div>
    );
}
