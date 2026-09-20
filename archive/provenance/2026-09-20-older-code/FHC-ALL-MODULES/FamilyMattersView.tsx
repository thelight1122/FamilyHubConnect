import React from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, HubTile } from './components';
import { styles } from './styles';

const FamilyMattersView = () => {
    const { onNavigate, currentViewingProfile } = useAppContext();
    const isChildView = currentViewingProfile?.role === 'Child';

    const subModules = [
        { page: 'familyFoundations', title: 'Family Foundations', icon: '📜', description: 'Create and agree upon your family\'s core values.' },
        { page: 'familyMeeting', title: 'Family Meetings', childTitle: 'Family Huddle', icon: '👨‍👩‍👧‍👦', description: 'Schedule and organize meetings.' },
        { page: 'familyCourt', title: 'Family Court', icon: '⚖️', description: 'Resolve disputes and make decisions together.' },
    ];

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                 <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>👨‍👩‍👧‍👦 Family Matters</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <div style={styles.hubGrid}>
                    {subModules.map(module => (
                        <HubTile 
                            key={module.page}
                            title={isChildView && module.childTitle ? module.childTitle : module.title}
                            icon={module.icon}
                            description={module.description}
                            onClick={() => onNavigate(module.page)}
                        />
                    ))}
                </div>
            </main>
            <BottomNavbar activePage="familyMatters" onNavigate={onNavigate} />
        </div>
    );
};

export default FamilyMattersView;