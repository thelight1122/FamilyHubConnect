import React from 'react';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import HubTile from '../components/ui/HubTile';

export default function FamilyCareView() {
    const { onNavigate } = useAppContext();

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: () => onNavigate('dashboard'),
                style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' },
                'aria-label': "Back to Dashboard"
            }, "← Back to Dashboard"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "❤️‍🩹 Family Care"),
            React.createElement('p', { style: { textAlign: 'center', color: '#666', marginTop: '-15px', marginBottom: '25px' } }, "Your hub for health logs, medical info, and caregiving."),

            React.createElement('div', { style: styles.hubGrid },
                React.createElement(HubTile, {
                    icon: '🤖',
                    title: 'AI Nurse-Bot',
                    description: 'Get quick, AI-powered answers to general health questions.',
                    onClick: () => onNavigate('aiNurse')
                }),
                React.createElement(HubTile, {
                    icon: '📝',
                    title: 'Health Logs',
                    description: 'Track symptoms, temperature, and other important health events.',
                    onClick: () => onNavigate('health')
                }),
                React.createElement(HubTile, {
                    icon: '🗂️',
                    title: 'Medical Records',
                    description: 'Securely store important medical documents and information.',
                    onClick: () => onNavigate('medicalRecords')
                }),
                 React.createElement(HubTile, {
                    icon: '🤝',
                    title: 'Caregiving Central',
                    description: 'Manage caregivers and create detailed care plans for family members.',
                    onClick: () => onNavigate('caregivingCentral')
                })
            )
        )
    );
}
