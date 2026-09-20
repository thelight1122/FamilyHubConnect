import React from 'react';
import type { PageView } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import HubTile from '../components/ui/HubTile';

export default function CreatorsStudioView({ onNavigate, onBack }: { onNavigate: (page: PageView) => void; onBack: () => void; }) {
    
    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: onBack,
                style: { ...styles.backButton, float: 'left' },
                'aria-label': "Back to Dashboard"
            }, "← Back to Dashboard"),
            React.createElement('div', {style: {clear: 'both'}}),
            React.createElement('h2', { style: styles.pageHeader }, "✨ Creator's Studio"),
            React.createElement('p', { style: { textAlign: 'center', color: '#666', marginTop: '-15px', marginBottom: '25px' } }, "Unleash your creativity with AI-powered tools!"),

            React.createElement('div', { style: styles.hubGrid },
                React.createElement(HubTile, {
                    icon: '🤖',
                    title: 'AI Avatar Creator',
                    description: 'Design a unique, personalized avatar using the power of AI image generation.',
                    onClick: () => onNavigate('aiAvatarCreator')
                }),
                React.createElement(HubTile, {
                    icon: '📖',
                    title: 'AI Story Generator',
                    description: 'Create imaginative stories with custom characters, settings, and plot twists.',
                    onClick: () => onNavigate('storyTime')
                }),
                 React.createElement(HubTile, {
                    icon: '🎨',
                    title: 'Digital Drawing Board',
                    description: 'A simple canvas for free-form drawing and doodling. Save your creations to a photo album.',
                    onClick: () => onNavigate('drawingBoard')
                }),
                 React.createElement(HubTile, {
                    icon: '📰',
                    title: 'Family Newsletter',
                    description: 'Work together to create a fun, illustrated newsletter about your family\'s week.',
                    onClick: () => onNavigate('newsletterCreator')
                })
            )
        )
    );
}
