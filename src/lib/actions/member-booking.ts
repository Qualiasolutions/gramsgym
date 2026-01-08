'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import {
  notifyBookingConfirmation,
  notifyBookingCancellation,
  notifyCoachNewBooking,
  notifyCoachBookingCancelled,
} from '@/lib/notifications'

export async function createMemberBooking(formData: FormData) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  const member_id = formData.get('member_id') as string
  const coach_id = formData.get('coach_id') as string
  const scheduled_at = formData.get('scheduled_at') as string
  const duration_minutes = parseInt(formData.get('duration_minutes') as string) || 60

  // Verify member has active PT package with this coach
  const { data: ptPackage } = await client
    .from('pt_packages')
    .select('id, remaining_sessions')
    .eq('member_id', member_id)
    .eq('coach_id', coach_id)
    .eq('status', 'active')
    .gt('remaining_sessions', 0)
    .limit(1)
    .single()

  if (!ptPackage) {
    return { error: 'No active PT package found. Please purchase a package first.' }
  }

  // Check for conflicts using count (more efficient than fetching rows)
  const bookingTime = new Date(scheduled_at)
  const bookingEnd = new Date(bookingTime.getTime() + duration_minutes * 60000)

  const { count: conflictCount } = await client
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('coach_id', coach_id)
    .eq('status', 'scheduled')
    .gte('scheduled_at', bookingTime.toISOString())
    .lt('scheduled_at', bookingEnd.toISOString())

  if (conflictCount && conflictCount > 0) {
    return { error: 'This time slot is no longer available. Please choose another time.' }
  }

  // Create booking
  const { error: bookingError } = await client.from('bookings').insert({
    member_id,
    coach_id,
    pt_package_id: ptPackage.id,
    scheduled_at,
    duration_minutes,
    status: 'scheduled',
  })

  if (bookingError) {
    return { error: bookingError.message }
  }

  // Fetch member and coach details for notifications
  const [memberResult, coachResult] = await Promise.all([
    client.from('members').select('name_en, email, phone').eq('id', member_id).single(),
    client.from('coaches').select('name_en, email, phone').eq('id', coach_id).single(),
  ])

  const member = memberResult.data
  const coach = coachResult.data

  // Format date and time for notifications
  const bookingDate = format(new Date(scheduled_at), 'EEEE, MMMM d, yyyy')
  const bookingTimeStr = format(new Date(scheduled_at), 'h:mm a')

  // Send notifications (non-blocking)
  if (member && coach) {
    // Notify member
    notifyBookingConfirmation(
      { name: member.name_en, email: member.email, phone: member.phone },
      { date: bookingDate, time: bookingTimeStr, coachName: coach.name_en }
    ).catch(console.error)

    // Notify coach
    notifyCoachNewBooking(
      { name: coach.name_en, email: coach.email, phone: coach.phone },
      member.name_en,
      { date: bookingDate, time: bookingTimeStr }
    ).catch(console.error)
  }

  revalidatePath('/member/book')
  revalidatePath('/member/bookings')
  revalidatePath('/member/dashboard')
  revalidatePath('/coach/bookings')
  revalidatePath('/coach/schedule')
  return { success: true }
}

export async function cancelMemberBooking(id: string, memberId: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  // Verify booking belongs to member and get full details
  const { data: booking } = await client
    .from('bookings')
    .select(`
      id,
      member_id,
      coach_id,
      scheduled_at,
      status,
      member:members(name_en, email, phone),
      coach:coaches(name_en, email, phone)
    `)
    .eq('id', id)
    .single()

  if (!booking || booking.member_id !== memberId) {
    return { error: 'Booking not found' }
  }

  if (booking.status !== 'scheduled') {
    return { error: 'Cannot cancel this booking' }
  }

  const { error } = await client
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // Format date and time for notifications
  const bookingDate = format(new Date(booking.scheduled_at), 'EEEE, MMMM d, yyyy')
  const bookingTimeStr = format(new Date(booking.scheduled_at), 'h:mm a')

  // Send cancellation notifications (non-blocking)
  if (booking.member && booking.coach) {
    // Notify member
    notifyBookingCancellation(
      { name: booking.member.name_en, email: booking.member.email, phone: booking.member.phone },
      { date: bookingDate, time: bookingTimeStr, coachName: booking.coach.name_en }
    ).catch(console.error)

    // Notify coach
    notifyCoachBookingCancelled(
      { name: booking.coach.name_en, email: booking.coach.email, phone: booking.coach.phone },
      booking.member.name_en,
      { date: bookingDate, time: bookingTimeStr }
    ).catch(console.error)
  }

  revalidatePath('/member/bookings')
  revalidatePath('/member/dashboard')
  revalidatePath('/coach/bookings')
  revalidatePath('/coach/schedule')
  return { success: true }
}
