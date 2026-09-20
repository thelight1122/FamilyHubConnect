import React from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, HubTile } from './components';
import { styles } from './styles';

const DigitalDeskView = () => {
    const { onNavigate, currentViewingProfile } = useAppContext();
    const isChildView = currentViewingProfile?.role === 'Child';

    const subModules = [
        { page: 'homeworkHelper', title: 'Homework Helper', childTitle: 'Brain Boost', icon: '✏️', description: 'Get help with school assignments.' },
        { page: 'skillsTracker', title: 'Skills Tracker', childTitle: 'Level Up!', icon: '🌱', description: 'Learn new skills and track progress.' },
        { page: 'habitTracker', title: 'Routine Builder', childTitle: 'My Routines', icon: '🔄', description: 'Build and maintain good habits.' },
    ];

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                 <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>🖥️ {isChildView ? 'My Desk' : 'Digital Desk'}</h2>
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
            <BottomNavbar activePage="digitalDesk" onNavigate={onNavigate} />
        </div>
    );
};

export default DigitalDeskView;
