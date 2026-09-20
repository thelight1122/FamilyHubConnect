import React, { useState, useMemo, useCallback } from 'react';
import type { PageView, ToastMessage, MadLibTheme, AIStoryTemplate, MadLibPrompt } from '../types';
import { styles } from '../styles';
import { useAppContext } from '../contexts/AppContext';
import { supabase } from '../services/supabaseClient';

const AVAILABLE_THEMES: MadLibTheme[] = [
    "Fantasy Adventure",
    "Silly School Day",
    "Outer Space Mystery",
    "Pirate Treasure Hunt",
    "Talking Animals Farm"
];

export default function FamilyGamesView() {
    const { onNavigate, addToast, IS_TESTING_MODE } = useAppContext();
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

        if (IS_TESTING_MODE) {
            const mockTemplates: Record<MadLibTheme, AIStoryTemplate> = {
                "Fantasy Adventure": {
                    story: "The brave [NOUN_1] went on a quest to find the [ADJECTIVE_1] [NOUN_2]. They had to [VERB_1] over the [ADJECTIVE_2] mountains and fight a [NOUN_3].",
                    prompts: [
                        { id: "NOUN_1", label: "Noun (Hero)" },
                        { id: "ADJECTIVE_1", label: "Adjective" },
                        { id: "NOUN_2", label: "Noun (Object)" },
                        { id: "VERB_1", label: "Verb" },
                        { id: "ADJECTIVE_2", label: "Adjective" },
                        { id: "NOUN_3", label: "Noun (Monster)" },
                    ]
                },
                "Silly School Day": {
                    story: "My teacher, Mr. [NOUN_1], told us to [VERB_1] our homework. Instead, I saw a [ADJECTIVE_1] [NOUN_2] outside the window!",
                    prompts: [
                        { id: "NOUN_1", label: "Funny Last Name" },
                        { id: "VERB_1", label: "Verb" },
                        { id: "ADJECTIVE_1", label: "Adjective" },
                        { id: "NOUN_2", label: "Noun" }
                    ]
                },
                "Outer Space Mystery": { story: "...", prompts: []},
                "Pirate Treasure Hunt": { story: "...", prompts: []},
                "Talking Animals Farm": { story: "...", prompts: []}
            };

            setTimeout(() => {
                const template = mockTemplates[selectedTheme];
                if (template.prompts.length === 0) { // Fill in other mocks
                    template.story = "This is a [ADJECTIVE_1] mock story for the [NOUN_1] theme.";
                    template.prompts = [{ id: "ADJECTIVE_1", label: "Adjective" }, {id: "NOUN_1", label: "Noun" }];
                }
                setStoryTemplate(template);
                setGamePhase('word_input');
                setIsLoadingTemplate(false);
            }, 500);
            return;
        }

        const prompt = `
            Create a short, fun Mad Libs style story template based on the theme "${selectedTheme}".
            The story should have unique placeholders like [NOUN_1], [VERB_1], [ADJECTIVE_1], etc.
        `;
        const systemInstruction = `
            Return the result as a JSON object with two keys:
            1. "story": A string containing the story with the unique placeholders.
            2. "prompts": An array of objects, where each object has "id" (the unique placeholder name, e.g., "NOUN_1") and "label" (the type of word needed, e.g., "Noun").
            Example:
            {
              "story": "Yesterday, I went to the zoo and saw a [ADJECTIVE_1] [NOUN_1].",
              "prompts": [
                { "id": "ADJECTIVE_1", "label": "Adjective" },
                { "id": "NOUN_1", "label": "Noun" }
              ]
            }
            Return ONLY the raw JSON object.
        `;

        try {
            const { data, error: funcError } = await supabase.functions.invoke('ai-handler', {
                body: { endpoint: 'generateJson', prompt, systemInstruction }
            });

            if (funcError) throw funcError;

            const parsedData = JSON.parse(data.text);
            
            if (parsedData.story && Array.isArray(parsedData.prompts)) {
                setStoryTemplate(parsedData);
                setGamePhase('word_input');
            } else {
                throw new Error("AI response was not in the expected format.");
            }
        } catch (e: any) {
            console.error("Error getting Mad Libs template:", e);
            setError("Couldn't create a story. Please try another theme.");
            setGamePhase('theme_selection');
        } finally {
            setIsLoadingTemplate(false);
        }
    }, [selectedTheme, IS_TESTING_MODE]);

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

    return React.createElement('div', { style: styles.familyGamesContainer },
        React.createElement('button', {
            onClick: () => onNavigate('lockerRoom'),
            style: { ...styles.backButton, float: 'left', marginTop: 0, marginLeft: 0, marginBottom: '15px' },
            'aria-label': "Back to The Locker Room"
        }, "← Back to The Locker Room"),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "🎲 AI Mad Libs"),

        gamePhase === 'theme_selection' && React.createElement('div', { style: styles.madLibsThemeSelection },
            React.createElement('h3', { style: styles.madLibsThemeTitle }, "Choose a Story Theme!"),
            React.createElement('div', { style: styles.madLibsThemeButtonContainer },
                AVAILABLE_THEMES.map(theme =>
                    React.createElement('button', {
                        key: theme,
                        onClick: () => setSelectedTheme(theme),
                        style: selectedTheme === theme ? { ...styles.madLibsThemeButton, ...styles.madLibsThemeButtonSelected } : styles.madLibsThemeButton
                    }, theme)
                )
            ),
            React.createElement('button', {
                onClick: handleStartGame,
                disabled: !selectedTheme || isLoadingTemplate,
                style: { ...styles.madLibsActionButton, backgroundColor: '#5cb85c', marginTop: '20px' }
            }, isLoadingTemplate ? "Loading Story..." : "Start Game")
        ),

        gamePhase === 'word_input' && storyTemplate && React.createElement('div', { style: styles.madLibsWordInputSection },
            React.createElement('h3', { style: styles.sectionTitle }, "Fill in the Blanks!"),
            React.createElement('p', { style: { color: '#666' } }, `Give me some words for our "${selectedTheme}" story...`),
            storyTemplate.prompts.map(prompt =>
                React.createElement('div', { key: prompt.id, style: styles.formGroup },
                    React.createElement('label', { htmlFor: `madlib-input-${prompt.id}`, style: styles.madLibsPromptLabel }, prompt.label),
                    React.createElement('input', {
                        type: 'text',
                        id: `madlib-input-${prompt.id}`,
                        style: styles.input,
                        value: userWords[prompt.id] || '',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleWordInputChange(prompt.id, e.target.value)
                    })
                )
            ),
            React.createElement('button', {
                onClick: handleShowStory,
                style: { ...styles.madLibsActionButton, backgroundColor: '#ff69b4', marginTop: '10px' }
            }, "Create My Story!")
        ),

        gamePhase === 'story_display' && filledStory && React.createElement('div', { style: styles.madLibsStoryDisplaySection },
            React.createElement('h3', { style: styles.sectionTitle }, `Our ${selectedTheme} Story!`),
            React.createElement('div', { style: styles.madLibsStoryText, dangerouslySetInnerHTML: { __html: filledStory } }),
            React.createElement('button', {
                onClick: handlePlayAgain,
                style: { ...styles.madLibsActionButton, backgroundColor: '#007bff', marginTop: '20px' }
            }, "Play Again")
        ),

        error && React.createElement('p', { style: styles.aiError }, error)
    );
}
