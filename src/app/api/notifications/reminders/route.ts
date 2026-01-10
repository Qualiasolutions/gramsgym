import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format, addDays, startOfDay, endOfDay } from 'date-fns'
import {
  notifySessionReminder,
  notifySubscriptionExpiring,
  notifyPTSessionsLow,
} from '@/lib/notifications'

// This endpoint should be called daily by a cron job
// Vercel Cron, Supabase Edge Functions, or external service

// SECURITY: Use POST for state-changing operations (sending notifications)
export async function POST(request: NextRequest) {
  // SECURITY: Require CRON_SECRET - no hardcoded fallback
  const authHeader = request.headers.get('authorization')
  const expectedKey = process.env.CRON_SECRET

  if (!expectedKey) {
    console.error('CRON_SECRET environment variable is not configured')
    return NextResponse.json(
      { error: 'Service misconfigured' },
      { status: 503 }
    )
  }

  if (authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  const results = {
    sessionReminders: 0,
    subscriptionExpiring: 0,
    ptSessionsLow: 0,
    errors: [] as string[],
  }

  try {
    // 1. Send session reminders for tomorrow's bookings
    const tomorrow = addDays(new Date(), 1)
    const tomorrowStart = startOfDay(tomorrow)
    const tomorrowEnd = endOfDay(tomorrow)

    const { data: tomorrowBookings } = await client
      .from('bookings')
      .select(`
        id,
        scheduled_at,
        member:members(name_en, email, phone),
        coach:coaches(name_en)
      `)
      .eq('status', 'scheduled')
      .gte('scheduled_at', tomorrowStart.toISOString())
      .lte('scheduled_at', tomorrowEnd.toISOString())

    if (tomorrowBookings) {
      for (const booking of tomorrowBookings) {
        if (booking.member && booking.coach) {
          try {
            await notifySessionReminder(
              {
                name: booking.member.name_en,
                email: booking.member.email,
                phone: booking.member.phone,
              },
              {
                date: format(new Date(booking.scheduled_at), 'EEEE, MMMM d, yyyy'),
                time: format(new Date(booking.scheduled_at), 'h:mm a'),
                coachName: booking.coach.name_en,
              }
            )
            results.sessionReminders++
          } catch (error) {
            results.errors.push(`Session reminder error: ${error}`)
          }
        }
      }
    }

    // 2. Send subscription expiring notifications (7 days before and 3 days before)
    const sevenDaysFromNow = addDays(new Date(), 7)
    const threeDaysFromNow = addDays(new Date(), 3)

    const { data: expiringMemberships } = await client
      .from('gym_memberships')
      .select(`
        id,
        end_date,
        member:members(name_en, email, phone),
        pricing:pricing(name_en)
      `)
      .eq('status', 'active')
      .or(`end_date.eq.${format(sevenDaysFromNow, 'yyyy-MM-dd')},end_date.eq.${format(threeDaysFromNow, 'yyyy-MM-dd')}`)

    if (expiringMemberships) {
      for (const membership of expiringMemberships) {
        if (membership.member) {
          const endDate = new Date(membership.end_date)
          const daysLeft = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

          try {
            await notifySubscriptionExpiring(
              {
                name: membership.member.name_en,
                email: membership.member.email,
                phone: membership.member.phone,
              },
              membership.pricing?.name_en || 'Gym Membership',
              format(endDate, 'MMMM d, yyyy'),
              daysLeft
            )
            results.subscriptionExpiring++
          } catch (error) {
            results.errors.push(`Subscription expiry error: ${error}`)
          }
        }
      }
    }

    // 3. Send PT sessions low notifications (when <= 2 sessions remaining)
    const { data: lowPtPackages } = await client
      .from('pt_packages')
      .select(`
        id,
        remaining_sessions,
        member:members(name_en, email, phone)
      `)
      .eq('status', 'active')
      .lte('remaining_sessions', 2)
      .gt('remaining_sessions', 0)

    if (lowPtPackages) {
      for (const ptPackage of lowPtPackages) {
        if (ptPackage.member) {
          try {
            await notifyPTSessionsLow(
              {
                name: ptPackage.member.name_en,
                email: ptPackage.member.email,
                phone: ptPackage.member.phone,
              },
              ptPackage.remaining_sessions
            )
            results.ptSessionsLow++
          } catch (error) {
            results.errors.push(`PT sessions low error: ${error}`)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Notification cron error:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications', details: String(error) },
      { status: 500 }
    )
  }
}
