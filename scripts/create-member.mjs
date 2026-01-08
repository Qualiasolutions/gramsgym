#!/usr/bin/env node
// One-time script to create a member using Supabase admin API
// Run with: node scripts/create-member.mjs

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const memberData = {
  email: 'moayad@admin.com',
  password: 'sprinkleofmillions',
  name_en: 'Moayad Admin',
  name_ar: 'مؤيد أدمن',
  phone: '+962 79 123 4567',
  whatsapp_number: '+962 79 123 4567',
}

async function createMember() {
  console.log('Creating auth user...')

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: memberData.email,
    password: memberData.password,
    email_confirm: true,
  })

  if (authError) {
    console.error('Auth error:', authError.message)
    process.exit(1)
  }

  if (!authData.user) {
    console.error('Failed to create user')
    process.exit(1)
  }

  console.log('Auth user created:', authData.user.id)

  // Create member record
  console.log('Creating member record...')
  const { error: memberError } = await supabase.from('members').insert({
    id: authData.user.id,
    email: memberData.email,
    name_en: memberData.name_en,
    name_ar: memberData.name_ar,
    phone: memberData.phone,
    whatsapp_number: memberData.whatsapp_number,
    preferred_language: 'en',
    notification_preference: 'whatsapp',
  })

  if (memberError) {
    console.error('Member error:', memberError.message)
    // Rollback: delete auth user
    await supabase.auth.admin.deleteUser(authData.user.id)
    process.exit(1)
  }

  console.log('Member record created!')

  // Create gym membership (1 year)
  console.log('Creating gym membership...')
  const startDate = new Date()
  const endDate = new Date()
  endDate.setFullYear(endDate.getFullYear() + 1)

  const { error: membershipError } = await supabase.from('gym_memberships').insert({
    member_id: authData.user.id,
    membership_type: 'yearly',
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    amount_paid: 300,
    payment_method: 'cash',
    is_active: true,
  })

  if (membershipError) {
    console.error('Membership error:', membershipError.message)
  } else {
    console.log('Gym membership created!')
  }

  console.log('\n✅ Member created successfully!')
  console.log('Email:', memberData.email)
  console.log('Password:', memberData.password)
  console.log('User ID:', authData.user.id)
}

createMember()
