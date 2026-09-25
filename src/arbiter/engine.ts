// The Arbiter engine contract.
//
// The Arbiter observes and reports; it never judges (Totem §16, Accountability
// spec §3). Any engine plugged in here, including the IRG port to on-device
// Gemma, must return observations in this shape and nothing else. There is
// deliberately no verdict, fault or consequence field; the database refuses a
// record that carries one. Engines run on the device: family conflict text
// must not leave the room.

export const SEVEN_VIRTUES = Object.freeze([
  'Honesty',
  'Respect',
  'Attention',
  'Affection',
  'Loyalty',
  'Trust',
  'Communication',
] as const);

export type Virtue = (typeof SEVEN_VIRTUES)[number];

export interface VirtueObservation {
  name: Virtue;
  score: number; // 0-100
  reason: string; // the named, specific basis for the score
}

export interface Observation {
  virtues: VirtueObservation[];
  // Intent Decoder triad
  signal: string;
  energy: string;
  synthesis: string;
}

export type EngineOutcome = { ok: true; observation: Observation } | { ok: false; message: string };
export type ObserveResult = { ok: true; engine: string; observation: Observation } | { ok: false; message: string };

export interface ArbiterEngine {
  id: string;
  ready: boolean;
  observe(text: string): Promise<EngineOutcome>;
}

const FORBIDDEN_KEYS = ['verdict', 'guilty', 'fault', 'consequence', 'punishment'];

// Returns a description of the first problem, or null when the observation
// meets the contract. Takes `unknown` because engine output is untrusted.
export function validateObservation(observation: unknown): string | null {
  if (!observation || typeof observation !== 'object') return 'An observation must be an object.';
  const record = observation as Record<string, unknown>;

  const forbidden = FORBIDDEN_KEYS.find((key) => key in record);
  if (forbidden) return `Observations cannot carry a "${forbidden}".`;
  if (!Array.isArray(record.virtues)) return 'Observations need a virtues list.';

  for (const virtue of record.virtues as Partial<VirtueObservation>[]) {
    if (!SEVEN_VIRTUES.includes(virtue.name as Virtue)) return `Unknown virtue "${virtue.name}".`;
    if (typeof virtue.score !== 'number' || !Number.isFinite(virtue.score) || virtue.score < 0 || virtue.score > 100) {
      return `${virtue.name} needs a 0-100 score.`;
    }
    if (!virtue.reason?.trim()) return `${virtue.name} needs a named reason.`;
  }

  for (const key of ['signal', 'energy', 'synthesis']) {
    if (typeof record[key] !== 'string') return `Observations need "${key}" text.`;
  }
  return null;
}

// Used until the IRG engine is ported: says plainly that nothing is observed,
// rather than inventing observations.
export const unavailableEngine: ArbiterEngine = Object.freeze({
  id: 'unavailable',
  ready: false,
  async observe(): Promise<EngineOutcome> {
    return { ok: false, message: 'The Arbiter engine is not installed on this device yet.' };
  },
});

let activeEngine: ArbiterEngine = unavailableEngine;

export function registerArbiterEngine(engine: ArbiterEngine): void {
  if (!engine?.id || typeof engine.observe !== 'function') {
    throw new Error('An Arbiter engine needs an id and an observe(text) function.');
  }
  activeEngine = engine;
}

export function getArbiterEngine(): ArbiterEngine {
  return activeEngine;
}

// Runs the active engine and checks its output against the contract before
// anything else sees it.
export async function observe(text: string): Promise<ObserveResult> {
  const outcome = await activeEngine.observe(text);
  if (!outcome?.ok) return outcome ?? { ok: false, message: 'The Arbiter returned nothing.' };

  const problem = validateObservation(outcome.observation);
  if (problem) return { ok: false, message: `Arbiter output rejected: ${problem}` };
  return { ok: true, engine: activeEngine.id, observation: outcome.observation };
}
