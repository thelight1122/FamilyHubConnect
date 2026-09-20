
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function WeeklyReportView() {
    const { 
        generateWeeklyReport, onNavigate, chores, profiles,
        familyEvents, bookLogEntries
    } = useAppContext();
    const [report, setReport] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const generate = async () => {
            setIsLoading(true);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            const completedChores = chores.filter(c => c.status === 'completed' && c.completed_at && new Date(c.completed_at) > oneWeekAgo);
            const eventsLastWeek = familyEvents.filter(e => new Date(e.date) > oneWeekAgo);
            const booksFinished = bookLogEntries.filter(b => b.status === 'finished' && b.finishDate && new Date(b.finishDate) > oneWeekAgo);
            
            let highlights = '';
            completedChores.forEach(c => {
                const member = profiles.find(p => p.id === c.assignedTo)?.name || 'Someone';
                highlights += `${member} completed the chore "${c.name}".\n`;
            });
            eventsLastWeek.forEach(e => {
                highlights += `The family had the event "${e.title}".\n`;
            });
            booksFinished.forEach(b => {
                const member = profiles.find(p => p.id === b.profileId)?.name || 'Someone';
                highlights += `${member} finished reading "${b.title}".\n`;
            });

            if (!highlights.trim()) {
                highlights = "It was a quiet week.";
            }

            try {
                const generatedReport = await generateWeeklyReport(highlights);
                setReport(generatedReport);
            } catch (error) {
                setReport("There was an error generating the report. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        generate();
    }, []);

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', { onClick: () => onNavigate('dashboard'), style: { ...styles.backButton, float: 'left' } }, "← Back"),
            React.createElement('div', { style: { clear: 'both' } }),
            React.createElement('h2', { style: styles.pageHeader }, "📊 Weekly Report"),
            React.createElement('section', { style: styles.section },
                isLoading
                    ? React.createElement(LoadingSpinner, { message: "Generating your weekly summary..." })
                    : React.createElement('div', { style: { whiteSpace: 'pre-wrap', lineHeight: 1.6 } }, report)
            )
        )
    );
}
