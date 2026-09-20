

import React, { useState, useMemo } from 'react';
import type { Profile, Transaction, SavingsGoal, BadgeType } from '../types.ts';
import { uniqueId, formatCurrency } from '../utils/utils.ts';
import { Modal, ArrowLeftIcon, BottomNavbar } from '../components.tsx';
import { useAppState, useAppDispatch } from '../AppContext.tsx';

export default function AllowanceView() {
    const { 
        addToast, getProfileName, addAppNotification, onNavigate, 
        addTransaction, updateTransaction, addSavingsGoal, 
        updateSavingsGoal, updateProfile, awardBadgeIfEligible 
    } = useAppDispatch();
    const { profiles, viewingAsProfileId, transactions, savingsGoals } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);

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
            profileId: currentViewingProfile.id, amount: -amount,
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

        await updateProfile(currentViewingProfile.id, { balance: (currentViewingProfile.balance || 0) - amount });
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
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>My Wallet</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card text-center">
                    <p className="text-light m-0">{`${currentViewingProfile?.name}'s Balance`}</p>
                    <p style={{ fontSize: '3em', margin: '0 0 15px 0', fontWeight: 'bold', color: '#28a745' }}>{formatCurrency(currentViewingProfile?.balance)}</p>
                    {currentViewingProfile?.role === 'Child' && <button className="btn w-auto" onClick={() => setIsRequestModalOpen(true)}>Request to Spend Money</button>}
                </section>
                
                {(currentViewingProfile?.role === 'Admin' || currentViewingProfile?.role === 'Parent') && pendingTransactions.length > 0 && (
                    <section className="card">
                        <h3>Pending Requests</h3>
                        {pendingTransactions.map(tx => (
                            <div key={tx.id} className="list-item">
                                <div>
                                    <strong>{getProfileName(tx.profileId)}</strong> wants to spend {formatCurrency(Math.abs(tx.amount))} for "{tx.description}"
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button className="btn btn-success btn-sm" onClick={() => handleParentTxApproval(tx.id, true)}>Approve</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleParentTxApproval(tx.id, false)}>Deny</button>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                <section className="card">
                    <h3>Savings Goals</h3>
                    {currentViewingProfile?.role === 'Child' && <button className="btn w-auto mb-20" onClick={() => setIsGoalModalOpen(true)}>Add New Goal</button>}
                    {myGoals.length > 0 ? myGoals.map(goal => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        return (
                            <div key={goal.id} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>{`${goal.icon} ${goal.name}`}</strong>
                                    {goal.isCompleted ? <span style={{color: 'green'}}>🎉 Completed!</span> : <span>{`${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.targetAmount)}`}</span>}
                                </div>
                                {!goal.isCompleted && (
                                    <div style={{ backgroundColor: '#e9ecef', borderRadius: '4px', marginTop: '5px' }}>
                                        <div style={{ width: `${progress}%`, height: '20px', backgroundColor: '#28a745', borderRadius: '4px' }} />
                                    </div>
                                )}
                                {currentViewingProfile?.role === 'Child' && !goal.isCompleted && (
                                    <button
                                        className="btn btn-info btn-sm w-auto mt-10"
                                        onClick={() => { setDepositGoalId(goal.id); setIsDepositModalOpen(true); }}
                                    >
                                        Deposit Money
                                    </button>
                                )}
                            </div>
                        )
                    }) : <p>No savings goals set up yet.</p>}
                </section>

                <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title="Request to Spend">
                    <div className="form-group">
                        <label htmlFor='reqAmount'>Amount ($)</label>
                        <input id='reqAmount' type='number' value={requestAmount} onChange={e => setRequestAmount(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='reqReason'>Reason</label>
                        <input id='reqReason' type='text' value={requestReason} onChange={e => setRequestReason(e.target.value)} />
                    </div>
                    <button className="btn" onClick={handleRequestMoney}>Submit Request</button>
                </Modal>

                <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title="New Savings Goal">
                    <div className="form-group">
                        <label htmlFor='goalName'>Goal Name</label>
                        <input id='goalName' type='text' value={goalName} onChange={e => setGoalName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='goalIcon'>Icon</label>
                        <input id='goalIcon' type='text' value={goalIcon} onChange={e => setGoalIcon(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='goalTarget'>Target Amount ($)</label>
                        <input id='goalTarget' type='number' value={goalTargetAmount} onChange={e => setGoalTargetAmount(e.target.value)} />
                    </div>
                    <button className="btn" onClick={handleAddGoal}>Add Goal</button>
                </Modal>

                <Modal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} title="Deposit to Goal">
                    <p>Depositing to: "{savingsGoals.find(g => g.id === depositGoalId)?.name}"</p>
                    <div className="form-group">
                        <label htmlFor='depAmount'>Amount to Deposit ($)</label>
                        <input id='depAmount' type='number' value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
                    </div>
                    <button className="btn" onClick={handleDepositToGoal}>Confirm Deposit</button>
                </Modal>
            </main>
             <BottomNavbar activePage="allowance" onNavigate={onNavigate} />
        </div>
    );
}