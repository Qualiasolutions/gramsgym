'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateMemberProfile(id: string, formData: FormData) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  const name_en = formData.get('name_en') as string
  const name_ar = formData.get('name_ar') as string
  const phone = formData.get('phone') as string
  const whatsapp_number = formData.get('whatsapp_number') as string
  const preferred_language = formData.get('preferred_language') as 'ar' | 'en'
  const notification_preference = formData.get('notification_preference') as 'whatsapp' | 'email' | 'both'

  const { error } = await client
    .from('members')
    .update({
      name_en,
      name_ar,
      phone: phone || null,
      whatsapp_number: whatsapp_number || null,
      preferred_language,
      notification_preference,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/member/profile')
  revalidatePath('/member/dashboard')
  return { success: true }
}
