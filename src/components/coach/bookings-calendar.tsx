'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
} from 'date-fns'

interface Booking {
  id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  notes: string | null
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

interface Coach {
  id: string
  name_en: string
  name_ar: string
}

interface Member {
  id: string
  name_en: string
  name_ar: string
}

interface BookingsCalendarProps {
  bookings: Booking[]
  coaches: Coach[]
  members: Member[]
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7) // 7 AM to 10 PM

export function BookingsCalendar({ bookings, coaches, members }: BookingsCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedCoach, setSelectedCoach] = useState<string>('all')

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 6 }) // Saturday
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const filteredBookings = bookings.filter(
    (booking) => selectedCoach === 'all' || booking.coach.id === selectedCoach
  )

  const getBookingsForDayAndHour = (day: Date, hour: number) => {
    return filteredBookings.filter((booking) => {
      const bookingDate = new Date(booking.scheduled_at)
      return isSameDay(bookingDate, day) && bookingDate.getHours() === hour
    })
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentWeek(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium ml-2">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>
        </div>

        <Select value={selectedCoach} onValueChange={setSelectedCoach}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by coach" />
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

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0 overflow-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-3 text-center text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4 mx-auto" />
              </div>
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`p-3 text-center border-l border-border ${
                    isSameDay(day, new Date())
                      ? 'bg-primary/10'
                      : ''
                  }`}
                >
                  <p className="text-xs text-muted-foreground">
                    {format(day, 'EEE')}
                  </p>
                  <p className={`text-lg font-semibold ${
                    isSameDay(day, new Date()) ? 'text-primary' : ''
                  }`}>
                    {format(day, 'd')}
                  </p>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b border-border last:border-b-0">
                <div className="p-2 text-center text-xs text-muted-foreground border-r border-border">
                  {format(new Date().setHours(hour, 0), 'h a')}
                </div>
                {days.map((day) => {
                  const dayBookings = getBookingsForDayAndHour(day, hour)
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className={`min-h-[60px] p-1 border-l border-border ${
                        isSameDay(day, new Date()) ? 'bg-primary/5' : ''
                      }`}
                    >
                      {dayBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className={`p-1.5 rounded text-xs mb-1 ${
                            booking.status === 'scheduled'
                              ? 'bg-primary/20 border border-primary/30'
                              : booking.status === 'completed'
                              ? 'bg-green-500/20 border border-green-500/30'
                              : 'bg-red-500/20 border border-red-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={booking.member.profile_photo_url || undefined} />
                              <AvatarFallback className="text-[8px]">
                                {booking.member.name_en.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate font-medium">
                              {booking.member.name_en}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {booking.coach.name_en}
                          </p>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today&apos;s Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.filter((b) => isSameDay(new Date(b.scheduled_at), new Date())).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No bookings scheduled for today
            </p>
          ) : (
            <div className="space-y-2">
              {filteredBookings
                .filter((b) => isSameDay(new Date(b.scheduled_at), new Date()))
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={booking.member.profile_photo_url || undefined} />
                        <AvatarFallback>{booking.member.name_en.charAt(0)}</AvatarFallback>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
