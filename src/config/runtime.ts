export type AuthMode = 'mock' | 'supabase' | 'unconfigured';

const isDevelopment = import.meta.env.DEV;
const mockAuthFlag = import.meta.env.VITE_ENABLE_MOCK_AUTH;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const mockAuthEnabled = isDevelopment || mockAuthFlag === 'true';
const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const runtimeConfig = Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  supabaseUrl,
  supabaseAnonKey,
  supabaseConfigured,
  isDevelopment,
  mockAuthEnabled,
  authMode: (mockAuthEnabled ? 'mock' : supabaseConfigured ? 'supabase' : 'unconfigured') as AuthMode,
});
