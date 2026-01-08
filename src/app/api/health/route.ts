import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  checks: {
    database: {
      status: 'up' | 'down'
      latency?: number
      error?: string
    }
    environment: {
      status: 'ok' | 'missing'
      missing?: string[]
    }
  }
}

export async function GET() {
  const startTime = Date.now()
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    checks: {
      database: { status: 'up' },
      environment: { status: 'ok' }
    }
  }

  // Check required environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  const missingEnvVars = requiredEnvVars.filter(v => !process.env[v])

  if (missingEnvVars.length > 0) {
    health.checks.environment = {
      status: 'missing',
      missing: missingEnvVars
    }
    health.status = 'degraded'
  }

  // Check database connectivity
  try {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any

    const dbStart = Date.now()
    const { error } = await client
      .from('gym_settings')
      .select('id')
      .limit(1)
      .single()

    const dbLatency = Date.now() - dbStart

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned, which is OK
      throw error
    }

    health.checks.database = {
      status: 'up',
      latency: dbLatency
    }
  } catch (error) {
    health.checks.database = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown database error'
    }
    health.status = 'unhealthy'
  }

  const statusCode = health.status === 'healthy' ? 200 :
                     health.status === 'degraded' ? 200 : 503

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Response-Time': `${Date.now() - startTime}ms`
    }
  })
}
