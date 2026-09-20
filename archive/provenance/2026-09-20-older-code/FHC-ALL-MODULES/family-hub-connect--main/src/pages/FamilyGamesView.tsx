import React, { useState, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { MadLibTheme, AIStoryTemplate } from '../types.ts';
import { useAppDispatch } from '../AppContext.tsx';
import { ArrowLeftIcon, LoadingSpinner } from '../components.tsx';

const AVAILABLE_THEMES: MadLibTheme[] = [
    "Fantasy Adventure", "Silly School Day", "Outer Space Mystery",
    "Pirate Treasure Hunt", "Talking Animals Farm"
];

export default function FamilyGamesView() {
    const { onNavigate, addToast } = useAppDispatch();
    const [selectedTheme, setSelectedTheme] = useState<MadLibTheme | null>(null);
    const [storyTemplate, setStoryTemplate] = useState<AIStoryTemplate | null>(null);
    const [userWords, setUserWords] = useState<Record<string, string>>({});
    const [filledStory, setFilledStory] = useState<string | null>(null);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [gamePhase, setGamePhase] = useState<'theme_selection' | 'word_input' | 'story_display'>('theme_selection');

    const handleStartGame = useCallback(async () => {
        if (!selectedTheme) return;
        setIsLoadingTemplate(true);
        setError(null);
        setFilledStory(null);
        setUserWords({});

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Create a short, simple, and funny Mad Libs-style story for kids based on the theme: "${selectedTheme}". The story should have between 8 and 12 blank words for the user to fill in.`;

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            story: {
                                type: Type.STRING,
                                description: "The story template with placeholders like [prompt1], [prompt2], etc."
                            },
                            prompts: {
                                type: Type.ARRAY,
                                description: "An array of objects, each with an 'id' (e.g., 'prompt1') and a 'label' (e.g., 'Noun').",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        label: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            
            if (!response.text) {
                throw new Error("Response text is undefined.");
            }
            const template = JSON.parse(response.text);
            setStoryTemplate(template);
            setGamePhase('word_input');
        } catch (e: any) {
            setError("Couldn't create a story. Please try another theme.");
            setGamePhase('theme_selection');
        } finally {
            setIsLoadingTemplate(false);
        }
    }, [selectedTheme]);

    const handleWordInputChange = (id: string, value: string) => {
        setUserWords(prev => ({ ...prev, [id]: value }));
    };

    const handleShowStory = () => {
        if (!storyTemplate) return;
        const allWordsProvided = storyTemplate.prompts.every(p => userWords[p.id]?.trim());
        if (!allWordsProvided) {
            addToast("Please fill in all the words!", 'info');
            return;
        }

        let finalStory = storyTemplate.story;
        storyTemplate.prompts.forEach(p => {
            const placeholderRegex = new RegExp(`\\[${p.id}\\]`, "gi");
            finalStory = finalStory.replace(placeholderRegex, `<strong>${userWords[p.id]}</strong>`);
        });

        setFilledStory(finalStory);
        setGamePhase('story_display');
    };

    const handlePlayAgain = () => {
        setSelectedTheme(null);
        setStoryTemplate(null);
        setUserWords({});
        setFilledStory(null);
        setError(null);
        setGamePhase('theme_selection');
    };

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" title="Go back to Locker Room" onClick={() => onNavigate('lockerRoom')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🎲 AI Mad Libs</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <div className="card">
                    {gamePhase === 'theme_selection' && (
                        <div className="text-center">
                            <h3>Choose a Story Theme!</h3>
                            <div className="flex flex-wrap justify-center gap-2 my-4">
                                {AVAILABLE_THEMES.map(theme =>
                                    <button
                                        key={theme}
                                        onClick={() => setSelectedTheme(theme)}
                                        className={`btn ${selectedTheme === theme ? '' : 'btn-secondary'}`}
                                    >
                                        {theme}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={handleStartGame}
                                disabled={!selectedTheme || isLoadingTemplate}
                                className="btn btn-success"
                            >
                                {isLoadingTemplate ? "Loading Story..." : "Start Game"}
                            </button>
                             {isLoadingTemplate && <LoadingSpinner message="Writing a wacky story..." />}
                        </div>
                    )}

                    {gamePhase === 'word_input' && storyTemplate && (
                        <div>
                            <h3>Fill in the Blanks!</h3>
                            <p className="text-light">{`Give me some words for our "${selectedTheme}" story...`}</p>
                            {storyTemplate.prompts.map(prompt =>
                                <div key={prompt.id} className="form-group">
                                    <label htmlFor={`madlib-input-${prompt.id}`}>{prompt.label}</label>
                                    <input
                                        type='text'
                                        id={`madlib-input-${prompt.id}`}
                                        value={userWords[prompt.id] || ''}
                                        onChange={(e) => handleWordInputChange(prompt.id, e.target.value)}
                                    />
                                </div>
                            )}
                            <button onClick={handleShowStory} className="btn w-100" style={{backgroundColor: '#ff69b4'}}>
                                Create My Story!
                            </button>
                        </div>
                    )}

                    {gamePhase === 'story_display' && filledStory && (
                        <div className="text-center">
                            <h3>{`Our ${selectedTheme} Story!`}</h3>
                            <div className="p-4 bg-gray-100 rounded-lg my-4" dangerouslySetInnerHTML={{ __html: filledStory }} />
                            <button onClick={handlePlayAgain} className="btn">
                                Play Again
                            </button>
                        </div>
                    )}

                    {error && <p className="ai-error">{error}</p>}
                </div>
            </main>
        </div>
    );
}