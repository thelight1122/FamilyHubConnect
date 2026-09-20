import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { SavingsGoal, AllowanceTransaction } from './types';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const ProgressBar = ({ value, max }: { value: number; max: number; }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBarFill, width: `${Math.min(percentage, 100)}%`, backgroundColor: '#2ecc71' }}></div>
        </div>
    );
};

const SavingsGoalCard = ({ goal, onContribute }: { goal: SavingsGoal; onContribute: (goal: SavingsGoal) => void; }) => {
    return (
        <div style={styles.savingsGoalCard}>
            <img src={goal.imageUrl} alt={goal.name} style={styles.savingsGoalImage} />
            <div style={styles.savingsGoalInfo}>
                <h3 style={styles.savingsGoalTitle}>{goal.name}</h3>
                <p style={styles.savingsGoalProgressText}>
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                </p>
                <ProgressBar value={goal.currentAmount} max={goal.targetAmount} />
                <div style={{...styles.formActions, justifyContent: 'flex-end'}}>
                     <button onClick={() => onContribute(goal)} style={{...styles.button, padding: '8px 16px'}}>+ Contribute</button>
                </div>
            </div>
        </div>
    );
};

const GoalModal = ({ onClose, onSave, isLoading }: { onClose: () => void; onSave: (name: string, target: number) => void; isLoading: boolean; }) => {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');

    return (
        <Modal onClose={onClose} title="Create a New Savings Goal">
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="goal-name">What are you saving for?</label>
                <input id="goal-name" style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., New Bicycle" />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="goal-target">How much do you need?</label>
                <input id="goal-target" type="number" style={styles.input} value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g., 250" />
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
                <button onClick={() => onSave(name, parseFloat(target))} style={styles.button} disabled={isLoading || !name || !target}>
                    {isLoading ? '🧠 Creating...' : '✨ Create Goal'}
                </button>
            </div>
        </Modal>
    );
};

const ContributeModal = ({ onClose, onSave, goal, userBalance }: { onClose: () => void; onSave: (amount: number) => void; goal: SavingsGoal; userBalance: number }) => {
    const [amount, setAmount] = useState('');
    return (
        <Modal onClose={onClose} title={`Contribute to ${goal.name}`}>
            <p>Your current balance: <strong>{formatCurrency(userBalance)}</strong></p>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="contribution">Amount to contribute:</label>
                <input id="contribution" type="number" style={styles.input} value={amount} onChange={e => setAmount(e.target.value)} max={userBalance} />
            </div>
            <div style={styles.formActions}>
                <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>Cancel</button>
                <button onClick={() => onSave(parseFloat(amount))} style={styles.button} disabled={!amount || parseFloat(amount) > userBalance}>Save</button>
            </div>
        </Modal>
    );
};

const SavingsGoalsView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, currentViewingProfile, addToast } = useAppContext();
    const allGoals = useMemo(() => personalizationData.savingsGoals || [], [personalizationData.savingsGoals]);
    const myGoals = allGoals.filter(g => g.createdBy === currentViewingProfile.id);

    const [isLoading, setIsLoading] = useState(false);
    const [isGoalModalOpen, setGoalModalOpen] = useState(false);
    const [isContributeModalOpen, setContributeModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

    const getProfileBalance = (profileId: string) => {
        return (personalizationData.allowanceTransactions || [])
            .filter(t => t.profileId === profileId)
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const handleCreateGoal = async (name: string, targetAmount: number) => {
        if (!process.env.API_KEY) {
            addToast("API Key is not configured.", 'info');
            return;
        }
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: `A vibrant, fun, cartoon-style image of a ${name}`,
                config: { numberOfImages: 1, aspectRatio: '4:3', outputMimeType: 'image/jpeg' }
            });

            const newGoal: SavingsGoal = {
                id: `goal_${Date.now()}`,
                name,
                targetAmount,
                currentAmount: 0,
                imageUrl: `data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}`,
                createdBy: currentViewingProfile.id,
            };

            onSavePersonalization({ savingsGoals: [...allGoals, newGoal] });
            addToast('New goal created!', 'badge');
            setGoalModalOpen(false);
        } catch (error) {
            console.error("Error creating goal:", error);
            addToast("Could not create goal. Please try again.", 'info');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleOpenContribute = (goal: SavingsGoal) => {
        setSelectedGoal(goal);
        setContributeModalOpen(true);
    };

    const handleSaveContribution = (amount: number) => {
        if (!selectedGoal || isNaN(amount) || amount <= 0) return;

        const updatedGoals = allGoals.map(g => 
            g.id === selectedGoal.id ? { ...g, currentAmount: g.currentAmount + amount } : g
        );

        const newTransaction: AllowanceTransaction = {
            id: `txn_${Date.now()}`,
            profileId: currentViewingProfile.id,
            date: Date.now(),
            amount: -amount,
            description: `Saved for: ${selectedGoal.name}`,
            category: 'savings',
        };
        const updatedTransactions = [...(personalizationData.allowanceTransactions || []), newTransaction];

        onSavePersonalization({
            savingsGoals: updatedGoals,
            allowanceTransactions: updatedTransactions
        });
        addToast(`You saved ${formatCurrency(amount)}!`, 'badge');
        setContributeModalOpen(false);
        setSelectedGoal(null);
    };

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{ ...styles.navButton, flexShrink: 0, width: 40 }} onClick={() => onNavigate('finance')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>🎯 Savings Goals</h2>
                <div style={{ flexShrink: 0, width: 40 }}></div>
            </header>
            <main style={styles.mainContent}>
                <button onClick={() => setGoalModalOpen(true)} style={{ ...styles.button, width: '100%', marginBottom: '20px' }}>
                    + Create a New Goal
                </button>
                <div style={styles.hubGrid}>
                    {myGoals.map(goal => (
                        <SavingsGoalCard key={goal.id} goal={goal} onContribute={handleOpenContribute} />
                    ))}
                </div>
                {myGoals.length === 0 && (
                    <div style={styles.section}><p>No savings goals yet. Create one to start saving!</p></div>
                )}
            </main>

            {isGoalModalOpen && <GoalModal onClose={() => setGoalModalOpen(false)} onSave={handleCreateGoal} isLoading={isLoading} />}
            
            {isContributeModalOpen && selectedGoal && (
                <ContributeModal 
                    onClose={() => setContributeModalOpen(false)}
                    onSave={handleSaveContribution}
                    goal={selectedGoal}
                    userBalance={getProfileBalance(currentViewingProfile.id)}
                />
            )}

            <BottomNavbar activePage="savingsGoals" onNavigate={onNavigate} />
        </div>
    );
};

export default SavingsGoalsView;
