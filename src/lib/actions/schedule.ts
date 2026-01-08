'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { CACHE_TAGS } from '@/lib/cache'

export async function updateCoachAvailability(formData: FormData) {
  const supabase = await createClient()

  const coach_id = formData.get('coach_id') as string
  const day_of_week = parseInt(formData.get('day_of_week') as string)
  const start_time = formData.get('start_time') as string
  const end_time = formData.get('end_time') as string
  const is_available = formData.get('is_available') === 'on'

  // Check if availability record exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('coach_availability')
    .select('id')
    .eq('coach_id', coach_id)
    .eq('day_of_week', day_of_week)
    .single()

  if (existing) {
    // Update existing record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('coach_availability')
      .update({
        start_time,
        end_time,
        is_available,
      })
      .eq('id', existing.id)

    if (error) {
      return { error: error.message }
    }
  } else {
    // Insert new record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('coach_availability')
      .insert({
        coach_id,
        day_of_week,
        start_time,
        end_time,
        is_available,
      })

    if (error) {
      return { error: error.message }
    }
  }

  revalidateTag(CACHE_TAGS.COACHES, 'max')
  revalidatePath('/coach/schedule')
  return { success: true }
}

export async function createBooking(formData: FormData) {
  const supabase = await createClient()

  const member_id = formData.get('member_id') as string
  const coach_id = formData.get('coach_id') as string
  const scheduled_at = formData.get('scheduled_at') as string
  const duration_minutes = parseInt(formData.get('duration_minutes') as string) || 60
  const notes = formData.get('notes') as string || null

  // Check for conflicts using count (more efficient than fetching rows)
  const bookingTime = new Date(scheduled_at)
  const bookingEnd = new Date(bookingTime.getTime() + duration_minutes * 60000)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: conflictCount } = await (supabase as any)
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('coach_id', coach_id)
    .eq('status', 'scheduled')
    .gte('scheduled_at', bookingTime.toISOString())
    .lt('scheduled_at', bookingEnd.toISOString())

  if (conflictCount && conflictCount > 0) {
    return { error: 'This time slot is already booked' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('bookings').insert({
    member_id,
    coach_id,
    scheduled_at,
    duration_minutes,
    notes,
    status: 'scheduled',
  })

  if (error) {
    return { error: error.message }
  }

  revalidateTag(CACHE_TAGS.BOOKINGS, 'max')
  revalidatePath('/coach/schedule')
  revalidatePath('/coach/bookings')
  return { success: true }
}

export async function updateBookingStatus(id: string, status: 'completed' | 'cancelled' | 'no_show') {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  // For completed status, fetch booking with PT package in a single query (fixes N+1)
  if (status === 'completed') {
    const { data: booking, error: fetchError } = await client
      .from('bookings')
      .select(`
        id,
        member_id,
        coach_id,
        pt_package:pt_packages!bookings_pt_package_id_fkey(id, remaining_sessions, status)
      `)
      .eq('id', id)
      .single()

    if (fetchError) {
      return { error: fetchError.message }
    }

    // Update booking status
    const { error: updateError } = await client
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (updateError) {
      return { error: updateError.message }
    }

    // Decrement PT package sessions if linked
    if (booking?.pt_package && booking.pt_package.remaining_sessions > 0) {
      const newRemaining = booking.pt_package.remaining_sessions - 1
      await client
        .from('pt_packages')
        .update({
          remaining_sessions: newRemaining,
          status: newRemaining === 0 ? 'completed' : 'active',
        })
        .eq('id', booking.pt_package.id)
    }
  } else {
    // For non-completed status, just update the booking
    const { error } = await client
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }
  }

  revalidateTag(CACHE_TAGS.BOOKINGS, 'max')
  revalidateTag(CACHE_TAGS.SUBSCRIPTIONS, 'max')
  revalidatePath('/coach/schedule')
  revalidatePath('/coach/bookings')
  revalidatePath('/coach/subscriptions')
  return { success: true }
}

export async function deleteBooking(id: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('bookings')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidateTag(CACHE_TAGS.BOOKINGS, 'max')
  revalidatePath('/coach/schedule')
  revalidatePath('/coach/bookings')
  return { success: true }
}
