import React, { useState, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useAppState, useAppDispatch } from '../AppContext';
import { ArrowLeftIcon, LoadingSpinner } from '../components';

export default function NewsletterCreatorView({ onBack }: { onBack: () => void }) {
    const { addToast, getProfileName } = useAppDispatch();
    const { chores, familyEvents, familyPhotos } = useAppState();
    const [title, setTitle] = useState("Our Family's Weekly Update");
    const [introduction, setIntroduction] = useState("Here's what we've been up to this week!");
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const generateNewsletterContent = useCallback(async () => {
        setIsLoading(true);
        setGeneratedContent('');

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentChores = chores.filter((c: any) => c.completed_at && new Date(c.completed_at) > oneWeekAgo)
            .map((c: any) => `${c.name} (by ${getProfileName(c.assignedTo)})`);
        
        const recentEvents = familyEvents.filter((e: any) => new Date(e.date) > oneWeekAgo).map((e: any) => e.title);
        const recentPhotosCount = familyPhotos.filter((p: any) => new Date(p.timestamp) > oneWeekAgo).length;

        const highlights = `
            - Introduction: ${introduction}
            - Completed Chores this week: ${recentChores.join(', ') || 'None'}
            - Family Events this week: ${recentEvents.join(', ') || 'None'}
            - Photos added this week: ${recentPhotosCount}
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate a short, cheerful, family-friendly newsletter titled "${title}". Use the following highlights to create a summary of the week. Format it nicely with headings for different sections (like "This Week's Highlights", "Chore Champions"). Be creative and fun! \n\n${highlights}`;
             const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setGeneratedContent(response.text);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            addToast(`Error generating newsletter: ${message}`, 'info');
        } finally {
            setIsLoading(false);
        }
    }, [addToast, getProfileName, chores, familyEvents, familyPhotos, title, introduction]);

    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>📰 Family Newsletter Creator</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    <div className="form-group">
                        <label htmlFor='newsletterTitle'>Newsletter Title</label>
                        <input id='newsletterTitle' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='newsletterIntro'>Introduction</label>
                        <textarea id='newsletterIntro' value={introduction} onChange={(e) => setIntroduction(e.target.value)} rows={3} />
                    </div>
                    <button onClick={generateNewsletterContent} disabled={isLoading} className="btn">
                        {isLoading ? "Generating..." : "Generate Preview"}
                    </button>
                </section>
                
                {isLoading && <LoadingSpinner message="Writing your newsletter..." />}
                
                {generatedContent && !isLoading && (
                    <section className="card">
                        <h3>Preview</h3>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: '#f9f9f9' }}>
                            <h2 style={{marginTop: 0}}>{title}</h2>
                            <p><em>{introduction}</em></p>
                            <hr style={{margin: '15px 0'}}/>
                            <div dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br />') }} />
                        </div>
                        <button disabled={isSending} className="btn btn-success w-100 mt-20">
                            {isSending ? "Sending..." : "Send to Family"}
                        </button>
                    </section>
                )}
            </main>
        </div>
    );
}