
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import { supabase } from '../services/supabaseClient';

export default function FamilyBrandingView({ onBack }: { onBack: () => void }) {
    const { personalizationData, onSavePersonalization, addToast, IS_TESTING_MODE } = useAppContext();
    const [motto, setMotto] = useState(personalizationData?.familyBranding?.motto || '');
    const [crestPrompt, setCrestPrompt] = useState('');
    const [crestUrl, setCrestUrl] = useState(personalizationData?.familyBranding?.crestUrl || null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [headerFont, setHeaderFont] = useState(personalizationData?.familyBranding?.headerFont || 'Nunito');
    const [bodyFont, setBodyFont] = useState(personalizationData?.familyBranding?.bodyFont || 'Nunito');
    const [borderRadius, setBorderRadius] = useState(personalizationData?.familyBranding?.borderRadius || '8px');
    
    const GOOGLE_FONTS = ['Nunito', 'Caveat', 'Roboto', 'Montserrat', 'Lato', 'Poppins'];

    const handleGenerateCrest = async () => {
        if (!crestPrompt) { addToast("Please enter a prompt for your crest.", 'info'); return; }
        setIsGenerating(true);
        const fullPrompt = `Family crest, logo style, simple, vector art. Theme: ${crestPrompt}. No text.`;
        
        if (IS_TESTING_MODE) {
            setTimeout(() => {
                setCrestUrl('https://placehold.co/200x200/a2d2ff/ffffff?text=Crest');
                setIsGenerating(false);
            }, 1000);
            return;
        }

        try {
            const { data, error } = await supabase.functions.invoke('ai-handler', {
                body: { endpoint: 'generateImage', prompt: fullPrompt }
            });
            if (error) throw error;
            setCrestUrl(data.imageUrl);
        } catch (e: any) {
            addToast(`Error generating crest: ${e.message}`, 'info');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSave = () => {
        onSavePersonalization({ familyBranding: { motto, crestUrl, headerFont, bodyFont, borderRadius }});
        addToast("Family branding saved!", 'badge');
        onBack();
    };

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('button', { onClick: onBack, style: { ...styles.backButton, float: 'left' } }, "← Back to Settings"),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement('h2', { style: styles.pageHeader }, "🎨 Family Branding"),

        React.createElement('section', { style: styles.section },
            React.createElement('div', {style: styles.formGroup},
                React.createElement('label', {style: styles.label}, 'Family Motto:',
                React.createElement('input', {value: motto, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMotto(e.target.value), style: styles.input, placeholder: 'e.g., Always be kind'}))
            ),
             React.createElement('div', {style: styles.formGroup},
                React.createElement('label', {style: styles.label}, 'Header Font:',
                React.createElement('select', {value: headerFont, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setHeaderFont(e.target.value), style: styles.selectInput},
                    GOOGLE_FONTS.map(f => React.createElement('option', {key: f, value: f}, f))
                ))
            ),
            React.createElement('div', {style: styles.formGroup},
                React.createElement('label', {style: styles.label}, 'Body Font:',
                 React.createElement('select', {value: bodyFont, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setBodyFont(e.target.value), style: styles.selectInput},
                    GOOGLE_FONTS.map(f => React.createElement('option', {key: f, value: f}, f))
                ))
            ),
            React.createElement('div', {style: styles.formGroup},
                React.createElement('label', {style: styles.label}, 'Border Radius:',
                 React.createElement('select', {value: borderRadius, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setBorderRadius(e.target.value), style: styles.selectInput},
                    React.createElement('option', {value: '4px'}, 'Subtle'),
                    React.createElement('option', {value: '8px'}, 'Standard'),
                    React.createElement('option', {value: '16px'}, 'Rounded'),
                    React.createElement('option', {value: '50px'}, 'Pill')
                ))
            ),
             React.createElement('div', {style: styles.formGroup},
                React.createElement('label', {style: styles.label}, 'AI Family Crest:'),
                crestUrl && React.createElement('img', {src: crestUrl, alt: "Family Crest", style: {width: '100px', height: '100px', marginBottom: '10px'}}),
                React.createElement('input', {value: crestPrompt, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCrestPrompt(e.target.value), style: styles.input, placeholder: 'e.g., A lion and a wolf high-fiving'}),
                React.createElement('button', {onClick: handleGenerateCrest, disabled: isGenerating, style: {...styles.button, width: 'auto', marginTop: '5px'}}, isGenerating ? 'Generating...' : 'Generate Crest')
            ),
             React.createElement('button', {onClick: handleSave, style: styles.button}, 'Save Branding')
        )
    );
}
