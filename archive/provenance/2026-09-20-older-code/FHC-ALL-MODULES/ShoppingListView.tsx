import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { ShoppingListItem } from './types';

const ShoppingListView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, addToast } = useAppContext();
    const allItems = useMemo(() => personalizationData.shoppingListItems || [], [personalizationData.shoppingListItems]);

    const [newItemName, setNewItemName] = useState('');
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
    const [suggestionInput, setSuggestionInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        const newItem: ShoppingListItem = {
            id: `sli_${Date.now()}`,
            name: newItemName.trim(),
            category: 'General', // Default category for manual adds
            isComplete: false,
        };

        const updatedItems = [...allItems, newItem];
        onSavePersonalization({ shoppingListItems: updatedItems });
        setNewItemName('');
    };

    const handleToggleComplete = (itemId: string) => {
        const updatedItems = allItems.map(item =>
            item.id === itemId ? { ...item, isComplete: !item.isComplete } : item
        );
        onSavePersonalization({ shoppingListItems: updatedItems });
    };

    const handleDeleteItem = (itemId: string) => {
        const updatedItems = allItems.filter(item => item.id !== itemId);
        onSavePersonalization({ shoppingListItems: updatedItems });
    };

    const handleClearCompleted = () => {
        const remainingItems = allItems.filter(item => !item.isComplete);
        onSavePersonalization({ shoppingListItems: remainingItems });
        addToast('Cleared completed items!', 'badge');
    };

    const handleGenerateSuggestions = async () => {
        if (!suggestionInput.trim() || !process.env.API_KEY) {
            addToast('Please enter what you plan to cook.', 'info');
            return;
        }
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const prompt = `Based on this meal plan: "${suggestionInput}", generate a shopping list. Group items by category (e.g., Produce, Dairy, Meat, Pantry, Household). Respond with ONLY a JSON object like this: {"Produce": ["Tomatoes", "Onions"], "Meat": ["Ground Beef (1lb)"]}. Do not include any other text or markdown.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const jsonString = response.text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
            const suggestedData = JSON.parse(jsonString);

            const newItems: ShoppingListItem[] = [];
            for (const category in suggestedData) {
                for (const itemName of suggestedData[category]) {
                    newItems.push({
                        id: `sli_${Date.now()}_${Math.random()}`,
                        name: itemName,
                        category: category,
                        isComplete: false,
                    });
                }
            }

            if (newItems.length > 0) {
                const updatedItems = [...allItems, ...newItems];
                onSavePersonalization({ shoppingListItems: updatedItems });
                addToast(`${newItems.length} items added from your meal plan!`, 'badge');
                setIsSuggestModalOpen(false);
                setSuggestionInput('');
            } else {
                addToast('Could not generate items. Please try a different description.', 'info');
            }

        } catch (error) {
            console.error("Error generating shopping list:", error);
            addToast("Failed to get suggestions. The AI might be busy!", 'info');
        } finally {
            setIsLoading(false);
        }
    };

    const groupedItems = useMemo(() => {
        const sortedItems = [...allItems].sort((a, b) => (a.isComplete ? 1 : -1) - (b.isComplete ? 1 : -1));
        return sortedItems.reduce((acc, item) => {
            const category = item.category || 'General';
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        }, {} as { [key: string]: ShoppingListItem[] });
    }, [allItems]);
    
    const categoryOrder = ['Produce', 'Meat', 'Dairy', 'Bakery', 'Pantry', 'Frozen', 'Household', 'General'];
    const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>🛒 Shopping List</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <section style={styles.section}>
                    <form style={styles.addItemForm} onSubmit={handleAddItem}>
                        <input
                            type="text"
                            style={{...styles.input, ...styles.addItemInput}}
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="e.g., Eggs, Milk, Bread"
                        />
                        <button type="submit" style={{...styles.button, padding: '12px 16px'}}>Add</button>
                    </form>
                    <div style={styles.listActions}>
                        <button onClick={() => setIsSuggestModalOpen(true)} style={{...styles.button, ...styles.buttonSecondary, flex: 1}}>🤖 Suggest with AI</button>
                        <button onClick={handleClearCompleted} style={{...styles.button, ...styles.buttonDanger, flex: 1}}>Clear Completed</button>
                    </div>
                </section>

                {sortedCategories.map(category => (
                    <div key={category}>
                        <h3 style={styles.categoryHeader}>{category}</h3>
                        <div style={styles.listContainer}>
                            {groupedItems[category].map(item => (
                                <div key={item.id} style={styles.listItem}>
                                    <input
                                        type="checkbox"
                                        style={styles.checkbox}
                                        checked={item.isComplete}
                                        onChange={() => handleToggleComplete(item.id)}
                                        aria-labelledby={`item-name-${item.id}`}
                                    />
                                    <span id={`item-name-${item.id}`} style={{...styles.listItemName, ...(item.isComplete ? styles.listItemCompleted : {})}}>{item.name}</span>
                                    <button
                                        style={styles.deleteItemButton}
                                        onClick={() => handleDeleteItem(item.id)}
                                        aria-label={`Delete ${item.name}`}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {allItems.length === 0 && (
                    <div style={styles.section}>
                        <p>Your shopping list is empty. Add an item or use the AI suggestion tool to get started!</p>
                    </div>
                )}
            </main>

            {isSuggestModalOpen && (
                 <Modal onClose={() => setIsSuggestModalOpen(false)} title="Suggest Shopping List">
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="suggestion-input">What are you planning to cook?</label>
                        <textarea
                            id="suggestion-input"
                            style={styles.textarea}
                            value={suggestionInput}
                            onChange={e => setSuggestionInput(e.target.value)}
                            placeholder="e.g., Tacos for Tuesday, spaghetti bolognese for Friday..."
                        />
                    </div>
                    <div style={styles.formActions}>
                        <button onClick={() => setIsSuggestModalOpen(false)} style={{...styles.button, ...styles.buttonSecondary}}>Cancel</button>
                        <button onClick={handleGenerateSuggestions} style={styles.button} disabled={isLoading}>
                            {isLoading ? '🧠 Thinking...' : 'Generate List'}
                        </button>
                    </div>
                </Modal>
            )}

            <BottomNavbar activePage="shoppingList" onNavigate={onNavigate} />
        </div>
    );
};

export default ShoppingListView;