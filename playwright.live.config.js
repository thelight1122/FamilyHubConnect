/* global process */
import { defineConfig, devices } from '@playwright/test';
import { localSupabaseEnv } from './e2e-live/supabaseEnv.js';

// Live-auth browser tests: a production build (mock sign-in off) talking to
// the local Supabase stack. Run with `npm run test:e2e:live`.
const supabase = localSupabaseEnv();
const port = 4174;

export default defineConfig({
  testDir: './e2e-live',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'line' : 'list',
  timeout: 60000,
  globalSetup: './e2e-live/globalSetup.js',
  use: {
    baseURL: `http://localhost:${port}`,
    ...devices['Pixel 5'],
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npx vite build --outDir dist-live && npx vite preview --outDir dist-live --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      VITE_SUPABASE_URL: supabase.url,
      VITE_SUPABASE_ANON_KEY: supabase.anonKey,
      VITE_ENABLE_MOCK_AUTH: 'false',
    },
  },
});
