import React, { useState, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { BudgetCategory, BudgetExpense } from './types';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const ProgressBar = ({ value, max }: { value: number; max: number; }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const color = percentage > 100 ? '#e74c3c' : percentage > 80 ? '#f1c40f' : '#2ecc71';

    return (
        <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBarFill, width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}></div>
            <div style={styles.progressBarText}>
                {formatCurrency(value)} / {formatCurrency(max)}
            </div>
        </div>
    );
};

const AddExpenseModal = ({ onClose, onSave, categories }: { onClose: () => void; onSave: (data: Omit<BudgetExpense, 'id'|'date'>) => void; categories: BudgetCategory[]; }) => {
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {
        if (!categoryId || !description || !amount) {
            alert('Please fill out all fields.');
            return;
        }
        onSave({ categoryId, description, amount: parseFloat(amount) });
    };

    return (
        <Modal onClose={onClose} title="Log a New Expense">
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="category">Category</label>
                <select id="category" style={styles.selectInput} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                    <option value="">-- Select a Category --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="description">Description</label>
                <input id="description" style={styles.input} value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Weekly groceries" />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="amount">Amount ($)</label>
                <input id="amount" type="number" step="0.01" style={styles.input} value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 125.50" />
            </div>
            <div style={styles.formActions}>
                <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onClose}>Cancel</button>
                <button style={styles.button} onClick={handleSubmit}>Save Expense</button>
            </div>
        </Modal>
    );
};


const BudgetsView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, currentViewingProfile, addToast } = useAppContext();
    const budgets = useMemo(() => personalizationData.budgets || [], [personalizationData.budgets]);
    const expenses = useMemo(() => personalizationData.expenses || [], [personalizationData.expenses]);

    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

    if (currentViewingProfile.role === 'Child') {
        // This view is for parents only
        return (
            <div style={styles.pageContainer}>
                <header style={styles.header}>
                    <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('finance')}>
                        <ArrowLeftIcon />
                    </button>
                    <h2 style={styles.pageHeader}>📊 Budgets</h2>
                    <div style={{flexShrink: 0, width: 40}}></div>
                </header>
                <main style={styles.mainContent}>
                    <div style={styles.section}>
                        <p>This feature is available for parents only.</p>
                    </div>
                </main>
            </div>
        );
    }
    
    const getCategoryTotal = (categoryId: string) => {
        return expenses
            .filter(e => e.categoryId === categoryId)
            .reduce((sum, e) => sum + e.amount, 0);
    };

    const handleAddExpense = (data: Omit<BudgetExpense, 'id'|'date'>) => {
        const newExpense: BudgetExpense = {
            ...data,
            id: `exp_${Date.now()}`,
            date: Date.now(),
        };
        onSavePersonalization({ expenses: [...expenses, newExpense] });
        addToast('Expense logged!', 'badge');
        setExpenseModalOpen(false);
    };
    
    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('finance')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>📊 Budgets</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <button onClick={() => setExpenseModalOpen(true)} style={{...styles.button, width: '100%', marginBottom: '20px'}}>+ Log an Expense</button>
                
                {budgets.map(category => (
                    <section key={category.id} style={styles.section}>
                        <h3 style={{margin: '0 0 5px 0'}}>{category.name}</h3>
                        <ProgressBar value={getCategoryTotal(category.id)} max={category.limit} />
                    </section>
                ))}

                {budgets.length === 0 && <p>No budget categories set up yet.</p>}
            </main>

            {isExpenseModalOpen && (
                <AddExpenseModal
                    onClose={() => setExpenseModalOpen(false)}
                    onSave={handleAddExpense}
                    categories={budgets}
                />
            )}
            <BottomNavbar activePage="budgets" onNavigate={onNavigate} />
        </div>
    );
};

export default BudgetsView;
