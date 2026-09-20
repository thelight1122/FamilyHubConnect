import React from 'react';
import type { PageView } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import HubTile from '../components/ui/HubTile';

export default function DigitalDeskView() {
    const { onNavigate } = useAppContext();

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: () => onNavigate('dashboard'),
                style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' },
                'aria-label': "Back to Dashboard"
            }, "← Back to Dashboard"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "📝 Digital Desk"),
            React.createElement('p', { style: { textAlign: 'center', color: '#666', marginTop: '-15px', marginBottom: '25px' } }, "Your personal space for learning and productivity."),


            React.createElement('div', { style: styles.hubGrid },
                React.createElement(HubTile, {
                    icon: '🗓️',
                    title: 'Homework Planner',
                    description: 'Keep track of all your school assignments, projects, and due dates.',
                    onClick: () => onNavigate('homeworkPlanner')
                }),
                React.createElement(HubTile, {
                    icon: '💡',
                    title: 'Homework Helper',
                    description: 'Get AI-powered help and explanations for tough subjects and questions.',
                    onClick: () => onNavigate('homeworkHelper')
                }),
                React.createElement(HubTile, {
                    icon: '📚',
                    title: 'Reading Corner',
                    description: 'Log the books you\'re reading, discover new ones, and earn reading badges.',
                    onClick: () => onNavigate('readingCorner')
                }),
                React.createElement(HubTile, {
                    icon: '🎯',
                    title: 'Routine Builder',
                    description: 'Create and track your daily morning and evening routines and build good habits.',
                    onClick: () => onNavigate('routineBuilder')
                })
            )
        )
    );
}
