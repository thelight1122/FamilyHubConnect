import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components.tsx';

export default function MealSuggestionView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('theFridge')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🧠 AI Meal Suggestions</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to get AI-powered meal ideas is coming soon!"
                />
            </main>
            <BottomNavbar activePage="mealSuggestions" onNavigate={onNavigate} />
        </div>
    );
}