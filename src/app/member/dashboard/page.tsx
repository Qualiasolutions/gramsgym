'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CreditCard,
  Calendar,
  Clock,
  Dumbbell,
  CalendarPlus,
  ChevronRight,
  Sparkles,
  Trophy,
} from 'lucide-react'

// Mock data for demo
const mockMember = {
  name: 'Ahmad Khalil',
  membership: {
    type: 'Quarterly',
    daysLeft: 45,
    endDate: '2026-02-22',
  },
  ptSessions: 12,
  coach: {
    name: 'Ahmad Grams',
    specialty: 'Strength Training',
  },
}

const mockUpcomingBookings = [
  { id: '1', coachName: 'Ahmad Grams', date: 'Today', time: '4:30 PM', duration: 60 },
  { id: '2', coachName: 'Ahmad Grams', date: 'Tomorrow', time: '10:00 AM', duration: 60 },
  { id: '3', coachName: 'Ahmad Grams', date: 'Jan 12', time: '2:00 PM', duration: 45 },
]

const mockPTPackages = [
  { id: '1', coachName: 'Ahmad Grams', remaining: 12, total: 16 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MemberDashboardPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold-500/20 via-gold-600/10 to-transparent p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span className="text-sm text-gold-400 font-medium">Welcome back</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-semibold mb-2">
              {mockMember.name.split(' ')[0]}!
            </h1>
            <p className="text-zinc-400">
              Here&apos;s your fitness journey at a glance
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Gym Membership */}
        <motion.div variants={itemVariants}>
          <div className="glass-light rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-gold-500/10">
                <CreditCard className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            <p className="text-2xl font-display font-semibold capitalize">
              {mockMember.membership.type}
            </p>
            <p className="text-sm text-zinc-500 mt-1">Gym Membership</p>
            <div className="mt-3">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                {mockMember.membership.daysLeft} days left
              </span>
            </div>
          </div>
        </motion.div>

        {/* PT Sessions */}
        <motion.div variants={itemVariants}>
          <div className="glass-light rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-gold-500/10">
                <Dumbbell className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            <p className="text-2xl font-display font-semibold">
              {mockMember.ptSessions}
            </p>
            <p className="text-sm text-zinc-500 mt-1">PT Sessions Left</p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full"
                    style={{ width: `${(mockMember.ptSessions / 16) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Session */}
        <motion.div variants={itemVariants}>
          <div className="glass-light rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-gold-500/10">
                <Calendar className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            {mockUpcomingBookings.length > 0 ? (
              <>
                <p className="text-2xl font-display font-semibold">
                  {mockUpcomingBookings[0].date}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Next Session</p>
                <p className="text-xs text-gold-400 mt-2">
                  {mockUpcomingBookings[0].time}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-display font-semibold text-zinc-500">-</p>
                <p className="text-sm text-zinc-500 mt-1">No upcoming sessions</p>
              </>
            )}
          </div>
        </motion.div>

        {/* Quick Book */}
        <motion.div variants={itemVariants}>
          <Link href="/member/book" className="block h-full">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-light rounded-2xl p-6 h-full flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-gold-500/10 group-hover:bg-gold-500/20 transition-colors">
                  <CalendarPlus className="w-5 h-5 text-gold-400" />
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-gold-400 transition-colors" />
              </div>
              <div>
                <p className="text-lg font-semibold">Book Session</p>
                <p className="text-sm text-zinc-500 mt-1">Schedule your next PT</p>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Coach */}
        <motion.div variants={itemVariants}>
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold-500/10">
                  <Trophy className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-semibold">My Coach</h3>
                  <p className="text-xs text-zinc-500">Your personal trainer</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                <span className="text-gold-400 font-semibold text-xl">
                  {mockMember.coach.name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-semibold">{mockMember.coach.name}</h4>
                <p className="text-sm text-zinc-500">{mockMember.coach.specialty}</p>
              </div>
            </div>

            <Link href="/member/book">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 btn-premium flex items-center justify-center gap-2"
              >
                Book a Session
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div variants={itemVariants}>
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold-500/10">
                  <Clock className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Upcoming Sessions</h3>
                  <p className="text-xs text-zinc-500">Your scheduled PT sessions</p>
                </div>
              </div>
              <span className="text-xs text-gold-400 font-medium px-2 py-1 rounded-full bg-gold-500/10">
                {mockUpcomingBookings.length} booked
              </span>
            </div>

            {mockUpcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {mockUpcomingBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                        <span className="text-gold-400 font-semibold text-sm">
                          {booking.coachName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{booking.coachName}</p>
                        <p className="text-xs text-zinc-500">{booking.duration} min session</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        booking.date === 'Today'
                          ? 'bg-gold-500/10 text-gold-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {booking.date}
                      </span>
                      <p className="text-xs text-zinc-500 mt-1">{booking.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No upcoming sessions</p>
                <Link href="/member/book">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-3 btn-ghost text-sm"
                  >
                    Book Now
                  </motion.button>
                </Link>
              </div>
            )}

            <Link href="/member/bookings">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all flex items-center justify-center gap-2"
              >
                View All Bookings
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* PT Packages */}
      {mockPTPackages.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold-500/10">
                  <Dumbbell className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Active PT Packages</h3>
                  <p className="text-xs text-zinc-500">Your personal training session packages</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockPTPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-4 rounded-xl bg-zinc-900/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                      <span className="text-gold-400 font-semibold text-sm">
                        {pkg.coachName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{pkg.coachName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-500 rounded-full transition-all"
                        style={{ width: `${(pkg.remaining / pkg.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gold-400">
                      {pkg.remaining}/{pkg.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
