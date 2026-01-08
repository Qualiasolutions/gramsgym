'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users,
  AlertTriangle,
  Calendar,
  UserPlus,
  CreditCard,
  Clock,
  ChevronRight,
  Dumbbell,
  Activity,
  Zap,
  Target,
  BarChart3,
  Bell,
} from 'lucide-react'
import { CircularProgress } from '@/components/ui/circular-progress'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { AnimatedProgress } from '@/components/ui/animated-progress'

// Mock data for demo
const mockStats = {
  activeMembers: 127,
  expiringThisWeek: 8,
  todaySessions: 12,
  lowSessionPackages: 5,
  monthlyRevenue: 24500,
  completionRate: 94,
}

const mockTodayBookings = [
  { id: '1', memberName: 'Ahmad Khalil', time: '9:00 AM', duration: 60, status: 'confirmed' },
  { id: '2', memberName: 'Sara Hassan', time: '10:30 AM', duration: 45, status: 'confirmed' },
  { id: '3', memberName: 'Mohammed Ali', time: '2:00 PM', duration: 60, status: 'pending' },
  { id: '4', memberName: 'Layla Noor', time: '4:30 PM', duration: 45, status: 'confirmed' },
  { id: '5', memberName: 'Omar Faisal', time: '6:00 PM', duration: 60, status: 'confirmed' },
]

const mockExpiringMemberships = [
  { id: '1', memberName: 'Yousef Ahmed', type: 'Monthly', daysLeft: 2 },
  { id: '2', memberName: 'Nadia Samir', type: 'Quarterly', daysLeft: 4 },
  { id: '3', memberName: 'Tariq Hassan', type: 'Monthly', daysLeft: 5 },
  { id: '4', memberName: 'Rania Khalid', type: 'Monthly', daysLeft: 7 },
]

const mockLowSessions = [
  { id: '1', memberName: 'Karim Mahmoud', remaining: 1, total: 8 },
  { id: '2', memberName: 'Hana Ibrahim', remaining: 2, total: 16 },
  { id: '3', memberName: 'Fadi Nassar', remaining: 3, total: 8 },
]

