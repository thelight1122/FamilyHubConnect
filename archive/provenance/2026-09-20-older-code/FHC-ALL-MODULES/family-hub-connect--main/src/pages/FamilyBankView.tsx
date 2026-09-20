

import React, { useState, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { formatCurrency } from '../utils/utils.ts';
import { Modal, ArrowLeftIcon } from '../components.tsx';
import type { Loan, Investment } from '../types.ts';

interface FamilyBankViewProps {
    onBack: () => void;
}

export default function FamilyBankView({ onBack }: FamilyBankViewProps) {
    const { addLoan, updateLoan, addInvestment, addToast, getProfileName } = useAppDispatch();
    const { profiles, viewingAsProfileId, loans, investments } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);

    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
    
    const [loanAmount, setLoanAmount] = useState('');
    const [loanReason, setLoanReason] = useState('');
    const [investmentAmount, setInvestmentAmount] = useState('');

    const handleRequestLoan = async () => {
        const amount = parseFloat(loanAmount);
        if (isNaN(amount) || amount <= 0 || !loanReason.trim() || !currentViewingProfile) {
            addToast("Please provide a valid amount and reason.", 'info'); return;
        }
        await addLoan({
            profileId: currentViewingProfile.id, amount, reason: loanReason, status: 'pending',
            remainingAmount: amount, createdAt: Date.now(),
        });
        addToast("Loan request submitted!", 'info');
        setIsLoanModalOpen(false);
    };
    
    const handleRequestInvestment = async () => {
        const amount = parseFloat(investmentAmount);
         if (isNaN(amount) || amount <= 0 || !currentViewingProfile) { addToast("Please provide a valid amount.", 'info'); return; }
        if (amount > (currentViewingProfile.balance || 0)) { addToast("You don't have enough in your wallet to invest.", 'info'); return; }
        await addInvestment({
            profileId: currentViewingProfile.id, initialAmount: amount, currentValue: amount, createdAt: Date.now(),
        });
        addToast("Investment request submitted! A parent will process it.", 'info');
        setIsInvestModalOpen(false);
    };

    const handleLoanApproval = (loan: Loan, approve: boolean) => {
        updateLoan(loan.id, { status: approve ? 'active' : 'denied' });
        const childName = getProfileName(loan.profileId);
        addToast(`Loan for ${childName} has been ${approve ? 'approved' : 'denied'}.`, 'info');
    };
    
    const isParent = currentViewingProfile?.role === 'Admin' || currentViewingProfile?.role === 'Parent';
    const myLoans = loans.filter(l => l.profileId === currentViewingProfile?.id);
    const myInvestments = investments.filter(i => i.profileId === currentViewingProfile?.id);
    const pendingLoans = loans.filter(l => l.status === 'pending');

    if (!currentViewingProfile) return null;

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBack} aria-label="Back to Finance Hub">
                    <ArrowLeftIcon />
                </button>
                <h2>🏦 Family Bank</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 {isParent && pendingLoans.length > 0 && (
                    <section className="card">
                        <h3>Pending Loan Requests</h3>
                        {pendingLoans.map(loan => (
                            <div key={loan.id} className="list-item">
                                <div>
                                    <strong>{`${getProfileName(loan.profileId)} requests ${formatCurrency(loan.amount)}`}</strong>
                                    <p className="m-0 text-sm text-light">{`Reason: ${loan.reason}`}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-success btn-sm" onClick={() => handleLoanApproval(loan, true)}>Approve</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleLoanApproval(loan, false)}>Deny</button>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                <section className="card">
                    <div className="flex justify-between">
                        <h3>Loans</h3>
                        {!isParent && <button onClick={() => setIsLoanModalOpen(true)} className="btn w-auto">Request Loan</button>}
                    </div>
                    {myLoans.map(loan => (
                         <div key={loan.id} className="list-item">
                            {`Loan for ${formatCurrency(loan.amount)} - Status: ${loan.status}`}
                         </div>
                    ))}
                </section>

                <section className="card">
                     <div className="flex justify-between">
                        <h3>Investments</h3>
                        {!isParent && <button onClick={() => setIsInvestModalOpen(true)} className="btn w-auto">Make Investment</button>}
                    </div>
                     {myInvestments.map(inv => (
                         <div key={inv.id} className="list-item">
                            {`Investment: Initial ${formatCurrency(inv.initialAmount)}, Current Value: ${formatCurrency(inv.currentValue)}`}
                         </div>
                    ))}
                </section>
            </main>
            
            {isLoanModalOpen && <Modal isOpen={true} onClose={() => setIsLoanModalOpen(false)} title='Request a Loan'>
                <input value={loanAmount} onChange={e => setLoanAmount(e.target.value)} type='number' placeholder='Amount' />
                <input value={loanReason} onChange={e => setLoanReason(e.target.value)} className="mt-10" placeholder='Reason for loan' />
                <button className="btn mt-10" onClick={handleRequestLoan}>Submit Request</button>
            </Modal>}
            
             {isInvestModalOpen && <Modal isOpen={true} onClose={() => setIsInvestModalOpen(false)} title='Make an Investment'>
                <p>Your current balance: {formatCurrency(currentViewingProfile?.balance)}</p>
                <input value={investmentAmount} onChange={e => setInvestmentAmount(e.target.value)} type='number' placeholder='Amount to invest' />
                <button className="btn mt-10" onClick={handleRequestInvestment}>Request Investment</button>
            </Modal>}
        </div>
    );
}