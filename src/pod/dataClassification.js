export const dataClassification = Object.freeze({
  PUBLIC: 'public',
  HOUSEHOLD_OPERATIONAL: 'household_operational',
  FAMILY_GOVERNANCE: 'family_governance',
  CHILD_SAFE: 'child_safe',
  AI_SAFE_SHADOW: 'ai_safe_shadow',
  NO_MODEL_VAULT: 'no_model_vault',
  EXTERNAL_FINANCIAL: 'external_financial',
});

export const aiAccessLevels = Object.freeze({
  NONE: 'none',
  SUMMARY_ONLY: 'summary_only',
  AI_SAFE_SHADOW_ONLY: 'ai_safe_shadow_only',
  GOVERNED_CONTEXT: 'governed_context',
});

export const vaultAccessRules = Object.freeze({
  NONE: 'none',
  SHADOW_ONLY: 'shadow_only',
  GUARDIAN_UNLOCK_REQUIRED: 'guardian_unlock_required',
  NEVER_MODEL_ACCESSIBLE: 'never_model_accessible',
});

export const transparencyBehaviors = Object.freeze({
  NONE: 'none',
  RECORD_ACCESS: 'record_access',
  RECORD_GOVERNANCE_EVENT: 'record_governance_event',
  RECORD_WITHHELD_CONTEXT: 'record_withheld_context',
});

export const rolePermissions = Object.freeze({
  ADULT: 'adult',
  CHILD: 'child',
  CAREGIVER: 'caregiver',
  TRUSTED_ADULT: 'trusted_adult',
});

export const noModelVaultClassifications = new Set([
  dataClassification.NO_MODEL_VAULT,
  dataClassification.EXTERNAL_FINANCIAL,
]);

export function canClassificationReachModel(classification) {
  return !noModelVaultClassifications.has(classification);
}
