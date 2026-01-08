import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export function createClient() {
  // Return cached client if available
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, return null
  // Components should check isSupabaseConfigured() before using the client
  if (!supabaseUrl || !supabaseAnonKey) {
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  return client
}
