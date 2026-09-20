const isDevelopment = import.meta.env.DEV;
const mockAuthFlag = import.meta.env.VITE_ENABLE_MOCK_AUTH;

export const runtimeConfig = Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  isDevelopment,
  mockAuthEnabled: isDevelopment || mockAuthFlag === 'true',
});
