
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import { formatCurrency, uniqueId } from '../utils/utils';
import type { BudgetCategory, Expense } from '../types';
import Modal from '../components/ui/Modal';
import { supabase } from '../services/supabaseClient';
import AIHelperWidget from '../components/ui/AIHelperWidget';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CategoryModal: React.FC<{
    onClose: () => void;
    category?: BudgetCategory | null;
}> = ({ onClose, category }) => {
    const { addBudgetCategory, updateBudgetCategory, deleteBudgetCategory, addToast } = useAppContext();
    const [name, setName] = useState(category?.name || '');
    const [allocated, setAllocated] = useState(String(category?.allocated || ''));
    const [icon, setIcon] = useState(category?.icon || '💰');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAllocated = parseFloat(allocated);
        if (!name || isNaN(numAllocated) || numAllocated < 0) {
            addToast("Please provide a valid name and allocated amount.", 'info');
            return;
        }
        if (category) {
            updateBudgetCategory(category.id, { name, allocated: numAllocated, icon });
        } else {
            addBudgetCategory({ name, allocated: numAllocated, icon });
        }
        onClose();
    };
    
    const handleDelete = () => {
        if(category && window.confirm("Are you sure? This will delete the category and all associated expenses.")) {
            deleteBudgetCategory(category.id);
            onClose();
        }
    };

    return React.createElement(Modal, {
        isOpen: true, onClose, title: category ? 'Edit Category' : 'New Category',
        children: React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('div', { style: styles.formGroup }, React.createElement('label', null, 'Category Name:'), React.createElement('input', { value: name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value), style: styles.input })),
            React.createElement('div', { style: styles.formGroup }, React.createElement('label', null, 'Icon:'), React.createElement('input', { value: icon, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setIcon(e.target.value), style: styles.input })),
            React.createElement('div', { style: styles.formGroup }, React.createElement('label', null, 'Monthly Budget:'), React.createElement('input', { type: 'number', value: allocated, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAllocated(e.target.value), style: styles.input })),
            React.createElement('div', { style: styles.modalActions },
                category && React.createElement('button', { type: 'button', onClick: handleDelete, style: { ...styles.button, ...styles.buttonDanger, marginRight: 'auto' } }, 'Delete'),
                React.createElement('button', { type: 'submit', style: styles.button }, 'Save')
            )
        )
    });
};

export default function BudgetView() {
    const { budgetCategories, expenses, addExpense, IS_TESTING_MODE } = useAppContext();
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
    const [expenseText, setExpenseText] = useState('');
    const [isProcessingExpense, setIsProcessingExpense] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const categorySpending = useMemo(() => {
        const spending: Record<string, number> = {};
        expenses.forEach(exp => {
            spending[exp.categoryId] = (spending[exp.categoryId] || 0) + exp.amount;
        });
        return spending;
    }, [expenses]);
    
    const handleAddExpense = async () => {
        if (!expenseText.trim()) return;
        if (budgetCategories.length === 0) {
            setAiError("Please create at least one budget category before adding an expense.");
            return;
        }
        setIsProcessingExpense(true);
        setAiError(null);

        if (IS_TESTING_MODE) {
            setTimeout(() => {
                addExpense({
                    categoryId: budgetCategories[0].id,
                    description: `Mock: ${expenseText}`,
                    amount: Math.floor(Math.random() * 50) + 1,
                    timestamp: Date.now()
                });
                setIsProcessingExpense(false);
                setExpenseText('');
            }, 500);
            return;
        }

        try {
            const { data, error } = await supabase.functions.invoke('ai-handler', {
                body: {
                    endpoint: 'categorizeExpense',
                    prompt: expenseText,
                    categories: budgetCategories,
                }
            });
            if (error) throw error;
            const { description, amount, categoryId } = data.expenseData;
            addExpense({ description, amount, categoryId, timestamp: Date.now() });
            setExpenseText('');
        } catch (e: any) {
            setAiError(e.message || "Failed to categorize expense.");
        } finally {
            setIsProcessingExpense(false);
        }
    };
    
    const ProgressBar = ({ spent, allocated }: {spent: number, allocated: number}) => {
        const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
        const color = percentage > 100 ? '#dc3545' : percentage > 80 ? '#ffc107' : '#28a745';
        return React.createElement('div', {style: {backgroundColor: '#e9ecef', borderRadius: '8px', height: '20px', width: '100%', overflow: 'hidden'}},
            React.createElement('div', {style: {height: '100%', width: `${Math.min(percentage, 100)}%`, backgroundColor: color, borderRadius: '8px'}})
        );
    };

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('h2', { style: styles.pageHeader }, "📊 Budget Tracker"),
        
        React.createElement('section', { style: styles.section },
            React.createElement('h3', { style: styles.sectionTitle }, "Add Expense"),
            React.createElement(AIHelperWidget, {
                title: "AI-Powered Expense Entry",
                description: "Just type what you bought and we'll categorize it for you!",
                children: React.createElement('div', {style: {display: 'flex', gap: '10px'}},
                    React.createElement('input', {
                        value: expenseText,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setExpenseText(e.target.value),
                        style: styles.input,
                        placeholder: 'e.g., Groceries for $52.50 at the store'
                    }),
                    React.createElement('button', {
                        onClick: handleAddExpense,
                        disabled: isProcessingExpense,
                        style: {...styles.button, width: 'auto'}
                    }, isProcessingExpense ? React.createElement(LoadingSpinner, {message: ""}) : 'Add')
                )
            }),
            aiError && React.createElement('p', {style: styles.aiError}, aiError)
        ),
        
        React.createElement('section', { style: styles.section },
            React.createElement('div', {style: {display: 'flex', justifyContent: 'space-between', alignItems: 'center'}},
                React.createElement('h3', { style: styles.sectionTitle }, "Budget Categories"),
                React.createElement('button', {onClick: () => { setEditingCategory(null); setIsCategoryModalOpen(true); }, style: {...styles.button, width: 'auto'}}, '+ Add Category')
            ),
            budgetCategories.map(cat => {
                const spent = categorySpending[cat.id] || 0;
                return React.createElement('div', {key: cat.id, style: {...styles.listItem, flexDirection: 'column', alignItems: 'flex-start'}},
                    React.createElement('div', {style: {display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}},
                        React.createElement('h4', {style: {margin: 0}}, `${cat.icon} ${cat.name}`),
                        React.createElement('button', {onClick: () => { setEditingCategory(cat); setIsCategoryModalOpen(true); }, style: {...styles.button, ...styles.buttonSecondary, width: 'auto'}}, 'Edit')
                    ),
                    React.createElement('p', {style: {margin: '5px 0'}}, `${formatCurrency(spent)} of ${formatCurrency(cat.allocated)} spent`),
                    React.createElement(ProgressBar, {spent, allocated: cat.allocated})
                )
            })
        ),
        isCategoryModalOpen && React.createElement(CategoryModal, {onClose: () => setIsCategoryModalOpen(false), category: editingCategory})
    );
}
