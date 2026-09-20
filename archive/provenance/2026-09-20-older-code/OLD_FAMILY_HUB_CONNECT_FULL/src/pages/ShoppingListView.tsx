

import React, { useState, useMemo } from 'react';
import type { PageView, ShoppingListItem, Profile, ToastMessage, PersonalizationData } from '../types/index';
import { styles } from '../styles/index';
import Modal from '../components/ui/Modal';
import { supabase } from '../services/supabaseClient';
import { useAppContext } from '../contexts/AppContext';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ShoppingListView() {
    const { 
        shoppingListItems, addShoppingListItem, updateShoppingListItem, deleteShoppingListItem, clearPurchasedItems,
        addToast, currentViewingProfile, personalizationData, IS_TESTING_MODE
    } = useAppContext();
    const [newItemName, setNewItemName] = useState('');

    // State for editing items
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);
    const [editItemName, setEditItemName] = useState('');
    const [editItemQuantity, setEditItemQuantity] = useState('1');
    
    // State for AI list generation
    const [isAiHelperOpen, setIsAiHelperOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGeneratingList, setIsGeneratingList] = useState(false);
    const [generatedList, setGeneratedList] = useState<Record<string, string[]> | null>(null);
    const [aiListError, setAiListError] = useState<string | null>(null);

    // State for AI organization
    const [isOrganizing, setIsOrganizing] = useState(false);
    const [categorizedItems, setCategorizedItems] = useState<Record<string, ShoppingListItem[]> | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

    const handleAddItem = async (event: React.FormEvent) => {
        event.preventDefault();
        const trimmedName = newItemName.trim();
        if (!trimmedName) {
            addToast("Item name cannot be empty.", 'info');
            return;
        }
        if (!currentViewingProfile || !personalizationData) {
            addToast("Cannot add item: User profile not available.", 'info');
            return;
        }
        
        const existingItem = shoppingListItems.find(
            item => !item.isChecked && item.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (existingItem) {
            await updateShoppingListItem(existingItem.id, { quantity: existingItem.quantity + 1 });
            addToast(`Increased quantity for "${existingItem.name}".`, 'info', '➕');
        } else {
            const newItem: Omit<ShoppingListItem, 'id' | 'family_id'> = {
                name: trimmedName,
                addedBy: currentViewingProfile.id,
                isChecked: false,
                quantity: 1,
            };
            await addShoppingListItem(newItem);
            addToast(`"${trimmedName}" added to shopping list.`, 'info', '🛍️');
        }
        
        setCategorizedItems(null);
        setNewItemName('');
    };

    const handleToggleItem = async (itemId: string) => {
        const item = shoppingListItems.find(i => i.id === itemId);
        if (!item) return;
        const newCheckedStatus = !item.isChecked;
        await updateShoppingListItem(itemId, { isChecked: newCheckedStatus });
        addToast(
            `"${item.name}" ${newCheckedStatus ? 'marked as purchased' : 'added back to list'}.`,
            'info',
            newCheckedStatus ? '✔️' : '↪️'
        );
        setCategorizedItems(null);
    };

    const handleDeleteItem = async (itemId: string, itemName: string) => {
        if (window.confirm(`Are you sure you want to delete "${itemName}" from the shopping list?`)) {
            await deleteShoppingListItem(itemId);
            addToast(`"${itemName}" removed from shopping list.`, 'info', '🗑️');
            setCategorizedItems(null);
        }
    };
    
    // --- Edit Item Logic ---
    const handleOpenEditModal = (item: ShoppingListItem) => {
        setEditingItem(item);
        setEditItemName(item.name);
        setEditItemQuantity(String(item.quantity));
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveChanges = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!editingItem) return;

        const newName = editItemName.trim();
        const newQuantity = parseInt(editItemQuantity, 10);

        if (!newName) { addToast("Item name cannot be empty.", 'info'); return; }
        if (isNaN(newQuantity) || newQuantity < 1) { addToast("Quantity must be at least 1.", 'info'); return; }

        await updateShoppingListItem(editingItem.id, { name: newName, quantity: newQuantity });
        setCategorizedItems(null);
        addToast(`"${newName}" updated.`, 'info');
        handleCloseEditModal();
    };


    const handleClearPurchased = async () => {
        const hasCheckedItems = shoppingListItems.some(item => item.isChecked);
        if (!hasCheckedItems) {
            addToast("No purchased items to clear.", 'info');
            return;
        }
        if (window.confirm("Are you sure you want to clear all purchased items? This will also add them to your pantry.")) {
            await clearPurchasedItems();
            setCategorizedItems(null);
            addToast("Purchased items cleared and added to pantry.", 'info', '✨');
        }
    };
    
    const handleCompileAndCopy = async () => {
        const listToCopy = uncheckedItems.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
        if (!listToCopy) { addToast("Nothing to copy!", 'info'); return; }
        await navigator.clipboard.writeText("Shopping List:\n" + listToCopy);
        addToast("Shopping list copied to clipboard!", 'info', '📋');
    };

    const { checkedItems, uncheckedItems } = useMemo(() => {
        const checked: ShoppingListItem[] = [];
        const unchecked: ShoppingListItem[] = [];
        shoppingListItems.forEach(item => {
            if (item.isChecked) {
                checked.push(item);
            } else {
                unchecked.push(item);
            }
        });
        return { checkedItems: checked, uncheckedItems: unchecked };
    }, [shoppingListItems]);

    // AI Organization Logic
    const handleOrganizeList = async () => {
        if (uncheckedItems.length === 0) {
            addToast("Add some items to the list before organizing.", 'info');
            return;
        }
        setIsOrganizing(true);
        setAiError(null);
        setCategorizedItems(null);

        if (IS_TESTING_MODE) {
            setTimeout(() => {
                const mockCategorized: Record<string, ShoppingListItem[]> = {
                    "Produce": uncheckedItems.filter((_, i) => i % 2 === 0),
                    "Pantry": uncheckedItems.filter((_, i) => i % 2 !== 0),
                };
                setCategorizedItems(mockCategorized);
                setIsOrganizing(false);
            }, 500);
            return;
        }

        const itemList = uncheckedItems.map(item => item.name).join(', ');
        const prompt = `Organize the following shopping list items into categories: ${itemList}.`;
        const systemInstruction = `Provide the output as a JSON object where keys are category names (e.g., "Produce", "Dairy & Eggs", "Meat & Seafood", "Pantry", "Frozen", "Bakery", "Household", "Other") and values are arrays of the item names that belong to that category. Only include categories that have items from the list. Example: {"Produce": ["Apples", "Bananas"], "Dairy & Eggs": ["Milk", "Cheese"]}`;

        try {
            const { data, error } = await supabase.functions.invoke('ai-handler', {
                body: { endpoint: 'generateJson', prompt, systemInstruction }
            });
            if (error) throw error;
            
            const categorizedNames = JSON.parse(data.text) as Record<string, string[]>;
            const finalCategorizedItems: Record<string, ShoppingListItem[]> = {};
            
            Object.entries(categorizedNames).forEach(([category, names]) => {
                finalCategorizedItems[category] = (names as string[]).map(name => 
                    uncheckedItems.find(item => item.name.toLowerCase() === name.toLowerCase())!
                ).filter(Boolean); // Filter out any potential mismatches
            });
            
            // Handle items AI might have missed
            const allCategorizedItems = Object.values(finalCategorizedItems).flat();
            const uncategorized = uncheckedItems.filter(item => !allCategorizedItems.some(ci => ci.id === item.id));
            if (uncategorized.length > 0) {
                finalCategorizedItems['Other'] = [...(finalCategorizedItems['Other'] || []), ...uncategorized];
            }

            setCategorizedItems(finalCategorizedItems);
            addToast("List organized!", 'info', '🧠');
        } catch (error: any) {
            setAiError(error.message || "Could not organize the list.");
        } finally {
            setIsOrganizing(false);
        }
    };
    
    const handleGenerateListFromPrompt = async () => {
        if (!aiPrompt.trim()) return;
        setIsGeneratingList(true);
        setAiListError(null);
        setGeneratedList(null);

        if (IS_TESTING_MODE) {
            setTimeout(() => {
                setGeneratedList({
                    "Mock Category 1": ["Suggested Item A", "Suggested Item B"],
                    "Mock Category 2": ["Suggested Item C"],
                });
                setIsGeneratingList(false);
            }, 500);
            return;
        }

        try {
            const { data, error } = await supabase.functions.invoke('ai-handler', {
                body: {
                    endpoint: 'generateShoppingList',
                    prompt: aiPrompt,
                }
            });
            if (error) throw error;
            setGeneratedList(data.list as Record<string, string[]>);
        } catch (e: any) {
            setAiListError(e.message || "Failed to generate list.");
        } finally {
            setIsGeneratingList(false);
        }
    };

    const handleAddFromAi = (name: string) => {
        if (!currentViewingProfile) return;
        addShoppingListItem({ name, addedBy: currentViewingProfile.id, isChecked: false, quantity: 1 });
        addToast(`Added "${name}" to your list.`, 'info');
    };
    
    const handleAddAllFromAi = () => {
        if (!generatedList || !currentViewingProfile) return;
        Object.values(generatedList).flat().forEach(name => {
            addShoppingListItem({ name, addedBy: currentViewingProfile.id, isChecked: false, quantity: 1 });
        });
        addToast(`All suggested items added to your list.`, 'info');
    };

    const renderListItem = (item: ShoppingListItem) => (
         React.createElement('li', { key: item.id, style: {...styles.shoppingListItem, backgroundColor: item.isChecked ? '#f0f0f0' : 'var(--section-bg, #fff)', opacity: item.isChecked ? 0.7 : 1}, 'aria-labelledby': `item-name-${item.id}` },
            React.createElement('div', { style: styles.shoppingListItemDetails },
                React.createElement('input', {
                    type: "checkbox",
                    checked: item.isChecked,
                    onChange: () => handleToggleItem(item.id),
                    style: styles.checkbox,
                    'aria-label': `Mark ${item.name} as ${item.isChecked ? 'needed' : 'purchased'}`
                }),
                React.createElement('div', { id: `item-name-${item.id}`, style: { textDecoration: item.isChecked ? 'line-through' : 'none'}},
                    React.createElement('span', { style: styles.shoppingListItemName }, `${item.name}`),
                    React.createElement('span', { style: { color: '#666', marginLeft: '8px' } }, `(x${item.quantity})`),
                )
            ),
             React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '10px'} },
                !item.isChecked && React.createElement('button', {
                    onClick: () => handleOpenEditModal(item),
                    style: {...styles.button, ...styles.buttonSecondary, width: 'auto', padding: '5px 10px', fontSize: '0.9em'},
                    'aria-label': `Edit item ${item.name}`
                }, "Edit"),
                React.createElement('button', {
                    onClick: () => handleDeleteItem(item.id, item.name),
                    style: {...styles.buttonDanger, width: 'auto', padding: '5px 10px', fontSize: '0.9em'},
                    'aria-label': `Delete item ${item.name}`
                }, "Delete")
            )
        )
    );

    const renderOrganizedList = () => {
        if (!categorizedItems) return null;
        return React.createElement('div', null,
            Object.entries(categorizedItems).map(([category, items]) => {
                if (items.length === 0) return null;
                const isCollapsed = collapsedCategories[category];
                return React.createElement('div', { key: category, style: { marginBottom: '10px' } },
                    React.createElement('h4', {
                        style: styles.shoppingListCategoryHeader,
                        onClick: () => setCollapsedCategories(prev => ({...prev, [category]: !prev[category]}))
                    },
                         `${category} (${items.length})`,
                         React.createElement('span', {style: {transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'}}, '▼')
                    ),
                    !isCollapsed && React.createElement('ul', { style: {...styles.shoppingListCategoryItems, listStyle: 'none', padding: '0 0 0 15px'} }, items.map(renderListItem))
                );
            })
        );
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('h2', { style: styles.pageHeader }, "🛒 Shared Shopping List"),

            React.createElement('form', { 
                onSubmit: handleAddItem, 
                style: {display: 'flex', gap: '10px', marginBottom: '20px'},
                'aria-labelledby': "add-shopping-item-title"
            },
                React.createElement('h3', { id: "add-shopping-item-title", style: { ...styles.sectionTitle, display: 'none'} }, "Add New Item"),
                React.createElement('input', {
                    type: "text",
                    value: newItemName,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewItemName(e.target.value),
                    placeholder: "Enter item name...",
                    style: {...styles.input, flexGrow: 1},
                    'aria-label': "New shopping item name"
                }),
                React.createElement('button', { type: "submit", style: {...styles.button, width: 'auto'}, 'aria-label': "Add item to shopping list" }, "Add Item")
            ),
            
             React.createElement('div', { style: {display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '-10px', marginBottom: '20px', flexWrap: 'wrap'} },
                isOrganizing ? React.createElement('p', {style: styles.loadingMessage}, 'Organizing...')
                : React.createElement('button', {
                    onClick: categorizedItems ? () => setCategorizedItems(null) : handleOrganizeList,
                    style: {...styles.button, ...styles.buttonWarning, width: 'auto'}
                  }, categorizedItems ? '↩️ Show Unorganized' : '🧠 Organize List'),
                React.createElement('button', {
                    onClick: () => setIsAiHelperOpen(true),
                    style: { ...styles.button, backgroundColor: '#5cb85c', width: 'auto' }
                }, "🤖 AI Shopping Helper"),
                uncheckedItems.length > 0 &&
                    React.createElement('button', {
                        onClick: handleCompileAndCopy,
                        style: {...styles.button, ...styles.buttonInfo, width: 'auto'}
                    }, "📋 Compile for Sharing"),
                shoppingListItems.some(item => item.isChecked) &&
                    React.createElement('button', {
                        onClick: handleClearPurchased,
                        style: {...styles.button, ...styles.buttonSecondary, width: 'auto'}
                    }, "✨ Clear Purchased Items")
             ),

            aiError && React.createElement('p', {style: styles.aiError}, aiError),

            (uncheckedItems.length === 0 && checkedItems.length === 0) ? (
                React.createElement(EmptyState, {
                    icon: "🛒",
                    title: "Shopping List is Empty",
                    message: "Add some items above or use the AI helper to get started!",
                })
            ) : (
                React.createElement('div', { 'aria-label': "Shopping items" },
                    categorizedItems ? renderOrganizedList() : uncheckedItems.map(renderListItem),
                    checkedItems.length > 0 && uncheckedItems.length > 0 && React.createElement('hr', { style: { margin: '20px 0', borderTop: '1px solid #ccc'} }),
                    checkedItems.length > 0 && React.createElement(React.Fragment, null,
                        React.createElement('h4', { style: styles.shoppingListCategoryHeader }, `Purchased (${checkedItems.length})`),
                        checkedItems.map(renderListItem)
                    )
                )
            ),
            
            React.createElement(Modal, {
                isOpen: isEditModalOpen,
                onClose: handleCloseEditModal,
                title: "Edit Item",
                children: React.createElement('form', { onSubmit: handleSaveChanges },
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'editItemName', style: styles.label }, 'Item Name:'),
                        React.createElement('input', {
                            id: 'editItemName',
                            type: 'text',
                            style: styles.input,
                            value: editItemName,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEditItemName(e.target.value),
                            required: true
                        })
                    ),
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'editItemQuantity', style: styles.label }, 'Quantity:'),
                        React.createElement('input', {
                            id: 'editItemQuantity',
                            type: 'number',
                            style: styles.input,
                            value: editItemQuantity,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEditItemQuantity(e.target.value),
                            required: true,
                            min: 1
                        })
                    ),
                    React.createElement('div', { style: styles.modalActions },
                        React.createElement('button', { type: 'button', style: {...styles.button, ...styles.buttonSecondary, width: 'auto'}, onClick: handleCloseEditModal }, 'Cancel'),
                        React.createElement('button', { type: 'submit', style: {...styles.button, width: 'auto'} }, 'Save Changes')
                    )
                )
            }),
            
             React.createElement(Modal, {
                isOpen: isAiHelperOpen,
                onClose: () => setIsAiHelperOpen(false),
                title: "🤖 AI Shopping Helper",
                contentStyle: { maxWidth: '600px' },
                children: React.createElement('div', null,
                    React.createElement('div', { style: styles.formGroup },
                        React.createElement('label', { htmlFor: 'aiPrompt', style: styles.label }, 'What do you need a list for?'),
                        React.createElement('input', {
                            id: 'aiPrompt',
                            style: styles.input,
                            value: aiPrompt,
                            onChange: e => setAiPrompt(e.target.value),
                            placeholder: 'e.g., "Taco night for 4 people"'
                        })
                    ),
                    React.createElement('button', { style: styles.button, onClick: handleGenerateListFromPrompt, disabled: isGeneratingList },
                        isGeneratingList ? "Generating..." : "Generate List"
                    ),
                    isGeneratingList && React.createElement(LoadingSpinner, { message: "" }),
                    aiListError && React.createElement('p', { style: styles.aiError }, aiListError),
                    generatedList && React.createElement('div', { style: styles.aiShoppingSuggestionContainer },
                        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center'} },
                            React.createElement('h4', { style: styles.sectionTitle }, "Suggested Items"),
                            React.createElement('button', { style: {...styles.button, width: 'auto', backgroundColor: '#5cb85c'}, onClick: handleAddAllFromAi }, 'Add All')
                        ),
                        Object.entries(generatedList).map(([category, items]) => (
                            React.createElement('div', { key: category, style: styles.aiShoppingCategory },
                                React.createElement('h5', { style: styles.aiShoppingCategoryTitle }, category),
                                React.createElement('div', { style: styles.aiShoppingItemList },
                                    items.map((item: string, index: number) => (
                                        React.createElement('div', { key: index, style: styles.aiShoppingItem },
                                            React.createElement('span', null, item),
                                            React.createElement('button', { style: {...styles.button, width: 'auto', padding: '5px 10px', fontSize: '0.8em'}, onClick: () => handleAddFromAi(item) }, 'Add')
                                        )
                                    ))
                                )
                            )
                        ))
                    )
                )
            })
        )
    );
}
