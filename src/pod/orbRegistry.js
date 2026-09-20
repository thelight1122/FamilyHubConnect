import { paths } from '../config/paths';
import {
  aiAccessLevels,
  dataClassification,
  rolePermissions,
  transparencyBehaviors,
  vaultAccessRules,
} from './dataClassification';

export const orbIds = Object.freeze({
  FAMILY_POD: 'family-pod',
  ASSISTANT: 'assistant',
  TRANSPARENCY: 'transparency',
  GOVERNANCE: 'family-governance',
  ACCOUNTABILITY: 'accountability',
  CONSTITUTION: 'family-creed-constitution',
  CHORES: 'chores-rewards',
  FINANCE_LEARNING: 'finance-learning',
  DIGITAL_DESK: 'digital-desk',
  HEALTH_CARE_SHADOW: 'health-care-shadow',
  CALENDAR: 'calendar-reminders',
  TIMELINE: 'family-timeline',
  MESSAGES: 'family-messages',
  SPORTS_TEAM: 'sports-team',
  PET_CARE: 'pet-care',
  CREATOR_STUDIO: 'creator-studio',
  AUTO_MAINTENANCE: 'auto-maintenance',
  HOME_MAINTENANCE: 'home-maintenance',
  SUBSCRIPTION_MINDER: 'subscription-minder',
});

