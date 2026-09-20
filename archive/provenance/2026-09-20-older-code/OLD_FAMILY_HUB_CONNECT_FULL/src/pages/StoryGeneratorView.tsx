
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import { supabase } from '../services/supabaseClient';

interface StoryGeneratorViewProps {
    onBackToDashboard: () => void;
}

export default function StoryGeneratorView({ onBackToDashboard }: StoryGeneratorViewProps) {
    const { addToast, IS_TESTING_MODE } = useAppContext();
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

        if (IS_TESTING_MODE) {
            setTimeout(() => {
                setStory(`Once upon a time, ${character} went to ${setting} to ${plot}. It was a grand adventure!`);
                setImageUrl('https://placehold.co/512x512/d1e7dd/ffffff?text=Story+Image');
                setIsLoading(false);
            }, 1000);
            return;
        }

        const storyPrompt = `Write a short, fun, child-friendly story about a character described as: "${character}". The story is set in: "${setting}". The main plot point is: "${plot}".`;
        const imagePrompt = `A cute, vibrant, cartoon-style illustration for a children's story. The scene should depict: A character, ${character}, in a place like ${setting}. Focus on the action of: ${plot}.`;

        try {
            const [storyResponse, imageResponse] = await Promise.all([
                supabase.functions.invoke('ai-handler', { body: { endpoint: 'generateText', prompt: storyPrompt } }),
                supabase.functions.invoke('ai-handler', { body: { endpoint: 'generateImage', prompt: imagePrompt } })
            ]);

            if (storyResponse.error) throw new Error(`Story generation failed: ${storyResponse.error.message}`);
            if (imageResponse.error) throw new Error(`Image generation failed: ${imageResponse.error.message}`);
            
            setStory(storyResponse.data.text);
            setImageUrl(imageResponse.data.imageUrl);

        } catch (e: any) {
            setError(e.message || "Failed to generate story. Please try again.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        React.createElement('div', { style: styles.pageContainer },
            React.createElement('button', {
                onClick: onBackToDashboard,
                style: { ...styles.backButton, float: 'left' },
                'aria-label': "Back to Dashboard"
            }, "← Back"),
            React.createElement('div', {style: {clear: 'both'}}),
            React.createElement('h2', { style: styles.pageHeader }, "📖 AI Story Generator"),
            
            React.createElement('div', { style: styles.storyPromptForm },
                React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'character'}, 'Main Character:'), React.createElement('input', {id: 'character', value: character, onChange: e => setCharacter(e.target.value), style: styles.input, placeholder: 'e.g., a brave little mouse'})),
                React.createElement('div', {style: styles.formGroup}, React.createElement('label', {htmlFor: 'setting'}, 'Setting:'), React.createElement('input', {id: 'setting', value: setting, onChange: e => setSetting(e.target.value), style: styles.input, placeholder: 'e.g., a magical candy forest'})),
                React.createElement('div', {style: {...styles.formGroup, gridColumn: '1 / -1'}}, React.createElement('label', {htmlFor: 'plot'}, 'Plot:'), React.createElement('input', {id: 'plot', value: plot, onChange: e => setPlot(e.target.value), style: styles.input, placeholder: 'e.g., find the legendary giant gummy bear'})),
                React.createElement('button', {style: styles.storyGeneratorButtonPrimary, onClick: handleGenerate, disabled: isLoading}, isLoading ? "Generating..." : "Create Story!")
            ),

            error && React.createElement('p', {style: styles.aiError}, error),
            
            (isLoading || story) && React.createElement('div', { style: styles.storyResultContainer },
                React.createElement('div', { style: styles.storyImageColumn },
                    isLoading ? React.createElement('div', { style: styles.storyImagePlaceholder }, 'Creating image...') : (imageUrl && React.createElement('img', { src: imageUrl, alt: "Generated story illustration", style: styles.storyImage }))
                ),
                React.createElement('div', { style: styles.storyTextColumn },
                    React.createElement('h3', { style: styles.storyResultHeader }, "Your Story"),
                    isLoading ? React.createElement('div', { style: styles.storyTextPlaceholder }, 'Writing your story...') : (story && React.createElement('p', { style: styles.storyTextArea }, story))
                )
            ),

            story && React.createElement('button', { style: { ...styles.storyGeneratorButtonSecondary, marginTop: '20px' }, onClick: () => { setStory(null); setImageUrl(null); } }, 'Start Over')
        )
    );
}
