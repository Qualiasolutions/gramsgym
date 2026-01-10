'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// SECURITY: Helper to verify the user is an authenticated coach
async function verifyCoachAuth() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized: Not authenticated', isCoach: false }
  }

  const { data: coach } = await client
    .from('coaches')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!coach) {
    return { error: 'Unauthorized: Coach access required', isCoach: false }
  }

  return { error: null, isCoach: true }
}

export async function updateGymSettings(formData: FormData) {
  // SECURITY: Verify caller is a coach
  const auth = await verifyCoachAuth()
  if (!auth.isCoach) {
    return { error: auth.error }
  }

  const supabase = await createClient()

  const id = formData.get('id') as string
  const name_en = formData.get('name_en') as string
  const name_ar = formData.get('name_ar') as string
  const description_en = formData.get('description_en') as string || null
  const description_ar = formData.get('description_ar') as string || null
  const address_en = formData.get('address_en') as string || null
  const address_ar = formData.get('address_ar') as string || null
  const phone = formData.get('phone') as string || null
  const email = formData.get('email') as string || null
  const instagram = formData.get('instagram') as string || null
  const whatsapp = formData.get('whatsapp') as string || null

  const data = {
    name_en,
    name_ar,
    description_en,
    description_ar,
    address_en,
    address_ar,
    phone,
    email,
    instagram,
    whatsapp,
  }

  let error

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  if (id) {
    const result = await client
      .from('gym_settings')
      .update(data)
      .eq('id', id)
    error = result.error
  } else {
    const result = await client
      .from('gym_settings')
      .insert(data)
    error = result.error
  }

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/coach/settings')
  revalidatePath('/')
  return { success: true }
}

export async function createPricing(formData: FormData) {
  // SECURITY: Verify caller is a coach
  const auth = await verifyCoachAuth()
  if (!auth.isCoach) {
    return { error: auth.error }
  }

  const supabase = await createClient()

  const name_en = formData.get('name_en') as string
  const name_ar = formData.get('name_ar') as string
  const type = formData.get('type') as string
  const duration_or_sessions = formData.get('duration_or_sessions') as string || null
  const price = parseFloat(formData.get('price') as string)
  const is_active = formData.get('is_active') === 'on'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('pricing').insert({
    name_en,
    name_ar,
    type,
    duration_or_sessions,
    price,
    is_active,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/coach/settings')
  revalidatePath('/')
  return { success: true }
}

export async function updatePricing(id: string, formData: FormData) {
  // SECURITY: Verify caller is a coach
  const auth = await verifyCoachAuth()
  if (!auth.isCoach) {
    return { error: auth.error }
  }

  const supabase = await createClient()

  const name_en = formData.get('name_en') as string
  const name_ar = formData.get('name_ar') as string
  const type = formData.get('type') as string
  const duration_or_sessions = formData.get('duration_or_sessions') as string || null
  const price = parseFloat(formData.get('price') as string)
  const is_active = formData.get('is_active') === 'on'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('pricing')
    .update({
      name_en,
      name_ar,
      type,
      duration_or_sessions,
      price,
      is_active,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/coach/settings')
  revalidatePath('/')
  return { success: true }
}

export async function deletePricing(id: string) {
  // SECURITY: Verify caller is a coach
  const auth = await verifyCoachAuth()
  if (!auth.isCoach) {
    return { error: auth.error }
  }

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('pricing')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/coach/settings')
  return { success: true }
}

export async function updateWorkingHours(formData: FormData) {
  // SECURITY: Verify caller is a coach
  const auth = await verifyCoachAuth()
  if (!auth.isCoach) {
    return { error: auth.error }
  }

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  const updates = []

  for (let day = 0; day < 7; day++) {
    const id = formData.get(`day_${day}_id`) as string
    const is_open = formData.get(`day_${day}_open`) === 'on'
    const open_time = formData.get(`day_${day}_open_time`) as string
    const close_time = formData.get(`day_${day}_close_time`) as string

    const data = {
      day_of_week: day,
      open_time: is_open ? open_time : null,
      close_time: is_open ? close_time : null,
      is_closed: !is_open,
    }

    if (id) {
      updates.push(
        client
          .from('gym_working_hours')
          .update(data)
          .eq('id', id)
      )
    } else {
      updates.push(
        client
          .from('gym_working_hours')
          .insert(data)
      )
    }
  }

  const results = await Promise.all(updates)
  const errors = results.filter((r: { error?: { message: string } }) => r.error)

  if (errors.length > 0) {
    return { error: errors[0].error?.message }
  }

  revalidatePath('/coach/settings')
  revalidatePath('/')
  return { success: true }
}
