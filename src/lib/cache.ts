import { unstable_cache } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'

// SECURITY: Cached queries use admin client to prevent cache poisoning
// All cached data is coach-accessible, so using admin client is safe
// This ensures cache is not affected by individual user sessions

// Cache tags for revalidation (not in 'use server' since they're just constants)
export const CACHE_TAGS = {
  MEMBERS: 'members',
  COACHES: 'coaches',
  BOOKINGS: 'bookings',
  SUBSCRIPTIONS: 'subscriptions',
  GYM_INFO: 'gym-info',
} as const

// Cache duration in seconds
const CACHE_DURATIONS = {
  SHORT: 60,        // 1 minute - for frequently changing data
  MEDIUM: 300,      // 5 minutes - for moderately changing data
  LONG: 3600,       // 1 hour - for rarely changing data
  STATIC: 86400,    // 24 hours - for near-static data
} as const

// Cached query: Get all members with relations
export const getCachedMembers = unstable_cache(
  async () => {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('members')
      .select(`
        id,
        name_en,
        name_ar,
        email,
        phone,
        whatsapp_number,
        profile_photo_url,
        assigned_coach_id,
        created_at,
        coach:coaches(id, name_en, name_ar),
        gym_memberships(id, type, status, end_date),
        pt_packages(id, remaining_sessions, status, coach:coaches(id, name_en))
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
  [CACHE_TAGS.MEMBERS],
  { revalidate: CACHE_DURATIONS.SHORT, tags: [CACHE_TAGS.MEMBERS] }
)

// Cached query: Get active coaches
export const getCachedCoaches = unstable_cache(
  async () => {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('coaches')
      .select('id, name_en, name_ar, email, phone, specialty_en, specialty_ar, is_active')
      .eq('is_active', true)

    if (error) throw error
    return data
  },
  [CACHE_TAGS.COACHES],
  { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.COACHES] }
)

// Cached query: Get gym settings (rarely changes)
export const getCachedGymSettings = unstable_cache(
  async () => {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('gym_settings')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },
  [CACHE_TAGS.GYM_INFO],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.GYM_INFO] }
)

// Cached query: Get gym working hours (rarely changes)
export const getCachedWorkingHours = unstable_cache(
  async () => {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('gym_working_hours')
      .select('*')
      .order('day_of_week', { ascending: true })

    if (error) throw error
    return data
  },
  [CACHE_TAGS.GYM_INFO],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.GYM_INFO] }
)

// Cached query: Get pricing (rarely changes)
export const getCachedPricing = unstable_cache(
  async () => {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('is_active', true)
      .order('type', { ascending: true })

    if (error) throw error
    return data
  },
  [CACHE_TAGS.GYM_INFO],
  { revalidate: CACHE_DURATIONS.LONG, tags: [CACHE_TAGS.GYM_INFO] }
)

// Cached query: Get bookings for a date range (shorter cache due to time-sensitivity)
export const getCachedBookingsForRange = unstable_cache(
  async (startDate: string, endDate: string) => {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        scheduled_at,
        duration_minutes,
        status,
        notes,
        member:members(id, name_en, name_ar, profile_photo_url),
        coach:coaches(id, name_en, name_ar)
      `)
      .gte('scheduled_at', startDate)
      .lte('scheduled_at', endDate)
      .order('scheduled_at', { ascending: true })

    if (error) throw error
    return data
  },
  [CACHE_TAGS.BOOKINGS],
  { revalidate: CACHE_DURATIONS.SHORT, tags: [CACHE_TAGS.BOOKINGS] }
)