const mockRecentActivity = [
  { id: '1', type: 'booking', message: 'New booking from Ahmad Khalil', time: '5 min ago' },
  { id: '2', type: 'payment', message: 'Payment received from Sara Hassan', time: '1 hour ago' },
  { id: '3', type: 'renewal', message: 'Membership renewed by Mohammed Ali', time: '3 hours ago' },
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function CoachDashboardPage() {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'

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
            Coach Dashboard
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-medium text-white mb-1">
            {greeting}
          </h1>
          <p className="text-zinc-500 text-sm">
            {mockStats.todaySessions} sessions scheduled today
          </p>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Active Members', value: mockStats.activeMembers, icon: Users, accent: 'text-champagne-400' },
            { label: 'Today\'s Sessions', value: mockStats.todaySessions, icon: Calendar, accent: 'text-blue-400' },
            { label: 'Completion Rate', value: mockStats.completionRate, icon: Target, accent: 'text-emerald-400', suffix: '%' },
            { label: 'Expiring Soon', value: mockStats.expiringThisWeek, icon: AlertTriangle, accent: 'text-amber-400' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className={`w-4 h-4 ${stat.accent}`} />
                <span className="text-xs text-zinc-500">{stat.label}</span>
              </div>
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix || ''}
                className={`text-2xl font-semibold ${stat.accent}`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
          <Link href="/coach/members/new">
            <motion.button
              className="px-4 py-2 rounded-lg text-sm font-medium text-noir-950 bg-champagne-500 hover:bg-champagne-400 transition-colors flex items-center gap-2"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </motion.button>
          </Link>
          <Link href="/coach/subscriptions">
            <motion.button
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800 transition-all flex items-center gap-2"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <CreditCard className="w-4 h-4" />
              New Subscription
            </motion.button>
          </Link>
          <Link href="/coach/bookings">
            <motion.button
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800 transition-all flex items-center gap-2"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="w-4 h-4" />
              View Bookings
            </motion.button>
          </Link>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left Column - Schedule & Alerts */}
          <div className="lg:col-span-2 space-y-5">
            {/* Today's Schedule */}
            <motion.div variants={itemVariants}>
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Clock className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">Today&apos;s Schedule</h3>
                      <p className="text-xs text-zinc-500">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400">
                    {mockTodayBookings.length} sessions
                  </span>
                </div>

                {/* Session List */}
                <div className="space-y-2">
                  {mockTodayBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-champagne-500/10 flex items-center justify-center">
                          <span className="text-champagne-400 font-medium text-xs">
                            {booking.memberName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{booking.memberName}</p>
                          <p className="text-xs text-zinc-500">{booking.duration} min</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{booking.time}</p>
                        <p className={`text-xs ${booking.status === 'confirmed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link href="/coach/bookings" className="block mt-4">
                  <button className="w-full py-2.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all flex items-center justify-center gap-1">
                    View All Bookings
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Two Column Alerts */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Expiring Memberships */}
              <motion.div variants={itemVariants}>
                <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-amber-500/10">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <h3 className="font-medium text-white text-sm">Expiring Soon</h3>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                      {mockExpiringMemberships.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {mockExpiringMemberships.slice(0, 3).map((membership) => (
                      <motion.div
                        key={membership.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                        whileHover={{ x: 2 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-champagne-500/10 flex items-center justify-center">
                            <span className="text-champagne-400 font-medium text-[10px]">
                              {membership.memberName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-white">{membership.memberName}</p>
                            <p className="text-[10px] text-zinc-500">{membership.type}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          membership.daysLeft <= 3 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {membership.daysLeft}d
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <Link href="/coach/subscriptions" className="block mt-3">
                    <button className="w-full py-2 rounded-lg text-[10px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
                      Manage All →
                    </button>
                  </Link>
                </div>
              </motion.div>

              {/* Low PT Sessions */}
              <motion.div variants={itemVariants}>
                <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-red-500/10">
                        <Dumbbell className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <h3 className="font-medium text-white text-sm">Low Sessions</h3>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-red-500/10 text-red-400">
                      {mockLowSessions.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {mockLowSessions.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-2.5 rounded-lg bg-zinc-800/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-champagne-500/10 flex items-center justify-center">
                              <span className="text-champagne-400 font-medium text-[10px]">
                                {pkg.memberName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-white">{pkg.memberName}</span>
                          </div>
                          <span className={`text-[10px] font-semibold ${
                            pkg.remaining <= 1 ? 'text-red-400' : 'text-amber-400'
                          }`}>
                            {pkg.remaining}/{pkg.total}
                          </span>
                        </div>
                        <AnimatedProgress
                          value={pkg.remaining}
                          max={pkg.total}
                          color={pkg.remaining <= 1 ? 'red' : 'orange'}
                          size="sm"
                          showPercentage={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Activity & Performance */}
          <div className="space-y-5">
            {/* Performance Overview */}
            <motion.div variants={itemVariants}>
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 rounded-md bg-emerald-500/10">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm">Performance</h3>
                </div>

                {/* Circular Progress */}
                <div className="flex justify-center mb-5">
                  <CircularProgress
                    value={mockStats.completionRate}
                    max={100}
                    size={120}
                    strokeWidth={8}
                    color="green"
                    glowIntensity="low"
                    label="Completion"
                  />
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-800/30">
                    <span className="text-xs text-zinc-400">Sessions Completed</span>
                    <AnimatedCounter value={156} className="text-sm font-medium text-white" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-800/30">
                    <span className="text-xs text-zinc-400">New Members</span>
                    <AnimatedCounter value={12} className="text-sm font-medium text-white" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-800/30">
                    <span className="text-xs text-zinc-400">Avg. Rating</span>
                    <span className="text-sm font-medium text-white">4.9</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-md bg-violet-500/10">
                    <Activity className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm">Recent Activity</h3>
                </div>

                <div className="space-y-3">
                  {mockRecentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-2.5"
                    >
                      <div className={`p-1.5 rounded-md mt-0.5 ${
                        activity.type === 'booking' ? 'bg-blue-500/10' :
                        activity.type === 'payment' ? 'bg-emerald-500/10' :
                        'bg-champagne-500/10'
                      }`}>
                        {activity.type === 'booking' && <Calendar className="w-3 h-3 text-blue-400" />}
                        {activity.type === 'payment' && <CreditCard className="w-3 h-3 text-emerald-400" />}
                        {activity.type === 'renewal' && <Zap className="w-3 h-3 text-champagne-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-300 truncate">{activity.message}</p>
                        <p className="text-[10px] text-zinc-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={itemVariants}>
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative p-1.5 rounded-md bg-champagne-500/10">
                      <Bell className="w-3.5 h-3.5 text-champagne-400" />
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                        3
                      </span>
                    </div>
                    <span className="text-xs font-medium text-white">3 unread notifications</span>
                  </div>
                  <button className="text-[10px] text-champagne-400 hover:text-champagne-300 transition-colors">
                    View →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
