'use client'

// TEMPORARY: Delete this file after creating the user
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TempSignupPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    setStatus('Creating user...')

    try {
      const supabase = createClient()

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: 'moayad@admin.com',
        password: 'sprinkleofmillions',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setStatus(`Auth Error: ${error.message}`)
        setLoading(false)
        return
      }

      if (!data.user) {
        setStatus('Failed to create user')
        setLoading(false)
        return
      }

      setStatus(`User created with ID: ${data.user.id}. Now creating member record...`)

      // Create member record
      const { error: memberError } = await supabase.from('members').insert({
        id: data.user.id,
        email: 'moayad@admin.com',
        name_en: 'Moayad Admin',
        name_ar: 'مؤيد أدمن',
        phone: '+962 79 123 4567',
        whatsapp_number: '+962 79 123 4567',
        preferred_language: 'en',
        notification_preference: 'whatsapp',
      })

      if (memberError) {
        setStatus(`Member Error: ${memberError.message}`)
        setLoading(false)
        return
      }

      // Create gym membership
      const startDate = new Date()
      const endDate = new Date()
      endDate.setFullYear(endDate.getFullYear() + 1)

      await supabase.from('gym_memberships').insert({
        member_id: data.user.id,
        membership_type: 'yearly',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        amount_paid: 300,
        payment_method: 'cash',
        is_active: true,
      })

      setStatus(`SUCCESS! User created. Email: moayad@admin.com, Password: sprinkleofmillions`)
    } catch (err) {
      setStatus(`Error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-8 rounded-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Temporary Signup</h1>
        <p className="text-zinc-400 mb-6">
          Click the button to create the member account:<br />
          Email: moayad@admin.com<br />
          Password: sprinkleofmillions
        </p>
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 px-4 bg-champagne-500 text-black font-semibold rounded-lg hover:bg-champagne-400 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Member Account'}
        </button>
        {status && (
          <div className={`mt-4 p-4 rounded-lg ${status.includes('SUCCESS') ? 'bg-green-900/50 text-green-300' : status.includes('Error') ? 'bg-red-900/50 text-red-300' : 'bg-zinc-800 text-zinc-300'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  )
}
