'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

// Helper to get client IP
async function getClientIP(): Promise<string> {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  return forwardedFor?.split(',')[0] || realIP || 'unknown'
}

export async function signInCoach(formData: FormData) {
  const ip = await getClientIP()
  const email = formData.get('email') as string

  // Rate limit by IP + email combination
  const rateLimitKey = `auth:coach:${ip}:${email}`
  const { success, remaining } = await checkRateLimit(rateLimitKey, 5, 60000)

  if (!success) {
    return { error: 'Too many login attempts. Please try again in a minute.' }
  }

  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message, remaining }
  }

  // Verify user is a coach
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!coach) {
      await supabase.auth.signOut()
      return { error: 'Access denied. Not a coach account.' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/coach/dashboard')
}

export async function signInMember(formData: FormData) {
  const ip = await getClientIP()
  const email = formData.get('email') as string

  // Rate limit by IP + email combination
  const rateLimitKey = `auth:member:${ip}:${email}`
  const { success, remaining } = await checkRateLimit(rateLimitKey, 5, 60000)

  if (!success) {
    return { error: 'Too many login attempts. Please try again in a minute.' }
  }

  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message, remaining }
  }

  // Verify user is a member
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: member } = await supabase
      .from('members')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!member) {
      await supabase.auth.signOut()
      return { error: 'Access denied. Not a member account.' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/member/dashboard')
}

export async function signInMemberMagicLink(formData: FormData) {
  const ip = await getClientIP()
  const email = formData.get('email') as string

  // Rate limit magic link requests more strictly
  const rateLimitKey = `auth:magic:${ip}:${email}`
  const { success } = await checkRateLimit(rateLimitKey, 3, 300000) // 3 per 5 minutes

  if (!success) {
    return { error: 'Too many requests. Please try again in a few minutes.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=member`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Check your email for the login link!' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOutCoach() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/coach/login')
}

export async function signOutMember() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/member/login')
}
