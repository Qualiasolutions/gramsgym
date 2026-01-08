import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js modules
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn()
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams())
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map([
    ['x-forwarded-for', '127.0.0.1'],
  ])),
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    getAll: vi.fn(() => [])
  }))
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.OPENROUTER_API_KEY = 'test-openrouter-key'
process.env.RESEND_API_KEY = 'test-resend-key'
process.env.NODE_ENV = 'test'
