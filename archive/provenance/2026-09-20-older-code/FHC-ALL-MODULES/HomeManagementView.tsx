import React from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, HubTile } from './components';
import { styles } from './styles';

const HomeManagementView = () => {
    const { onNavigate, currentViewingProfile } = useAppContext();
    const isChildView = currentViewingProfile?.role === 'Child';

    const subModules: { page: string; title: string; icon: string; description: string; childTitle?: string; }[] = [
        { page: 'maintenanceSchedule', title: 'Maintenance Schedule', icon: '🔧', description: 'Track recurring home care tasks.' },
        { page: 'homeProjects', title: 'Home Projects', icon: '🔨', description: 'Plan and manage improvement projects.' },
        { page: 'smartHome', title: 'Smart Home', icon: '💡', description: 'Control smart devices and scenes.' },
        { page: 'homeInventory', title: 'Home Inventory', icon: '📦', description: 'Keep track of appliances and valuables.' },
        { page: 'serviceContacts', title: 'Service Contacts', icon: '📞', description: 'A directory of trusted professionals.' },
    ];

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                 <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>🏡 {isChildView ? 'Our Home Base' : 'Home Management'}</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <div style={styles.hubGrid}>
                    {subModules.map(module => {
                        // Hide from children if they don't have a specific child title.
                        if (isChildView && !module.childTitle) return null;

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
            <BottomNavbar activePage="homeManagement" onNavigate={onNavigate} />
        </div>
    );
};

export default HomeManagementView;