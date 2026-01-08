import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CreditCard, Calendar, Clock, Dumbbell, CalendarPlus } from 'lucide-react'
import { format, differenceInDays, isSameDay } from 'date-fns'
import Link from 'next/link'

export default async function MemberDashboardPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  const { data: { user } } = await supabase.auth.getUser()

  // Get member with coach
  const { data: member } = await client
    .from('members')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar, profile_photo_url, specialty_en)
    `)
    .eq('id', user?.id)
    .single()

  // Get active gym membership
  const { data: gymMembership } = await client
    .from('gym_memberships')
    .select('*')
    .eq('member_id', user?.id)
    .eq('status', 'active')
    .order('end_date', { ascending: false })
    .limit(1)
    .single()

  // Get active PT packages
  const { data: ptPackages } = await client
    .from('pt_packages')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar, profile_photo_url)
    `)
    .eq('member_id', user?.id)
    .eq('status', 'active')

  // Get upcoming bookings
  const today = new Date()
  const { data: upcomingBookings } = await client
    .from('bookings')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar, profile_photo_url)
    `)
    .eq('member_id', user?.id)
    .eq('status', 'scheduled')
    .gte('scheduled_at', today.toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(5)

  const daysUntilExpiry = gymMembership
    ? differenceInDays(new Date(gymMembership.end_date), today)
    : null

  const totalRemainingSessions = ptPackages?.reduce(
    (acc: number, pkg: { remaining_sessions: number }) => acc + pkg.remaining_sessions,
    0
  ) || 0

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
        <h1 className="text-2xl font-bold">
          Welcome back, {member?.name_en?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your fitness journey at a glance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Gym Membership Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gym Membership</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {gymMembership ? (
              <>
                <div className="text-2xl font-bold capitalize">{gymMembership.type}</div>
                <Badge
                  variant={daysUntilExpiry !== null && daysUntilExpiry <= 7 ? 'destructive' : 'default'}
                  className="mt-1"
                >
                  {daysUntilExpiry} days left
                </Badge>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">None</div>
                <p className="text-xs text-muted-foreground">No active membership</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* PT Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PT Sessions</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRemainingSessions}</div>
            <p className="text-xs text-muted-foreground">Sessions remaining</p>
          </CardContent>
        </Card>

        {/* Next Session */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Session</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingBookings && upcomingBookings.length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {isSameDay(new Date(upcomingBookings[0].scheduled_at), today)
                    ? 'Today'
                    : format(new Date(upcomingBookings[0].scheduled_at), 'MMM d')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(upcomingBookings[0].scheduled_at), 'h:mm a')}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <p className="text-xs text-muted-foreground">No upcoming sessions</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Book */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Action</CardTitle>
            <CalendarPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/member/book">Book Session</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Coach */}
        {member?.coach && (
          <Card>
            <CardHeader>
              <CardTitle>My Coach</CardTitle>
              <CardDescription>Your assigned personal trainer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={member.coach.profile_photo_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {member.coach.name_en.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{member.coach.name_en}</h3>
                  <p className="text-sm text-muted-foreground">
                    {member.coach.specialty_en || 'Personal Trainer'}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/member/book">Book a Session</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled PT sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings && upcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {upcomingBookings.map((booking: {
                  id: string
                  scheduled_at: string
                  duration_minutes: number
                  coach: { name_en: string; profile_photo_url: string | null }
                }) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={booking.coach.profile_photo_url || undefined} />
                        <AvatarFallback>{booking.coach.name_en.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.coach.name_en}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.duration_minutes} min session
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={isSameDay(new Date(booking.scheduled_at), today) ? 'default' : 'secondary'}>
                        {isSameDay(new Date(booking.scheduled_at), today)
                          ? 'Today'
                          : format(new Date(booking.scheduled_at), 'MMM d')}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(booking.scheduled_at), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming sessions</p>
                <Button asChild variant="outline" className="mt-3">
                  <Link href="/member/book">Book Now</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PT Packages */}
      {ptPackages && ptPackages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active PT Packages</CardTitle>
            <CardDescription>Your personal training session packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ptPackages.map((pkg: {
                id: string
                total_sessions: number
                remaining_sessions: number
                coach: { name_en: string; profile_photo_url: string | null }
              }) => (
                <div
                  key={pkg.id}
                  className="flex items-center gap-3 p-4 rounded-lg border bg-card"
                >
                  <Avatar>
                    <AvatarImage src={pkg.coach.profile_photo_url || undefined} />
                    <AvatarFallback>{pkg.coach.name_en.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{pkg.coach.name_en}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${(pkg.remaining_sessions / pkg.total_sessions) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {pkg.remaining_sessions}/{pkg.total_sessions}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
