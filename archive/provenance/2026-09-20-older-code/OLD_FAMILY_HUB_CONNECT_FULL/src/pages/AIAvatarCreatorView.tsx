import React, { useState } from 'react';
import type { PageView, Profile } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import { supabase } from '../services/supabaseClient';

interface AIAvatarCreatorViewProps {
    updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<void>;
    onBack: () => void;
}

export default function AIAvatarCreatorView({ updateProfile, onBack }: AIAvatarCreatorViewProps) {
    const { currentViewingProfile, addToast, IS_TESTING_MODE } = useAppContext();
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
        
        const fullPrompt = `Create a cute, cartoon-style avatar for a family app. The avatar should be of: ${prompt}. Clean, simple background.`;

        if (IS_TESTING_MODE) {
            setTimeout(() => {
                setImageUrl('https://placehold.co/512x512/a2d2ff/ffffff?text=Avatar');
                setIsLoading(false);
            }, 1000);
            return;
        }

        try {
            const { data, error: funcError } = await supabase.functions.invoke('ai-handler', {
                body: {
                    endpoint: 'generateImage',
                    prompt: fullPrompt,
                }
            });

            if (funcError) throw funcError;

            setImageUrl(data.imageUrl);

        } catch (e: any) {
            setError('Could not generate avatar. Please try a different prompt.');
            console.error("Error generating avatar:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetAsAvatar = () => {
        if (!imageUrl || !currentViewingProfile) return;
        updateProfile(currentViewingProfile.id, { avatarUrl: imageUrl });
        addToast("New avatar set!", 'badge', '🎉');
        onBack();
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: onBack,
                style: { ...styles.backButton, float: 'left' },
                'aria-label': "Back to Creators Studio"
            }, "← Back to Creators Studio"),
             React.createElement('div', {style: {clear: 'both'}}),
            React.createElement('h2', { style: styles.pageHeader }, "🤖 AI Avatar Creator"),

            React.createElement('div', { style: styles.storyPromptForm },
                React.createElement('div', { style: { ...styles.formGroup, gridColumn: '1 / -1' } },
                    React.createElement('label', { htmlFor: 'avatarPrompt', style: styles.label }, 'Describe your new avatar:'),
                    React.createElement('input', {
                        id: 'avatarPrompt',
                        style: styles.input,
                        value: prompt,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value),
                        placeholder: 'e.g., a happy robot holding a flower'
                    })
                ),
                React.createElement('button', {
                    style: { ...styles.storyGeneratorButtonPrimary, gridColumn: '1 / -1' },
                    onClick: handleGenerateAvatar,
                    disabled: isLoading
                }, isLoading ? "Creating..." : "Generate Avatar")
            ),
            
            React.createElement('div', {style: {marginTop: '20px', textAlign: 'center'}},
                error && React.createElement('p', { style: styles.aiError }, error),
                isLoading && React.createElement('div', { style: styles.storyImagePlaceholder }, 'Generating your masterpiece...'),
                imageUrl && !isLoading && React.createElement('div', null,
                    React.createElement('img', { src: imageUrl, alt: "Generated avatar", style: { ...styles.storyImage, maxWidth: '512px', margin: '0 auto' } }),
                    React.createElement('button', {
                        style: { ...styles.button, width: 'auto', marginTop: '15px' },
                        onClick: handleSetAsAvatar
                    }, "✅ Set as My Avatar")
                )
            )
        )
    );
}
