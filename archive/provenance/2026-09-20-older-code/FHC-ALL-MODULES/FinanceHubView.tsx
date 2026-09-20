import React from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, HubTile } from './components';
import { styles } from './styles';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const FinanceHubView = () => {
    const { onNavigate, currentViewingProfile, profiles, personalizationData } = useAppContext();
    const isParentView = currentViewingProfile.role !== 'Child';

    const getProfileBalance = (profileId: string) => {
        return (personalizationData.allowanceTransactions || [])
            .filter(t => t.profileId === profileId)
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const financeSubModules = [
        { page: 'allowance', title: 'Allowance', childTitle: 'My Wallet', icon: '💵', description: 'Track allowance and spending.' },
        { page: 'budgets', title: 'Budgets', icon: '📊', description: 'Set and track monthly spending categories.', parentOnly: true },
        { page: 'savingsGoals', title: 'Savings Goals', childTitle: 'My Goals', icon: '🎯', description: 'Save up for big purchases.' },
    ];
    
    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>💰 {isParentView ? 'Finance Hub' : 'My Piggy Bank'}</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                {isParentView ? (
                    <section style={styles.section}>
                        <h3>Family Overview</h3>
                        {profiles.filter(p => p.role === 'Child').map(child => (
                            <div key={child.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f2f5'}}>
                                <span>{child.name}'s Balance</span>
                                <span style={{fontWeight: 'bold'}}>{formatCurrency(getProfileBalance(child.id))}</span>
                            </div>
                        ))}
                    </section>
                ) : (
                    <section style={styles.section}>
                        <h3 style={{textAlign: 'center', fontSize: '1.2em', color: '#7f8c8d', margin: 0, fontWeight: 'normal'}}>My Balance</h3>
                        <p style={{fontSize: '3.5em', fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', margin: '10px 0'}}>{formatCurrency(getProfileBalance(currentViewingProfile.id))}</p>
                    </section>
                )}
                
                <div style={styles.hubGrid}>
                    {financeSubModules.map(module => {
                        if (module.parentOnly && !isParentView) return null;
                        
                        return (
                            <HubTile 
                                key={module.page}
                                title={!isParentView && module.childTitle ? module.childTitle : module.title}
                                icon={module.icon}
                                description={module.description}
                                onClick={() => onNavigate(module.page)}
                            />
                        );
                    })}
                </div>
            </main>
            <BottomNavbar activePage="finance" onNavigate={onNavigate} />
        </div>
    );
};

export default FinanceHubView;
