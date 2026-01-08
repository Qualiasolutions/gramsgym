'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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

  // Check for conflicts
  const bookingTime = new Date(scheduled_at)
  const bookingEnd = new Date(bookingTime.getTime() + duration_minutes * 60000)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: conflicts } = await (supabase as any)
    .from('bookings')
    .select('id')
    .eq('coach_id', coach_id)
    .eq('status', 'scheduled')
    .gte('scheduled_at', bookingTime.toISOString())
    .lt('scheduled_at', bookingEnd.toISOString())

  if (conflicts && conflicts.length > 0) {
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

  revalidatePath('/coach/schedule')
  revalidatePath('/coach/bookings')
  return { success: true }
}

export async function updateBookingStatus(id: string, status: 'completed' | 'cancelled' | 'no_show') {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('bookings')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // If completed, decrement PT package sessions
  if (status === 'completed') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: booking } = await (supabase as any)
      .from('bookings')
      .select('member_id, coach_id')
      .eq('id', id)
      .single()

    if (booking) {
      // Find active PT package for this member-coach pair
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: ptPackage } = await (supabase as any)
        .from('pt_packages')
        .select('id, remaining_sessions')
        .eq('member_id', booking.member_id)
        .eq('coach_id', booking.coach_id)
        .eq('status', 'active')
        .gt('remaining_sessions', 0)
        .single()

      if (ptPackage) {
        const newRemaining = ptPackage.remaining_sessions - 1
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('pt_packages')
          .update({
            remaining_sessions: newRemaining,
            status: newRemaining === 0 ? 'completed' : 'active',
          })
          .eq('id', ptPackage.id)
      }
    }
  }

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

  revalidatePath('/coach/schedule')
  revalidatePath('/coach/bookings')
  return { success: true }
}
