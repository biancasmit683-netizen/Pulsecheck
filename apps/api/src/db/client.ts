import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

/**
 * Backend Supabase client.
 *
 * Uses the service_role (secret) key so it bypasses Row Level Security.
 * Never import this from anything that runs in a browser.
 */
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);
