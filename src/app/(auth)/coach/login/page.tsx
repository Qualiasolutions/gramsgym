'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import {
  Loader2,
  ArrowLeft,
  Mail,
  KeyRound,
} from 'lucide-react'

export default function CoachLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('password')
  const [isConfigured, setIsConfigured] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured())
  }, [])

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConfigured) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Database connection unavailable')
        setLoading(false)
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
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
          setError('Access denied. Not a coach account.')
          setLoading(false)
          return
        }
      }

      router.push('/coach/dashboard')
      router.refresh()
    } catch {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConfigured) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Database connection unavailable')
        setLoading(false)
        return
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=coach`,
        },
      })

      if (otpError) {
        setError(otpError.message)
        setLoading(false)
        return
      }

      setSuccess('Check your email for the login link!')
      setLoading(false)
    } catch {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-champagne-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-champagne-500/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-sm p-8 border border-zinc-800/50">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative w-[140px] h-[50px] mx-auto mb-4">
              <Image
                src="/logo.png"
                alt="Grams Gym"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-display font-semibold mb-1">
              Coach Login
            </h1>
            <p className="text-zinc-500 text-sm">
              Sign in to your dashboard
            </p>
          </div>

          {isConfigured ? (
            <>
              {/* Login Method Tabs */}
              <div className="flex gap-2 mb-6 p-1 rounded-lg bg-zinc-800/50">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'password'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('magic')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'magic'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Magic Link
                </button>
              </div>

              {/* Forms */}
              <AnimatePresence mode="wait">
                {loginMethod === 'password' ? (
                  <motion.form
                    key="password"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handlePasswordLogin}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 transition-colors disabled:opacity-50"
                        placeholder="coach@gramsgym.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 transition-colors disabled:opacity-50"
                        placeholder="••••••••"
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-lg font-medium text-white bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="magic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleMagicLink}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 transition-colors disabled:opacity-50"
                        placeholder="coach@gramsgym.com"
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    {success && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-sm text-green-400">{success}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-lg font-medium text-white bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending link...</span>
                        </>
                      ) : (
                        <span>Send Magic Link</span>
                      )}
                    </button>

                    <p className="text-xs text-zinc-500 text-center">
                      We&apos;ll send you a login link to your email
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-zinc-500">
                Database not configured. Use Demo Mode to explore.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-champagne-400 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
