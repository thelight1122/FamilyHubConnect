import React from 'react';
import { useAppDispatch } from '../AppContext.tsx';

const Feature = ({ title, description, items }: { title: string; description?: string; items?: string[] }) => (
    <div className="card">
        <h4>{title}</h4>
        {description && <p>{description}</p>}
        {items && (
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                {items.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ marginRight: '8px' }}>✓</span> {item}
                    </li>
                ))}
            </ul>
        )}
    </div>
);

interface LandingPageProps {
    personalizationDataExists: boolean;
}

export default function LandingPage({ personalizationDataExists }: LandingPageProps) {
    const { onNavigate } = useAppDispatch();
    return (
        <div className="page" style={{ alignItems: 'center', textAlign: 'center' }}>
            <main className="main" style={{ maxWidth: '1000px' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2.5em', fontFamily: 'var(--font-title)' }}>Welcome to Family Hub Connect</h1>
                    <p style={{ fontSize: '1.2em', color: 'var(--text-light)' }}>The all-in-one app to organize your family's life.</p>
                </header>
           
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                    <button
                        className="btn"
                        onClick={() => onNavigate('auth')}
                        aria-label={personalizationDataExists ? 'Go to FamilyHub Connect dashboard' : 'Login or Sign Up for Family Hub Connect'}
                    >
                        {personalizationDataExists ? '📊 Go to Dashboard' : '🚀 Login or Sign Up'}
                    </button>
                    {personalizationDataExists && (
                         <button
                            className="btn btn-secondary"
                            onClick={() => onNavigate('settings')}
                            aria-label="Manage FamilyHub Connect settings"
                        >
                            ⚙️ Manage Settings
                        </button>
                    )}
                </div>
                 <section aria-labelledby="core-features-title-landing">
                    <h2 id="core-features-title-landing" style={{ fontSize: '1.8em', fontFamily: 'var(--font-title)' }}>🎯 Core Features</h2>
                    <div className="hub-grid">
                        <Feature title="👨‍👩‍👧‍👦 Profiles & Roles" description="Individual accounts with parent/child specific views." />
                        <Feature title="📋 Chore Management" description="Assign, track, and manage recurring tasks." />
                        <Feature title="⭐ Prizes System" description="Points, badges, and leaderboards for motivation." />
                        <Feature title="📅 Shared Calendar" description="Keep track of family events, chores, and meal plans." />
                        <Feature title="✈️ Trip Planner" description="Organize family vacations from start to finish." />
                        <Feature title="🤖 AI-Powered Assists" description="Get smart suggestions for chores, meals, and more!" />
                    </div>
                </section>
            </main>
        </div>
    );
}