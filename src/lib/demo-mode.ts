import { cookies } from 'next/headers'

// Check if demo mode is active (server-side only)
export async function isDemoMode(): Promise<'member' | 'coach' | false> {
  const cookieStore = await cookies()
  const demoMode = cookieStore.get('demo_mode')?.value
  if (demoMode === 'member') return 'member'
  if (demoMode === 'coach') return 'coach'
  return false
}
