
import React from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ArrowLeftIcon, BottomNavbar } from '../components.tsx';
import { useCountdown } from '../hooks/useCountdown.ts';
import type { FamilyCourtCase } from '../types.ts';

const ConsequenceTimer = ({ caseData, endTime, getProfileName }: { caseData: FamilyCourtCase, endTime: number, getProfileName: (id: string) => string }) => {
    const { days, hours, minutes, seconds, isFinished } = useCountdown(endTime);
    if (isFinished) return null;

    return (
        <section className="card">
            <h3>{getProfileName(caseData.defendantId)}'s Consequence</h3>
            <p><strong>Case:</strong> {caseData.title}</p>
            <p><strong>Consequence:</strong> {caseData.consequence}</p>
            <p className="timer-display">
                {`${days}d ${hours}h ${minutes}m ${seconds}s`}
            </p>
        </section>
    );
};

const ConsequencesView = () => {
    const { onNavigate, getProfileName } = useAppDispatch();
    const { personalizationData, profiles } = useAppState();
    const activeCases = (personalizationData?.familyCourtCases || []).filter(c => c.status === 'Closed' && c.consequence && c.consequenceDurationHours && c.consequenceDurationHours > 0);

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" title="Go back to dashboard" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>⏳ Consequences</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                {activeCases.length > 0
                    ? activeCases.map(c => {
                        if (!c.verdictTimestamp || !c.consequenceDurationHours) return null;
                        const endTime = c.verdictTimestamp + (c.consequenceDurationHours * 60 * 60 * 1000);
                        return <ConsequenceTimer key={c.id} caseData={c} endTime={endTime} getProfileName={getProfileName} />;
                    })
                    : <div className="card"><p>No active consequences.</p></div>
                }
            </main>
            <BottomNavbar activePage="consequences" onNavigate={onNavigate} />
        </div>
    );
};

export default ConsequencesView;