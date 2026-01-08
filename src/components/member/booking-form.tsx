'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Loader2, Clock, Check } from 'lucide-react'
import { format, addDays, isSameDay, isAfter, isBefore, setHours, setMinutes } from 'date-fns'
import { createMemberBooking } from '@/lib/actions/member-booking'

interface Coach {
  id: string
  name_en: string
  name_ar: string
  profile_photo_url: string | null
  specialty_en: string | null
}

interface PTPackage {
  id: string
  remaining_sessions: number
  total_sessions: number
  coach: { id: string; name_en: string }
}

interface CoachAvailability {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
}

interface ExistingBooking {
  scheduled_at: string
  duration_minutes: number
  coach_id: string
}

interface BookingFormProps {
  member: { id: string; name_en: string }
  coach: Coach
  ptPackages: PTPackage[]
  coachAvailability: CoachAvailability[]
  existingBookings: ExistingBooking[]
}

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
]

export function BookingForm({
  member,
  coach,
  ptPackages,
  coachAvailability,
  existingBookings,
}: BookingFormProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalRemainingSessions = ptPackages.reduce((acc, pkg) => acc + pkg.remaining_sessions, 0)

  const getAvailableTimesForDate = (date: Date) => {
    const dayOfWeek = date.getDay()
    const availability = coachAvailability.find((a) => a.day_of_week === dayOfWeek)

    if (!availability || !availability.is_available) {
      return []
    }

    const startHour = parseInt(availability.start_time.split(':')[0])
    const endHour = parseInt(availability.end_time.split(':')[0])

    return TIME_SLOTS.filter((time) => {
      const hour = parseInt(time.split(':')[0])

      // Check if within coach's available hours
      if (hour < startHour || hour >= endHour) {
        return false
      }

      // Check if slot is already booked
      const slotDateTime = setMinutes(setHours(date, hour), 0)
      const isBooked = existingBookings.some((booking) => {
        const bookingStart = new Date(booking.scheduled_at)
        const bookingEnd = new Date(bookingStart.getTime() + booking.duration_minutes * 60000)
        return (
          isSameDay(bookingStart, date) &&
          slotDateTime >= bookingStart &&
          slotDateTime < bookingEnd
        )
      })

      // Check if it's in the past
      const now = new Date()
      if (isSameDay(date, now) && hour <= now.getHours()) {
        return false
      }

      return !isBooked
    })
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Disable past dates
    if (isBefore(date, today)) {
      return true
    }

    // Disable dates more than 2 weeks in the future
    if (isAfter(date, addDays(today, 14))) {
      return true
    }

    // Disable days when coach is not available
    const dayOfWeek = date.getDay()
    const availability = coachAvailability.find((a) => a.day_of_week === dayOfWeek)
    if (!availability || !availability.is_available) {
      return true
    }

    // Disable if no available times
    const availableTimes = getAvailableTimesForDate(date)
    return availableTimes.length === 0
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return

    setLoading(true)
    setError(null)

    const [hours, minutes] = selectedTime.split(':')
    const scheduledAt = new Date(selectedDate)
    scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    const formData = new FormData()
    formData.append('member_id', member.id)
    formData.append('coach_id', coach.id)
    formData.append('scheduled_at', scheduledAt.toISOString())
    formData.append('duration_minutes', '60')

    const result = await createMemberBooking(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/member/bookings?success=true')
    }
  }

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : []

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Coach Info */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Your Coach</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage src={coach.profile_photo_url || undefined} />
              <AvatarFallback className="text-xl">{coach.name_en.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{coach.name_en}</h3>
            <p className="text-sm text-muted-foreground">{coach.specialty_en || 'Personal Trainer'}</p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Available Sessions</span>
              <Badge variant={totalRemainingSessions <= 3 ? 'destructive' : 'default'}>
                {totalRemainingSessions} left
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Sessions from your active PT packages
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Select Date & Time</CardTitle>
          <CardDescription>Choose when you&apos;d like to have your session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Calendar */}
            <div>
              <h4 className="font-medium mb-3">Select Date</h4>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  setSelectedTime(null)
                }}
                disabled={isDateDisabled}
                className="rounded-md border"
              />
            </div>

            {/* Time Slots */}
            <div>
              <h4 className="font-medium mb-3">
                {selectedDate ? (
                  <>Available Times for {format(selectedDate, 'MMM d')}</>
                ) : (
                  'Select a date first'
                )}
              </h4>
              {selectedDate ? (
                availableTimes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {format(setHours(setMinutes(new Date(), 0), parseInt(time)), 'h:mm a')}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No available times for this date
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Please select a date to see available times
                </div>
              )}
            </div>
          </div>

          {/* Summary & Submit */}
          {selectedDate && selectedTime && (
            <div className="mt-6 pt-6 border-t">
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Booking Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {format(setHours(setMinutes(new Date(), 0), parseInt(selectedTime)), 'h:mm a')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">60 minutes</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Coach</p>
                    <p className="font-medium">{coach.name_en}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-500 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Confirm Booking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
