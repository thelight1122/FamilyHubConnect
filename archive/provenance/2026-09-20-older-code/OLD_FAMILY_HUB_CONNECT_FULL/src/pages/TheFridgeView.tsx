
import React from 'react';
import type { PageView } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import HubTile from '../components/ui/HubTile';

export default function TheFridgeView() {
    const { onNavigate } = useAppContext();

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: () => onNavigate('dashboard'),
                style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' },
                'aria-label': "Back to Dashboard"
            }, "← Back to Dashboard"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "🧊 The Fridge"),

            React.createElement('div', { style: styles.hubGrid },
                React.createElement(HubTile, {
                    icon: '📅',
                    title: 'Weekly Meal Plan',
                    description: 'Plan your breakfasts, lunches, and dinners for the upcoming week.',
                    onClick: () => onNavigate('mealPlan')
                }),
                React.createElement(HubTile, {
                    icon: '🧠',
                    title: 'AI Meal Suggestions',
                    description: 'Get creative, AI-powered meal ideas based on your preferences or pantry items.',
                    onClick: () => onNavigate('mealSuggestions')
                }),
                React.createElement(HubTile, {
                    icon: '🍳',
                    title: 'My Recipe Book',
                    description: 'Browse your collection of saved family recipes.',
                    onClick: () => onNavigate('recipeBook')
                }),
                React.createElement(HubTile, {
                    icon: '🥫',
                    title: 'Pantry Inventory',
                    description: 'Keep track of what you have in stock to make shopping easier.',
                    onClick: () => onNavigate('pantry')
                })
            )
        )
    );
}
