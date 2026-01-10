'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
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
import { Calendar, Clock, Loader2, Users, Sparkles, Edit2 } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'availability' | 'upcoming' | 'coaches'>('availability')

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
                <Clock className="w-5 h-5 text-champagne-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-medium">
                <span className="text-gradient italic">Schedule</span>
              </h1>
            </div>
            <p className="text-noir-400 text-sm md:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-champagne-500" />
              Manage coach availability and view upcoming sessions
            </p>
          </div>

          <Select value={selectedCoach} onValueChange={setSelectedCoach}>
            <SelectTrigger className="w-[180px] bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
              <SelectValue placeholder="Select coach" />
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
      </motion.div>

      {/* Premium Tabs */}
      <motion.div variants={itemVariants}>
        <div className="glass-subtle rounded-2xl p-1.5 inline-flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'availability'
                ? 'bg-champagne-500/20 text-champagne-400 shadow-lg shadow-champagne-500/10'
                : 'text-noir-400 hover:text-noir-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Weekly Availability
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-champagne-500/20 text-champagne-400 shadow-lg shadow-champagne-500/10'
                : 'text-noir-400 hover:text-noir-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Upcoming Sessions
          </button>
          <button
            onClick={() => setActiveTab('coaches')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'coaches'
                ? 'bg-champagne-500/20 text-champagne-400 shadow-lg shadow-champagne-500/10'
                : 'text-noir-400 hover:text-noir-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Coach Overview
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Weekly Availability Tab */}
          {activeTab === 'availability' && (
            <motion.div
              key="availability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-champagne-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground/90">Weekly Schedule</h2>
                    <p className="text-xs text-noir-400">Set regular working hours for each day of the week</p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {DAYS.map((day, i) => {
                  const coachAvailability = selectedCoach !== 'all'
                    ? getAvailabilityForDay(selectedCoach, day.value)
                    : null

                  return (
                    <motion.div
                      key={day.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-subtle rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 font-medium text-foreground/90">{day.label}</div>
                        {selectedCoach !== 'all' ? (
                          coachAvailability?.is_available ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              {coachAvailability.start_time} - {coachAvailability.end_time}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-noir-700 text-noir-400 border-noir-600">
                              Not Available
                            </span>
                          )
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {coaches.map((coach) => {
                              const avail = getAvailabilityForDay(coach.id, day.value)
                              if (!avail?.is_available) return null
                              return (
                                <span key={coach.id} className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-noir-800 text-noir-300 border border-noir-700">
                                  {coach.name_en}: {avail.start_time}-{avail.end_time}
                                </span>
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
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setEditingDay(day.value)}
                              className="p-2 rounded-lg bg-noir-800 hover:bg-noir-700 border border-noir-700 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-noir-400" />
                            </motion.button>
                          </DialogTrigger>
                          <DialogContent className="glass border-noir-700 sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="text-gradient">Edit {day.label} Availability</DialogTitle>
                              <DialogDescription className="text-noir-400">
                                Set working hours for {day.label}
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSaveAvailability} className="space-y-4 mt-4">
                              <input type="hidden" name="coach_id" value={selectedCoach} />
                              <input type="hidden" name="day_of_week" value={day.value} />

                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="is_available"
                                  name="is_available"
                                  defaultChecked={coachAvailability?.is_available ?? true}
                                />
                                <Label htmlFor="is_available" className="text-noir-300">Available this day</Label>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-noir-300">Start Time</Label>
                                  <Select
                                    name="start_time"
                                    defaultValue={coachAvailability?.start_time || '09:00'}
                                  >
                                    <SelectTrigger className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-noir-900 border-noir-700 max-h-[200px]">
                                      {TIME_SLOTS.map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-noir-300">End Time</Label>
                                  <Select
                                    name="end_time"
                                    defaultValue={coachAvailability?.end_time || '17:00'}
                                  >
                                    <SelectTrigger className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-noir-900 border-noir-700 max-h-[200px]">
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
                                <p className="text-sm text-red-400">{error}</p>
                              )}

                              <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-premium w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                              >
                                {loading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Save Changes'
                                )}
                              </motion.button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Upcoming Sessions Tab */}
          {activeTab === 'upcoming' && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-champagne-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground/90">Upcoming Sessions</h2>
                    <p className="text-xs text-noir-400">Sessions scheduled for the next 2 weeks</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                {Object.keys(groupedBookingsByDate).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-noir-800/50 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-noir-500" />
                    </div>
                    <h3 className="font-medium text-foreground/80">No Upcoming Sessions</h3>
                    <p className="text-sm text-noir-500 mt-1">
                      No sessions scheduled for the next 2 weeks
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedBookingsByDate).map(([date, dateBookings], dateIndex) => (
                      <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: dateIndex * 0.05 }}
                      >
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground/90">
                          <Calendar className="h-4 w-4 text-champagne-400" />
                          {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                          {isSameDay(new Date(date), new Date()) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-champagne-500/20 text-champagne-400 border border-champagne-500/30">
                              Today
                            </span>
                          )}
                        </h3>
                        <div className="space-y-2 ml-6">
                          {dateBookings.map((booking, i) => (
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
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
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Coach Overview Tab */}
          {activeTab === 'coaches' && (
            <motion.div
              key="coaches"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-4 md:grid-cols-2"
            >
              {coaches.map((coach, i) => {
                const coachBookings = bookings.filter((b) => b.coach.id === coach.id)
                const todayBookings = coachBookings.filter((b) =>
                  isSameDay(new Date(b.scheduled_at), new Date())
                )

                return (
                  <motion.div
                    key={coach.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="glass rounded-2xl overflow-hidden"
                  >
                    <div className="p-5 border-b border-champagne-500/10">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-champagne-500/30">
                          <AvatarImage src={coach.profile_photo_url || undefined} />
                          <AvatarFallback className="bg-champagne-500/10 text-champagne-400">
                            {coach.name_en.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium text-foreground/90">{coach.name_en}</h3>
                          <p className="text-sm text-noir-400">{coach.specialization || 'Personal Trainer'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="glass-subtle rounded-xl p-3 text-center">
                          <p className="text-2xl font-bold text-champagne-400">{todayBookings.length}</p>
                          <p className="text-xs text-noir-500">Today&apos;s Sessions</p>
                        </div>
                        <div className="glass-subtle rounded-xl p-3 text-center">
                          <p className="text-2xl font-bold text-foreground/90">{coachBookings.length}</p>
                          <p className="text-xs text-noir-500">Next 2 Weeks</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-noir-300 mb-2">Weekly Availability</p>
                        <div className="flex flex-wrap gap-1">
                          {DAYS.map((day) => {
                            const avail = getAvailabilityForDay(coach.id, day.value)
                            return (
                              <span
                                key={day.value}
                                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                  avail?.is_available
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-noir-800 text-noir-500 border border-noir-700'
                                }`}
                              >
                                {day.label.slice(0, 3)}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
