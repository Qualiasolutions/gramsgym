import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'
import { sendWhatsAppMessage, whatsappTemplates } from '@/lib/notifications/whatsapp'

// Cron secret for scheduled job authentication
const CRON_SECRET = process.env.CRON_SECRET

// Helper to get client IP
async function getClientIP(): Promise<string> {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  return forwardedFor?.split(',')[0] || realIP || 'unknown'
}

interface ExpiringMember {
  id: string
  name_en: string
  name_ar: string | null
  whatsapp_number: string | null
  phone: string | null
  notification_preference: string
  membership?: {
    type: string
    end_date: string
  }
}

interface ReminderResult {
  success: boolean
  totalMembers: number
  sent: number
  failed: number
  results: Array<{
    memberId: string
    memberName: string
    status: 'sent' | 'failed' | 'no_whatsapp'
    error?: string
    daysLeft: number
  }>
}

export async function POST(request: NextRequest): Promise<NextResponse<ReminderResult>> {
  try {
    // SECURITY: Authentication - allow either cron secret OR authenticated coach
    const headersList = await headers()
    const cronSecret = headersList.get('x-cron-secret') || headersList.get('authorization')?.replace('Bearer ', '')

    const supabase = await createClient()
    let isAuthorized = false

    // Check cron secret first (for scheduled jobs)
    if (CRON_SECRET && cronSecret === CRON_SECRET) {
      isAuthorized = true
    } else {
      // Fall back to coach authentication (for manual triggers)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: coach } = await supabase
          .from('coaches')
          .select('id')
          .eq('id', user.id)
          .single()
        isAuthorized = !!coach
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          totalMembers: 0,
          sent: 0,
          failed: 0,
          results: [{ memberId: '', memberName: '', status: 'failed', error: 'Unauthorized. Valid cron secret or coach authentication required.', daysLeft: 0 }]
        },
        { status: 401 }
      )
    }

    // Rate limiting: 3 calls per hour
    const ip = await getClientIP()
    const rateLimitKey = `api:reminders:${ip}`
    const { success: rateLimitSuccess } = await checkRateLimit(rateLimitKey, 3, 3600000)

    if (!rateLimitSuccess) {
      return NextResponse.json(
        {
          success: false,
          totalMembers: 0,
          sent: 0,
          failed: 0,
          results: [{ memberId: '', memberName: '', status: 'failed', error: 'Rate limit exceeded. Please try again later.', daysLeft: 0 }]
        },
        { status: 429 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const daysThreshold = body.daysThreshold || 7 // Default: members expiring within 7 days

    // Get current date and threshold date
    const today = new Date()
    const thresholdDate = new Date()
    thresholdDate.setDate(today.getDate() + daysThreshold)

    // Find members with expiring gym memberships
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: expiringMemberships, error } = await (supabase as any)
      .from('gym_memberships')
      .select(`
        id,
        type,
        end_date,
        member:members(
          id,
          name_en,
          name_ar,
          whatsapp_number,
          phone,
          notification_preference
        )
      `)
      .eq('status', 'active')
      .gte('end_date', today.toISOString().split('T')[0])
      .lte('end_date', thresholdDate.toISOString().split('T')[0])

    if (error) {
      return NextResponse.json(
        {
          success: false,
          totalMembers: 0,
          sent: 0,
          failed: 0,
          results: [{ memberId: '', memberName: '', status: 'failed', error: error.message, daysLeft: 0 }]
        },
        { status: 500 }
      )
    }

    const results: ReminderResult = {
      success: true,
      totalMembers: expiringMemberships?.length || 0,
      sent: 0,
      failed: 0,
      results: [],
    }

    if (!expiringMemberships || expiringMemberships.length === 0) {
      return NextResponse.json({
        success: true,
        totalMembers: 0,
        sent: 0,
        failed: 0,
        results: [],
      })
    }

    // Send reminders to each member
    for (const membership of expiringMemberships) {
      const member = membership.member as ExpiringMember | null

      if (!member) continue

      const endDate = new Date(membership.end_date)
      const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      const whatsappNumber = member.whatsapp_number || member.phone

      if (!whatsappNumber) {
        results.results.push({
          memberId: member.id,
          memberName: member.name_en,
          status: 'no_whatsapp',
          error: 'No WhatsApp number',
          daysLeft,
        })
        results.failed++
        continue
      }

      // Get subscription type display name
      const subscriptionType = getSubscriptionTypeName(membership.type)

      // Send WhatsApp message
      const message = whatsappTemplates.subscriptionExpiring(
        member.name_en,
        subscriptionType,
        daysLeft
      )

      const sendResult = await sendWhatsAppMessage(whatsappNumber, message)

      if (sendResult.success) {
        results.sent++
        results.results.push({
          memberId: member.id,
          memberName: member.name_en,
          status: 'sent',
          daysLeft,
        })

        // Log the notification
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('notifications_log').insert({
          member_id: member.id,
          type: 'membership_expiry',
          channel: 'whatsapp',
          message_content: message,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
      } else {
        results.failed++
        results.results.push({
          memberId: member.id,
          memberName: member.name_en,
          status: 'failed',
          error: sendResult.error,
          daysLeft,
        })

        // Log failed notification
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('notifications_log').insert({
          member_id: member.id,
          type: 'membership_expiry',
          channel: 'whatsapp',
          message_content: message,
          status: 'failed',
        })
      }
    }

    results.success = results.failed === 0

    return NextResponse.json(results)
  } catch (error) {
    console.error('Send reminders error:', error)
    return NextResponse.json(
      {
        success: false,
        totalMembers: 0,
        sent: 0,
        failed: 0,
        results: [{ memberId: '', memberName: '', status: 'failed', error: error instanceof Error ? error.message : 'Unknown error', daysLeft: 0 }]
      },
      { status: 500 }
    )
  }
}

function getSubscriptionTypeName(type: string): string {
  switch (type) {
    case 'monthly': return 'Monthly Membership'
    case 'quarterly': return 'Quarterly Membership'
    case 'yearly': return 'Yearly Membership'
    default: return 'Gym Membership'
  }
}

// GET endpoint to check expiring memberships without sending
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // SECURITY: Verify coach authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 })
    }

    const { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!coach) {
      return NextResponse.json({ error: 'Forbidden. Only coaches can view expiring memberships.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const daysThreshold = parseInt(searchParams.get('days') || '7')

    const today = new Date()
    const thresholdDate = new Date()
    thresholdDate.setDate(today.getDate() + daysThreshold)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: expiringMemberships, error } = await (supabase as any)
      .from('gym_memberships')
      .select(`
        id,
        type,
        end_date,
        member:members(
          id,
          name_en,
          name_ar,
          whatsapp_number,
          phone,
          email
        )
      `)
      .eq('status', 'active')
      .gte('end_date', today.toISOString().split('T')[0])
      .lte('end_date', thresholdDate.toISOString().split('T')[0])
      .order('end_date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const membersExpiring = expiringMemberships?.map((m: { end_date: string; type: string; member: ExpiringMember }) => {
      const endDate = new Date(m.end_date)
      const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return {
        ...m.member,
        membership_type: m.type,
        end_date: m.end_date,
        days_left: daysLeft,
        has_whatsapp: !!(m.member?.whatsapp_number || m.member?.phone),
      }
    }) || []

    return NextResponse.json({
      count: membersExpiring.length,
      daysThreshold,
      members: membersExpiring,
    })
  } catch (error) {
    console.error('Get expiring members error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
