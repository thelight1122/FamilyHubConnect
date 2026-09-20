
import React from 'react';
import type { PageView } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';

// --- Sub-Components for Landing Page ---
const Feature = ({ title, description, items }: { title: string; description?: string; items?: string[] }) => (
    <div style={styles.featureCard}>
        <h4 style={styles.featureTitle}>{title}</h4>
        {description && <p>{description}</p>}
        {items && (
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                {items.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                        <span style={styles.listIcon}>✓</span> {item}
                    </li>
                ))}
            </ul>
        )}
    </div>
);


// --- Landing Page Component ---
interface LandingPageProps {
    personalizationDataExists: boolean;
}

export default function LandingPage({
    personalizationDataExists,
}: LandingPageProps) {
    const { onNavigate } = useAppContext();
    return (
        <div style={styles.landingPageContainer}>
            <header style={{ ...styles.header, width: '100%', maxWidth: '800px'}}>
                <h1 style={styles.headerTitle}>Welcome to Family Hub Connect</h1>
                <p style={styles.headerSubtitle}>The all-in-one app to organize your family's life.</p>
            </header>
           
            <div style={styles.landingNavButtons}>
                <button
                    style={{...styles.landingButton, backgroundColor: '#4a90e2'}}
                    onClick={() => onNavigate('auth')}
                    aria-label={personalizationDataExists ? 'Go to FamilyHub Connect dashboard' : 'Login or Sign Up for Family Hub Connect'}
                >
                    {personalizationDataExists ? '📊 Go to Dashboard' : '🚀 Login or Sign Up'}
                </button>
                {personalizationDataExists && (
                     <button
                        style={{...styles.landingButton, backgroundColor: '#6c757d', fontSize: '1em'}}
                        onClick={() => onNavigate('settings')}
                        aria-label="Manage FamilyHub Connect settings"
                    >
                        ⚙️ Manage Settings
                    </button>
                )}
            </div>
             <section style={{...styles.section, width: '100%', maxWidth: '1000px', marginTop: '30px', textAlign: 'left'}} aria-labelledby="core-features-title-landing">
                <h2 id="core-features-title-landing" style={styles.sectionTitle}>🎯 Core Features</h2>
                <div style={styles.featureGrid}>
                    <Feature title="👨‍👩‍👧‍👦 Profiles & Roles" description="Individual accounts with parent/child specific views." />
                    <Feature title="📋 Chore Management" description="Assign, track, and manage recurring tasks." />
                    <Feature title="⭐ Prizes System" description="Points, badges, and leaderboards for motivation." />
                    <Feature title="📅 Shared Calendar" description="Keep track of family events, chores, and meal plans." />
                    <Feature title="✈️ Trip Planner" description="Organize family vacations from start to finish." />
                    <Feature title="🤖 AI-Powered Assists" description="Get smart suggestions for chores, meals, and more!" />
                </div>
            </section>
        </div>
    );
}