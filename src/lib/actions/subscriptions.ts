'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { addMonths } from 'date-fns'

// SECURITY: Helper to verify the user is an authenticated coach
async function verifyCoachAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized: Not authenticated', isCoach: false }
  }

  const { data: coach } = await supabase
    .from('coaches')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!coach) {
    return { error: 'Unauthorized: Coach access required', isCoach: false }
  }

  return { error: null, isCoach: true }
}

export async function createGymMembership(formData: FormData) {
  // SECURITY: Verify caller is a coach
  const auth = await verifyCoachAuth()
  if (!auth.isCoach) {
    return { error: auth.error }
  }

  const supabase = await createClient()

  const member_id = formData.get('member_id') as string
  const type = formData.get('type') as 'monthly' | 'quarterly' | 'yearly'
  const price_paid = parseFloat(formData.get('price_paid') as string) || null
  const start_date = formData.get('start_date') as string

  // Calculate end date based on type
  const startDate = new Date(start_date)
  let endDate: Date

  switch (type) {
    case 'monthly':
      endDate = addMonths(startDate, 1)
      break
    case 'quarterly':
      endDate = addMonths(startDate, 3)
      break
    case 'yearly':
      endDate = addMonths(startDate, 12)
      break
    default:
      endDate = addMonths(startDate, 1)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('gym_memberships').insert({
    member_id,
    type,
    start_date,
    end_date: endDate.toISOString().split('T')[0],
    price_paid,
    status: 'active',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/coach/subscriptions')
  revalidatePath('/coach/members')
  revalidatePath(`/coach/members/${member_id}`)
  return { success: true }
}

export async function createPTPackage(formData: FormData) {
  // SECURITY: Verify caller is a coach
  const auth = await verifyCoachAuth()
  if (!auth.isCoach) {
    return { error: auth.error }
  }

  const supabase = await createClient()

  const member_id = formData.get('member_id') as string
  const coach_id = formData.get('coach_id') as string
  const total_sessions = parseInt(formData.get('total_sessions') as string)
  const price_paid = parseFloat(formData.get('price_paid') as string) || null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('pt_packages').insert({
    member_id,
    coach_id,
    total_sessions,
    remaining_sessions: total_sessions,
    price_paid,
    status: 'active',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/coach/subscriptions')
  revalidatePath('/coach/members')
  revalidatePath(`/coach/members/${member_id}`)
  return { success: true }
}

export async function cancelGymMembership(id: string) {
  // SECURITY: Verify caller is a coach
  const auth = await verifyCoachAuth()
  if (!auth.isCoach) {
    return { error: auth.error }
  }

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('gym_memberships')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/coach/subscriptions')
  revalidatePath('/coach/members')
  return { success: true }
}

export async function cancelPTPackage(id: string) {
  // SECURITY: Verify caller is a coach
  const auth = await verifyCoachAuth()
  if (!auth.isCoach) {
    return { error: auth.error }
  }

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('pt_packages')
    .update({ status: 'expired' })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/coach/subscriptions')
  revalidatePath('/coach/members')
  return { success: true }
}
