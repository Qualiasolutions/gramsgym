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
  Trophy,
  Target,
  TrendingUp,
  Activity,
  Flame,
} from 'lucide-react'
import { CircularProgress } from '@/components/ui/circular-progress'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { AnimatedProgress } from '@/components/ui/animated-progress'
import { GlowCard } from '@/components/ui/glow-card'

// Mock data for demo
const mockMember = {
  name: 'Ahmad Khalil',
  membership: {
    type: 'Quarterly',
    daysLeft: 45,
    endDate: '2026-02-22',
    totalDays: 90,
  },
  ptSessions: {
    remaining: 12,
    total: 16,
  },
  streak: 7,
  totalWorkouts: 48,
  coach: {
    name: 'Ahmad Grams',
    specialty: 'Strength & Conditioning',
    avatar: 'AG',
  },
}

const mockUpcomingBookings = [
  { id: '1', coachName: 'Ahmad Grams', date: 'Today', time: '4:30 PM', duration: 60 },
  { id: '2', coachName: 'Ahmad Grams', date: 'Tomorrow', time: '10:00 AM', duration: 60 },
  { id: '3', coachName: 'Ahmad Grams', date: 'Jan 12', time: '2:00 PM', duration: 45 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function MemberDashboardPage() {
  return (
    <div className="min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Premium Header */}
        <motion.div variants={itemVariants} className="glass-champagne rounded-2xl p-6 glow-champagne mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-champagne-500 font-medium tracking-widest uppercase mb-2">
                Member Dashboard
              </p>
              <h1 className="text-2xl md:text-3xl font-display font-medium text-gradient mb-1">
                Welcome back, {mockMember.name.split(' ')[0]}
              </h1>
              <p className="text-noir-400 text-sm flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  {mockMember.streak} day streak
                </span>
                <span className="text-noir-600">•</span>
                <span>{mockMember.totalWorkouts} total workouts</span>
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
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Membership Status */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-lg font-semibold capitalize text-white">
              {mockMember.membership.type}
            </p>
            <p className="text-xs text-noir-400 mb-3">Gym Membership</p>
            <AnimatedProgress
              value={mockMember.membership.daysLeft}
              max={mockMember.membership.totalDays}
              color="green"
              size="sm"
              showPercentage={false}
            />
            <p className="text-[10px] text-noir-400 mt-1">{mockMember.membership.daysLeft} days remaining</p>
          </div>

          {/* PT Sessions */}
          <div className="glass rounded-2xl p-5 glow-champagne">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-champagne-500/10">
                    <Dumbbell className="w-4 h-4 text-champagne-400" />
                  </div>
                </div>
                <p className="text-xs text-noir-400 mt-3">PT Sessions</p>
                <p className="text-[10px] text-noir-500">remaining in package</p>
              </div>
              <CircularProgress
                value={mockMember.ptSessions.remaining}
                max={mockMember.ptSessions.total}
                size={64}
                strokeWidth={5}
                color="gold"
                glowIntensity="medium"
              />
            </div>
          </div>

          {/* Next Session */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Calendar className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            {mockUpcomingBookings.length > 0 ? (
              <>
                <p className="text-lg font-semibold text-white">
                  {mockUpcomingBookings[0].date}
                </p>
                <p className="text-xs text-noir-400">Next Session</p>
                <p className="text-sm text-orange-400 font-medium mt-1">
                  {mockUpcomingBookings[0].time}
                </p>
              </>
            ) : (
              <p className="text-noir-400 text-sm">No upcoming sessions</p>
            )}
          </div>

          {/* Quick Book CTA */}
          <Link href="/member/book" className="block">
            <GlowCard glowColor="rgba(201, 169, 108, 0.3)" className="h-full">
              <motion.div
                className="relative h-full p-5"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 rounded-lg bg-champagne-500/10 w-fit mb-3">
                  <CalendarPlus className="w-4 h-4 text-champagne-400" />
                </div>
                <p className="text-base font-medium text-white">Book Session</p>
                <p className="text-xs text-noir-400">Schedule your next PT</p>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-champagne-400" />
              </motion.div>
            </GlowCard>
          </Link>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left Column - Coach & Sessions */}
          <div className="lg:col-span-2 space-y-5">
            {/* My Coach Section */}
            <motion.div variants={itemVariants}>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-md bg-champagne-500/10">
                    <Trophy className="w-3.5 h-3.5 text-champagne-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm">My Coach</h3>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl glass-subtle">
                  {/* Coach Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-champagne-400 to-champagne-600 flex items-center justify-center shadow-lg shadow-champagne-500/20">
                      <span className="text-noir-950 font-bold text-lg">
                        {mockMember.coach.avatar}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-noir-900" />
                  </div>

                  {/* Coach Info */}
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-white">{mockMember.coach.name}</h4>
                    <p className="text-xs text-champagne-400">{mockMember.coach.specialty}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-noir-400">4.9 rating</span>
                      <span className="text-[10px] text-noir-400">200+ sessions</span>
                    </div>
                  </div>
                </div>

                <Link href="/member/book" className="block mt-4">
                  <motion.button
                    className="w-full btn-premium py-2.5 rounded-lg text-sm font-medium"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book a Session
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Upcoming Sessions */}
            <motion.div variants={itemVariants}>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-500/10">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <h3 className="font-medium text-white text-sm">Upcoming Sessions</h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {mockUpcomingBookings.length} booked
                  </span>
                </div>

                {mockUpcomingBookings.length > 0 ? (
                  <div className="space-y-2">
                    {mockUpcomingBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl glass-subtle hover:bg-noir-800/50 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne-400/20 to-champagne-600/10 flex items-center justify-center border border-champagne-500/20">
                            <span className="text-champagne-400 font-medium text-xs">
                              {booking.coachName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{booking.coachName}</p>
                            <p className="text-xs text-noir-400">{booking.duration} min</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{booking.date}</p>
                          <p className="text-xs text-champagne-400">{booking.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-10 h-10 text-noir-700 mx-auto mb-3" />
                    <p className="text-noir-400 text-sm mb-3">No upcoming sessions</p>
                    <Link href="/member/book">
                      <button className="btn-ghost px-4 py-2 rounded-lg text-xs font-medium">
                        Book Now
                      </button>
                    </Link>
                  </div>
                )}

                <Link href="/member/bookings" className="block mt-4">
                  <button className="w-full py-2.5 rounded-lg text-xs font-medium text-noir-400 hover:text-white glass-subtle hover:bg-noir-800/50 transition-all flex items-center justify-center gap-1">
                    View All Bookings
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-5">
            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-md bg-violet-500/10">
                    <Activity className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm">Your Stats</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-orange-500/10">
                        <Flame className="w-3 h-3 text-orange-400" />
                      </div>
                      <span className="text-xs text-noir-300">Current Streak</span>
                    </div>
                    <span className="text-sm font-semibold text-orange-400">{mockMember.streak} days</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-emerald-500/10">
                        <Target className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-xs text-noir-300">Total Workouts</span>
                    </div>
                    <AnimatedCounter value={mockMember.totalWorkouts} className="text-sm font-semibold text-emerald-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl glass-subtle">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-blue-500/10">
                        <TrendingUp className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-xs text-noir-300">This Month</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-400">+12 sessions</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Membership Overview */}
            <motion.div variants={itemVariants}>
              <GlowCard glowColor="rgba(52, 211, 153, 0.2)">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-md bg-emerald-500/10">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h3 className="font-medium text-white text-sm">Membership</h3>
                  </div>

                  <div className="text-center mb-4">
                    <CircularProgress
                      value={mockMember.membership.daysLeft}
                      max={mockMember.membership.totalDays}
                      size={100}
                      strokeWidth={6}
                      color="green"
                      glowIntensity="medium"
                      label="Days Left"
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 rounded-lg glass-subtle">
                      <span className="text-noir-400">Plan</span>
                      <span className="text-white font-medium capitalize">{mockMember.membership.type}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg glass-subtle">
                      <span className="text-noir-400">Expires</span>
                      <span className="text-white font-medium">{mockMember.membership.endDate}</span>
                    </div>
                  </div>

                  <Link href="/member/subscriptions" className="block mt-4">
                    <button className="w-full py-2 rounded-lg text-xs font-medium text-emerald-400 glass-subtle hover:bg-emerald-500/10 transition-all border border-emerald-500/20">
                      Manage Subscription →
                    </button>
                  </Link>
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
