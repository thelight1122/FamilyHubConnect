import React, { useState, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { formatCurrency } from '../utils/utils.ts';
import type { BudgetCategory, Expense } from '../types.ts';
import { Modal, AIHelperWidget, LoadingSpinner, ArrowLeftIcon } from '../components.tsx';

const CategoryModal: React.FC<{
    onClose: () => void;
    category?: BudgetCategory | null;
}> = ({ onClose, category }) => {
    const { addBudgetCategory, updateBudgetCategory, deleteBudgetCategory, addToast } = useAppDispatch();
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

    return (
        <Modal onClose={onClose} title={category ? 'Edit Category' : 'New Category'}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Category Name:</label>
                    <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        title="Category Name" 
                        placeholder="Enter category name" 
                    />
                </div>
                <div className="form-group"><label>Icon:</label><input value={icon} onChange={(e) => setIcon(e.target.value)} title="Icon" placeholder="Enter an icon" /></div>
                <div className="form-group">
                    <label>Monthly Budget:</label>
                    <input 
                        type='number' 
                        value={allocated} 
                        onChange={(e) => setAllocated(e.target.value)} 
                        title="Monthly Budget" 
                        placeholder="Enter allocated budget" 
                    />
                </div>
                <div className="form-actions">
                    {category && <button type='button' onClick={handleDelete} className="btn btn-danger" style={{ marginRight: 'auto' }}>Delete</button>}
                    <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                    <button type='submit' className="btn">Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default function BudgetView() {
    const { onNavigate, addExpense } = useAppDispatch();
    const { budgetCategories, expenses } = useAppState();
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
    
    const categorizeExpense = async (expenseText: string): Promise<Omit<Expense, 'id' | 'timestamp'>> => {
        const categoryNames = budgetCategories.map(c => c.name);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Categorize the following expense: "${expenseText}". The available categories are: ${categoryNames.join(', ')}.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING },
                        amount: { type: Type.NUMBER },
                        category: { type: Type.STRING, enum: categoryNames }
                    }
                }
            }
        });
        
        if (!response.text) {
            throw new Error("Response text is undefined.");
        }
        const result = JSON.parse(response.text);
        const category = budgetCategories.find(c => c.name === result.category);
        if (!category) {
            throw new Error(`AI returned an invalid category: ${result.category}`);
        }
        return {
            description: result.description,
            amount: result.amount,
            categoryId: category.id,
        };
    };
    
    const handleAddExpense = async () => {
        if (!expenseText.trim()) return;
        if (budgetCategories.length === 0) {
            setAiError("Please create at least one budget category before adding an expense.");
            return;
        }
        setIsProcessingExpense(true);
        setAiError(null);

        try {
            const expenseData = await categorizeExpense(expenseText);
            addExpense({ ...expenseData, timestamp: Date.now() });
            setExpenseText('');
        } catch (e: any) {
            setAiError(e.message || "Failed to categorize expense.");
        } finally {
            setIsProcessingExpense(false);
        }
    };
    
    const ProgressBar = ({ spent, allocated }: {spent: number, allocated: number}) => {
        const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
        const color = percentage > 100 ? 'var(--danger)' : percentage > 80 ? 'var(--warning)' : 'var(--success)';
        return (
            <div style={{backgroundColor: '#e9ecef', borderRadius: '8px', height: '20px', width: '100%', overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${Math.min(percentage, 100)}%`, backgroundColor: color, borderRadius: '8px'}} />
            </div>
        );
    };

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" title="Go back to finance" onClick={() => onNavigate('finance')}>
                    <ArrowLeftIcon />
                </button>
                <h2>📊 Budget Tracker</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <section className="card">
                    <h3>Add Expense</h3>
                    <AIHelperWidget
                        title="AI-Powered Expense Entry"
                        description="Just type what you bought and we'll categorize it for you!"
                    >
                        <div style={{display: 'flex', gap: '10px'}}>
                            <input
                                value={expenseText}
                                onChange={(e) => setExpenseText(e.target.value)}
                                placeholder="e.g., Groceries for $52.50 at the store"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddExpense()}
                            />
                            <button
                                onClick={handleAddExpense}
                                disabled={isProcessingExpense}
                                className="btn w-auto"
                            >
                                {isProcessingExpense ? <LoadingSpinner message="" /> : 'Add'}
                            </button>
                        </div>
                    </AIHelperWidget>
                    {aiError && <p className="ai-error">{aiError}</p>}
                </section>
                
                <section className="card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3>Budget Categories</h3>
                        <button onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }} className="btn w-auto">+ Add Category</button>
                    </div>
                    {budgetCategories.map(cat => {
                        const spent = categorySpending[cat.id] || 0;
                        return (
                            <div key={cat.id} className="list-item" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                                    <h4 style={{margin: 0}}>{`${cat.icon} ${cat.name}`}</h4>
                                    <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="btn btn-secondary btn-sm">Edit</button>
                                </div>
                                <p style={{margin: '5px 0'}}>{`${formatCurrency(spent)} of ${formatCurrency(cat.allocated)} spent`}</p>
                                <ProgressBar spent={spent} allocated={cat.allocated} />
                            </div>
                        )
                    })}
                </section>
                {isCategoryModalOpen && <CategoryModal onClose={() => setIsCategoryModalOpen(false)} category={editingCategory} />}
            </main>
        </div>
    );
}