export const standardOrbRegistry = Object.freeze([
  {
    id: orbIds.FAMILY_POD,
    label: 'Family POD',
    routes: [paths.childDashboard, paths.adultDashboard, paths.dashboard],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD, rolePermissions.CAREGIVER],
    dataClassification: dataClassification.HOUSEHOLD_OPERATIONAL,
    aiAccessLevel: aiAccessLevels.GOVERNED_CONTEXT,
    vaultAccessRule: vaultAccessRules.SHADOW_ONLY,
    transparencyBehavior: transparencyBehaviors.RECORD_ACCESS,
  },
  {
    id: orbIds.TRANSPARENCY,
    label: 'Transparency Orb',
    routes: [paths.moreTransparency],
    rolePermissions: [rolePermissions.ADULT],
    dataClassification: dataClassification.AI_SAFE_SHADOW,
    aiAccessLevel: aiAccessLevels.SUMMARY_ONLY,
    vaultAccessRule: vaultAccessRules.NONE,
    transparencyBehavior: transparencyBehaviors.RECORD_GOVERNANCE_EVENT,
  },
  {
    id: orbIds.ASSISTANT,
    label: 'AEGIS SEEDed Assistant Shell',
    routes: [paths.moreAssistant],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD, rolePermissions.CAREGIVER],
    dataClassification: dataClassification.AI_SAFE_SHADOW,
    aiAccessLevel: aiAccessLevels.NONE,
    vaultAccessRule: vaultAccessRules.NEVER_MODEL_ACCESSIBLE,
    transparencyBehavior: transparencyBehaviors.RECORD_WITHHELD_CONTEXT,
  },
  {
    id: orbIds.GOVERNANCE,
    label: 'Family Governance Orb',
    routes: [paths.moreGovernance],
    rolePermissions: [rolePermissions.ADULT],
    dataClassification: dataClassification.FAMILY_GOVERNANCE,
    aiAccessLevel: aiAccessLevels.GOVERNED_CONTEXT,
    vaultAccessRule: vaultAccessRules.SHADOW_ONLY,
    transparencyBehavior: transparencyBehaviors.RECORD_GOVERNANCE_EVENT,
  },
  {
    id: orbIds.ACCOUNTABILITY,
    label: 'Accountability Orb',
    routes: [paths.moreCourt, paths.moreAppeal, paths.moreAppealReview, paths.moreAppealNegotiation, paths.moreAppealResolution],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD],
    dataClassification: dataClassification.FAMILY_GOVERNANCE,
    aiAccessLevel: aiAccessLevels.GOVERNED_CONTEXT,
    vaultAccessRule: vaultAccessRules.SHADOW_ONLY,
    transparencyBehavior: transparencyBehaviors.RECORD_GOVERNANCE_EVENT,
  },
  {
    id: orbIds.CONSTITUTION,
    label: 'Family Creed / Constitution Orb',
    routes: [paths.moreConstitution, paths.onboardingValues, paths.onboardingRules],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD, rolePermissions.CAREGIVER],
    dataClassification: dataClassification.CHILD_SAFE,
    aiAccessLevel: aiAccessLevels.GOVERNED_CONTEXT,
    vaultAccessRule: vaultAccessRules.NONE,
    transparencyBehavior: transparencyBehaviors.RECORD_ACCESS,
  },
  {
    id: orbIds.CHORES,
    label: 'Chores & Rewards Orb',
    routes: [paths.chores],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD],
    dataClassification: dataClassification.HOUSEHOLD_OPERATIONAL,
    aiAccessLevel: aiAccessLevels.GOVERNED_CONTEXT,
    vaultAccessRule: vaultAccessRules.NONE,
    transparencyBehavior: transparencyBehaviors.RECORD_ACCESS,
  },
  {
    id: orbIds.FINANCE_LEARNING,
    label: 'Finance Learning Orb',
    routes: [paths.finance, paths.financeMarket, paths.financeLoan, paths.financeLoanConfirmation],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD],
    dataClassification: dataClassification.HOUSEHOLD_OPERATIONAL,
    aiAccessLevel: aiAccessLevels.AI_SAFE_SHADOW_ONLY,
    vaultAccessRule: vaultAccessRules.NEVER_MODEL_ACCESSIBLE,
    transparencyBehavior: transparencyBehaviors.RECORD_WITHHELD_CONTEXT,
  },
  {
    id: orbIds.HEALTH_CARE_SHADOW,
    label: 'Medical & Care Shadow Orb',
    routes: [paths.moreHealth],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CAREGIVER],
    dataClassification: dataClassification.NO_MODEL_VAULT,
    aiAccessLevel: aiAccessLevels.NONE,
    vaultAccessRule: vaultAccessRules.NEVER_MODEL_ACCESSIBLE,
    transparencyBehavior: transparencyBehaviors.RECORD_WITHHELD_CONTEXT,
  },
  {
    id: orbIds.CALENDAR,
    label: 'Calendar & Reminders Orb',
    routes: [],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD, rolePermissions.CAREGIVER],
    dataClassification: dataClassification.HOUSEHOLD_OPERATIONAL,
    aiAccessLevel: aiAccessLevels.AI_SAFE_SHADOW_ONLY,
    vaultAccessRule: vaultAccessRules.SHADOW_ONLY,
    transparencyBehavior: transparencyBehaviors.RECORD_ACCESS,
  },
  {
    id: orbIds.TIMELINE,
    label: 'Family Timeline Orb',
    routes: [paths.moreTimeline],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD],
    dataClassification: dataClassification.HOUSEHOLD_OPERATIONAL,
    aiAccessLevel: aiAccessLevels.SUMMARY_ONLY,
    vaultAccessRule: vaultAccessRules.SHADOW_ONLY,
    transparencyBehavior: transparencyBehaviors.RECORD_ACCESS,
  },
  {
    id: orbIds.MESSAGES,
    label: 'Family Messages Orb',
    routes: [],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD, rolePermissions.CAREGIVER],
    dataClassification: dataClassification.FAMILY_GOVERNANCE,
    aiAccessLevel: aiAccessLevels.GOVERNED_CONTEXT,
    vaultAccessRule: vaultAccessRules.SHADOW_ONLY,
    transparencyBehavior: transparencyBehaviors.RECORD_GOVERNANCE_EVENT,
  },
  {
    id: orbIds.SPORTS_TEAM,
    label: 'Sports Team Orb',
    routes: [paths.sports, paths.sportsChat],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD, rolePermissions.CAREGIVER],
    dataClassification: dataClassification.HOUSEHOLD_OPERATIONAL,
    aiAccessLevel: aiAccessLevels.SUMMARY_ONLY,
    vaultAccessRule: vaultAccessRules.SHADOW_ONLY,
    transparencyBehavior: transparencyBehaviors.RECORD_ACCESS,
  },
  {
    id: orbIds.PET_CARE,
    label: 'Pet Care Orb',
    routes: [paths.morePets],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CHILD],
    dataClassification: dataClassification.HOUSEHOLD_OPERATIONAL,
    aiAccessLevel: aiAccessLevels.SUMMARY_ONLY,
    vaultAccessRule: vaultAccessRules.NONE,
    transparencyBehavior: transparencyBehaviors.RECORD_ACCESS,
  },
  {
    id: orbIds.CREATOR_STUDIO,
    label: 'Creator Studio Orb',
    routes: [paths.moreCreator],
    rolePermissions: [rolePermissions.ADULT],
    dataClassification: dataClassification.HOUSEHOLD_OPERATIONAL,
    aiAccessLevel: aiAccessLevels.SUMMARY_ONLY,
    vaultAccessRule: vaultAccessRules.NONE,
    transparencyBehavior: transparencyBehaviors.RECORD_ACCESS,
  },
  {
    id: orbIds.AUTO_MAINTENANCE,
    label: 'Auto Maintenance Minder Orb',
    routes: [paths.adultMaintenance],
    rolePermissions: [rolePermissions.ADULT],
    dataClassification: dataClassification.HOUSEHOLD_OPERATIONAL,
    aiAccessLevel: aiAccessLevels.AI_SAFE_SHADOW_ONLY,
    vaultAccessRule: vaultAccessRules.SHADOW_ONLY,
    transparencyBehavior: transparencyBehaviors.RECORD_ACCESS,
  },
  {
    id: orbIds.HOME_MAINTENANCE,
    label: 'Home Maintenance Custodian Orb',
    routes: [],
    rolePermissions: [rolePermissions.ADULT, rolePermissions.CAREGIVER],
    dataClassification: dataClassification.HOUSEHOLD_OPERATIONAL,
    aiAccessLevel: aiAccessLevels.AI_SAFE_SHADOW_ONLY,
    vaultAccessRule: vaultAccessRules.SHADOW_ONLY,
    transparencyBehavior: transparencyBehaviors.RECORD_ACCESS,
  },
  {
    id: orbIds.SUBSCRIPTION_MINDER,
    label: 'Subscription Minder Orb',
    routes: [],
    rolePermissions: [rolePermissions.ADULT],
    dataClassification: dataClassification.AI_SAFE_SHADOW,
    aiAccessLevel: aiAccessLevels.AI_SAFE_SHADOW_ONLY,
    vaultAccessRule: vaultAccessRules.NEVER_MODEL_ACCESSIBLE,
    transparencyBehavior: transparencyBehaviors.RECORD_WITHHELD_CONTEXT,
  },
]);

export const orbRegistryById = Object.freeze(
  standardOrbRegistry.reduce((registry, orb) => ({ ...registry, [orb.id]: orb }), {}),
);

export const routeOrbMap = Object.freeze(
  standardOrbRegistry.reduce((map, orb) => {
    orb.routes.forEach((route) => {
      map[route] = orb.id;
    });
    return map;
  }, {}),
);

export function getOrbById(orbId) {
  return orbRegistryById[orbId] ?? null;
}

export function getOrbForRoute(route) {
  const orbId = routeOrbMap[route];
  return orbId ? getOrbById(orbId) : null;
}
