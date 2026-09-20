import { createClient } from '@supabase/supabase-js';
import { runtimeConfig } from '../config/runtime';

const hasSupabaseConfig = Boolean(runtimeConfig.supabaseUrl && runtimeConfig.supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(runtimeConfig.supabaseUrl, runtimeConfig.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseConfigured = hasSupabaseConfig;

