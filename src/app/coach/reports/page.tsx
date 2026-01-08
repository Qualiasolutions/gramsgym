import { createClient } from '@/lib/supabase/server'
import { ReportsDashboard } from '@/components/coach/reports-dashboard'
import { isDemoMode } from '@/lib/demo-mode'
import { demoMembers, demoBookings, demoGymMemberships, demoPTPackages } from '@/lib/demo-data'

export default async function ReportsPage() {
  // Check for demo mode
  const demoMode = await isDemoMode()

  let totalMembers = 0
  let activeMembers = 0
  let totalBookings = 0
  let completedBookings = 0
  let scheduledBookings = 0
  let cancelledBookings = 0
  let totalRevenue = 0
  let activeMemberships = 0
  let activePTPackages = 0
  let membershipsByType = { monthly: 0, quarterly: 0, yearly: 0 }
  let revenueByMonth: { month: string; revenue: number }[] = []
  let memberGrowth: { month: string; members: number }[] = []

  if (demoMode === 'coach') {
    totalMembers = demoMembers.length
    activeMembers = demoMembers.length
    totalBookings = demoBookings.length
    completedBookings = demoBookings.filter(b => b.status === 'completed').length
    scheduledBookings = demoBookings.filter(b => b.status === 'scheduled').length
    cancelledBookings = demoBookings.filter(b => (b.status as string) === 'cancelled').length
    totalRevenue = demoGymMemberships.reduce((sum, m) => sum + (m.price_paid || 0), 0) +
                   demoPTPackages.reduce((sum, p) => sum + (p.price_paid || 0), 0)
    activeMemberships = demoGymMemberships.filter(m => m.status === 'active').length
    activePTPackages = demoPTPackages.filter(p => p.status === 'active').length

    // Demo membership distribution
    membershipsByType = {
      monthly: 1,
      quarterly: 1,
      yearly: 0
    }

    // Demo revenue by month (last 6 months)
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
    revenueByMonth = months.map((month, i) => ({
      month,
      revenue: 200 + Math.floor(Math.random() * 300)
    }))

    // Demo member growth
    memberGrowth = months.map((month, i) => ({
      month,
      members: 5 + i * 2
    }))
  } else {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any

    // Get member counts
    const { count: membersCount } = await client
      .from('members')
      .select('*', { count: 'exact', head: true })
    totalMembers = membersCount || 0
    activeMembers = membersCount || 0

    // Get booking stats
    const { data: bookings } = await client
      .from('bookings')
      .select('status')
    totalBookings = bookings?.length || 0
    completedBookings = bookings?.filter((b: { status: string }) => b.status === 'completed').length || 0
    scheduledBookings = bookings?.filter((b: { status: string }) => b.status === 'scheduled').length || 0
    cancelledBookings = bookings?.filter((b: { status: string }) => b.status === 'cancelled').length || 0

    // Get revenue from memberships
    const { data: memberships } = await client
      .from('gym_memberships')
      .select('price_paid, status, type')
    const membershipRevenue = memberships?.reduce((sum: number, m: { price_paid: number }) => sum + (m.price_paid || 0), 0) || 0
    activeMemberships = memberships?.filter((m: { status: string }) => m.status === 'active').length || 0

    // Calculate membership distribution
    membershipsByType = {
      monthly: memberships?.filter((m: { type: string; status: string }) => m.type === 'monthly' && m.status === 'active').length || 0,
      quarterly: memberships?.filter((m: { type: string; status: string }) => m.type === 'quarterly' && m.status === 'active').length || 0,
      yearly: memberships?.filter((m: { type: string; status: string }) => m.type === 'yearly' && m.status === 'active').length || 0,
    }

    // Get revenue from PT packages
    const { data: ptPackages } = await client
      .from('pt_packages')
      .select('price_paid, status')
    const ptRevenue = ptPackages?.reduce((sum: number, p: { price_paid: number }) => sum + (p.price_paid || 0), 0) || 0
    activePTPackages = ptPackages?.filter((p: { status: string }) => p.status === 'active').length || 0

    totalRevenue = membershipRevenue + ptRevenue

    // Generate revenue by month (last 6 months - simplified)
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
    revenueByMonth = months.map((month) => ({
      month,
      revenue: Math.round(totalRevenue / 6)
    }))

    // Generate member growth
    memberGrowth = months.map((month, i) => ({
      month,
      members: Math.max(1, totalMembers - (5 - i) * 2)
    }))
  }

  return (
    <ReportsDashboard
      totalMembers={totalMembers}
      activeMembers={activeMembers}
      totalBookings={totalBookings}
      completedBookings={completedBookings}
      scheduledBookings={scheduledBookings}
      cancelledBookings={cancelledBookings}
      totalRevenue={totalRevenue}
      activeMemberships={activeMemberships}
      activePTPackages={activePTPackages}
      membershipsByType={membershipsByType}
      revenueByMonth={revenueByMonth}
      memberGrowth={memberGrowth}
    />
  )
}
