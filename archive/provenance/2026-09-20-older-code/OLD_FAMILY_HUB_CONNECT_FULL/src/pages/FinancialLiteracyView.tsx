
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import { FINANCIAL_LITERACY_TOPICS } from '../constants';

export default function FinancialLiteracyView() {
    const { onNavigate, currentViewingProfile, updateProfile, addToast } = useAppContext();

    if (!currentViewingProfile) {
        return React.createElement('div', { style: styles.loadingMessage }, 'Loading profile...');
    }
    
    const completedTopics = currentViewingProfile.completedLiteracyTopics || [];

    const handleToggleLesson = async (lessonId: string) => {
        const isCompleted = completedTopics.includes(lessonId);
        const newCompletedTopics = isCompleted
            ? completedTopics.filter(id => id !== lessonId)
            : [...completedTopics, lessonId];
        
        await updateProfile(currentViewingProfile.id, { completedLiteracyTopics: newCompletedTopics });
        
        if (!isCompleted) {
            addToast("Lesson complete! Keep it up!", 'badge', '🎓');
        }
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: () => onNavigate('finance'),
                style: { ...styles.backButton, float: 'left' },
            }, '← Back to Finance Hub'),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "🧑‍🏫 Financial Literacy"),
            React.createElement('p', { style: { textAlign: 'center', color: '#666', marginTop: '-15px', marginBottom: '25px' } }, "Learn the basics of money management with these fun lessons."),

            FINANCIAL_LITERACY_TOPICS.map(topic => {
                const completedInTopic = topic.lessons.filter(l => completedTopics.includes(l.id)).length;
                const totalInTopic = topic.lessons.length;
                const progress = totalInTopic > 0 ? (completedInTopic / totalInTopic) * 100 : 0;

                return React.createElement('section', { key: topic.id, style: styles.section },
                    React.createElement('h3', { style: styles.sectionTitle }, `${topic.icon} ${topic.title}`),
                    React.createElement('p', null, topic.description),
                    React.createElement('div', { style: { backgroundColor: '#e9ecef', borderRadius: '4px', height: '10px', marginBottom: '10px' } },
                        React.createElement('div', { style: { width: `${progress}%`, height: '100%', backgroundColor: '#28a745', borderRadius: '4px', transition: 'width 0.3s ease-in-out' } })
                    ),
                    React.createElement('p', {style: {fontSize: '0.9em', color: '#666'}}, `${completedInTopic} of ${totalInTopic} lessons completed.`),
                    topic.lessons.map(lesson => (
                        React.createElement('div', { key: lesson.id, style: styles.listItem },
                            React.createElement('label', { style: styles.checkboxLabel },
                                React.createElement('input', {
                                    type: 'checkbox',
                                    style: styles.checkbox,
                                    checked: completedTopics.includes(lesson.id),
                                    onChange: () => handleToggleLesson(lesson.id)
                                }),
                                React.createElement('span', {style: {textDecoration: completedTopics.includes(lesson.id) ? 'line-through' : 'none'}}, lesson.title)
                            )
                        )
                    ))
                );
            })
        )
    );
}
