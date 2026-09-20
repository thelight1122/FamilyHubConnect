
import React from 'react';
import { useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components';

export default function RecipeBookView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('theFridge')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🍳 My Recipe Book</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🏗️"
                    title="Under Construction"
                    message="This feature to store and browse your favorite recipes is coming soon!"
                />
            </main>
            <BottomNavbar activePage="recipeBook" onNavigate={onNavigate} />
        </div>
    );
}
