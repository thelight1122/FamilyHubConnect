import React from 'react';
import type { PageView } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import HubTile from '../components/ui/HubTile';

export default function FinanceView() {
    const { onNavigate } = useAppContext();

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: () => onNavigate('dashboard'),
                style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' },
                'aria-label': "Back to Dashboard"
            }, "← Back to Dashboard"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "💸 Finance Hub"),
            React.createElement('p', { style: { textAlign: 'center', color: '#666', marginTop: '-15px', marginBottom: '25px' } }, "Manage all your family's financial matters here."),

            React.createElement('div', { style: styles.hubGrid },
                React.createElement(HubTile, {
                    icon: '💰',
                    title: 'Allowances & Wallets',
                    description: 'View individual balances, manage savings goals, and approve spending requests.',
                    onClick: () => onNavigate('allowance')
                }),
                React.createElement(HubTile, {
                    icon: '📊',
                    title: 'Family Budget',
                    description: 'Set monthly budgets for categories like groceries and entertainment and track spending.',
                    onClick: () => onNavigate('budget')
                }),
                React.createElement(HubTile, {
                    icon: '🏦',
                    title: 'Family Bank',
                    description: 'Manage loans and investments within the family to teach financial principles.',
                    onClick: () => onNavigate('familyBank')
                }),
                 React.createElement(HubTile, {
                    icon: '📱',
                    title: 'Screen Time Bank',
                    description: 'Allow kids to earn and spend screen time minutes as a reward.',
                    onClick: () => onNavigate('screenTimeBank')
                }),
                 React.createElement(HubTile, {
                    icon: '📈',
                    title: 'Market Simulator',
                    description: 'A fun, safe way for kids to learn about the stock market with play money.',
                    onClick: () => onNavigate('marketSim')
                }),
                 React.createElement(HubTile, {
                    icon: '🧑‍🏫',
                    title: 'Financial Literacy',
                    description: 'Interactive lessons on earning, saving, and investing for all ages.',
                    onClick: () => onNavigate('financialLiteracy')
                })
            )
        )
    );
}
