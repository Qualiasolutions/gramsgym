'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar } from '@/components/ui/calendar'
import { Loader2, Clock, Check, User, Dumbbell, CalendarDays, AlertCircle, Sparkles } from 'lucide-react'
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  },
}

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

      if (hour < startHour || hour >= endHour) {
        return false
      }

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

    if (isBefore(date, today)) {
      return true
    }

    if (isAfter(date, addDays(today, 14))) {
      return true
    }

    const dayOfWeek = date.getDay()
    const availability = coachAvailability.find((a) => a.day_of_week === dayOfWeek)
    if (!availability || !availability.is_available) {
      return true
    }

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Premium Header */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl glass-champagne glow-champagne p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-champagne-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <span className="text-xs text-champagne-400 uppercase tracking-[0.25em] font-medium mb-3 block">
              Book Session
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground/95 mb-1">
              Schedule Your <span className="text-gradient italic">Training</span>
            </h1>
            <p className="text-noir-300 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-champagne-500" />
              Pick a date and time that works for you
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coach Info */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="glass rounded-2xl overflow-hidden h-full">
            <div className="p-5 border-b border-champagne-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-champagne-500/10">
                  <User className="w-5 h-5 text-champagne-400" />
                </div>
                <h2 className="font-semibold text-foreground/90">Your Coach</h2>
              </div>
            </div>
            <div className="p-5">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-20 w-20 ring-2 ring-champagne-500/30">
                    <AvatarImage src={coach.profile_photo_url || undefined} />
                    <AvatarFallback className="bg-champagne-500/10 text-champagne-400 text-xl">
                      {coach.name_en.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-noir-900 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-medium text-foreground/95">{coach.name_en}</h3>
                <p className="text-sm text-noir-400">{coach.specialty_en || 'Personal Trainer'}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-champagne-500/10">
                <div className="glass-subtle rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-noir-400 uppercase tracking-wider flex items-center gap-2">
                      <Dumbbell className="w-3.5 h-3.5" />
                      Sessions
                    </span>
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
                      totalRemainingSessions <= 3
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {totalRemainingSessions} left
                    </span>
                  </div>
                  <p className="text-xs text-noir-500">
                    Sessions from your active PT packages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-champagne-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <CalendarDays className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground/90">Select Date & Time</h2>
                  <p className="text-xs text-noir-400">Choose when you&apos;d like to have your session</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Calendar */}
                <div>
                  <h4 className="text-xs text-noir-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Select Date
                  </h4>
                  <div className="glass-subtle rounded-xl p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date)
                        setSelectedTime(null)
                      }}
                      disabled={isDateDisabled}
                      className="rounded-lg [&_.rdp-day_button]:text-foreground [&_.rdp-day_button:hover]:bg-champagne-500/20 [&_.rdp-day_button.rdp-day_selected]:bg-champagne-500 [&_.rdp-day_button.rdp-day_selected]:text-noir-950"
                    />
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h4 className="text-xs text-noir-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedDate ? (
                      <>Available Times for {format(selectedDate, 'MMM d')}</>
                    ) : (
                      'Select a date first'
                    )}
                  </h4>
                  {selectedDate ? (
                    availableTimes.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimes.map((time, index) => (
                          <motion.button
                            key={time}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedTime(time)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                              selectedTime === time
                                ? 'bg-champagne-500 text-noir-950 glow-champagne'
                                : 'glass-subtle hover:bg-champagne-500/10 text-foreground/80'
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            {format(setHours(setMinutes(new Date(), 0), parseInt(time)), 'h:mm a')}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 glass-subtle rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-noir-800/50 flex items-center justify-center mx-auto mb-3">
                          <Clock className="h-6 w-6 text-noir-500" />
                        </div>
                        <p className="text-sm text-noir-500">No available times for this date</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-10 glass-subtle rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-noir-800/50 flex items-center justify-center mx-auto mb-3">
                        <CalendarDays className="h-6 w-6 text-noir-500" />
                      </div>
                      <p className="text-sm text-noir-500">Please select a date to see available times</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary & Submit */}
              <AnimatePresence>
                {selectedDate && selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6 pt-6 border-t border-champagne-500/10"
                  >
                    <div className="glass-champagne rounded-xl p-5 mb-5 glow-champagne">
                      <h4 className="font-medium text-foreground/90 mb-4 flex items-center gap-2">
                        <Check className="w-4 h-4 text-champagne-400" />
                        Booking Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-noir-500 uppercase tracking-wider mb-1">Date</p>
                          <p className="font-medium text-foreground/90">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-noir-500 uppercase tracking-wider mb-1">Time</p>
                          <p className="font-medium text-foreground/90">
                            {format(setHours(setMinutes(new Date(), 0), parseInt(selectedTime)), 'h:mm a')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-noir-500 uppercase tracking-wider mb-1">Duration</p>
                          <p className="font-medium text-foreground/90">60 minutes</p>
                        </div>
                        <div>
                          <p className="text-xs text-noir-500 uppercase tracking-wider mb-1">Coach</p>
                          <p className="font-medium text-foreground/90">{coach.name_en}</p>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4"
                      >
                        <div className="glass-subtle rounded-xl p-4 flex items-center gap-3 border border-red-500/20">
                          <div className="p-1.5 rounded-lg bg-red-500/10">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          </div>
                          <p className="text-sm text-red-400">{error}</p>
                        </div>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn-premium w-full py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Booking...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
