import React, { useState, useMemo, useEffect } from 'react';
import type { PageView, Profile, Chore, FamilyEvent, PlannedMeal, ModuleDefinition, ShoutOut } from '../types/index';
import { BADGE_DEFINITIONS } from '../constants/badges';
import { ALL_MODULES } from '../constants/navigation';
import { styles } from '../styles/index';
import { isDateToday } from '../utils/utils';
import UpcomingBannerWidget from '../components/ui/UpcomingBannerWidget';
import Modal from '../components/ui/Modal';
import { supabase } from '../services/supabaseClient';
import { useAppContext } from '../contexts/AppContext';
import HubTile from '../components/ui/HubTile';
import ChoreListWidget from '../components/ui/ChoreListWidget';
import WeatherWidget from '../components/ui/WeatherWidget';

interface DashboardViewProps {
    setCurrentViewingProfileId: (id: string | null) => void;
}

export default function DashboardView({
    setCurrentViewingProfileId,
}: DashboardViewProps) {
    const { onNavigate, profiles, currentViewingProfile, personalizationData, chores, familyEvents, addToast, IS_TESTING_MODE, getProfileName } = useAppContext();
    const [aiBriefing, setAiBriefing] = useState<string | null>(null);
    const [isBriefingLoading, setIsBriefingLoading] = useState(false);
    const [isShoutOutHovered, setIsShoutOutHovered] = useState(false);
    
    useEffect(() => {
        if (!currentViewingProfile) {
            setIsBriefingLoading(false);
            setAiBriefing("Welcome! Let's have a great day.");
            return;
        }

        if (IS_TESTING_MODE) {
            setAiBriefing(`Welcome, ${currentViewingProfile.name}! Let's make today great.`);
            setIsBriefingLoading(false);
            return;
        }

        const fetchBriefing = async () => {
            setIsBriefingLoading(true);
            
            const todaysChores = chores.filter(c => c.assignedTo === currentViewingProfile.id && isDateToday(c.dueDate) && c.status !== 'completed');
            const todaysEvents = familyEvents.filter(e => isDateToday(e.date));

            let prompt = `Give me a short, encouraging daily briefing for ${currentViewingProfile.name}.`;
            if (todaysChores.length > 0) {
                prompt += ` They have these chores today: ${todaysChores.map(c => c.name).join(', ')}.`;
            } else {
                prompt += " They have no chores assigned for today.";
            }
            if (todaysEvents.length > 0) {
                prompt += ` Upcoming events for the family today are: ${todaysEvents.map(e => e.title).join(', ')}.`;
            }
            prompt += " Keep it concise and positive.";

            try {
                const { data, error } = await supabase.functions.invoke('ai-handler', {
                    body: { endpoint: 'generateText', prompt }
                });
                if (error) throw error;
                setAiBriefing(data.text);
            } catch (error) {
                console.error("Error fetching AI briefing:", error);
                setAiBriefing(`Welcome, ${currentViewingProfile.name}! Have a fantastic day.`);
            } finally {
                setIsBriefingLoading(false);
            }
        };

        fetchBriefing();
    }, [currentViewingProfile, chores, familyEvents, IS_TESTING_MODE]);

    const dashboardLayout = useMemo(() => {
        if (!currentViewingProfile) return [];

        const modulesForUser = ALL_MODULES.filter(module => {
            if (currentViewingProfile.role === 'adult') return !module.childOnly;
            if (currentViewingProfile.role === 'child') return !module.parentOnly;
            return true;
        });

        const userLayout = currentViewingProfile.dashboardLayout;

        if (userLayout && userLayout.length > 0) {
            // User has a saved layout. Filter it to ensure all modules are still valid for their role.
            const userLayoutPages = new Set(userLayout.map(item => item.page));
            const availableModulePages = new Set(modulesForUser.map(m => m.page));
            
            const validLayout = userLayout.filter(item => availableModulePages.has(item.page));
            
            // Find any new modules that were added to the app since the user saved their layout
            const newModules = modulesForUser.filter(module => !userLayoutPages.has(module.page));
            
            // Combine them. The user's ordered layout comes first, then any new ones.
            return [...validLayout, ...newModules.map(m => ({ page: m.page, visible: true }))];
        } else {
            // No saved layout, return the default list for their role
            return modulesForUser.map(m => ({ page: m.page, visible: true }));
        }
    }, [currentViewingProfile, ALL_MODULES]);
    
    const latestShoutOut = useMemo(() => {
        const shoutOuts = personalizationData?.shoutOuts || [];
        if (shoutOuts.length === 0) return null;
        return [...shoutOuts].sort((a, b) => b.timestamp - a.timestamp)[0];
    }, [personalizationData?.shoutOuts]);

    if (!personalizationData || !currentViewingProfile) {
        return React.createElement('div', {style: styles.loadingMessage}, 'Loading dashboard...');
    }
    
    const MemberInfo = () => (
        React.createElement('div', { style: styles.memberInfoFrame },
            React.createElement('h2', { style: styles.memberInfoName },
                React.createElement('span', null, currentViewingProfile.avatarUrl), ' ', currentViewingProfile.name
            ),
            React.createElement('div', { style: styles.memberInfoRolePoints },
                React.createElement('span', null, `Role: ${currentViewingProfile.role.charAt(0).toUpperCase() + currentViewingProfile.role.slice(1)}`),
                personalizationData.gamifyTasks && React.createElement(React.Fragment, null,
                    React.createElement('span', null, "|"),
                    React.createElement('span', null, `${currentViewingProfile.points} Points 🌟`)
                ),
                personalizationData?.allowanceSettings?.enabled && React.createElement(React.Fragment, null,
                     React.createElement('span', null, "|"),
                     React.createElement('span', null, `Balance: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentViewingProfile.balance || 0)} 💵`)
                )
            ),
            React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' } },
                currentViewingProfile.earnedBadges.map(badgeId => {
                    const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                    if (!badge) return null;
                    return React.createElement('span', { key: badgeId, title: `${badge.name}: ${badge.description}`, style: { fontSize: '1.5em' } }, badge.icon);
                })
            )
        )
    );
    
    const renderShoutOutWidget = () => {
        if (!latestShoutOut) return null;

        const shoutOutStyle = {
            ...styles.shoutOutDashboardWidget,
            ...(isShoutOutHovered ? {
                transform: 'rotate(0deg) translateY(-3px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            } : {})
        };

        return React.createElement('button', {
            style: shoutOutStyle,
            onClick: () => onNavigate('shoutOuts'),
            onMouseEnter: () => setIsShoutOutHovered(true),
            onMouseLeave: () => setIsShoutOutHovered(false)
        },
            React.createElement('div', { style: styles.shoutOutPin, 'aria-hidden': 'true' }),
            React.createElement('h4', { style: { marginTop: 0, fontFamily: "'Caveat', cursive", fontSize: '1.4em' } }, `A little bird told me...`),
            React.createElement('p', { style: styles.shoutOutDashboardWidgetQuote }, `"${latestShoutOut.message}"`),
            React.createElement('p', { style: styles.shoutOutDashboardWidgetFrom },
                `- ${getProfileName(latestShoutOut.fromProfileId)} to ${getProfileName(latestShoutOut.toProfileId)}`
            )
        );
    };

    const renderGrid = () => {
        const itemsToRender = dashboardLayout.filter(item => item.visible);

        return React.createElement('div', { style: styles.hubGrid },
            itemsToRender.map((layoutItem) => {
                const module = ALL_MODULES.find(m => m.page === layoutItem.page);
                if (!module) return null;
                
                if (module.widget === 'chores') {
                    return React.createElement(ChoreListWidget, {
                        key: module.page,
                        onClick: () => onNavigate('chores'),
                    });
                }

                if (module.widget === 'upcoming') {
                     return React.createElement(UpcomingBannerWidget, {
                        key: module.page,
                        onNavigate,
                    });
                }

                if (module.widget === 'weather') {
                    return React.createElement(WeatherWidget, {
                        key: module.page,
                    });
                }
                
                return React.createElement(HubTile, {
                    key: module.page,
                    title: module.title,
                    icon: module.icon,
                    description: module.description,
                    notification: false,
                    onClick: () => onNavigate(module.page),
                });
            })
        );
    };

    return (
        React.createElement('div', { style: styles.pageContainer, className: 'dashboard-grid' },
            React.createElement('section', { style: { ...styles.section, textAlign: 'center' } },
                personalizationData.familyBranding?.motto && (
                    React.createElement('p', { style: styles.dashboardMotto }, `"${personalizationData.familyBranding.motto}"`)
                ),
                React.createElement('div', { style: styles.viewAsContainer },
                    React.createElement('label', { htmlFor: 'viewAsProfileSelect', style: styles.label }, "Viewing As:"),
                    React.createElement('select', {
                        id: 'viewAsProfileSelect',
                        style: styles.selectInput,
                        value: currentViewingProfile.id,
                        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentViewingProfileId(e.target.value),
                    } as React.HTMLProps<HTMLSelectElement>,
                        profiles.filter(p => p.status !== 'disabled').map(p => React.createElement('option', { key: p.id, value: p.id }, `${p.name} (${p.role})`))
                    )
                ),
                React.createElement(MemberInfo)
            ),
            renderShoutOutWidget(),
            React.createElement('section', { style: styles.aiBriefingContainerDashboard },
                isBriefingLoading 
                ? React.createElement('p', { style: styles.aiBriefingTextDashboard }, '☀️ Getting your daily briefing...')
                : React.createElement('p', { style: styles.aiBriefingTextDashboard }, aiBriefing || "Welcome! Let's have a great day.")
            ),
            renderGrid()
        )
    );
};
