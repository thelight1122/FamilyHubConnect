
import React, { Suspense, lazy, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './src/index.css';

import { useAppState, useAppDispatch } from './src/AppContext.tsx';
import { LoadingSpinner } from './src/components.tsx';
import PersonalizationFormView from './src/pages/PersonalizationFormView.tsx';
import type { PageView } from './src/types.ts';
import {
    CONNECTIONS_MODULES, FINANCE_MODULES, FAMILY_CARE_MODULES, HOME_MANAGEMENT_MODULES,
    THE_FRIDGE_MODULES, FAMILY_MATTERS_MODULES, DIGITAL_DESK_MODULES, LOCKER_ROOM_MODULES,
    CREATORS_STUDIO_MODULES, SETTINGS_MODULES
} from './src/constants/navigation.ts';
import { AppContextProvider } from './src/AppContextProviders.tsx';


// --- LAZY-LOADED VIEW COMPONENTS ---
const PAGE_COMPONENTS: { [key in PageView]?: React.LazyExoticComponent<any> } = {
    'dashboard': lazy(() => import('./src/pages/DashboardView.tsx')),
    'auth': lazy(() => import('./src/pages/AuthView.tsx')),
    'chores': lazy(() => import('./src/pages/ChoresView.tsx')),
    'rewards': lazy(() => import('./src/pages/RewardsView.tsx')),
    'calendar': lazy(() => import('./src/pages/CalendarView.tsx')),
    'shoppingList': lazy(() => import('./src/pages/ShoppingListView.tsx')),
    'settings': lazy(() => import('./src/pages/SettingsView.tsx')),
    'todo': lazy(() => import('./src/pages/TodoView.tsx')),
    'profileSettings': lazy(() => import('./src/pages/ProfileSettingsView.tsx')),
    'connections': lazy(() => import('./src/pages/ConnectionsView.tsx')),
    'messages': lazy(() => import('./src/pages/MessagesView.tsx')),
    'polls': lazy(() => import('./src/pages/PollsView.tsx')),
    'shoutOuts': lazy(() => import('./src/pages/ShoutOutsView.tsx')),
    'finance': lazy(() => import('./src/pages/FinanceView.tsx')),
    'allowance': lazy(() => import('./src/pages/AllowanceView.tsx')),
    'budget': lazy(() => import('./src/pages/BudgetView.tsx')),
    'familyBank': lazy(() => import('./src/pages/FamilyBankView.tsx')),
    'screenTimeBank': lazy(() => import('./src/pages/ScreenTimeBankView.tsx')),
    'marketSim': lazy(() => import('./src/pages/MarketSimView.tsx')),
    'financialLiteracy': lazy(() => import('./src/pages/FinancialLiteracyView.tsx')),
    'familyCare': lazy(() => import('./src/pages/FamilyCareView.tsx')),
    'aiNurse': lazy(() => import('./src/pages/AINurseView.tsx')),
    'health': lazy(() => import('./src/pages/HealthView.tsx')),
    'medicalRecords': lazy(() => import('./src/pages/MedicalRecordsView.tsx')),
    'caregivingCentral': lazy(() => import('./src/pages/CaregivingCentralView.tsx')),
    'homeManagement': lazy(() => import('./src/pages/HomeManagementView.tsx')),
    'vehicleMaintenance': lazy(() => import('./src/pages/VehicleMaintenanceView.tsx')),
    'smartHome': lazy(() => import('./src/pages/SmartHomeView.tsx')),
    'weeklyReport': lazy(() => import('./src/pages/WeeklyReportView.tsx')),
    'theFridge': lazy(() => import('./src/pages/TheFridgeView.tsx')),
    'mealPlan': lazy(() => import('./src/pages/MealPlanView.tsx')),
    'mealSuggestions': lazy(() => import('./src/pages/MealSuggestionView.tsx')),
    'recipeBook': lazy(() => import('./src/pages/RecipeBookView.tsx')),
    'pantry': lazy(() => import('./src/pages/PantryView.tsx')),
    'familyMatters': lazy(() => import('./src/pages/FamilyMattersView.tsx')),
    'familyFoundations': lazy(() => import('./src/pages/FamilyFoundationsView.tsx')),
    'familyMeeting': lazy(() => import('./src/pages/FamilyMeetingsView.tsx')),
    'familyCourt': lazy(() => import('./src/pages/FamilyCourtView.tsx')),
    'consequences': lazy(() => import('./src/pages/ConsequencesView.tsx')),
    'accolades': lazy(() => import('./src/pages/AccoladesView.tsx')),
    'digitalDesk': lazy(() => import('./src/pages/DigitalDeskView.tsx')),
    'homeworkPlanner': lazy(() => import('./src/pages/HomeworkPlannerView.tsx')),
    'homeworkHelper': lazy(() => import('./src/pages/HomeworkHelperView.tsx')),
    'readingCorner': lazy(() => import('./src/pages/ReadingCornerView.tsx')),
    'routineBuilder': lazy(() => import('./src/pages/RoutineBuilderView.tsx')),
    'lockerRoom': lazy(() => import('./src/pages/LockerRoomView.tsx')),
    'skillsTracker': lazy(() => import('./src/pages/SkillsTrackerView.tsx')),
    'familyGames': lazy(() => import('./src/pages/FamilyGamesView.tsx')),
    'movieNightPicker': lazy(() => import('./src/pages/MovieNightPickerView.tsx')),
    'gameScorer': lazy(() => import('./src/pages/GameScorerView.tsx')),
    'creatorsStudio': lazy(() => import('./src/pages/CreatorsStudioView.tsx')),
    'aiAvatarCreator': lazy(() => import('./src/pages/AIAvatarCreatorView.tsx')),
    'storyGenerator': lazy(() => import('./src/pages/StoryGeneratorView.tsx')),
    'drawingBoard': lazy(() => import('./src/pages/DrawingBoardView.tsx')),
    'newsletterCreator': lazy(() => import('./src/pages/NewsletterCreatorView.tsx')),
    'familyTimeline': lazy(() => import('./src/pages/FamilyTimelineView.tsx')),
    'familySettings': lazy(() => import('./src/pages/FamilySettingsView.tsx')),
    'familyBranding': lazy(() => import('./src/pages/FamilyBrandingView.tsx')),
    'choreSettings': lazy(() => import('./src/pages/ChoreSettingsView.tsx')),
    'rewardSettings': lazy(() => import('./src/pages/RewardSettingsView.tsx')),
    'allowanceSettings': lazy(() => import('./src/pages/AllowanceSettingsView.tsx')),
    'navigationSettings': lazy(() => import('./src/pages/NavigationSettingsView.tsx')),
    'dashboardSettings': lazy(() => import('./src/pages/DashboardSettingsView.tsx')),
    'integrations': lazy(() => import('./src/pages/IntegrationsView.tsx')),
    'securitySettings': lazy(() => import('./src/pages/SecuritySettingsView.tsx')),
};

const PageRenderer = () => {
    const { currentPage } = useAppState();
    const { onNavigate, onClearInitialRecipient } = useAppDispatch();
    
    const childToHubMap = useMemo(() => {
        const HUB_CONFIG = {
            connections: CONNECTIONS_MODULES,
            finance: FINANCE_MODULES,
            familyCare: FAMILY_CARE_MODULES,
            homeManagement: HOME_MANAGEMENT_MODULES,
            theFridge: THE_FRIDGE_MODULES,
            familyMatters: FAMILY_MATTERS_MODULES,
            digitalDesk: DIGITAL_DESK_MODULES,
            lockerRoom: LOCKER_ROOM_MODULES,
            creatorsStudio: CREATORS_STUDIO_MODULES,
        };

        const map = new Map<PageView, PageView>();
        for (const hub in HUB_CONFIG) {
            for (const module of HUB_CONFIG[hub as keyof typeof HUB_CONFIG]) {
                map.set(module.page, hub as PageView);
            }
        }
        SETTINGS_MODULES.forEach(page => map.set(page, 'settings'));
        return map;
    }, []);

    const Component = PAGE_COMPONENTS[currentPage];

    if (!Component) {
        const GenericPlaceholderView = lazy(() => import('./src/pages/GenericPlaceholderView.tsx'));
        return <GenericPlaceholderView pageId={currentPage} />;
    }

    const props: any = {};
    const backPage = childToHubMap.get(currentPage);
    if (backPage) {
        props.onBack = () => onNavigate(backPage);
    }
    
    if (currentPage === 'messages') {
        props.onClearInitialRecipient = onClearInitialRecipient;
    }
    if(currentPage === 'upcoming' || currentPage === 'webBrowser') {
        props.onBackToDashboard = () => onNavigate('dashboard');
    }
    
    return <Component {...props} />;
};

const ThemedApp = () => {
    const { personalizationData, viewingAsProfileId, profiles } = useAppState();

    useEffect(() => {
        const root = document.documentElement;
        const currentProfile = profiles.find(p => p.id === viewingAsProfileId);

        const baseTheme = personalizationData?.familyBranding?.['themeOverride'] || {};
        const finalTheme = { ...baseTheme, ...(currentProfile?.theme || {}) };

        const themeKeys = [
            '--primary-color', '--background-color', '--text-color',
            '--accent-color', '--header-bg', '--header-text'
        ];
        
        themeKeys.forEach(key => root.style.removeProperty(key));
        root.style.backgroundImage = '';
        root.style.backgroundSize = '';
        root.style.backgroundPosition = '';
        root.style.backgroundAttachment = '';

        Object.entries(finalTheme).forEach(([key, value]) => {
            if (key === '--background-image' && value) {
                root.style.backgroundImage = `url('${String(value)}')`;
                root.style.backgroundSize = 'cover';
                root.style.backgroundPosition = 'center';
                root.style.backgroundAttachment = 'fixed';
            } else if (key.startsWith('--') && typeof value === 'string') {
                root.style.setProperty(key, value);
            }
        });

    }, [personalizationData, viewingAsProfileId, profiles]);

    return <PageRenderer />;
};

const AppContent = () => {
    const { personalizationData } = useAppState();

    if (!personalizationData) {
        return (
            <Suspense fallback={<LoadingSpinner message="Loading Setup..." />}>
                <PersonalizationFormView />
            </Suspense>
        );
    }

    return (
        <Suspense fallback={<LoadingSpinner message="Loading Page..." />}>
            <ThemedApp />
        </Suspense>
    );
};

const App = () => {
    return (
        <AppContextProvider>
            <AppContent />
        </AppContextProvider>
    );
};

const container = document.getElementById('root');
if (!container) {
    throw new Error("Fatal Error: Could not find the root element to mount the React app.");
}
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
