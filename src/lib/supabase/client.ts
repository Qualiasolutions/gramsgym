import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  // Return cached client if available
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build time or if env vars are missing, throw a clear error
  // This should only happen on the client side after hydration
  if (!supabaseUrl || !supabaseAnonKey) {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      throw new Error(
        'Missing Supabase environment variables. Please check your .env.local file.'
      )
    }
    // During SSR/build, return a placeholder that will be replaced after hydration
    // This prevents build failures for pages that use the client
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  return client
}
