import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdultLayout from '../templates/adult/AdultLayout';
import ChildLayout from '../templates/child/ChildLayout';
import { paths } from './paths';
export { paths } from './paths';

// Onboarding & Auth
import LoginPage from '../pages/LoginPage';
import InviteFamilyPage from '../pages/onboarding/InviteFamilyPage';
import OnboardingRulesPage from '../pages/onboarding/OnboardingRulesPage';
import OnboardingValuesPage from '../pages/onboarding/OnboardingValuesPage';

// Generic Dash (redirects)
import DashboardPage from '../pages/DashboardPage';

// Templates
import ChildDashboard from '../templates/child/ChildDashboard';
import AdultDashboard from '../templates/adult/AdultDashboard';

// Features
import FinancePage from '../pages/finance/FinancePage';
import MarketPage from '../pages/finance/MarketPage';
import LoanPage from '../pages/finance/LoanPage';
import LoanConfirmationPage from '../pages/finance/LoanConfirmationPage';
import ChoresPage from '../pages/ChoresPage';
import LockerRoomPage from '../pages/sports/LockerRoomPage';
import TeamChatPage from '../pages/sports/TeamChatPage';
import MorePage from '../pages/more/MorePage';
import ConstitutionPage from '../pages/more/ConstitutionPage';
import TimelinePage from '../pages/more/TimelinePage';
import PetHubPage from '../pages/more/PetHubPage';
import HealthPage from '../pages/more/HealthPage';

// Adult only modules
import AppealPage from '../pages/more/AppealPage';
import AppealReviewPage from '../pages/more/AppealReviewPage';
import CreatorStudioPage from '../pages/more/CreatorStudioPage';
import FamilyGovernancePage from '../pages/more/FamilyGovernancePage';
import FamilyCourtPage from '../pages/more/FamilyCourtPage';
import NegotiationPage from '../pages/more/NegotiationPage';
import ResolutionConfirmedPage from '../pages/more/ResolutionConfirmedPage';


// Shared navigation definitions mapped for UI tabs
export const childNavTabs = [
  { label: 'Home', icon: 'home', path: paths.childDashboard, match: paths.childDashboard },
  { label: 'Wallet', icon: 'account_balance_wallet', path: paths.finance, match: paths.finance },
  { label: 'Chores', icon: 'checklist', path: paths.chores, match: paths.chores },
  { label: 'Sports', icon: 'sports_soccer', path: paths.sports, match: paths.sports, badge: 2 },
  { label: 'More', icon: 'grid_view', path: paths.more, match: paths.more, badge: 1 },
];

export const adultNavTabs = [
  { label: 'HQ', icon: 'home_app_logo', path: paths.adultDashboard, match: paths.adultDashboard },
  { label: 'Finance', icon: 'account_balance_wallet', path: paths.finance, match: paths.finance },
  { label: 'Chores', icon: 'checklist', path: paths.chores, match: paths.chores },
  { label: 'Maint.', icon: 'handyman', path: paths.adultMaintenance, match: paths.adultMaintenance },
  { label: 'More', icon: 'grid_view', path: paths.more, match: paths.more, badge: 3 },
];

export const publicRoutes = [
  { path: paths.login, element: <LoginPage /> },
  { path: paths.invite, element: <InviteFamilyPage /> },
  { path: paths.onboardingValues, element: <OnboardingValuesPage /> },
  { path: paths.onboardingRules, element: <OnboardingRulesPage /> },
];

const sharedProtectedRoutes = [
  { path: paths.finance, element: <FinancePage /> },
  { path: paths.financeMarket, element: <MarketPage /> },
  { path: paths.financeLoan, element: <LoanPage /> },
  { path: paths.financeLoanConfirmation, element: <LoanConfirmationPage /> },
  { path: paths.chores, element: <ChoresPage /> },
  { path: paths.sports, element: <LockerRoomPage /> },
  { path: paths.sportsChat, element: <TeamChatPage /> },
  { path: paths.more, element: <MorePage /> },
  { path: paths.moreConstitution, element: <ConstitutionPage /> },
  { path: paths.moreTimeline, element: <TimelinePage /> },
  { path: paths.morePets, element: <PetHubPage /> },
  { path: paths.moreHealth, element: <HealthPage /> },
  { path: paths.moreAppeal, element: <AppealPage /> },
  { path: paths.moreAppealNegotiation, element: <NegotiationPage /> },
];

export const childRoutes = [
  { path: paths.childDashboard, element: <ChildDashboard /> },
  ...sharedProtectedRoutes
];

export const adultRoutes = [
  { path: paths.adultDashboard, element: <AdultDashboard /> },
  // Maintenance (Placeholder)
  { path: paths.adultMaintenance, element: <div className="p-4 safe-top">Maintenance Dashboard Coming Soon</div> },
  
  // Adult only modules
  { path: paths.moreAppealReview, element: <AppealReviewPage /> },
  { path: paths.moreCreator, element: <CreatorStudioPage /> },
  { path: paths.moreGovernance, element: <FamilyGovernancePage /> },
  { path: paths.moreCourt, element: <FamilyCourtPage /> },
  { path: paths.moreAppealResolution, element: <ResolutionConfirmedPage /> },
  ...sharedProtectedRoutes
];

export const childLayoutRoute = {
  element: (
    <ProtectedRoute allowedRoles={['child']}>
      <ChildLayout />
    </ProtectedRoute>
  ),
  children: childRoutes,
};

export const adultLayoutRoute = {
  element: (
    <ProtectedRoute allowedRoles={['adult']}>
      <AdultLayout />
    </ProtectedRoute>
  ),
  children: adultRoutes,
};

// Auto router based on user role 
export const baseProtectedRoutes = [
  { 
    path: paths.dashboard, 
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ) 
  }
];

export const fallbackRoutes = [
  { path: '/', element: <Navigate to={paths.login} replace /> },
  { path: '*', element: <Navigate to={paths.login} replace /> },
];
