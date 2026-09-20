import { createClient } from '@supabase/supabase-js';

// Environment variables are exposed by Vite via `import.meta.env`.
// The `VITE_` prefix is required for them to be exposed to the client.
export const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

let supabase;

// The app will now show a dedicated error screen, but this client-side check is still a good fallback.
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "Supabase not configured. It seems environment variables are not set. " +
    "Please create a .env file based on .env.example. Using a placeholder client. Database calls will fail."
  );
  // Using placeholder values to prevent the client from throwing an error on initialization
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
}

export { supabase };