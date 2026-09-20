
import React from 'react';
import { useAppDispatch } from '../AppContext';
import { ArrowLeftIcon, BottomNavbar } from '../components';

const MarketSimView = () => {
    const { onNavigate } = useAppDispatch();

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('finance')}>
                    <ArrowLeftIcon />
                </button>
                <h2>📈 Market Simulator</h2>
                <div className="header-placeholder"></div>
            </header>
            <main className="main">
                <div className="card">
                    <p>This feature is coming soon!</p>
                </div>
            </main>
            <BottomNavbar activePage="marketSim" onNavigate={onNavigate} />
        </div>
    );
};

export default MarketSimView;
