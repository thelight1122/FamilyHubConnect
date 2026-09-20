
import React from 'react';
import { useAppDispatch } from '../AppContext';
import { EmptyState, ArrowLeftIcon, BottomNavbar } from '../components';

export default function ShoppingListView() {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🛒 Shopping List</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <EmptyState
                    icon="🚧"
                    title="Under Construction"
                    message="This feature is currently being rebuilt."
                />
            </main>
            <BottomNavbar activePage="shoppingList" onNavigate={onNavigate} />
        </div>
    );
}
