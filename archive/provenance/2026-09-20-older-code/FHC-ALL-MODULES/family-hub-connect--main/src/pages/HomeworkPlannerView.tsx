
import React from 'react';
import { EmptyState, ArrowLeftIcon } from '../components.tsx';

interface HomeworkPlannerViewProps {
    onBack: () => void;
}

export default function HomeworkPlannerView({ onBack }: HomeworkPlannerViewProps) {
    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={onBack} title="Go back to Digital Desk">
                    <ArrowLeftIcon />
                </button>
                <h2>🗓️ Homework Planner</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to plan your homework is coming soon!"
                />
            </main>
        </div>
    );
}