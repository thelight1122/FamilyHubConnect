import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components.tsx';

export default function MealPlanView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('theFridge')}>
                    <ArrowLeftIcon />
                </button>
                <h2>📅 Weekly Meal Plan</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to plan your weekly meals is coming soon!"
                />
            </main>
            <BottomNavbar activePage="mealPlan" onNavigate={onNavigate} />
        </div>
    );
}