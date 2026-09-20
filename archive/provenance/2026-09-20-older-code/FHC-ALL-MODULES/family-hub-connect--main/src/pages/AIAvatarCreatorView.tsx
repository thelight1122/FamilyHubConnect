import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Profile } from '../types.ts';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ArrowLeftIcon, LoadingSpinner } from '../components.tsx';

interface AIAvatarCreatorViewProps {
    onBack: () => void;
}

export default function AIAvatarCreatorView({ onBack }: AIAvatarCreatorViewProps) {
    const { addToast, updateProfile } = useAppDispatch();
    const { viewingAsProfileId, profiles } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateAvatar = async () => {
        if (!prompt.trim()) {
            addToast("Please enter a prompt for your avatar.", 'info');
            return;
        }

        setIsLoading(true);
        setError(null);
        setImageUrl(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: `A cute, simple, circular avatar for a family app profile. The avatar should be of: ${prompt}. Minimalist background.`,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: '1:1',
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes: string = response.generatedImages[0]?.image?.imageBytes ?? '';
                const fullImageUrl = `data:image/png;base64,${base64ImageBytes}`;
                setImageUrl(fullImageUrl);
            } else {
                throw new Error("The API did not return any images.");
            }
        } catch (err: any) {
            console.error("Error generating avatar:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
            addToast("Sorry, couldn't create your avatar right now.", 'info');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetAsAvatar = () => {
        if (!imageUrl || !currentViewingProfile) return;
        updateProfile(currentViewingProfile.id, { avatarUrl: imageUrl });
        addToast("New avatar set!", 'badge');
        onBack();
    };

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBack} title="Go back">
                    <ArrowLeftIcon />
                </button>
                <h2>🤖 AI Avatar Creator</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <div className="card">
                    <div className="form-group">
                        <label htmlFor="avatarPrompt">Describe your new avatar:</label>
                        <input
                            id="avatarPrompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., a happy robot holding a flower"
                        />
                    </div>
                    <button
                        className="btn w-100"
                        onClick={handleGenerateAvatar}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Generate Avatar"}
                    </button>
                </div>
            
                <div className="text-center mt-20">
                    {error && <p className="ai-error">{error}</p>}
                    {isLoading && <LoadingSpinner message="Generating your masterpiece..." />}
                    {imageUrl && !isLoading && (
                        <div className="card">
                            <img src={imageUrl} alt="Generated avatar" className="generated-avatar" />
                            <button
                                className="btn w-auto mt-20"
                                onClick={handleSetAsAvatar}
                            >
                                ✅ Set as My Avatar
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}