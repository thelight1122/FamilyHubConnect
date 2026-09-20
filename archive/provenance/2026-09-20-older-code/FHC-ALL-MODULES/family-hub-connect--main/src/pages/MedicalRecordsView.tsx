import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';
import { EmptyState, ArrowLeftIcon } from '../components.tsx';

interface MedicalRecordsViewProps {
  onBack: () => void;
}

export default function MedicalRecordsView({ onBack }: MedicalRecordsViewProps) {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>🗂️ Medical Records</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This secure feature to store medical records is coming soon!"
                />
            </main>
        </div>
    );
}