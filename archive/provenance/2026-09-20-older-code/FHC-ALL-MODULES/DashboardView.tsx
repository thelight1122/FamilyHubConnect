import React from 'react';
import { HubTile, BottomNavbar } from './components';
import { ALL_MODULES } from './constants';
import { useAppContext } from './AppContext';
import { styles } from './styles';

const DashboardView = () => {
    const { onNavigate, profiles, currentViewingProfile, setCurrentViewingProfile, personalizationData } = useAppContext();
    const isChildView = currentViewingProfile?.role === 'Child';

    return (
         <div style={styles.pageContainer}>
            <header style={styles.header}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    {personalizationData.coatOfArmsUrl && <img src={personalizationData.coatOfArmsUrl} alt="Family Crest" style={{width: 40, height: 40, borderRadius: 4}} />}
                    <h2 style={{...styles.pageHeader, textAlign: 'left', margin: 0, flexGrow: 0}}>{personalizationData?.familyName || 'Family Hub'}</h2>
                </div>
                <div style={styles.profileSelectWrapper}>
                    <label htmlFor="profile-select" style={{fontWeight: 500}}>Viewing As:</label>
                    <select 
                        id="profile-select"
                        style={styles.profileSelect}
                        value={currentViewingProfile?.id}
                        onChange={(e) => {
                            const profile = profiles.find(p => p.id === e.target.value);
                            if (profile) {
                                setCurrentViewingProfile(profile);
                            }
                        }}
                    >
                        {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </header>
            <main style={styles.mainContent}>
                <section style={styles.memberInfoFrame}>
                    <h2 style={styles.memberInfoName}>{currentViewingProfile?.name}</h2>
                    <p style={styles.memberInfoRolePoints}>Role: {currentViewingProfile?.role}</p>
                </section>
                {personalizationData.motto && <p style={styles.dashboardMotto}>"{personalizationData.motto}"</p>}
                <div style={styles.hubGrid}>
                    {ALL_MODULES.map(module => {
                        if (isChildView && module.page === 'aiSettings') return null;
                        
                        return (
                            <HubTile 
                                key={module.page}
                                title={isChildView && module.childTitle ? module.childTitle : module.title}
                                icon={module.icon}
                                description={module.description}
                                onClick={() => onNavigate(module.page)}
                            />
                        )
                    })}
                </div>
            </main>
            <BottomNavbar activePage="dashboard" onNavigate={onNavigate} />
        </div>
    );
};

export default DashboardView;