'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Calendar, Clock, X, CheckCircle, AlertCircle, CalendarPlus } from 'lucide-react'
import { format, isPast, isFuture, isToday } from 'date-fns'
import { cancelMemberBooking } from '@/lib/actions/member-booking'
import Link from 'next/link'

interface Booking {
  id: string
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  notes: string | null
  coach: {
    id: string
    name_en: string
    name_ar: string
    profile_photo_url: string | null
  }
}

interface MemberBookingsListProps {
  memberId: string
  bookings: Booking[]
  showSuccess?: boolean
}

export function MemberBookingsList({ memberId, bookings, showSuccess }: MemberBookingsListProps) {
  const [successMessage, setSuccessMessage] = useState(showSuccess)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'scheduled' && isFuture(new Date(b.scheduled_at))
  )
  const todayBookings = bookings.filter(
    (b) => b.status === 'scheduled' && isToday(new Date(b.scheduled_at))
  )
  const pastBookings = bookings.filter(
    (b) => b.status !== 'scheduled' || isPast(new Date(b.scheduled_at))
  )

  const handleCancel = async (id: string) => {
    setCancellingId(id)
    await cancelMemberBooking(id, memberId)
    setCancellingId(null)
  }

  const getStatusBadge = (status: string, scheduledAt: string) => {
    if (status === 'scheduled') {
      if (isToday(new Date(scheduledAt))) {
        return <Badge className="bg-primary">Today</Badge>
      }
      return <Badge variant="default">Scheduled</Badge>
    }
    if (status === 'completed') {
      return <Badge variant="secondary" className="bg-green-500/20 text-green-600">Completed</Badge>
    }
    if (status === 'cancelled') {
      return <Badge variant="secondary">Cancelled</Badge>
    }
    if (status === 'no_show') {
      return <Badge variant="destructive">No Show</Badge>
    }
    return null
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your PT sessions</p>
        </div>
        <Button asChild>
          <Link href="/member/book">
            <CalendarPlus className="h-4 w-4 mr-2" />
            Book New Session
          </Link>
        </Button>
      </div>

      {successMessage && (
        <div className="bg-green-500/10 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Your session has been booked successfully!
        </div>
      )}

      {/* Today's Sessions Alert */}
      {todayBookings.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">You have {todayBookings.length} session{todayBookings.length > 1 ? 's' : ''} today!</p>
                <p className="text-sm text-muted-foreground">
                  {todayBookings.map((b) => format(new Date(b.scheduled_at), 'h:mm a')).join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            History ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled PT sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold">No Upcoming Sessions</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    You don&apos;t have any scheduled sessions
                  </p>
                  <Button asChild>
                    <Link href="/member/book">Book a Session</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking.coach.profile_photo_url || undefined} />
                          <AvatarFallback>{booking.coach.name_en.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{booking.coach.name_en}</h3>
                            {getStatusBadge(booking.status, booking.scheduled_at)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(booking.scheduled_at), 'EEE, MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(new Date(booking.scheduled_at), 'h:mm a')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            disabled={cancellingId === booking.id}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Session?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel your session on{' '}
                              {format(new Date(booking.scheduled_at), 'EEEE, MMMM d')} at{' '}
                              {format(new Date(booking.scheduled_at), 'h:mm a')}?
                              <br /><br />
                              Please note: Cancelling within 24 hours of your session may affect your package.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Session</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => handleCancel(booking.id)}
                            >
                              Yes, Cancel
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>Your past PT sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {pastBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold">No Past Sessions</h3>
                  <p className="text-muted-foreground mt-1">
                    Your completed sessions will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={booking.coach.profile_photo_url || undefined} />
                          <AvatarFallback>{booking.coach.name_en.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.coach.name_en}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(booking.scheduled_at), 'MMM d, yyyy')} at{' '}
                            {format(new Date(booking.scheduled_at), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(booking.status, booking.scheduled_at)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
