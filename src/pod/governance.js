import {
  aiAccessLevels,
  canClassificationReachModel,
  transparencyBehaviors,
} from './dataClassification';
import { getOrbById } from './orbRegistry';

export function classifyInput({ actorRole, orbId, route, sensitivity = null, consentState = 'unverified' }) {
  const orb = getOrbById(orbId);

  return {
    actorRole,
    orbId,
    route,
    consentState,
    sensitivity: sensitivity ?? orb?.dataClassification ?? null,
    modelEligible: Boolean(orb && canClassificationReachModel(orb.dataClassification) && orb.aiAccessLevel !== aiAccessLevels.NONE),
    vaultRestricted: orb?.aiAccessLevel === aiAccessLevels.NONE || !canClassificationReachModel(orb?.dataClassification),
  };
}

export function gaugeMessageIntegrity({ messageId, text }) {
  return {
    messageId,
    virtues: [
      { key: 'honesty', label: 'Honesty', signal: 0, observation: 'Scoring is not implemented yet.' },
      { key: 'respect', label: 'Respect', signal: 0, observation: 'Scoring is not implemented yet.' },
      { key: 'attention', label: 'Attention', signal: 0, observation: 'Scoring is not implemented yet.' },
      { key: 'affection', label: 'Affection', signal: 0, observation: 'Scoring is not implemented yet.' },
      { key: 'loyalty', label: 'Loyalty', signal: 0, observation: 'Scoring is not implemented yet.' },
      { key: 'trust', label: 'Trust', signal: 0, observation: 'Scoring is not implemented yet.' },
      { key: 'communication', label: 'Communication', signal: 0, observation: 'Scoring is not implemented yet.' },
    ],
    overallObservation: text ? 'Message received for future integrity observation.' : 'No message text supplied.',
    confidence: 0,
  };
}

export function createReflection({ subject = 'this event', visibleFacts = [] }) {
  return {
    identify: `Identify what is present in ${subject}.`,
    describe: visibleFacts.length > 0 ? `Visible facts: ${visibleFacts.join('; ')}` : 'No visible facts supplied yet.',
    question: 'What has become visible from the outside?',
    reflect: 'Reflection template pending family-approved wording.',
    acknowledge: 'Acknowledgement remains with the family.',
  };
}

export function applyOutputBoundaries({ text, requiresHumanApproval = false }) {
  return {
    text,
    requiresHumanApproval,
    blockedTerms: [],
    boundary: 'Output must remain observational, non-coercive, child-aware, and human-approved before state changes.',
  };
}

export function inspectGovernanceEvent({ classification, requestedAction }) {
  const blocksModel = !canClassificationReachModel(classification);
  return {
    requestedAction,
    triggered: blocksModel || requestedAction === 'external_transaction',
    reasons: [
      ...(blocksModel ? ['No-Model Vault or external financial data cannot enter model context.'] : []),
      ...(requestedAction === 'external_transaction' ? ['External transactions require a separate Secure Transactions Orb.'] : []),
    ],
  };
}

export function recordGovernanceEvent({ orbId, eventType, summary, withheldContext = [] }) {
  const orb = getOrbById(orbId);

  return {
    orbId,
    orbLabel: orb?.label ?? 'Unknown Orb',
    eventType,
    summary,
    withheldContext,
    behavior: withheldContext.length > 0
      ? transparencyBehaviors.RECORD_WITHHELD_CONTEXT
      : orb?.transparencyBehavior ?? transparencyBehaviors.RECORD_ACCESS,
    recordedAt: new Date().toISOString(),
  };
}
