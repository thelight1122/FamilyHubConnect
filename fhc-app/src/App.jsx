import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import AppLayout from './components/AppLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FinancePage from './pages/finance/FinancePage';
import MarketPage from './pages/finance/MarketPage';
import LoanPage from './pages/finance/LoanPage';
import LoanConfirmationPage from './pages/finance/LoanConfirmationPage';
import ChoresPage from './pages/ChoresPage';
import LockerRoomPage from './pages/sports/LockerRoomPage';
import TeamChatPage from './pages/sports/TeamChatPage';
import MorePage from './pages/more/MorePage';
import ConstitutionPage from './pages/more/ConstitutionPage';
import TimelinePage from './pages/more/TimelinePage';
import PetHubPage from './pages/more/PetHubPage';
import HealthPage from './pages/more/HealthPage';
import AppealPage from './pages/more/AppealPage';
import AppealReviewPage from './pages/more/AppealReviewPage';
import CreatorStudioPage from './pages/more/CreatorStudioPage';
import FamilyGovernancePage from './pages/more/FamilyGovernancePage';
import FamilyCourtPage from './pages/more/FamilyCourtPage';
import InviteFamilyPage from './pages/onboarding/InviteFamilyPage';
import OnboardingRulesPage from './pages/onboarding/OnboardingRulesPage';
import OnboardingValuesPage from './pages/onboarding/OnboardingValuesPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes (no bottom nav) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/invite" element={<InviteFamilyPage />} />
        <Route path="/onboarding/values" element={<OnboardingValuesPage />} />
        <Route path="/onboarding/rules" element={<OnboardingRulesPage />} />

        {/* Protected routes inside AppLayout (with bottom nav) */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/finance/market" element={<MarketPage />} />
          <Route path="/finance/loan" element={<LoanPage />} />
          <Route path="/finance/loan/confirmation" element={<LoanConfirmationPage />} />
          <Route path="/chores" element={<ChoresPage />} />
          <Route path="/sports" element={<LockerRoomPage />} />
          <Route path="/sports/chat" element={<TeamChatPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/more/constitution" element={<ConstitutionPage />} />
          <Route path="/more/timeline" element={<TimelinePage />} />
          <Route path="/more/pets" element={<PetHubPage />} />
          <Route path="/more/health" element={<HealthPage />} />
          <Route path="/more/appeal" element={<AppealPage />} />
          <Route path="/more/appeal/review" element={<AppealReviewPage />} />
          <Route path="/more/creator" element={<CreatorStudioPage />} />
          <Route path="/more/governance" element={<FamilyGovernancePage />} />
          <Route path="/more/court" element={<FamilyCourtPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
