import React from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar } from './components';
import { useCountdown } from './hooks';
import { FamilyCourtCase } from './types';
import { styles } from './styles';

const ConsequenceTimer = ({ caseData, endTime, getProfileName }: { caseData: FamilyCourtCase, endTime: number, getProfileName: (id: string) => string }) => {
    const { days, hours, minutes, seconds, isFinished } = useCountdown(endTime);
    if (isFinished) return null;

    return (
        <section style={styles.section}>
            <h3>{getProfileName(caseData.defendantId)}'s Consequence</h3>
            <p><strong>Case:</strong> {caseData.title}</p>
            <p><strong>Consequence:</strong> {caseData.consequence}</p>
            <p style={{fontSize: '1.5em', fontWeight: 'bold', textAlign: 'center', margin: '20px 0'}}>
                {`${days}d ${hours}h ${minutes}m ${seconds}s`}
            </p>
        </section>
    );
};

const ConsequencesView = () => {
    const { onNavigate, personalizationData, profiles } = useAppContext();
    const getProfileName = (id: string) => profiles.find(p => p.id === id)?.name || 'N/A';
    const activeCases = (personalizationData.familyCourtCases || []).filter(c => c.status === 'Closed' && c.consequence && c.consequenceDurationHours && c.consequenceDurationHours > 0);

    return (
        <div style={styles.pageContainer}>
             <header style={styles.header}>
                 <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>⏳ Consequences</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                {activeCases.map(c => {
                    if(!c.verdictTimestamp || !c.consequenceDurationHours) return null;
                    const endTime = c.verdictTimestamp + (c.consequenceDurationHours * 60 * 60 * 1000);
                    return <ConsequenceTimer key={c.id} caseData={c} endTime={endTime} getProfileName={getProfileName} />
                })}
                {activeCases.length === 0 && <div style={styles.section}><p>No active consequences.</p></div>}
            </main>
             <BottomNavbar activePage="consequences" onNavigate={onNavigate} />
        </div>
    );
};

export default ConsequencesView;