// The Arbiter engine contract.
//
// The Arbiter observes and reports; it never judges (Totem §16, Accountability
// spec §3). Any engine plugged in here, including the IRG port to on-device
// Gemma, must return observations in this shape and nothing else:
//
//   {
//     virtues: [{ name, score, reason }],   // the Seven Virtues, 0-100, each with a named reason
//     signal: string,                       // Intent Decoder triad
//     energy: string,
//     synthesis: string,
//   }
//
// There is deliberately no verdict, fault or consequence field; the database
// refuses a record that carries one. Engines run on the device: family
// conflict text must not leave the room.

export const SEVEN_VIRTUES = Object.freeze([
  'Honesty',
  'Respect',
  'Attention',
  'Affection',
  'Loyalty',
  'Trust',
  'Communication',
]);

const FORBIDDEN_KEYS = ['verdict', 'guilty', 'fault', 'consequence', 'punishment'];

export function validateObservation(observation) {
  if (!observation || typeof observation !== 'object') return 'An observation must be an object.';
  const forbidden = FORBIDDEN_KEYS.find((key) => key in observation);
  if (forbidden) return `Observations cannot carry a "${forbidden}".`;
  if (!Array.isArray(observation.virtues)) return 'Observations need a virtues list.';

  for (const virtue of observation.virtues) {
    if (!SEVEN_VIRTUES.includes(virtue.name)) return `Unknown virtue "${virtue.name}".`;
    if (!Number.isFinite(virtue.score) || virtue.score < 0 || virtue.score > 100) return `${virtue.name} needs a 0-100 score.`;
    if (!virtue.reason?.trim()) return `${virtue.name} needs a named reason.`;
  }

  for (const key of ['signal', 'energy', 'synthesis']) {
    if (typeof observation[key] !== 'string') return `Observations need "${key}" text.`;
  }
  return null;
}

// Used until the IRG engine is ported: says plainly that nothing is observed,
// rather than inventing observations.
export const unavailableEngine = Object.freeze({
  id: 'unavailable',
  ready: false,
  async observe() {
    return { ok: false, message: 'The Arbiter engine is not installed on this device yet.' };
  },
});

let activeEngine = unavailableEngine;

export function registerArbiterEngine(engine) {
  if (!engine?.id || typeof engine.observe !== 'function') {
    throw new Error('An Arbiter engine needs an id and an observe(text) function.');
  }
  activeEngine = engine;
}

export function getArbiterEngine() {
  return activeEngine;
}

// Runs the active engine and checks its output against the contract before
// anything else sees it.
export async function observe(text) {
  const outcome = await activeEngine.observe(text);
  if (!outcome?.ok) return outcome ?? { ok: false, message: 'The Arbiter returned nothing.' };

  const problem = validateObservation(outcome.observation);
  if (problem) return { ok: false, message: `Arbiter output rejected: ${problem}` };
  return { ok: true, engine: activeEngine.id, observation: outcome.observation };
}
