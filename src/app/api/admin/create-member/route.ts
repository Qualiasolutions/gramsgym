// ONE-TIME USE: Create member via admin API
// DELETE THIS FILE AFTER USE
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// Secret key to prevent unauthorized access
const ADMIN_SECRET = 'create-moayad-member-2024'

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()

    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createAdminClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'moayad@admin.com',
      password: 'sprinkleofmillions',
      email_confirm: true,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Create member record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: memberError } = await (supabase as any).from('members').insert({
      id: authData.user.id,
      email: 'moayad@admin.com',
      name_en: 'Moayad Admin',
      name_ar: 'مؤيد أدمن',
      phone: '+962 79 123 4567',
      whatsapp_number: '+962 79 123 4567',
      preferred_language: 'en',
      notification_preference: 'whatsapp',
    })

    if (memberError) {
      // Rollback
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: memberError.message }, { status: 400 })
    }

    // Create gym membership (1 year)
    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('gym_memberships').insert({
      member_id: authData.user.id,
      membership_type: 'yearly',
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      amount_paid: 300,
      payment_method: 'cash',
      is_active: true,
    })

    return NextResponse.json({
      success: true,
      userId: authData.user.id,
      email: 'moayad@admin.com',
    })
  } catch (error) {
    console.error('Create member error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
