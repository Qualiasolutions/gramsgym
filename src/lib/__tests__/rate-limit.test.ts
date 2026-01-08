import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkRateLimit } from '../rate-limit'

// Mock Upstash Redis - not available in tests
vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: vi.fn()
}))

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn()
}))

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkRateLimit (in-memory fallback)', () => {
    it('should allow requests within limit', async () => {
      const identifier = `test-${Date.now()}-allow`

      // First request should succeed
      const result1 = await checkRateLimit(identifier, 5, 60000)
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(4)

      // Second request should succeed
      const result2 = await checkRateLimit(identifier, 5, 60000)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(3)
    })

    it('should block requests exceeding limit', async () => {
      const identifier = `test-${Date.now()}-block`

      // Use up all 3 allowed requests
      for (let i = 0; i < 3; i++) {
        await checkRateLimit(identifier, 3, 60000)
      }

      // 4th request should be blocked
      const result = await checkRateLimit(identifier, 3, 60000)
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after window expires', async () => {
      const identifier = `test-${Date.now()}-reset`

      // Use up all requests with a very short window (1ms)
      await checkRateLimit(identifier, 1, 1)

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 10))

      // Should allow new request
      const result = await checkRateLimit(identifier, 1, 1)
      expect(result.success).toBe(true)
    })

    it('should handle different identifiers separately', async () => {
      const identifier1 = `test-${Date.now()}-user1`
      const identifier2 = `test-${Date.now()}-user2`

      // Use up all requests for user1
      for (let i = 0; i < 2; i++) {
        await checkRateLimit(identifier1, 2, 60000)
      }

      // User1 should be blocked
      const result1 = await checkRateLimit(identifier1, 2, 60000)
      expect(result1.success).toBe(false)

      // User2 should still be allowed
      const result2 = await checkRateLimit(identifier2, 2, 60000)
      expect(result2.success).toBe(true)
    })

    it('should return reset timestamp', async () => {
      const identifier = `test-${Date.now()}-timestamp`
      const beforeTime = Date.now()

      const result = await checkRateLimit(identifier, 5, 60000)

      // Reset time should be ~60 seconds in the future
      expect(result.reset).toBeGreaterThanOrEqual(beforeTime + 60000)
      expect(result.reset).toBeLessThanOrEqual(beforeTime + 60000 + 100) // Allow 100ms tolerance
    })
  })

  describe('Rate limit edge cases', () => {
    it('should handle zero limit on second request', async () => {
      const identifier = `test-${Date.now()}-zero`

      // First request creates the record
      await checkRateLimit(identifier, 0, 60000)

      // Second request with limit 0 should be blocked since count(1) >= limit(0)
      const result = await checkRateLimit(identifier, 0, 60000)
      expect(result.success).toBe(false)
    })

    it('should handle empty identifier', async () => {
      const result = await checkRateLimit('', 5, 60000)
      expect(result.success).toBe(true)
    })
  })
})
