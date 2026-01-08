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
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-xs text-champagne-500 font-medium tracking-widest uppercase mb-2">
            Member Dashboard
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-medium text-white mb-1">
            Welcome back, {mockMember.name.split(' ')[0]}
          </h1>
          <p className="text-zinc-500 text-sm">
            {mockMember.streak} day streak • {mockMember.totalWorkouts} total workouts
          </p>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div variants={itemVariants} className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {/* Membership Status */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                Active
              </span>
            </div>
            <p className="text-lg font-semibold capitalize text-white">
              {mockMember.membership.type}
            </p>
            <p className="text-xs text-zinc-500 mb-3">Gym Membership</p>
            <AnimatedProgress
              value={mockMember.membership.daysLeft}
              max={mockMember.membership.totalDays}
              color="green"
              size="sm"
              showPercentage={false}
            />
            <p className="text-[10px] text-zinc-500 mt-1">{mockMember.membership.daysLeft} days remaining</p>
          </div>

          {/* PT Sessions */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-champagne-500/10">
                    <Dumbbell className="w-4 h-4 text-champagne-400" />
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mt-3">PT Sessions</p>
                <p className="text-[10px] text-zinc-600">remaining in package</p>
              </div>
              <CircularProgress
                value={mockMember.ptSessions.remaining}
                max={mockMember.ptSessions.total}
                size={64}
                strokeWidth={5}
                color="gold"
                glowIntensity="low"
              />
            </div>
          </div>

          {/* Next Session */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            {mockUpcomingBookings.length > 0 ? (
              <>
                <p className="text-lg font-semibold text-white">
                  {mockUpcomingBookings[0].date}
                </p>
                <p className="text-xs text-zinc-500">Next Session</p>
                <p className="text-sm text-amber-400 font-medium mt-1">
                  {mockUpcomingBookings[0].time}
                </p>
              </>
            ) : (
              <p className="text-zinc-500 text-sm">No upcoming sessions</p>
            )}
          </div>

          {/* Quick Book CTA */}
          <Link href="/member/book" className="block">
            <motion.div
              className="relative h-full p-4 rounded-xl bg-champagne-500/5 border border-champagne-500/20 hover:bg-champagne-500/10 hover:border-champagne-500/30 transition-all cursor-pointer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2 rounded-lg bg-champagne-500/10 w-fit mb-3">
                <CalendarPlus className="w-4 h-4 text-champagne-400" />
              </div>
              <p className="text-base font-medium text-white">Book Session</p>
              <p className="text-xs text-zinc-500">Schedule your next PT</p>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-champagne-400" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left Column - Coach & Sessions */}
          <div className="lg:col-span-2 space-y-5">
            {/* My Coach Section */}
            <motion.div variants={itemVariants}>
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-md bg-champagne-500/10">
                    <Trophy className="w-3.5 h-3.5 text-champagne-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm">My Coach</h3>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/30">
                  {/* Coach Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-champagne-500/10 flex items-center justify-center border border-champagne-500/20">
                      <span className="text-champagne-400 font-semibold text-lg">
                        {mockMember.coach.avatar}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                  </div>

                  {/* Coach Info */}
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-white">{mockMember.coach.name}</h4>
                    <p className="text-xs text-champagne-400">{mockMember.coach.specialty}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-zinc-500">4.9 rating</span>
                      <span className="text-[10px] text-zinc-500">200+ sessions</span>
                    </div>
                  </div>
                </div>

                <Link href="/member/book" className="block mt-4">
                  <motion.button
                    className="w-full py-2.5 rounded-lg text-sm font-medium text-noir-950 bg-champagne-500 hover:bg-champagne-400 transition-colors"
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
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-500/10">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <h3 className="font-medium text-white text-sm">Upcoming Sessions</h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                    {mockUpcomingBookings.length} booked
                  </span>
                </div>

                {mockUpcomingBookings.length > 0 ? (
                  <div className="space-y-2">
                    {mockUpcomingBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-champagne-500/10 flex items-center justify-center">
                            <span className="text-champagne-400 font-medium text-xs">
                              {booking.coachName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{booking.coachName}</p>
                            <p className="text-xs text-zinc-500">{booking.duration} min</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{booking.date}</p>
                          <p className="text-xs text-zinc-500">{booking.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm mb-3">No upcoming sessions</p>
                    <Link href="/member/book">
                      <button className="px-4 py-2 rounded-lg text-xs font-medium text-champagne-400 bg-champagne-500/10 hover:bg-champagne-500/20 transition-colors">
                        Book Now
                      </button>
                    </Link>
                  </div>
                )}

                <Link href="/member/bookings" className="block mt-4">
                  <button className="w-full py-2.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all flex items-center justify-center gap-1">
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
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-md bg-violet-500/10">
                    <Activity className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm">Your Stats</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-amber-500/10">
                        <Flame className="w-3 h-3 text-amber-400" />
                      </div>
                      <span className="text-xs text-zinc-400">Current Streak</span>
                    </div>
                    <span className="text-sm font-medium text-amber-400">{mockMember.streak} days</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-emerald-500/10">
                        <Target className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-xs text-zinc-400">Total Workouts</span>
                    </div>
                    <AnimatedCounter value={mockMember.totalWorkouts} className="text-sm font-medium text-emerald-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-blue-500/10">
                        <TrendingUp className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-xs text-zinc-400">This Month</span>
                    </div>
                    <span className="text-sm font-medium text-blue-400">+12 sessions</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Membership Overview */}
            <motion.div variants={itemVariants}>
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
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
                    glowIntensity="low"
                    label="Days Left"
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Plan</span>
                    <span className="text-white font-medium capitalize">{mockMember.membership.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Expires</span>
                    <span className="text-white font-medium">{mockMember.membership.endDate}</span>
                  </div>
                </div>

                <Link href="/member/subscriptions" className="block mt-4">
                  <button className="w-full py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all">
                    Manage Subscription →
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
