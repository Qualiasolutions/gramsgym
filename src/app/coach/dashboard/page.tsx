import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  AlertTriangle,
  Calendar,
  TrendingUp,
  UserPlus,
  CreditCard,
  Clock,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { format, addDays, differenceInDays } from 'date-fns'

async function getDashboardStats(supabase: Awaited<ReturnType<typeof createClient>>) {
  const today = new Date()
  const nextWeek = addDays(today, 7)

  // Get active members count
  const { count: activeMembers } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })

  // Get expiring memberships this week
  const { data: expiringMemberships } = await supabase
    .from('gym_memberships')
    .select(`
      *,
      member:members(id, name_en, name_ar, email, profile_photo_url)
    `)
    .eq('status', 'active')
    .lte('end_date', nextWeek.toISOString().split('T')[0])
    .gte('end_date', today.toISOString().split('T')[0])
    .order('end_date', { ascending: true })
    .limit(5)

  // Get today's bookings
  const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  const { data: todayBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      member:members(id, name_en, name_ar, profile_photo_url),
      coach:coaches(id, name_en, name_ar)
    `)
    .gte('scheduled_at', todayStart)
    .lte('scheduled_at', todayEnd)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })

  // Get low session packages
  const { data: lowSessionPackages } = await supabase
    .from('pt_packages')
    .select(`
      *,
      member:members(id, name_en, name_ar, email, profile_photo_url),
      coach:coaches(id, name_en, name_ar)
    `)
    .eq('status', 'active')
    .lte('remaining_sessions', 3)
    .order('remaining_sessions', { ascending: true })
    .limit(5)

  return {
    activeMembers: activeMembers || 0,
    expiringThisWeek: expiringMemberships?.length || 0,
    todaySessions: todayBookings?.length || 0,
    expiringMemberships: expiringMemberships || [],
    todayBookings: todayBookings || [],
    lowSessionPackages: lowSessionPackages || [],
  }
}

export default async function CoachDashboardPage() {
  const supabase = await createClient()
  const stats = await getDashboardStats(supabase)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMembers}</div>
            <p className="text-xs text-muted-foreground">Total registered members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring This Week</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.expiringThisWeek}</div>
            <p className="text-xs text-muted-foreground">Memberships need renewal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaySessions}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Sessions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowSessionPackages.length}</div>
            <p className="text-xs text-muted-foreground">PT packages running low</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/coach/members/new">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </Link>
        <Link href="/coach/subscriptions">
          <Button variant="outline">
            <CreditCard className="h-4 w-4 mr-2" />
            New Subscription
          </Button>
        </Link>
        <Link href="/coach/bookings">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            View Bookings
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today&apos;s Schedule
            </CardTitle>
            <CardDescription>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.todayBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No sessions scheduled for today
              </p>
            ) : (
              <div className="space-y-3">
                {stats.todayBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={booking.member?.profile_photo_url} />
                        <AvatarFallback>
                          {booking.member?.name_en?.charAt(0) || 'M'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{booking.member?.name_en}</p>
                        <p className="text-xs text-muted-foreground">
                          with {booking.coach?.name_en}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {format(new Date(booking.scheduled_at), 'h:mm a')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <Link href="/coach/bookings" className="block mt-4">
              <Button variant="ghost" size="sm" className="w-full">
                View All Bookings
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Expiring Soon
            </CardTitle>
            <CardDescription>Members needing renewal</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.expiringMemberships.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No memberships expiring this week
              </p>
            ) : (
              <div className="space-y-3">
                {stats.expiringMemberships.map((membership: any) => {
                  const daysLeft = differenceInDays(
                    new Date(membership.end_date),
                    new Date()
                  )
                  return (
                    <div
                      key={membership.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={membership.member?.profile_photo_url} />
                          <AvatarFallback>
                            {membership.member?.name_en?.charAt(0) || 'M'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {membership.member?.name_en}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {membership.type} membership
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={daysLeft <= 3 ? 'destructive' : 'secondary'}
                      >
                        {daysLeft === 0
                          ? 'Today'
                          : daysLeft === 1
                          ? '1 day'
                          : `${daysLeft} days`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
            <Link href="/coach/subscriptions" className="block mt-4">
              <Button variant="ghost" size="sm" className="w-full">
                Manage Subscriptions
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Low PT Sessions */}
      {stats.lowSessionPackages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Low PT Sessions
            </CardTitle>
            <CardDescription>Members with 3 or fewer sessions remaining</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stats.lowSessionPackages.map((pkg: any) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={pkg.member?.profile_photo_url} />
                      <AvatarFallback>
                        {pkg.member?.name_en?.charAt(0) || 'M'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{pkg.member?.name_en}</p>
                      <p className="text-xs text-muted-foreground">
                        Coach: {pkg.coach?.name_en}
                      </p>
                    </div>
                  </div>
                  <Badge variant={pkg.remaining_sessions <= 1 ? 'destructive' : 'secondary'}>
                    {pkg.remaining_sessions} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
