'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Plus, Loader2, Users } from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import { updateCoachAvailability } from '@/lib/actions/schedule'

interface Coach {
  id: string
  name_en: string
  name_ar: string
  specialization: string | null
  profile_photo_url: string | null
}

interface Availability {
  id: string
  coach_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
}

interface Booking {
  id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  member: {
    id: string
    name_en: string
    name_ar: string
    profile_photo_url: string | null
  }
  coach: {
    id: string
    name_en: string
    name_ar: string
  }
}

interface ScheduleManagerProps {
  currentCoach: Coach | null
  coaches: Coach[]
  availability: Availability[]
  bookings: Booking[]
}

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6 // Start from 6 AM
  const minute = (i % 2) * 30
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
})

export function ScheduleManager({
  currentCoach,
  coaches,
  availability,
  bookings,
}: ScheduleManagerProps) {
  const [selectedCoach, setSelectedCoach] = useState<string>(currentCoach?.id || 'all')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingDay, setEditingDay] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filteredAvailability = availability.filter(
    (a) => selectedCoach === 'all' || a.coach_id === selectedCoach
  )

  const filteredBookings = bookings.filter(
    (b) => selectedCoach === 'all' || b.coach.id === selectedCoach
  )

  const getAvailabilityForDay = (coachId: string, day: number) => {
    return availability.find((a) => a.coach_id === coachId && a.day_of_week === day)
  }

  const handleSaveAvailability = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateCoachAvailability(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setEditDialogOpen(false)
      setEditingDay(null)
    }
    setLoading(false)
  }

  const groupedBookingsByDate = filteredBookings.reduce((acc, booking) => {
    const date = format(new Date(booking.scheduled_at), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(booking)
    return acc
  }, {} as Record<string, Booking[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">Manage coach availability and view upcoming sessions</p>
        </div>

        <Select value={selectedCoach} onValueChange={setSelectedCoach}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select coach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Coaches</SelectItem>
            {coaches.map((coach) => (
              <SelectItem key={coach.id} value={coach.id}>
                {coach.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="availability">
        <TabsList>
          <TabsTrigger value="availability">
            <Clock className="h-4 w-4 mr-2" />
            Weekly Availability
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Sessions
          </TabsTrigger>
          <TabsTrigger value="coaches">
            <Users className="h-4 w-4 mr-2" />
            Coach Overview
          </TabsTrigger>
        </TabsList>

        {/* Weekly Availability Tab */}
        <TabsContent value="availability" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Set regular working hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DAYS.map((day) => {
                  const coachAvailability = selectedCoach !== 'all'
                    ? getAvailabilityForDay(selectedCoach, day.value)
                    : null

                  return (
                    <div
                      key={day.value}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 font-medium">{day.label}</div>
                        {selectedCoach !== 'all' ? (
                          coachAvailability?.is_available ? (
                            <Badge variant="default">
                              {coachAvailability.start_time} - {coachAvailability.end_time}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Available</Badge>
                          )
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {coaches.map((coach) => {
                              const avail = getAvailabilityForDay(coach.id, day.value)
                              if (!avail?.is_available) return null
                              return (
                                <Badge key={coach.id} variant="outline">
                                  {coach.name_en}: {avail.start_time}-{avail.end_time}
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {selectedCoach !== 'all' && (
                        <Dialog
                          open={editDialogOpen && editingDay === day.value}
                          onOpenChange={(open) => {
                            setEditDialogOpen(open)
                            if (!open) setEditingDay(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingDay(day.value)}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit {day.label} Availability</DialogTitle>
                              <DialogDescription>
                                Set working hours for {day.label}
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSaveAvailability} className="space-y-4">
                              <input type="hidden" name="coach_id" value={selectedCoach} />
                              <input type="hidden" name="day_of_week" value={day.value} />

                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="is_available"
                                  name="is_available"
                                  defaultChecked={coachAvailability?.is_available ?? true}
                                />
                                <Label htmlFor="is_available">Available this day</Label>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Start Time</Label>
                                  <Select
                                    name="start_time"
                                    defaultValue={coachAvailability?.start_time || '09:00'}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {TIME_SLOTS.map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>End Time</Label>
                                  <Select
                                    name="end_time"
                                    defaultValue={coachAvailability?.end_time || '17:00'}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {TIME_SLOTS.map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {error && (
                                <p className="text-sm text-red-500">{error}</p>
                              )}

                              <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Save Changes'
                                )}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Sessions Tab */}
        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>
                Sessions scheduled for the next 2 weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(groupedBookingsByDate).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming sessions scheduled
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedBookingsByDate).map(([date, dateBookings]) => (
                    <div key={date}>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                        {isSameDay(new Date(date), new Date()) && (
                          <Badge variant="default">Today</Badge>
                        )}
                      </h3>
                      <div className="space-y-2 ml-6">
                        {dateBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={booking.member.profile_photo_url || undefined} />
                                <AvatarFallback>
                                  {booking.member.name_en.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{booking.member.name_en}</p>
                                <p className="text-sm text-muted-foreground">
                                  with {booking.coach.name_en}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  booking.status === 'scheduled'
                                    ? 'default'
                                    : booking.status === 'completed'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                              >
                                {format(new Date(booking.scheduled_at), 'h:mm a')}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {booking.duration_minutes} min
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coach Overview Tab */}
        <TabsContent value="coaches" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {coaches.map((coach) => {
              const coachBookings = bookings.filter((b) => b.coach.id === coach.id)
              const todayBookings = coachBookings.filter((b) =>
                isSameDay(new Date(b.scheduled_at), new Date())
              )

              return (
                <Card key={coach.id}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={coach.profile_photo_url || undefined} />
                        <AvatarFallback>{coach.name_en.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{coach.name_en}</CardTitle>
                        <CardDescription>{coach.specialization || 'Personal Trainer'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{todayBookings.length}</p>
                        <p className="text-xs text-muted-foreground">Today&apos;s Sessions</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{coachBookings.length}</p>
                        <p className="text-xs text-muted-foreground">Next 2 Weeks</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Weekly Availability</p>
                      <div className="flex flex-wrap gap-1">
                        {DAYS.map((day) => {
                          const avail = getAvailabilityForDay(coach.id, day.value)
                          return (
                            <Badge
                              key={day.value}
                              variant={avail?.is_available ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {day.label.slice(0, 3)}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
