

import React, { useMemo } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { FINANCIAL_LITERACY_TOPICS } from '../constants.ts';
import { ArrowLeftIcon } from '../components.tsx';

export default function FinancialLiteracyView() {
    const { onNavigate, updateProfile, addToast } = useAppDispatch();
    const { profiles, viewingAsProfileId } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);


    if (!currentViewingProfile) {
        return <div className="page">Loading profile...</div>;
    }
    
    const completedTopics = currentViewingProfile.completedLiteracyTopics || [];

    const handleToggleLesson = async (lessonId: string) => {
        const isCompleted = completedTopics.includes(lessonId);
        const newCompletedTopics = isCompleted
            ? completedTopics.filter(id => id !== lessonId)
            : [...completedTopics, lessonId];
        
        await updateProfile(currentViewingProfile.id, { completedLiteracyTopics: newCompletedTopics });
        
        if (!isCompleted) {
            addToast("Lesson complete! Keep it up!", 'badge');
        }
    };

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={() => onNavigate('finance')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🧑‍🏫 Financial Literacy</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <p className="text-center text-light mt-0 mb-20">Learn the basics of money management with these fun lessons.</p>
                {FINANCIAL_LITERACY_TOPICS.map(topic => {
                    const completedInTopic = topic.lessons.filter(l => completedTopics.includes(l.id)).length;
                    const totalInTopic = topic.lessons.length;
                    const progress = totalInTopic > 0 ? (completedInTopic / totalInTopic) * 100 : 0;

                    return (
                        <section key={topic.id} className="card">
                            <h3>{`${topic.icon} ${topic.title}`}</h3>
                            <p>{topic.description}</p>
                            <div style={{ backgroundColor: '#e9ecef', borderRadius: '4px', height: '10px', marginBottom: '10px' }}>
                                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#28a745', borderRadius: '4px', transition: 'width 0.3s ease-in-out' }} />
                            </div>
                            <p className="text-light" style={{fontSize: '0.9em'}}>{`${completedInTopic} of ${totalInTopic} lessons completed.`}</p>
                            <ul>
                                {topic.lessons.map(lesson => (
                                    <li key={lesson.id} className="list-item">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={completedTopics.includes(lesson.id)}
                                                onChange={() => handleToggleLesson(lesson.id)}
                                            />
                                            <span style={{textDecoration: completedTopics.includes(lesson.id) ? 'line-through' : 'none'}}>{lesson.title}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    );
                })}
            </main>
        </div>
    );
}