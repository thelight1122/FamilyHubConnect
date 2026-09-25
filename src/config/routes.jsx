import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../templates/main/MainLayout';
import { getOrbForRoute, orbIds } from '../pod';
import { paths } from './paths';
export { paths } from './paths';

// Pages load on first visit (code-split); the login page stays in the main bundle.

// Onboarding & Auth
import LoginPage from '../pages/LoginPage';
const InviteFamilyPage = lazy(() => import('../pages/onboarding/InviteFamilyPage'));
const OnboardingRulesPage = lazy(() => import('../pages/onboarding/OnboardingRulesPage'));
const OnboardingSetupPage = lazy(() => import('../pages/onboarding/OnboardingSetupPage'));
const OnboardingValuesPage = lazy(() => import('../pages/onboarding/OnboardingValuesPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));
const JoinPage = lazy(() => import('../pages/JoinPage'));
const FamilyMembersPage = lazy(() => import('../pages/more/FamilyMembersPage'));

// Generic Dash (redirects)
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const MaintenancePage = lazy(() => import('../pages/adult/MaintenancePage'));

// Templates
const ChildDashboard = lazy(() => import('../templates/child/ChildDashboard'));
const AdultDashboard = lazy(() => import('../templates/adult/AdultDashboard'));

// Features
const FinancePage = lazy(() => import('../pages/finance/FinancePage'));
const MarketPage = lazy(() => import('../pages/finance/MarketPage'));
const LoanPage = lazy(() => import('../pages/finance/LoanPage'));
const LoanConfirmationPage = lazy(() => import('../pages/finance/LoanConfirmationPage'));
const ChoresPage = lazy(() => import('../pages/ChoresPage'));
const LockerRoomPage = lazy(() => import('../pages/sports/LockerRoomPage'));
const TeamChatPage = lazy(() => import('../pages/sports/TeamChatPage'));
const MorePage = lazy(() => import('../pages/more/MorePage'));
const ConstitutionPage = lazy(() => import('../pages/more/ConstitutionPage'));
const TimelinePage = lazy(() => import('../pages/more/TimelinePage'));
const PetHubPage = lazy(() => import('../pages/more/PetHubPage'));
const HealthPage = lazy(() => import('../pages/more/HealthPage'));
const AssistantPage = lazy(() => import('../pages/more/AssistantPage'));
const TransparencyPage = lazy(() => import('../pages/more/TransparencyPage'));

// Adult only modules
const AppealPage = lazy(() => import('../pages/more/AppealPage'));
const AppealReviewPage = lazy(() => import('../pages/more/AppealReviewPage'));
const CreatorStudioPage = lazy(() => import('../pages/more/CreatorStudioPage'));
const FamilyGovernancePage = lazy(() => import('../pages/more/FamilyGovernancePage'));
const FamilyCourtPage = lazy(() => import('../pages/more/FamilyCourtPage'));
const NegotiationPage = lazy(() => import('../pages/more/NegotiationPage'));
const ResolutionConfirmedPage = lazy(() => import('../pages/more/ResolutionConfirmedPage'));

// Shared navigation definitions mapped for UI tabs
export const childNavTabs = [
  { label: 'Home', icon: 'home', path: paths.childDashboard, match: paths.childDashboard, orbId: orbIds.FAMILY_POD },
  { label: 'Wallet', icon: 'account_balance_wallet', path: paths.finance, match: paths.finance, orbId: orbIds.FINANCE_LEARNING },
  { label: 'Chores', icon: 'checklist', path: paths.chores, match: paths.chores, orbId: orbIds.CHORES },
  { label: 'Sports', icon: 'sports_soccer', path: paths.sports, match: paths.sports, badge: 2, orbId: orbIds.SPORTS_TEAM },
  { label: 'More', icon: 'grid_view', path: paths.more, match: paths.more, badge: 1 },
];

export const adultNavTabs = [
  { label: 'HQ', icon: 'home_app_logo', path: paths.adultDashboard, match: paths.adultDashboard, orbId: orbIds.FAMILY_POD },
  { label: 'Finance', icon: 'account_balance_wallet', path: paths.finance, match: paths.finance, orbId: orbIds.FINANCE_LEARNING },
  { label: 'Chores', icon: 'checklist', path: paths.chores, match: paths.chores, orbId: orbIds.CHORES },
  { label: 'Maint.', icon: 'handyman', path: paths.adultMaintenance, match: paths.adultMaintenance, orbId: orbIds.AUTO_MAINTENANCE },
  { label: 'More', icon: 'grid_view', path: paths.more, match: paths.more, badge: 3 },
];

export const publicRoutes = [
  { path: paths.login, element: <LoginPage /> },
  { path: paths.signup, element: <SignUpPage /> },
  { path: paths.join, element: <JoinPage /> },
  { path: paths.invite, element: <InviteFamilyPage /> },
  { path: paths.onboardingSetup, element: <OnboardingSetupPage /> },
  { path: paths.onboardingInvite, element: <InviteFamilyPage /> },
  { path: paths.onboardingValues, element: <OnboardingValuesPage /> },
  { path: paths.onboardingRules, element: <OnboardingRulesPage /> },
];

export const mainLayoutRoute = {
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: paths.childDashboard, element: <ProtectedRoute allowedRoles={['child']}><ChildDashboard /></ProtectedRoute> },
    { path: paths.adultDashboard, element: <ProtectedRoute allowedRoles={['adult']}><AdultDashboard /></ProtectedRoute> },
    { path: paths.adultMaintenance, element: <ProtectedRoute allowedRoles={['adult']}><MaintenancePage /></ProtectedRoute> },
    
    // Shared features
    { path: paths.finance, element: <FinancePage /> },
    { path: paths.financeMarket, element: <MarketPage /> },
    { path: paths.financeLoan, element: <LoanPage /> },
    { path: paths.financeLoanConfirmation, element: <LoanConfirmationPage /> },
    { path: paths.chores, element: <ChoresPage /> },
    { path: paths.sports, element: <LockerRoomPage /> },
    { path: paths.sportsChat, element: <TeamChatPage /> },
    { path: paths.more, element: <MorePage /> },
    { path: paths.moreAssistant, element: <AssistantPage /> },
    { path: paths.moreConstitution, element: <ConstitutionPage /> },
    { path: paths.moreTimeline, element: <TimelinePage /> },
    { path: paths.morePets, element: <PetHubPage /> },
    { path: paths.moreHealth, element: <HealthPage /> },
    { path: paths.moreFamily, element: <FamilyMembersPage /> },
    { path: paths.moreTransparency, element: <ProtectedRoute allowedRoles={['adult']}><TransparencyPage /></ProtectedRoute> },
    { path: paths.moreAppeal, element: <AppealPage /> },
    { path: paths.moreAppealNegotiation, element: <NegotiationPage /> },
    
    // Role restricted adult modules
    { path: paths.moreAppealReview, element: <ProtectedRoute allowedRoles={['adult']}><AppealReviewPage /></ProtectedRoute> },
    { path: paths.moreCreator, element: <ProtectedRoute allowedRoles={['adult']}><CreatorStudioPage /></ProtectedRoute> },
    { path: paths.moreGovernance, element: <ProtectedRoute allowedRoles={['adult']}><FamilyGovernancePage /></ProtectedRoute> },
    // Accountability is mutual: children give their accounts too (spec §3).
    { path: paths.moreCourt, element: <ProtectedRoute allowedRoles={['adult', 'child']}><FamilyCourtPage /></ProtectedRoute> },
    { path: paths.moreAppealResolution, element: <ProtectedRoute allowedRoles={['adult']}><ResolutionConfirmedPage /></ProtectedRoute> },
  ]
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

export const routeOrbAssignments = Object.freeze(
  Object.values(paths).reduce((assignments, route) => {
    const orb = getOrbForRoute(route);
    return orb ? { ...assignments, [route]: orb.id } : assignments;
  }, {}),
);
