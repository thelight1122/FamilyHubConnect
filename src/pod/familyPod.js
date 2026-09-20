import { standardOrbRegistry } from './orbRegistry';

export const familyPod = Object.freeze({
  id: 'family-hub-connect-pod',
  label: 'Family Hub Connect POD',
  assistantPlacement: 'inside_pod_not_authority',
  illuminationInvariant: 'AEGIS illuminates patterns and never judges people.',
  standardOrbs: standardOrbRegistry,
  modelIntegrationStatus: 'blocked_until_orb_boundaries_exist',
  sourceTotem: 'docs/TOTEM-FAMILY-POD-IMPLEMENTATION-PLAN-2026-09-18.md',
});

export function getFamilyPodSummary() {
  return {
    id: familyPod.id,
    label: familyPod.label,
    orbCount: familyPod.standardOrbs.length,
    assistantPlacement: familyPod.assistantPlacement,
    modelIntegrationStatus: familyPod.modelIntegrationStatus,
  };
}
