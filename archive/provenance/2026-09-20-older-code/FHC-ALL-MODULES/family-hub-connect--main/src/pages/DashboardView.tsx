
//DashboardView.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { HubTile, BottomNavbar } from '../components.tsx';
import { ALL_MODULES } from '../constants/navigation.ts';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { isDateToday } from '../utils/utils.ts';


const DashboardView = () => {
    const { onNavigate, setCurrentViewingProfile } = useAppDispatch();
    const { profiles, viewingAsProfileId, personalizationData, chores, familyEvents } = useAppState();
    const currentViewingProfile = useMemo(() => profiles.find(p => p.id === viewingAsProfileId), [profiles, viewingAsProfileId]);
    
    const getProfileName = (profileId: string): string => {
        const profile = profiles.find(p => p.id === profileId);
        return profile ? profile.name : 'Unknown';
    };

    const [aiBriefing, setAiBriefing] = useState<string | null>(null);
    const [isBriefingLoading, setIsBriefingLoading] = useState(false);

    const isChildView = currentViewingProfile?.role === 'Child';

    useEffect(() => {
        if (!currentViewingProfile) return;

        const fetchBriefing = async () => {
            setIsBriefingLoading(true);
            try {
                const todaysChores = chores.filter(c => c.assignedTo === currentViewingProfile.id && isDateToday(c.dueDate) && c.status !== 'completed');
                const todaysEvents = familyEvents.filter(e => isDateToday(e.date));

                let prompt = `Give me a very short, encouraging, and fun daily briefing for ${currentViewingProfile.name}.`;
                if (todaysChores.length > 0) {
                    prompt += ` They have these chores today: ${todaysChores.map(c => c.name).join(', ')}.`;
                } else {
                    prompt += " They have no chores assigned for today.";
                }
                if (todaysEvents.length > 0) {
                    prompt += ` The family has these events today: ${todaysEvents.map(e => e.title).join(', ')}.`;
                }
                prompt += " Keep it to 2-3 sentences and end with a positive emoji. ✨";
                
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: prompt,
                });

                setAiBriefing(response.text ?? `Welcome, ${currentViewingProfile.name}! Have a fantastic day!`);

            } catch (error) {
                console.error("Error fetching AI briefing:", error);
                setAiBriefing(`Welcome, ${currentViewingProfile.name}! Have a fantastic day!`);
            } finally {
                setIsBriefingLoading(false);
            }
        };

        fetchBriefing();

    }, [currentViewingProfile, chores, familyEvents]);

    const latestShoutOut = useMemo(() => {
        const shoutOuts = personalizationData?.shoutOuts || [];
        if (shoutOuts.length === 0) return null;
        return [...shoutOuts].sort((a, b) => b.timestamp - a.timestamp)[0];
    }, [personalizationData?.shoutOuts]);

    const visibleModules = useMemo(() => {
        if (!currentViewingProfile) return [];

        const userLayout = currentViewingProfile.dashboardLayout || ALL_MODULES.map(m => ({ page: m.page, visible: true }));
        const visiblePages = new Set(userLayout.filter(item => item.visible).map(item => item.page));
        
        return ALL_MODULES.filter(module => {
            if (!visiblePages.has(module.page)) return false;
            if (isChildView && module.parentOnly) return false;
            if (!isChildView && module.childOnly) return false;
            return true;
        });
    }, [currentViewingProfile, isChildView]);


    return (
         <div className="page">
            <header className="header">
                <div className="header-left">
                    {personalizationData?.familyBranding?.crestUrl && <img src={personalizationData.familyBranding.crestUrl} alt="Family Crest" className="crest" />}
                    <h2>{personalizationData?.familyName || 'Family Hub'}</h2>
                </div>
                <div className="profile-select-wrapper">
                    <label htmlFor="profile-select">Viewing As:</label>
                    <select 
                        id="profile-select"
                        value={currentViewingProfile?.id || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const profile = profiles.find(p => p.id === e.target.value);
                            if (profile) {
                                setCurrentViewingProfile(profile);
                            }
                        }}
                    >
                        {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </header>
            <main className="main">
                <section className="member-info-frame">
                    <h2 className="member-info-name">{currentViewingProfile?.name}</h2>
                    <p className="member-info-role-points">{`Role: ${currentViewingProfile?.role}`}</p>
                </section>

                {personalizationData?.familyBranding?.motto && <p className="dashboard-motto">{`"${personalizationData.familyBranding.motto}"`}</p>}

                <div className="hub-grid">
                    <div className="card ai-briefing-card">
                        <h3 className="font-bold text-large mt-0">☀️ Daily Briefing</h3>
                        <p>{isBriefingLoading ? 'Checking your schedule...' : aiBriefing}</p>
                    </div>

                    {latestShoutOut && (
                         <div className="card shout-out-card" onClick={() => onNavigate('shoutOuts')}>
                            <div className="shout-out-pin" />
                            <h3 className="font-bold text-large mt-0">Latest Shout-Out!</h3>
                            <p className="shout-out-quote">"{latestShoutOut.message}"</p>
                            <p className="shout-out-from">
                                - {getProfileName(latestShoutOut.fromProfileId)} to {getProfileName(latestShoutOut.toProfileId)}
                            </p>
                        </div>
                    )}

                    {visibleModules.map(module => (
                        <HubTile 
                            key={module.page}
                            title={isChildView && module.childTitle ? module.childTitle : module.title}
                            icon={module.icon}
                            description={module.description}
                            onClick={() => onNavigate(module.page)}
                        />
                    ))}
                </div>
            </main>
            <BottomNavbar activePage="dashboard" onNavigate={onNavigate} />
        </div>
    );
};

export default DashboardView;