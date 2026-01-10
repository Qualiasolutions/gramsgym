'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Calendar, Clock, Sparkles, CalendarDays } from 'lucide-react'
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  }
}

export function BookingsCalendar({ bookings, coaches }: BookingsCalendarProps) {
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

  const todayBookings = filteredBookings.filter((b) => isSameDay(new Date(b.scheduled_at), new Date()))

  return (
    <motion.div
      className="space-y-6 md:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Premium Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl glass-champagne glow-champagne p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-champagne-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-champagne-500/20">
                <CalendarDays className="w-5 h-5 text-champagne-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-medium">
                <span className="text-gradient italic">Bookings</span>
              </h1>
            </div>
            <p className="text-noir-400 text-sm md:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-champagne-500" />
              View and manage PT session bookings
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedCoach} onValueChange={setSelectedCoach}>
              <SelectTrigger className="w-[180px] bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                <SelectValue placeholder="Filter by coach" />
              </SelectTrigger>
              <SelectContent className="bg-noir-900 border-noir-700">
                <SelectItem value="all">All Coaches</SelectItem>
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
            className="p-2 rounded-lg bg-noir-800/50 hover:bg-noir-700/50 border border-noir-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-noir-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentWeek(new Date())}
            className="px-4 py-2 rounded-lg bg-noir-800/50 hover:bg-noir-700/50 border border-noir-700 text-sm font-medium transition-colors"
          >
            Today
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            className="p-2 rounded-lg bg-noir-800/50 hover:bg-noir-700/50 border border-noir-700 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-noir-400" />
          </motion.button>
        </div>
        <span className="text-sm font-medium text-noir-300">
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </span>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-8 border-b border-noir-800">
              <div className="p-3 text-center text-sm font-medium text-noir-500">
                <Clock className="h-4 w-4 mx-auto" />
              </div>
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`p-3 text-center border-l border-noir-800 ${
                    isSameDay(day, new Date())
                      ? 'bg-champagne-500/10'
                      : ''
                  }`}
                >
                  <p className="text-xs text-noir-500 uppercase tracking-wider">
                    {format(day, 'EEE')}
                  </p>
                  <p className={`text-lg font-semibold mt-1 ${
                    isSameDay(day, new Date()) ? 'text-champagne-400' : 'text-foreground/80'
                  }`}>
                    {format(day, 'd')}
                  </p>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b border-noir-800/50 last:border-b-0">
                <div className="p-2 text-center text-xs text-noir-500 border-r border-noir-800/50">
                  {format(new Date().setHours(hour, 0), 'h a')}
                </div>
                {days.map((day) => {
                  const dayBookings = getBookingsForDayAndHour(day, hour)
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className={`min-h-[60px] p-1 border-l border-noir-800/50 ${
                        isSameDay(day, new Date()) ? 'bg-champagne-500/5' : ''
                      }`}
                    >
                      {dayBookings.map((booking) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-1.5 rounded-lg text-xs mb-1 cursor-pointer transition-colors ${
                            booking.status === 'scheduled'
                              ? 'bg-champagne-500/20 border border-champagne-500/30 hover:bg-champagne-500/30'
                              : booking.status === 'completed'
                              ? 'bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-red-500/20 border border-red-500/30 hover:bg-red-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={booking.member.profile_photo_url || undefined} />
                              <AvatarFallback className="text-[8px] bg-noir-700">
                                {booking.member.name_en.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate font-medium text-foreground/90">
                              {booking.member.name_en}
                            </span>
                          </div>
                          <p className="text-[10px] text-noir-400 truncate mt-0.5">
                            {booking.coach.name_en}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Today's Summary */}
      <motion.div variants={itemVariants} className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-champagne-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground/90">Today&apos;s Bookings</h2>
              <p className="text-xs text-noir-400">{todayBookings.length} sessions scheduled for today</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          {todayBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-noir-800/50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-noir-500" />
              </div>
              <h3 className="font-medium text-foreground/80">No Sessions Today</h3>
              <p className="text-sm text-noir-500 mt-1">
                No bookings scheduled for today
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="glass-subtle rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-noir-700">
                      <AvatarImage src={booking.member.profile_photo_url || undefined} />
                      <AvatarFallback className="bg-noir-700 text-noir-300">
                        {booking.member.name_en.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground/90">{booking.member.name_en}</p>
                      <p className="text-sm text-noir-400">with {booking.coach.name_en}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      booking.status === 'scheduled'
                        ? 'bg-champagne-500/20 text-champagne-400 border-champagne-500/30'
                        : booking.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {format(new Date(booking.scheduled_at), 'h:mm a')}
                    </span>
                    <p className="text-xs text-noir-500 mt-1">
                      {booking.duration_minutes} min
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
