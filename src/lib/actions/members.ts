'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { CACHE_TAGS } from '@/lib/cache'

export async function createMember(formData: FormData) {
  const supabase = await createAdminClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name_en = formData.get('name_en') as string
  const name_ar = formData.get('name_ar') as string
  const phone = formData.get('phone') as string
  const whatsapp_number = formData.get('whatsapp_number') as string
  const assigned_coach_id = formData.get('assigned_coach_id') as string
  const preferred_language = formData.get('preferred_language') as 'ar' | 'en'
  const notification_preference = formData.get('notification_preference') as 'whatsapp' | 'email' | 'both'

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Failed to create user' }
  }

  // Create member record with the same ID
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: memberError } = await (supabase as any).from('members').insert({
    id: authData.user.id,
    email,
    name_en,
    name_ar,
    phone: phone || null,
    whatsapp_number: whatsapp_number || null,
    assigned_coach_id: assigned_coach_id || null,
    preferred_language: preferred_language || 'ar',
    notification_preference: notification_preference || 'whatsapp',
  })

  if (memberError) {
    // Rollback: delete the auth user if member creation fails
    await supabase.auth.admin.deleteUser(authData.user.id)
    return { error: memberError.message }
  }

  revalidateTag(CACHE_TAGS.MEMBERS, 'max')
  revalidatePath('/coach/members')
  redirect('/coach/members')
}

export async function updateMember(id: string, formData: FormData) {
  const supabase = await createClient()

  const name_en = formData.get('name_en') as string
  const name_ar = formData.get('name_ar') as string
  const phone = formData.get('phone') as string
  const whatsapp_number = formData.get('whatsapp_number') as string
  const assigned_coach_id = formData.get('assigned_coach_id') as string
  const preferred_language = formData.get('preferred_language') as 'ar' | 'en'
  const notification_preference = formData.get('notification_preference') as 'whatsapp' | 'email' | 'both'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('members')
    .update({
      name_en,
      name_ar,
      phone: phone || null,
      whatsapp_number: whatsapp_number || null,
      assigned_coach_id: assigned_coach_id || null,
      preferred_language: preferred_language || 'ar',
      notification_preference: notification_preference || 'whatsapp',
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidateTag(CACHE_TAGS.MEMBERS, 'max')
  revalidatePath('/coach/members')
  revalidatePath(`/coach/members/${id}`)
  return { success: true }
}

export async function deleteMember(id: string) {
  const supabase = await createAdminClient()

  // SECURITY FIX: Delete auth user FIRST to prevent orphaned auth users
  // If member deletion fails afterward, the user simply can't log in (safer than orphaned auth)

  // First verify the member exists
  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('id', id)
    .single()

  if (!member) {
    return { error: 'Member not found' }
  }

  // Delete auth user first
  const { error: authError } = await supabase.auth.admin.deleteUser(id)

  if (authError) {
    console.error('Failed to delete auth user:', authError)
    return { error: `Failed to delete user account: ${authError.message}` }
  }

  // Delete member record (cascade will handle related records)
  const { error: memberError } = await supabase
    .from('members')
    .delete()
    .eq('id', id)

  if (memberError) {
    // Auth user is already deleted, but member record remains
    // This is a safer state - user can't log in but data is preserved
    // Log this for manual cleanup if needed
    console.error('Auth deleted but member record deletion failed:', memberError)
    return { error: `Account deleted but member data cleanup failed. Please contact support.` }
  }

  revalidateTag(CACHE_TAGS.MEMBERS, 'max')
  revalidatePath('/coach/members')
  redirect('/coach/members')
}
