import React, { useState, useMemo } from 'react';
import type { Profile, Transaction, SavingsGoal, BadgeType } from '../types';
import { styles } from '../styles';
import { uniqueId, formatCurrency } from '../utils/utils';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../contexts/AppContext';

interface AllowanceViewProps {
    addTransaction: (tx: Omit<Transaction, 'id' | 'family_id'>) => Promise<any>;
    updateTransaction: (txId: string, updates: Partial<Transaction>) => Promise<any>;
    addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'family_id'>) => Promise<any>;
    updateSavingsGoal: (goalId: string, updates: Partial<SavingsGoal>) => Promise<any>;
    deleteSavingsGoal: (goalId: string) => Promise<any>;
    updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<any>;
    awardBadgeIfEligible: (profileId: string, badgeId: BadgeType) => Promise<boolean>;
}

export default function AllowanceView({
    addTransaction, updateTransaction, addSavingsGoal, updateSavingsGoal,
    deleteSavingsGoal, updateProfile, awardBadgeIfEligible
}: AllowanceViewProps) {
    const { profiles, currentViewingProfile, transactions, savingsGoals, addToast, getProfileName, addAppNotification } = useAppContext();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestAmount, setRequestAmount] = useState('');
    const [requestReason, setRequestReason] = useState('');

    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [goalName, setGoalName] = useState('');
    const [goalIcon, setGoalIcon] = useState('🎮');
    const [goalTargetAmount, setGoalTargetAmount] = useState('');

    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [depositGoalId, setDepositGoalId] = useState('');
    const [depositAmount, setDepositAmount] = useState('');

    const handleRequestMoney = async () => {
        const amount = parseFloat(requestAmount);
        if (!requestReason.trim() || isNaN(amount) || amount <= 0) {
            addToast("Please enter a valid amount and reason.", 'info'); return;
        }
        if (!currentViewingProfile) return;

        const newTx: Omit<Transaction, 'id' | 'family_id'> = {
            profileId: currentViewingProfile.id, amount: -amount, // Requests are negative
            description: requestReason.trim(), timestamp: Date.now(), status: 'pending'
        };
        await addTransaction(newTx);
        addAppNotification(`${currentViewingProfile.name} is requesting to spend ${formatCurrency(amount)}.`, 'allowance_request');
        addToast("Your request has been sent for approval.", 'info');
        setIsRequestModalOpen(false);
    };

    const handleAddGoal = async () => {
        const amount = parseFloat(goalTargetAmount);
        if (!goalName.trim() || isNaN(amount) || amount <= 0) {
            addToast("Please enter a valid name and target amount.", 'info'); return;
        }
        if (!currentViewingProfile) return;
        const newGoal: Omit<SavingsGoal, 'id' | 'family_id'> = {
            profileId: currentViewingProfile.id, name: goalName.trim(), icon: goalIcon,
            targetAmount: amount, currentAmount: 0, isCompleted: false,
        };
        await addSavingsGoal(newGoal);
        addToast("New savings goal added!", 'info');
        awardBadgeIfEligible(currentViewingProfile.id, 'SAVINGS_STARTER');
        setIsGoalModalOpen(false);
    };

    const handleDepositToGoal = async () => {
        const amount = parseFloat(depositAmount);
        if (!depositGoalId || isNaN(amount) || amount <= 0) {
            addToast("Please select a goal and enter a valid amount.", 'info'); return;
        }
        if (!currentViewingProfile || (currentViewingProfile.balance || 0) < amount) {
            addToast("You don't have enough money in your wallet.", 'info'); return;
        }

        const goal = savingsGoals.find(g => g.id === depositGoalId);
        if (!goal) return;

        // 1. Update Profile Balance
        await updateProfile(currentViewingProfile.id, { balance: (currentViewingProfile.balance || 0) - amount });
        // 2. Update Goal Balance
        const newCurrentAmount = goal.currentAmount + amount;
        const isCompleted = newCurrentAmount >= goal.targetAmount;
        await updateSavingsGoal(goal.id, { currentAmount: newCurrentAmount, isCompleted });

        addToast(`${formatCurrency(amount)} moved to "${goal.name}"!`, 'info');
        if (isCompleted && !goal.isCompleted) {
            awardBadgeIfEligible(currentViewingProfile.id, 'GOAL_GETTER');
            addAppNotification(`${currentViewingProfile.name} has reached their savings goal: "${goal.name}"! 🎉`, 'goal_achieved');
        }
        setIsDepositModalOpen(false);
    };

    const myGoals = useMemo(() => savingsGoals.filter(g => g.profileId === currentViewingProfile?.id), [savingsGoals, currentViewingProfile]);
    const myTransactions = useMemo(() => transactions.filter(t => t.profileId === currentViewingProfile?.id), [transactions, currentViewingProfile]);
    const pendingTransactions = useMemo(() => transactions.filter(t => t.status === 'pending'), [transactions]);

    const handleParentTxApproval = async (txId: string, isApproved: boolean) => {
        const tx = transactions.find(t => t.id === txId);
        if (!tx) return;
        
        const childProfile = profiles.find(p => p.id === tx.profileId);
        if (!childProfile) return;

        if (isApproved) {
            if ((childProfile.balance || 0) < Math.abs(tx.amount)) {
                addToast(`${childProfile.name} does not have enough funds to approve this.`, 'info');
                return;
            }
            await updateProfile(childProfile.id, { balance: (childProfile.balance || 0) + tx.amount });
            await updateTransaction(txId, { status: 'completed' });
            addAppNotification(`Your request for "${tx.description}" was approved.`, 'allowance_request', childProfile.id);
        } else {
            await updateTransaction(txId, { status: 'denied' });
            addAppNotification(`Your request for "${tx.description}" was denied.`, 'allowance_request', childProfile.id);
        }
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('h2', { style: styles.pageHeader }, "My Wallet"),
            React.createElement('section', { style: styles.section },
                React.createElement('div', { style: { textAlign: 'center' } },
                    React.createElement('p', { style: { fontSize: '1.2em', margin: 0, color: '#666' } }, `${currentViewingProfile?.name}'s Balance`),
                    React.createElement('p', { style: { fontSize: '3em', margin: '0 0 15px 0', fontWeight: 'bold', color: '#28a745' } }, formatCurrency(currentViewingProfile?.balance)),
                    currentViewingProfile?.role === 'child' && React.createElement('button', { style: { ...styles.button, width: 'auto' }, onClick: () => setIsRequestModalOpen(true) }, "Request to Spend Money")
                )
            ),
            currentViewingProfile?.role === 'adult' && pendingTransactions.length > 0 && React.createElement('section', { style: styles.section },
                React.createElement('h3', { style: styles.sectionTitle }, "Pending Requests"),
                pendingTransactions.map(tx => (
                    React.createElement('div', { key: tx.id, style: styles.listItem },
                        React.createElement('div', null,
                            React.createElement('strong', null, getProfileName(tx.profileId)), ` wants to spend ${formatCurrency(Math.abs(tx.amount))} for "${tx.description}"`
                        ),
                        React.createElement('div', { style: { display: 'flex', gap: '5px' } },
                            React.createElement('button', { style: { ...styles.button, ...styles.buttonSuccess, width: 'auto' }, onClick: () => handleParentTxApproval(tx.id, true) }, 'Approve'),
                            React.createElement('button', { style: { ...styles.button, ...styles.buttonDanger, width: 'auto' }, onClick: () => handleParentTxApproval(tx.id, false) }, 'Deny')
                        )
                    )
                ))
            ),
            React.createElement('section', { style: styles.section },
                React.createElement('h3', { style: styles.sectionTitle }, "Savings Goals"),
                currentViewingProfile?.role === 'child' && React.createElement('button', { style: { ...styles.button, width: 'auto', marginBottom: '10px' }, onClick: () => setIsGoalModalOpen(true) }, "Add New Goal"),
                myGoals.length > 0 ? myGoals.map(goal => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    return React.createElement('div', { key: goal.id, style: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' } },
                        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                            React.createElement('strong', null, `${goal.icon} ${goal.name}`),
                            goal.isCompleted ? React.createElement('span', {style: {color: 'green'}}, '🎉 Completed!') : React.createElement('span', null, `${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.targetAmount)}`)
                        ),
                        !goal.isCompleted && React.createElement('div', { style: { backgroundColor: '#e9ecef', borderRadius: '4px', marginTop: '5px' } },
                            React.createElement('div', { style: { width: `${progress}%`, height: '20px', backgroundColor: '#28a745', borderRadius: '4px' } })
                        ),
                        currentViewingProfile?.role === 'child' && !goal.isCompleted && React.createElement('button', {
                            style: { ...styles.button, ...styles.buttonInfo, width: 'auto', padding: '5px 10px', fontSize: '0.8em', marginTop: '5px' },
                            onClick: () => { setDepositGoalId(goal.id); setIsDepositModalOpen(true); }
                        }, 'Deposit Money')
                    )
                }) : React.createElement('p', null, "No savings goals set up yet.")
            ),

            React.createElement(Modal, {
                isOpen: isRequestModalOpen, onClose: () => setIsRequestModalOpen(false), title: "Request to Spend",
                children: React.createElement('div', null,
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'reqAmount' }, 'Amount ($)'),
                        React.createElement('input', { id: 'reqAmount', type: 'number', value: requestAmount, onChange: e => setRequestAmount(e.target.value), style: styles.input })
                    ),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'reqReason' }, 'Reason'),
                        React.createElement('input', { id: 'reqReason', type: 'text', value: requestReason, onChange: e => setRequestReason(e.target.value), style: styles.input })
                    ),
                    React.createElement('button', { style: styles.button, onClick: handleRequestMoney }, 'Submit Request')
                )
            }),
            React.createElement(Modal, {
                isOpen: isGoalModalOpen, onClose: () => setIsGoalModalOpen(false), title: "New Savings Goal",
                children: React.createElement('div', null,
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'goalName' }, 'Goal Name'),
                        React.createElement('input', { id: 'goalName', type: 'text', value: goalName, onChange: e => setGoalName(e.target.value), style: styles.input })
                    ),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'goalIcon' }, 'Icon'),
                        React.createElement('input', { id: 'goalIcon', type: 'text', value: goalIcon, onChange: e => setGoalIcon(e.target.value), style: styles.input })
                    ),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'goalTarget' }, 'Target Amount ($)'),
                        React.createElement('input', { id: 'goalTarget', type: 'number', value: goalTargetAmount, onChange: e => setGoalTargetAmount(e.target.value), style: styles.input })
                    ),
                    React.createElement('button', { style: styles.button, onClick: handleAddGoal }, 'Add Goal')
                )
            }),
            React.createElement(Modal, {
                isOpen: isDepositModalOpen, onClose: () => setIsDepositModalOpen(false), title: "Deposit to Goal",
                children: React.createElement('div', null,
                    React.createElement('p', null, `Depositing to: "${savingsGoals.find(g => g.id === depositGoalId)?.name}"`),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'depAmount' }, 'Amount to Deposit ($)'),
                        React.createElement('input', { id: 'depAmount', type: 'number', value: depositAmount, onChange: e => setDepositAmount(e.target.value), style: styles.input })
                    ),
                    React.createElement('button', { style: styles.button, onClick: handleDepositToGoal }, 'Confirm Deposit')
                )
            })
        )
    );
}
