import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { AllowanceTransaction, Profile } from './types';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getCategoryIcon = (category: AllowanceTransaction['category']) => {
    const iconMap = {
        allowance: '🗓️',
        bonus: '⭐',
        chore: '🧹',
        reward: '🎁',
        deduction: '⚖️',
        adjustment: '⚙️',
    };
    return iconMap[category] || '💰';
};

const TransactionItem = ({ transaction, profileName }: { transaction: AllowanceTransaction; profileName: string; }) => {
    const isIncome = transaction.amount >= 0;
    const amountStyle = {
        ...styles.transactionAmount,
        color: isIncome ? styles.buttonSuccess.backgroundColor : styles.buttonDanger.backgroundColor
    };
    return (
        <div style={styles.transactionItem}>
            <div style={styles.transactionDetails}>
                <span style={styles.transactionIcon} aria-hidden="true">{getCategoryIcon(transaction.category)}</span>
                <div>
                    <div style={styles.transactionDescription}>{transaction.description}</div>
                    <div style={styles.transactionDate}>
                        {new Date(transaction.date).toLocaleDateString()} &bull; {profileName}
                    </div>
                </div>
            </div>
            <div style={amountStyle}>{formatCurrency(transaction.amount)}</div>
        </div>
    );
};

const TransactionModal = ({
    onClose, onSave, profile
}: {
    onClose: () => void;
    onSave: (amount: number, description: string) => void;
    profile: Profile;
}) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'add' | 'deduct'>('add');

    const handleSave = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || !description) {
            alert('Please enter a valid amount and description.');
            return;
        }
        const finalAmount = type === 'add' ? numericAmount : -numericAmount;
        onSave(finalAmount, description);
    };

    return (
        <Modal onClose={onClose} title={`Manage ${profile.name}'s Balance`}>
            <div style={styles.formGroup}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <button onClick={() => setType('add')} style={type === 'add' ? styles.button : { ...styles.button, ...styles.buttonSecondary }}>Add Funds</button>
                    <button onClick={() => setType('deduct')} style={type === 'deduct' ? styles.button : { ...styles.button, ...styles.buttonSecondary }}>Deduct Funds</button>
                </div>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="amount">Amount ($)</label>
                <input style={styles.input} id="amount" type="number" step="0.01" placeholder="e.g., 5.00" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="description">Description</label>
                <input style={styles.input} id="description" type="text" placeholder="e.g., Weekly Allowance" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div style={styles.formActions}>
                <button style={{...styles.button, ...styles.buttonSecondary}} onClick={onClose}>Cancel</button>
                <button style={styles.button} onClick={handleSave}>Save Transaction</button>
            </div>
        </Modal>
    );
};

const AllowanceView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, profiles, currentViewingProfile, addToast } = useAppContext();
    const isParentView = currentViewingProfile.role === 'Admin' || currentViewingProfile.role === 'Parent';
    const children = profiles.filter(p => p.role === 'Child');
    const transactions = useMemo(() => (personalizationData.allowanceTransactions || []).sort((a, b) => b.date - a.date), [personalizationData.allowanceTransactions]);
    
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

    const getProfileBalance = (profileId: string) => {
        return (personalizationData.allowanceTransactions || [])
            .filter(t => t.profileId === profileId)
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const handleOpenModal = (profile: Profile) => {
        setSelectedProfile(profile);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedProfile(null);
        setModalOpen(false);
    };

    const handleSaveTransaction = (amount: number, description: string) => {
        if (!selectedProfile) return;
        const newTransaction: AllowanceTransaction = {
            id: `txn_${Date.now()}`,
            profileId: selectedProfile.id,
            date: Date.now(),
            amount,
            description,
            category: 'adjustment' // Manual adjustments
        };

        const newTransactions = [...(personalizationData.allowanceTransactions || []), newTransaction];
        onSavePersonalization({ allowanceTransactions: newTransactions });
        addToast('Transaction saved!', 'badge');
        handleCloseModal();
    };

    const getProfileName = (id: string) => profiles.find(p => p.id === id)?.name || 'N/A';
    
    const ParentView = () => (
        <>
            {children.map(child => (
                <section key={child.id} style={styles.section}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>{child.name}'s Balance</h3>
                        <div style={styles.balanceDisplay}>{formatCurrency(getProfileBalance(child.id))}</div>
                    </div>
                     <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button style={{...styles.button, flex: 1}} onClick={() => handleOpenModal(child)}>Manage Funds</button>
                        {/* <button style={{...styles.button, ...styles.buttonSecondary, flex: 1}}>Settings</button> */}
                    </div>
                </section>
            ))}
             <section style={styles.section}>
                <h3>All Transactions</h3>
                <div style={styles.transactionList}>
                    {transactions.length > 0 ? (
                        transactions.map(t => <TransactionItem key={t.id} transaction={t} profileName={getProfileName(t.profileId)} />)
                    ) : (
                        <p>No transactions yet.</p>
                    )}
                </div>
            </section>
        </>
    );

    const ChildView = () => {
        const myBalance = getProfileBalance(currentViewingProfile.id);
        const myTransactions = transactions.filter(t => t.profileId === currentViewingProfile.id);
        return (
            <section style={styles.section}>
                <span style={styles.balanceLabel}>My Balance</span>
                <div style={styles.balanceDisplay}>{formatCurrency(myBalance)}</div>
                <h3 style={{marginTop: '20px'}}>My History</h3>
                 <div style={styles.transactionList}>
                    {myTransactions.length > 0 ? (
                        myTransactions.map(t => <TransactionItem key={t.id} transaction={t} profileName={currentViewingProfile.name} />)
                    ) : (
                        <p>You have no transactions yet. Ask a parent to add your first allowance!</p>
                    )}
                </div>
            </section>
        )
    };

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>💵 Allowance</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                {isParentView ? <ParentView /> : <ChildView />}
            </main>
            {modalOpen && selectedProfile && (
                <TransactionModal 
                    onClose={handleCloseModal}
                    onSave={handleSaveTransaction}
                    profile={selectedProfile}
                />
            )}
            <BottomNavbar activePage="allowance" onNavigate={onNavigate} />
        </div>
    );
};

export default AllowanceView;