'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Calendar, Clock, X, CheckCircle, CalendarPlus, History, Sparkles, AlertCircle } from 'lucide-react'
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
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
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full bg-champagne-500/10 text-champagne-400 border border-champagne-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-400 animate-pulse" />
            Today
          </span>
        )
      }
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Scheduled
        </span>
      )
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      )
    }
    if (status === 'cancelled') {
      return (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-noir-700 text-noir-300">
          Cancelled
        </span>
      )
    }
    if (status === 'no_show') {
      return (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          No Show
        </span>
      )
    }
    return null
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 pb-20 lg:pb-6"
    >
      {/* Premium Header */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl glass-champagne glow-champagne p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-champagne-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-champagne-400 uppercase tracking-[0.25em] font-medium mb-3 block">
                My Bookings
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground/95 mb-1">
                PT <span className="text-gradient italic">Sessions</span>
              </h1>
              <p className="text-noir-300 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-champagne-500" />
                View and manage your training sessions
              </p>
            </div>
            <Link href="/member/book">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-premium px-5 py-2.5 rounded-lg flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Book Session</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            variants={itemVariants}
          >
            <div className="glass-subtle rounded-xl p-4 flex items-center gap-3 border border-emerald-500/20">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-sm text-emerald-400">Your session has been booked successfully!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Today's Sessions Alert */}
      {todayBookings.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="glass-champagne rounded-xl p-4 flex items-center gap-4 glow-champagne">
            <div className="p-2.5 rounded-xl bg-champagne-500/20">
              <Clock className="w-5 h-5 text-champagne-400" />
            </div>
            <div>
              <p className="font-medium text-foreground/90">
                You have {todayBookings.length} session{todayBookings.length > 1 ? 's' : ''} today!
              </p>
              <p className="text-sm text-champagne-400/80">
                {todayBookings.map((b) => format(new Date(b.scheduled_at), 'h:mm a')).join(', ')}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="glass-subtle border-champagne-500/10 p-1 rounded-xl mb-4 w-full sm:w-auto">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-champagne-500/10 data-[state=active]:text-champagne-400 rounded-lg px-4 py-2 transition-all"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-champagne-500/10 data-[state=active]:text-champagne-400 rounded-lg px-4 py-2 transition-all"
            >
              <History className="h-4 w-4 mr-2" />
              History ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-champagne-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground/90">Upcoming Sessions</h2>
                    <p className="text-xs text-noir-400">Your scheduled PT sessions</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-noir-800/50 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-noir-500" />
                    </div>
                    <h3 className="font-medium text-foreground/80">No Upcoming Sessions</h3>
                    <p className="text-sm text-noir-500 mt-1 mb-5 max-w-xs mx-auto">
                      You don&apos;t have any scheduled sessions
                    </p>
                    <Link href="/member/book">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-premium px-5 py-2.5 rounded-lg"
                      >
                        Book a Session
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className="glass-subtle rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 ring-2 ring-champagne-500/20">
                            <AvatarImage src={booking.coach.profile_photo_url || undefined} />
                            <AvatarFallback className="bg-champagne-500/10 text-champagne-400">
                              {booking.coach.name_en.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-foreground/90">{booking.coach.name_en}</h3>
                              {getStatusBadge(booking.status, booking.scheduled_at)}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-noir-400">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-champagne-500/70" />
                                {format(new Date(booking.scheduled_at), 'EEE, MMM d')}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-champagne-500/70" />
                                {format(new Date(booking.scheduled_at), 'h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={cancellingId === booking.id}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <X className="h-3.5 w-3.5" />
                              Cancel
                            </motion.button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass border-champagne-500/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">Cancel Session?</AlertDialogTitle>
                              <AlertDialogDescription className="text-noir-400">
                                Are you sure you want to cancel your session on{' '}
                                <span className="text-foreground/80">{format(new Date(booking.scheduled_at), 'EEEE, MMMM d')}</span> at{' '}
                                <span className="text-foreground/80">{format(new Date(booking.scheduled_at), 'h:mm a')}</span>?
                                <br /><br />
                                <span className="text-amber-400 flex items-center gap-1.5">
                                  <AlertCircle className="w-4 h-4" />
                                  Cancelling within 24 hours may affect your package.
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-noir-800 border-noir-700 hover:bg-noir-700">
                                Keep Session
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                                onClick={() => handleCancel(booking.id)}
                              >
                                Yes, Cancel
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-champagne-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-noir-700">
                    <History className="w-5 h-5 text-noir-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground/90">Session History</h2>
                    <p className="text-xs text-noir-400">Your past PT sessions</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                {pastBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-noir-800/50 flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-noir-500" />
                    </div>
                    <h3 className="font-medium text-foreground/80">No Past Sessions</h3>
                    <p className="text-sm text-noir-500 mt-1 max-w-xs mx-auto">
                      Your completed sessions will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pastBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-noir-800/30"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={booking.coach.profile_photo_url || undefined} />
                            <AvatarFallback className="bg-noir-700 text-noir-400 text-sm">
                              {booking.coach.name_en.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-foreground/70">{booking.coach.name_en}</p>
                            <p className="text-xs text-noir-500">
                              {format(new Date(booking.scheduled_at), 'MMM d, yyyy')} at{' '}
                              {format(new Date(booking.scheduled_at), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(booking.status, booking.scheduled_at)}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
