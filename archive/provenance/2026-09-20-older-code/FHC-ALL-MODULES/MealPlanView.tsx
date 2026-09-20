import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from './AppContext';
import { ArrowLeftIcon, BottomNavbar, Modal } from './components';
import { styles } from './styles';
import { Meal, DailyMeals } from './types';

// Helper to get the start of the week (Monday)
const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
};

const MealPlanView = () => {
    const { onNavigate, personalizationData, onSavePersonalization, addToast, profiles } = useAppContext();
    const mealPlans = personalizationData.mealPlans || {};
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState<{ date: string; mealType: keyof DailyMeals; } | null>(null);
    const [mealInput, setMealInput] = useState('');
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
    const [hoveredSlot, setHoveredSlot] = useState<{ date: string; mealType: keyof DailyMeals; } | null>(null);

    const startOfWeek = useMemo(() => getStartOfWeek(currentDate), [currentDate]);

    const handlePrevWeek = () => {
        const newDate = new Date(startOfWeek);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(startOfWeek);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const weekDays = useMemo(() => {
        const days = [];
        const date = new Date(startOfWeek);
        for (let i = 0; i < 7; i++) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [startOfWeek]);

    const handleOpenModal = (date: Date, mealType: keyof DailyMeals) => {
        const dateKey = formatDateKey(date);
        const meal = mealPlans[dateKey]?.[mealType];
        setMealInput(meal?.name || '');
        setEditingSlot({ date: dateKey, mealType });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSlot(null);
        setMealInput('');
    };

    const handleSaveMeal = () => {
        if (!editingSlot) return;

        const { date, mealType } = editingSlot;
        const updatedMealPlans = JSON.parse(JSON.stringify(mealPlans));

        if (!updatedMealPlans[date]) {
            updatedMealPlans[date] = {};
        }

        if (mealInput.trim() === '') {
            delete updatedMealPlans[date][mealType];
        } else {
            const mealData: Meal = {
                id: updatedMealPlans[date]?.[mealType]?.id || `meal_${Date.now()}`,
                name: mealInput.trim(),
            };
            updatedMealPlans[date][mealType] = mealData;
        }

        onSavePersonalization({ mealPlans: updatedMealPlans });
        addToast('Meal plan updated!', 'badge');
        handleCloseModal();
    };

    const handleGenerateSuggestion = async () => {
        if (!editingSlot || !process.env.API_KEY) {
            addToast("API Key is not configured.", 'info');
            return;
        }
        setIsLoadingSuggestion(true);
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const familyInfo = profiles.map(p => `${p.name} (${p.role}, age ${p.age || 'N/A'})`).join(', ');
            const prompt = `Suggest a simple and tasty ${editingSlot.mealType} idea for a family.
            The family members are: ${familyInfo}.
            The family motto is: "${personalizationData.motto || 'None'}".
            Please provide just the name of the meal, no extra text or description. For example: "Chicken and Vegetable Stir-fry".`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setMealInput(response.text.trim().replace(/"/g, ''));

        } catch (error) {
            console.error("Error generating meal suggestion:", error);
            addToast("Couldn't generate a suggestion. Please try again.", 'info');
        } finally {
            setIsLoadingSuggestion(false);
        }
    };
    
    return (
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <button style={{...styles.navButton, flexShrink: 0, width: 40}} onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2 style={styles.pageHeader}>🍽️ Meal Planner</h2>
                <div style={{flexShrink: 0, width: 40}}></div>
            </header>
            <main style={styles.mainContent}>
                <div style={{...styles.section, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px 15px'}}>
                    <button onClick={handlePrevWeek} style={{...styles.button, padding: '8px 16px'}} aria-label="Previous week">&lt; Prev</button>
                    <h3 style={{margin: 0, textAlign: 'center'}}>Week of {startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
                    <button onClick={handleNextWeek} style={{...styles.button, padding: '8px 16px'}} aria-label="Next week">Next &gt;</button>
                </div>

                <div style={styles.weekGrid}>
                    {weekDays.map(day => {
                        const dateKey = formatDateKey(day);
                        const dayMeals = mealPlans[dateKey] || {};
                        return (
                            <div key={dateKey} style={styles.dayColumn}>
                                <div style={styles.dayHeader}>
                                    <div style={{fontWeight: 'bold'}}>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    <div style={{fontSize: '0.9em', color: '#6c757d'}}>{day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                </div>
                                {(['breakfast', 'lunch', 'dinner'] as const).map(mealType => {
                                    const isHovered = hoveredSlot?.date === dateKey && hoveredSlot.mealType === mealType;
                                    const mealSlotStyle: React.CSSProperties = { ...styles.mealSlot };

                                    if(isHovered && !dayMeals[mealType]) {
                                        mealSlotStyle.backgroundColor = '#f0f2f5';
                                    }

                                    return (
                                        <div 
                                            key={mealType} 
                                            style={mealSlotStyle} 
                                            onClick={() => handleOpenModal(day, mealType)} 
                                            role="button" 
                                            tabIndex={0} 
                                            onKeyPress={(e) => e.key === 'Enter' && handleOpenModal(day, mealType)}
                                            onMouseEnter={() => setHoveredSlot({ date: dateKey, mealType })}
                                            onMouseLeave={() => setHoveredSlot(null)}
                                        >
                                            <div style={styles.mealType}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</div>
                                            <div style={styles.mealName}>
                                                {dayMeals[mealType]?.name || <span style={styles.addMeal as React.CSSProperties}>+</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </main>

            {isModalOpen && editingSlot && (
                <Modal onClose={handleCloseModal} title={`Plan for ${editingSlot.mealType}`}>
                    <div style={styles.formGroup}>
                        <label htmlFor="meal-input" style={styles.label}>{new Date(editingSlot.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</label>
                        <textarea id="meal-input" style={{...styles.textarea, minHeight: '80px'}} value={mealInput} onChange={e => setMealInput(e.target.value)} placeholder="Enter meal name or clear to remove" />
                    </div>
                    <div style={{...styles.formActions, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                         <button onClick={handleGenerateSuggestion} disabled={isLoadingSuggestion} style={{...styles.button, ...styles.buttonSecondary}}>
                            {isLoadingSuggestion ? '🧠 Thinking...' : '🤖 Suggest with AI'}
                        </button>
                        <div>
                            <button onClick={handleCloseModal} style={{...styles.button, ...styles.buttonSecondary, marginRight: '10px'}}>Cancel</button>
                            <button onClick={handleSaveMeal} style={styles.button}>Save</button>
                        </div>
                    </div>
                </Modal>
            )}
            <BottomNavbar activePage="mealPlan" onNavigate={onNavigate} />
        </div>
    );
};

export default MealPlanView;