import { paths } from '../config/routes';
import { getOrbForRoute } from '../pod';
import { familyMembers, finances, sports } from './mockData';

export const familyName = 'Thompson Family';

export const currentMember =
  familyMembers.find((member) => member.name === 'Leo') ?? familyMembers[0];

export const dashboardSchedule = [
  { id: 1, title: 'Soccer Practice', time: '3:30 PM', icon: 'sports_soccer', color: 'text-primary bg-primary/10' },
  { id: 2, title: 'Dinner', time: '6:00 PM', icon: 'restaurant', color: 'text-orange-500 bg-orange-50' },
  { id: 3, title: 'Homework', time: '7:30 PM', icon: 'menu_book', color: 'text-violet-500 bg-violet-50' },
];

export const dashboardQuickActions = [
  { label: 'Finance', icon: 'account_balance_wallet', path: paths.finance, color: 'text-primary bg-primary/10' },
  { label: 'Sports', icon: 'sports_soccer', path: paths.sports, color: 'text-green-600 bg-green-50' },
  { label: 'Pet Hub', icon: 'pets', path: paths.morePets, color: 'text-amber-500 bg-amber-50' },
  { label: 'Reflection Request', icon: 'balance', path: paths.moreAppeal, color: 'text-violet-500 bg-violet-50' },
].map((action) => ({
  ...action,
  orbId: getOrbForRoute(action.path)?.id ?? null,
}));

export const financeTools = [
  { label: 'Allowance', icon: 'payments', color: 'text-primary bg-primary/10', path: null },
  { label: 'Savings Goals', icon: 'savings', color: 'text-green-600 bg-green-50', path: null },
  { label: 'Family Bank', icon: 'account_balance', color: 'text-violet-600 bg-violet-50', path: paths.financeLoan },
  { label: 'Market Sim', icon: 'show_chart', color: 'text-orange-500 bg-orange-50', path: paths.financeMarket },
];

export const walletMembers = familyMembers
  .filter((member) => member.wallet !== undefined)
  .sort((left, right) => right.wallet - left.wallet)
  .map((member) => ({
    id: member.id,
    name: member.name,
    wallet: member.wallet,
    avatar: member.avatar,
  }));

export const maxWalletBalance = Math.max(...walletMembers.map((member) => member.wallet), 1);

export const moreFeatures = [
  { label: 'Assistant', route: paths.moreAssistant, icon: 'smart_toy', bg: 'bg-primary/10', color: 'text-primary' },
  { label: 'Family Constitution', route: paths.moreConstitution, icon: 'gavel', bg: 'bg-violet-50', color: 'text-violet-600' },
  { label: 'Family Timeline', route: paths.moreTimeline, icon: 'timeline', bg: 'bg-rose-50', color: 'text-rose-500' },
  { label: 'Pet Hub', route: paths.morePets, icon: 'pets', bg: 'bg-amber-50', color: 'text-amber-500' },
  { label: 'Health Logs', route: paths.moreHealth, icon: 'health_and_safety', bg: 'bg-green-50', color: 'text-green-600' },
  { label: 'Transparency', route: paths.moreTransparency, icon: 'visibility', bg: 'bg-slate-100', color: 'text-slate-600' },
  { label: 'Accountability', route: paths.moreCourt, icon: 'gavel', bg: 'bg-orange-50', color: 'text-orange-500' },
  { label: "Creator's Studio", route: paths.moreCreator, icon: 'auto_fix_high', bg: 'bg-blue-50', color: 'text-blue-500' },
  { label: 'Family Governance', route: paths.moreGovernance, icon: 'balance', bg: 'bg-indigo-50', color: 'text-indigo-600' },
].map((feature) => ({
  ...feature,
  orbId: getOrbForRoute(feature.route)?.id ?? null,
}));

export const accountItems = [
  { label: 'Profile Settings', icon: 'manage_accounts', route: null, feedback: 'Profile settings are managed by the family account owner.' },
  { label: 'Invite Family', icon: 'group_add', route: paths.invite },
  { label: 'Notifications', icon: 'notifications', route: null, feedback: 'Notifications are not enabled for this local preview.' },
];

export const sportsTeams = sports.teams;
export const activeSportsTeam = sportsTeams.find((team) => team.active) ?? sportsTeams[0];
export const sportsContacts = sports.contacts;
export const sportsChecklist = sports.equipment;
export const sportsSchedule = sports.schedule;
export const onlineMembers = sportsContacts.map((contact, index) => ({
  name: contact.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
  color: ['bg-[#4c8ce6]', 'bg-amber-400', 'bg-green-400', 'bg-rose-400'][index % 4],
}));

export const totalFamilySavings = finances.totalSavings;
