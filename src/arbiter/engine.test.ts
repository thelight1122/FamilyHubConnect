import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  observe,
  registerArbiterEngine,
  unavailableEngine,
  validateObservation,
  type ArbiterEngine,
  type Observation,
  type ObserveResult,
} from './engine.ts';

const goodObservation: Observation = {
  virtues: [{ name: 'Honesty', score: 72, reason: 'States what happened without hedging.' }],
  signal: 'Wants to be believed',
  energy: 'Guarded',
  synthesis: 'An account given under pressure',
};

const messageOf = (outcome: ObserveResult) => (outcome.ok ? '' : outcome.message);

test('a well-formed observation passes', () => {
  assert.equal(validateObservation(goodObservation), null);
});

test('an observation carrying a verdict is rejected', () => {
  assert.match(validateObservation({ ...goodObservation, verdict: 'responsible' }) ?? '', /verdict/);
});

test('every virtue needs a named reason and a 0-100 score', () => {
  assert.match(validateObservation({ ...goodObservation, virtues: [{ name: 'Honesty', score: 72, reason: ' ' }] }) ?? '', /reason/);
  assert.match(validateObservation({ ...goodObservation, virtues: [{ name: 'Honesty', score: 140, reason: 'x' }] }) ?? '', /0-100/);
  assert.match(validateObservation({ ...goodObservation, virtues: [{ name: 'Obedience', score: 50, reason: 'x' }] }) ?? '', /Unknown virtue/);
});

test('with no engine installed, the Arbiter says so instead of inventing observations', async () => {
  registerArbiterEngine(unavailableEngine);
  const outcome = await observe('anything');
  assert.equal(outcome.ok, false);
  assert.match(messageOf(outcome), /not installed/);
});

test('engine output that breaks the contract never reaches the caller', async () => {
  const judge: ArbiterEngine = {
    id: 'judge',
    ready: true,
    async observe() {
      return { ok: true, observation: { ...goodObservation, guilty: true } as Observation };
    },
  };
  registerArbiterEngine(judge);
  const outcome = await observe('anything');
  assert.equal(outcome.ok, false);
  assert.match(messageOf(outcome), /rejected/);
  registerArbiterEngine(unavailableEngine);
});
