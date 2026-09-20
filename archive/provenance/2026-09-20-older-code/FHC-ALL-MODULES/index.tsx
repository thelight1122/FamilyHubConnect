import ReactDOM from 'react-dom/client';
import React, { useState } from 'react';

// --- STYLES ---
import { styles } from './styles';
import AnimationAndFlairStyles from './AnimationAndFlairStyles';

// --- DATA & TYPES ---
import { Profile, PersonalizationData } from './types';
import { ALL_MODULES } from './constants';
import { MOCK_PROFILES, MOCK_PERSONALIZATION_DATA } from './mockData';

// --- CONTEXT ---
import { MockAppProvider } from './AppContext';

// --- SHARED COMPONENTS ---
import { Toast } from './components';

// --- VIEWS (PAGES) ---
import DashboardView from './DashboardView';
import GenericPlaceholderView from './GenericPlaceholderView';
import FamilyFoundationsView from './FamilyFoundationsView';
import FamilyMattersView from './FamilyMattersView';
import FamilyMeetingsView from './FamilyMeetingsView';
import FamilyCourtView from './FamilyCourtView';
import ConsequencesView from './ConsequencesView';
import MealPlanView from './MealPlanView';
import AllowanceView from './AllowanceView';
import ChoresView from './ChoresView';
import ShoppingListView from './ShoppingListView';
import MessagesView from './MessagesView';
import PhotoAlbumsView from './PhotoAlbumsView';
import MovieNightView from './MovieNightView';
import ReadingCornerView from './ReadingCornerView';
import FamilyGamesView from './FamilyGamesView';
import TripPlannerView from './TripPlannerView';
import FinanceHubView from './FinanceHubView';
import BudgetsView from './BudgetsView';
import SavingsGoalsView from './SavingsGoalsView';
import HomeManagementView from './HomeManagementView';
import MaintenanceScheduleView from './MaintenanceScheduleView';
import HomeProjectsView from './HomeProjectsView';
import ServiceContactsView from './ServiceContactsView';
import SkillsTrackerView from './SkillsTrackerView';
import RoutineBuilderView from './RoutineBuilderView';
import DigitalDeskView from './DigitalDeskView';
import HomeworkHelperView from './HomeworkHelperView';
import ShoutOutsView from './ShoutOutsView';
import LockerRoomView from './LockerRoomView';
import SmartHomeView from './SmartHomeView';


// --- ONBOARDING (Disabled) ---
const OnboardingFlow = ({ onOnboardingComplete }: { onOnboardingComplete: (data: any) => void }) => { return <div style={{padding: '20px'}}>Onboarding Disabled</div>; };


// --- MAIN APP COMPONENT ---
export default function App() {
    const [isOnboarded, setIsOnboarded] = useState(true); // Onboarding is now disabled by default
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
    const [currentProfile, setCurrentProfile] = useState<Profile>(MOCK_PROFILES[0]);
    const [personalizationData, setPersonalizationData] = useState<PersonalizationData>(MOCK_PERSONALIZATION_DATA);
    const [toasts, setToasts] = useState<{id: number; message: string; type: 'info' | 'badge'}[]>([]);
    

    const addToast = (message: string, type: 'info' | 'badge') => {
        const id = Date.now();
        setToasts(t => [...t, { id, message, type }]);
        setTimeout(() => {
            setToasts(t => t.filter(toast => toast.id !== id));
        }, 3100);
    };

    const handleOnboardingComplete = ({ profiles, personalizationData }: { profiles: Profile[], personalizationData: PersonalizationData }) => {
        setProfiles(profiles);
        setPersonalizationData(personalizationData);
        setCurrentProfile(profiles[0]);
        setIsOnboarded(true);
        setCurrentPage('dashboard');
    };

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
    };
    
    const renderPage = () => {
        if (!isOnboarded) {
            return <OnboardingFlow onOnboardingComplete={handleOnboardingComplete} />;
        }
        
        const module = ALL_MODULES.find(m => m.page === currentPage);
        const title = currentProfile.role === 'Child' && module?.childTitle ? module.childTitle : module?.title;
        
        switch (currentPage) {
            case 'dashboard':
                return <DashboardView />;
            case 'familyFoundations':
                return <FamilyFoundationsView />;
            case 'familyMatters':
                return <FamilyMattersView />;
            case 'familyMeeting':
                return <FamilyMeetingsView />;
            case 'familyCourt':
                return <FamilyCourtView />;
            case 'consequences':
                return <ConsequencesView />;
            case 'mealPlan':
                return <MealPlanView />;
            case 'allowance':
                return <AllowanceView />;
            case 'chores':
                return <ChoresView />;
            case 'shoppingList':
                return <ShoppingListView />;
            case 'messages':
                return <MessagesView />;
            case 'photoAlbum':
                return <PhotoAlbumsView />;
            case 'movieNightPicker':
                return <MovieNightView />;
            case 'readingCorner':
                return <ReadingCornerView />;
            case 'familyGames':
                return <FamilyGamesView />;
            case 'tripPlanner':
                return <TripPlannerView />;
            case 'finance':
                return <FinanceHubView />;
            case 'budgets':
                return <BudgetsView />;
            case 'savingsGoals':
                return <SavingsGoalsView />;
            case 'homeManagement':
                return <HomeManagementView />;
            case 'maintenanceSchedule':
                return <MaintenanceScheduleView />;
            case 'homeProjects':
                return <HomeProjectsView />;
            case 'homeInventory':
                return <GenericPlaceholderView pageTitle="Home Inventory" />;
            case 'serviceContacts':
                return <ServiceContactsView />;
            case 'smartHome':
                return <SmartHomeView />;
            case 'digitalDesk':
                return <DigitalDeskView />;
            case 'homeworkHelper':
                return <HomeworkHelperView />;
            case 'skillsTracker':
                return <SkillsTrackerView />;
            case 'habitTracker':
                return <RoutineBuilderView />;
            case 'shoutOuts':
                return <ShoutOutsView />;
            case 'lockerRoom':
                return <LockerRoomView />;
            default:
                return <GenericPlaceholderView pageTitle={title || 'Coming Soon'} />;
        }
    };

    return (
        <MockAppProvider 
            onNavigate={handleNavigate} 
            profiles={profiles}
            setProfiles={setProfiles}
            currentProfile={currentProfile} 
            setCurrentProfile={setCurrentProfile}
            personalizationData={personalizationData}
            setPersonalizationData={setPersonalizationData}
            addToast={addToast}
        >
            <AnimationAndFlairStyles />
            {renderPage()}
            <div style={styles.toastArea}>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(t => t.filter(t => t.id !== toast.id))} />
                ))}
            </div>
        </MockAppProvider>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);