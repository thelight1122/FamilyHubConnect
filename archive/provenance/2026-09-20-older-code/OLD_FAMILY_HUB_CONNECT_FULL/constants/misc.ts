
// --- Sound Effect ---
export const SOUND_EFFECT_NOTIFICATION = new Audio('data:audio/wav;base64,UklGRjoAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQYAAAAIAAD//wA='); // Short click sound

// --- AI Feature Flag ---
// Set to false to disable non-critical AI calls (e.g., suggestions, briefings) to save API quota during development.
// Core creative AI features (Story Generator, Avatar Creator, Mad Libs) will remain active.
export const ENABLE_AI_FEATURES = true;

// --- Parent Themes ---
export const PARENT_THEMES: { [key: string]: { [key: string]: string } } = {
    'Default': {
        '--primary-color': '#4a90e2',
        '--secondary-color': '#6c757d',
        '--accent-color': '#e74c3c',
        '--background-color': '#f0f4f8',
        '--text-color': '#333333',
        '--header-bg': '#34495e',
        '--header-text': '#ffffff',
        '--button-bg': '#4a90e2',
        '--button-text': '#ffffff',
        '--section-bg': '#ffffff',
        '--tile-bg': '#ffffff',
        '--top-bar-bg': '#34495e',
        '--top-bar-text': '#ffffff',
        '--modal-overlay-bg': 'rgba(0, 0, 0, 0.6)',
        '--accent-color-light': '#e9f5ff',
    },
    'Modern Dark': {
        '--primary-color': '#00aaff',
        '--secondary-color': '#555',
        '--accent-color': '#00d1ff',
        '--background-color': '#121212',
        '--text-color': '#e0e0e0',
        '--header-bg': '#1e1e1e',
        '--header-text': '#ffffff',
        '--button-bg': '#00aaff',
        '--button-text': '#ffffff',
        '--section-bg': '#1e1e1e',
        '--tile-bg': '#2a2a2a',
        '--top-bar-bg': '#1e1e1e',
        '--top-bar-text': '#ffffff',
        '--modal-overlay-bg': 'rgba(255, 255, 255, 0.1)',
    },
    'Classic Blue': {
        '--primary-color': '#0d47a1',
        '--secondary-color': '#757575',
        '--accent-color': '#2962ff',
        '--background-color': '#e3f2fd',
        '--text-color': '#212121',
        '--header-bg': '#1565c0',
        '--header-text': '#ffffff',
        '--button-bg': '#1976d2',
        '--button-text': '#ffffff',
        '--section-bg': '#ffffff',
        '--tile-bg': '#bbdefb',
        '--top-bar-bg': '#0d47a1',
        '--top-bar-text': '#ffffff',
        '--modal-overlay-bg': 'rgba(0, 0, 0, 0.5)',
    },
     'Minimalist Light': {
        '--primary-color': '#333333',
        '--secondary-color': '#888888',
        '--accent-color': '#5c5c5c',
        '--background-color': '#ffffff',
        '--text-color': '#333333',
        '--header-bg': '#f5f5f5',
        '--header-text': '#333333',
        '--button-bg': '#333333',
        '--button-text': '#ffffff',
        '--section-bg': '#f9f9f9',
        '--tile-bg': '#f0f0f0',
        '--top-bar-bg': '#ffffff',
        '--top-bar-text': '#333333',
        '--modal-overlay-bg': 'rgba(0, 0, 0, 0.4)',
    },
};

// --- Avatar Options ---
export const AVATAR_OPTIONS = [
    { value: '👤', label: '👤 Person' },
    { value: '👩‍🦰', label: '👩‍🦰 Woman' },
    { value: '👨‍🦱', label: '👨‍🦱 Man' },
    { value: '👴', label: '👴 Grandparent' },
    { value: '🧒', label: '🧒 Child' },
    { value: '👧', label: '👧 Girl' },
    { value: '🧑‍🚀', label: '🧑‍🚀 Astronaut' },
    { value: '🦸', label: '🦸 Superhero' },
    { value: '🎨', label: '🎨 Artist' },
    { value: '😊', label: '😊 Smiley Face' },
    { value: '⭐', label: '⭐ Star' },
];
