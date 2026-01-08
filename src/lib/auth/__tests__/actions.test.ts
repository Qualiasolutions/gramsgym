import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signInCoach, signInMember, signOut } from '../actions'

// Mock dependencies
const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signInWithOtp: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn()
      }))
    }))
  }))
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase))
}))

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn(() => Promise.resolve({ success: true, remaining: 4, reset: Date.now() + 60000 }))
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => Promise.resolve(new Map([
    ['x-forwarded-for', '192.168.1.1']
  ])))
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signInCoach', () => {
    it('should sign in a valid coach', async () => {
      // Mock successful auth
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'coach-123' } },
        error: null
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'coach-123' } }
      })

      // Mock coach lookup
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'coach-123' }
            })
          })
        })
      })

      const formData = new FormData()
      formData.set('email', 'coach@gramsgym.com')
      formData.set('password', 'password123')

      // This will throw redirect, which is expected
      try {
        await signInCoach(formData)
      } catch (e) {
        // redirect throws an error in tests
      }

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'coach@gramsgym.com',
        password: 'password123'
      })
    })

    it('should return error for invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' }
      })

      const formData = new FormData()
      formData.set('email', 'coach@gramsgym.com')
      formData.set('password', 'wrongpassword')

      const result = await signInCoach(formData)

      expect(result).toEqual({
        error: 'Invalid login credentials',
        remaining: 4
      })
    })

    it('should deny access to non-coach users', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'member-123' } },
        error: null
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'member-123' } }
      })

      // Mock coach lookup - returns null (not a coach)
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null
            })
          })
        })
      })

      mockSupabase.auth.signOut.mockResolvedValue({})

      const formData = new FormData()
      formData.set('email', 'member@gramsgym.com')
      formData.set('password', 'password123')

      const result = await signInCoach(formData)

      expect(result).toEqual({ error: 'Access denied. Not a coach account.' })
      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('signInMember', () => {
    it('should sign in a valid member', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'member-123' } },
        error: null
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'member-123' } }
      })

      // Mock member lookup
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'member-123' }
            })
          })
        })
      })

      const formData = new FormData()
      formData.set('email', 'member@example.com')
      formData.set('password', 'password123')

      // redirect throws in tests
      try {
        await signInMember(formData)
      } catch (e) {
        // expected
      }

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'member@example.com',
        password: 'password123'
      })
    })

    it('should deny access to non-member users', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'coach-123' } },
        error: null
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'coach-123' } }
      })

      // Mock member lookup - returns null (not a member)
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null
            })
          })
        })
      })

      mockSupabase.auth.signOut.mockResolvedValue({})

      const formData = new FormData()
      formData.set('email', 'coach@gramsgym.com')
      formData.set('password', 'password123')

      const result = await signInMember(formData)

      expect(result).toEqual({ error: 'Access denied. Not a member account.' })
    })
  })

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({})

      try {
        await signOut()
      } catch (e) {
        // redirect throws in tests
      }

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })
  })
})

describe('Rate Limiting Integration', () => {
  it('should block after too many attempts', async () => {
    // Import the mock to override it
    const { checkRateLimit } = await import('@/lib/rate-limit')
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: false,
      remaining: 0,
      reset: Date.now() + 60000
    })

    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('password', 'password')

    const result = await signInCoach(formData)

    expect(result).toEqual({
      error: 'Too many login attempts. Please try again in a minute.'
    })
  })
})
