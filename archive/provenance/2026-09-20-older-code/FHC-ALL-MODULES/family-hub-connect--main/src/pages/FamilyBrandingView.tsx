import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ArrowLeftIcon, LoadingSpinner } from '../components.tsx';

export default function FamilyBrandingView({ onBack }: { onBack: () => void }) {
    const { onSavePersonalization, addToast, generateFamilyCrest } = useAppDispatch();
    const { personalizationData } = useAppState();
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
        try {
            const url = await generateFamilyCrest(crestPrompt);
            if(url) setCrestUrl(url);
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

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={onBack} title="Go back">
                    <ArrowLeftIcon />
                </button>
                <h2>🎨 Family Branding</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <section className="card">
                    <div className="form-group">
                        <label>Family Motto:</label>
                        <input value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="e.g., Always be kind" />
                    </div>
                    <div className="form-group">
                        <label>Header Font:</label>
                        <label htmlFor="headerFontSelect">Header Font:</label>
                        <select id="headerFontSelect" value={headerFont} onChange={(e) => setHeaderFont(e.target.value)}>
                            {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Body Font:</label>
                        <label htmlFor="bodyFontSelect">Body Font:</label>
                        <select id="bodyFontSelect" value={bodyFont} onChange={(e) => setBodyFont(e.target.value)}>
                            {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Border Radius:</label>
                        <label htmlFor="borderRadiusSelect">Border Radius:</label>
                        <select id="borderRadiusSelect" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)}>
                            <option value='4px'>Subtle</option>
                            <option value='8px'>Standard</option>
                            <option value='16px'>Rounded</option>
                            <option value='50px'>Pill</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>AI Family Crest:</label>
                        {crestUrl && <img src={crestUrl} alt="Family Crest" style={{width: '100px', height: '100px', marginBottom: '10px'}}/>}
                        <input value={crestPrompt} onChange={(e) => setCrestPrompt(e.target.value)} placeholder='e.g., A lion and a wolf high-fiving'/>
                        <button onClick={handleGenerateCrest} disabled={isGenerating} className="btn w-auto mt-10">
                            {isGenerating ? 'Generating...' : 'Generate Crest'}
                        </button>
                         {isGenerating && <LoadingSpinner message="" />}
                    </div>
                    <button onClick={handleSave} className="btn w-100 mt-20">Save Branding</button>
                </section>
            </main>
        </div>
    );
}