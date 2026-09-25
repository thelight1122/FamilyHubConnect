import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { runtimeConfig } from '../config/runtime';
import type { Database } from '../types/database';

export type FamilyDatabase = SupabaseClient<Database>;

const hasSupabaseConfig = Boolean(runtimeConfig.supabaseUrl && runtimeConfig.supabaseAnonKey);

export const supabase: FamilyDatabase | null = hasSupabaseConfig
  ? createClient<Database>(runtimeConfig.supabaseUrl, runtimeConfig.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseConfigured = hasSupabaseConfig;
