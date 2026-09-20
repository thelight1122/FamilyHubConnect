import React from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar } from './components';
import { ALL_MODULES } from './constants';
import { styles } from './styles';

interface GenericPlaceholderViewProps {
    pageTitle: string;
}

const GenericPlaceholderView = ({ pageTitle }: GenericPlaceholderViewProps) => {
    const { currentViewingProfile, onNavigate } = useAppContext();
    const isChildView = currentViewingProfile?.role === 'Child';
    
    const moduleInfo = ALL_MODULES.find(m => m.title === pageTitle || m.childTitle === pageTitle);
    const title = isChildView && moduleInfo?.childTitle ? moduleInfo.childTitle : moduleInfo?.title || pageTitle;

    return (
         <div style={styles.pageContainer}>
            <header style={styles.header}>
                 <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>{title}</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <div style={styles.section}>
                    <p>This feature is coming soon!</p>
                    {pageTitle === 'Settings' && (
                        <button style={{...styles.button, marginTop: '20px'}} onClick={() => onNavigate('aiSettings')}>
                            🤖 AI Safety Settings
                        </button>
                    )}
                </div>
            </main>
            <BottomNavbar activePage={moduleInfo?.page || ''} onNavigate={onNavigate} />
        </div>
    );
};

export default GenericPlaceholderView;