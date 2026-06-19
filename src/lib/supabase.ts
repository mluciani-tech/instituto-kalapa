import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Cliente público (apenas leitura — usa anon key)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Cliente server-side (leitura + escrita — usa service_role)
// NUNCA expor NEXT_SUPABASE_SERVICE_ROLE_KEY em client-side
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || "";
export const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

export const isSupabaseConfigured = () => !!supabase;
export const isAdminConfigured = () => !!supabaseAdmin;
