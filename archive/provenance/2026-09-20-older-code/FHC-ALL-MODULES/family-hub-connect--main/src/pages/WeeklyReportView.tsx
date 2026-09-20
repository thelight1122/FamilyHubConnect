
import React, { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../AppContext';
import { LoadingSpinner, ArrowLeftIcon } from '../components';

export default function WeeklyReportView() {
    const { 
        generateWeeklyReport, onNavigate
    } = useAppDispatch();
    const { chores, profiles, familyEvents, bookLogEntries } = useAppState();
    const [report, setReport] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const generate = async () => {
            setIsLoading(true);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            const completedChores = chores.filter(c => c.status === 'completed' && c.completed_at && new Date(c.completed_at) > oneWeekAgo);
            const eventsLastWeek = familyEvents.filter(e => new Date(e.date) > oneWeekAgo);
            const booksFinished = (bookLogEntries || []).filter(b => b.status === 'finished' && b.finishDate && new Date(b.finishDate) > oneWeekAgo);
            
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
    }, [generateWeeklyReport, chores, familyEvents, bookLogEntries, profiles]);

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={() => onNavigate('dashboard')}>
                    <ArrowLeftIcon />
                </button>
                <h2>📊 Weekly Report</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    {isLoading
                        ? <LoadingSpinner message="Generating your weekly summary..." />
                        : <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{report}</div>
                    }
                </section>
            </main>
        </div>
    );
}
