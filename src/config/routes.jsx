import { Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
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
import AppealPage from '../pages/more/AppealPage';
import AppealReviewPage from '../pages/more/AppealReviewPage';
import CreatorStudioPage from '../pages/more/CreatorStudioPage';
import FamilyGovernancePage from '../pages/more/FamilyGovernancePage';
import FamilyCourtPage from '../pages/more/FamilyCourtPage';
import InviteFamilyPage from '../pages/onboarding/InviteFamilyPage';
import OnboardingRulesPage from '../pages/onboarding/OnboardingRulesPage';
import OnboardingValuesPage from '../pages/onboarding/OnboardingValuesPage';

export const paths = {
  login: '/login',
  invite: '/invite',
  onboardingValues: '/onboarding/values',
  onboardingRules: '/onboarding/rules',
  dashboard: '/dashboard',
  finance: '/finance',
  financeMarket: '/finance/market',
  financeLoan: '/finance/loan',
  financeLoanConfirmation: '/finance/loan/confirmation',
  chores: '/chores',
  sports: '/sports',
  sportsChat: '/sports/chat',
  more: '/more',
  moreConstitution: '/more/constitution',
  moreTimeline: '/more/timeline',
  morePets: '/more/pets',
  moreHealth: '/more/health',
  moreAppeal: '/more/appeal',
  moreAppealReview: '/more/appeal/review',
  moreCreator: '/more/creator',
  moreGovernance: '/more/governance',
  moreCourt: '/more/court',
};

export const bottomNavTabs = [
  { label: 'Home', icon: 'home', path: paths.dashboard, match: paths.dashboard },
  { label: 'Finance', icon: 'account_balance_wallet', path: paths.finance, match: paths.finance },
  { label: 'Chores', icon: 'checklist', path: paths.chores, match: paths.chores },
  { label: 'Sports', icon: 'sports_soccer', path: paths.sports, match: paths.sports },
  { label: 'More', icon: 'grid_view', path: paths.more, match: paths.more },
];

export const publicRoutes = [
  { path: paths.login, element: <LoginPage /> },
  { path: paths.invite, element: <InviteFamilyPage /> },
  { path: paths.onboardingValues, element: <OnboardingValuesPage /> },
  { path: paths.onboardingRules, element: <OnboardingRulesPage /> },
];

export const protectedRoutes = [
  { path: paths.dashboard, element: <DashboardPage /> },
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
  { path: paths.moreAppealReview, element: <AppealReviewPage /> },
  { path: paths.moreCreator, element: <CreatorStudioPage /> },
  { path: paths.moreGovernance, element: <FamilyGovernancePage /> },
  { path: paths.moreCourt, element: <FamilyCourtPage /> },
];

export const protectedLayoutRoute = {
  element: (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  ),
  children: protectedRoutes,
};

export const fallbackRoutes = [
  { path: '/', element: <Navigate to={paths.login} replace /> },
  { path: '*', element: <Navigate to={paths.login} replace /> },
];
