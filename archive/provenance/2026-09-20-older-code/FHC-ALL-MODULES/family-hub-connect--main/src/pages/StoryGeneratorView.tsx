import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppDispatch } from '../AppContext';
import { ArrowLeftIcon, LoadingSpinner } from '../components';

interface StoryGeneratorViewProps {
    onBack: () => void;
}

export default function StoryGeneratorView({ onBack }: StoryGeneratorViewProps) {
    const { addToast } = useAppDispatch();
    const [character, setCharacter] = useState('');
    const [setting, setSetting] = useState('');
    const [plot, setPlot] = useState('');
    const [story, setStory] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!character.trim() || !setting.trim() || !plot.trim()) {
            addToast("Please fill in all fields to create a story.", 'info');
            return;
        }

        setIsLoading(true);
        setError(null);
        setStory(null);
        setImageUrl(null);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const storyPrompt = `Write a short, fun, child-friendly story about a character described as: "${character}". The story is set in: "${setting}". The main plot point is: "${plot}".`;
        const imagePrompt = `A cute, vibrant, cartoon-style illustration for a children's story. The scene should depict: A character, ${character}, in a place like ${setting}. Focus on the action of: ${plot}.`;

        try {
            const storyPromise = ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: storyPrompt,
            });

            const imagePromise = ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: imagePrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: '1:1',
                }
            });

            const [storyResponse, imageResponse] = await Promise.all([storyPromise, imagePromise]);
            
            setStory(storyResponse.text);

            if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
                const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
                const fullImageUrl = `data:image/png;base64,${base64ImageBytes}`;
                setImageUrl(fullImageUrl);
            } else {
                // Don't throw an error if image fails, story can still be shown
                console.warn("Image generation did not return any images.");
            }

        } catch (e: any) {
            setError(e.message || "Failed to generate story. Please try again.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="page">
            <header className="header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeftIcon />
                </button>
                <h2>📖 AI Story Generator</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <div className="card">
                    <div className="form-group">
                        <label htmlFor='character'>Main Character:</label>
                        <input id='character' value={character} onChange={e => setCharacter(e.target.value)} placeholder='e.g., a brave little mouse' />
                    </div>
                    <div className="form-group">
                        <label htmlFor='setting'>Setting:</label>
                        <input id='setting' value={setting} onChange={e => setSetting(e.target.value)} placeholder='e.g., a magical candy forest' />
                    </div>
                    <div className="form-group">
                        <label htmlFor='plot'>Plot:</label>
                        <input id='plot' value={plot} onChange={e => setPlot(e.target.value)} placeholder='e.g., find the legendary giant gummy bear' />
                    </div>
                    <button className="btn w-100" onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? "Generating..." : "Create Story!"}
                    </button>
                </div>

                {error && <p className="ai-error text-center">{error}</p>}
                
                {isLoading && <LoadingSpinner message="Crafting your adventure..." />}
                
                {story && !isLoading && (
                    <div className="card story-result-card">
                         {imageUrl && <img src={imageUrl} alt="Generated story illustration" className="story-image" />}
                        <div className="story-content">
                            <h3>Your Story</h3>
                            <p className="story-text">{story}</p>
                        </div>
                    </div>
                )}

                {story && !isLoading && (
                    <button className="btn btn-secondary w-100 mt-20" onClick={() => { setStory(null); setImageUrl(null); }}>
                        Start Over
                    </button>
                )}
            </main>
        </div>
    );
}