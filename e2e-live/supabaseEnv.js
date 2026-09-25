/* global process */
import { execSync } from 'node:child_process';

// Reads the local Supabase stack's URL and keys (`npx supabase start` must be
// running). CI and local runs share this, so no key is ever stored in the repo.
let cached;

export function localSupabaseEnv() {
  if (cached) return cached;

  const output = execSync('npx supabase status -o env', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const values = Object.fromEntries(
    output
      .split(/\r?\n/)
      .map((line) => line.match(/^([A-Z_]+)="?(.*?)"?$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2]])
  );

  if (!values.API_URL || !values.ANON_KEY || !values.SERVICE_ROLE_KEY) {
    throw new Error('Local Supabase is not running. Start it with `npx supabase start`.');
  }

  cached = { url: values.API_URL, anonKey: values.ANON_KEY, serviceRoleKey: values.SERVICE_ROLE_KEY };
  process.env.FHC_LIVE_SUPABASE_URL = cached.url;
  return cached;
}
