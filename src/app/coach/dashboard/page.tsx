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
  TrendingUp,
} from 'lucide-react'
import { CircularProgress } from '@/components/ui/circular-progress'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { AnimatedProgress } from '@/components/ui/animated-progress'
import { StatCard } from '@/components/ui/stat-card'
import { GlowCard } from '@/components/ui/glow-card'
import { useTranslation, translations } from '@/lib/i18n'

// Mock data for demo (will be replaced with real Supabase data)
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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function CoachDashboardPage() {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'
  const { t, isRTL } = useTranslation()

  return (
    <div className="min-h-screen pb-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Premium Header Section */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-2xl glass-champagne glow-champagne p-6 md:p-8">
            {/* Background gradient accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-champagne-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <span className="text-xs text-champagne-400 uppercase tracking-[0.25em] font-medium mb-3 block">
                {t(translations.coach.dashboard)}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-medium text-foreground/95 mb-2">
                {greeting}, <span className="text-gradient italic">Coach</span>
              </h1>
              <p className="text-noir-300 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-champagne-500" />
                {mockStats.todaySessions} sessions scheduled today
              </p>
            </div>
          </div>
        </motion.div>

        {/* Premium Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Members"
            value={mockStats.activeMembers}
            icon={Users}
            color="gold"
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatCard
            label="Today's Sessions"
            value={mockStats.todaySessions}
            icon={Calendar}
            color="blue"
            delay={0.1}
          />
          <StatCard
            label="Completion Rate"
            value={mockStats.completionRate}
            suffix="%"
            icon={Target}
            color="green"
            delay={0.2}
          />
          <StatCard
            label="Expiring Soon"
            value={mockStats.expiringThisWeek}
            icon={AlertTriangle}
            color="orange"
            delay={0.3}
          />
        </motion.div>

        {/* Premium Quick Actions */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <Link href="/coach/members/new">
            <motion.button
              className="btn-premium px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
              whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(201, 169, 108, 0.35)' }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </motion.button>
          </Link>
          <Link href="/coach/subscriptions">
            <motion.button
              className="btn-ghost px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <CreditCard className="w-4 h-4" />
              <span>New Subscription</span>
            </motion.button>
          </Link>
          <Link href="/coach/bookings">
            <motion.button
              className="btn-ghost px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="w-4 h-4" />
              <span>View Bookings</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Schedule & Alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule - Premium Timeline */}
            <motion.div variants={itemVariants}>
              <div className="card-glass rounded-2xl p-6 spotlight">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl glass-champagne glow-champagne">
                      <Clock className="w-5 h-5 text-champagne-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-base">Today&apos;s Schedule</h3>
                      <p className="text-xs text-noir-400">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full glass-champagne text-champagne-400">
                    {mockTodayBookings.length} sessions
                  </span>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-champagne-500/50 via-champagne-500/20 to-transparent" />

                  <div className="space-y-3">
                    {mockTodayBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        className="relative pl-10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.08 }}
                      >
                        {/* Timeline dot with pulse */}
                        <motion.div
                          className="absolute left-2.5 top-4 w-3 h-3 rounded-full bg-champagne-500"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          style={{ boxShadow: '0 0 12px rgba(201, 169, 108, 0.5)' }}
                        />

                        <GlowCard className="p-4" glowColor="rgba(201, 169, 108, 0.15)" hoverScale={1.01}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne-400/20 to-champagne-600/10 flex items-center justify-center border border-champagne-500/20">
                                <span className="text-champagne-400 font-medium text-sm">
                                  {booking.memberName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{booking.memberName}</p>
                                <p className="text-xs text-noir-400">{booking.duration} min session</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-champagne-400">{booking.time}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                booking.status === 'confirmed'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </GlowCard>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Link href="/coach/bookings" className="block mt-5">
                  <motion.button
                    className="w-full py-3 rounded-xl text-sm font-medium text-champagne-400 glass-subtle hover:glass-champagne transition-all flex items-center justify-center gap-2"
                    whileHover={{ y: -2 }}
                  >
                    View All Bookings
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Two Column Alerts */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Expiring Memberships - With Animated Border */}
              <motion.div variants={itemVariants}>
                <div className="relative animated-border rounded-2xl">
                  <div className="relative glass p-5 rounded-2xl h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        </div>
                        <h3 className="font-medium text-white text-sm">Expiring Soon</h3>
                      </div>
                      <motion.span
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {mockExpiringMemberships.length}
                      </motion.span>
                    </div>

                    <div className="space-y-2">
                      {mockExpiringMemberships.slice(0, 4).map((membership, index) => (
                        <motion.div
                          key={membership.id}
                          className="flex items-center justify-between p-3 rounded-xl glass-subtle hover:glass transition-all cursor-pointer group"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-champagne-400/20 to-champagne-600/10 flex items-center justify-center border border-champagne-500/20">
                              <span className="text-champagne-400 font-medium text-xs">
                                {membership.memberName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-white group-hover:text-champagne-400 transition-colors">
                                {membership.memberName}
                              </p>
                              <p className="text-[10px] text-noir-500">{membership.type}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                            membership.daysLeft <= 3
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {membership.daysLeft}d left
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <Link href="/coach/subscriptions" className="block mt-4">
                      <button className="w-full py-2.5 rounded-xl text-xs font-medium text-noir-400 hover:text-champagne-400 glass-subtle hover:glass transition-all">
                        Manage Subscriptions →
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Low PT Sessions */}
              <motion.div variants={itemVariants}>
                <div className="card-glass rounded-2xl p-5 h-full spotlight">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <Dumbbell className="w-4 h-4 text-red-400" />
                      </div>
                      <h3 className="font-medium text-white text-sm">Low Sessions</h3>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-500/10 text-red-400">
                      {mockLowSessions.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {mockLowSessions.map((pkg, index) => (
                      <motion.div
                        key={pkg.id}
                        className="p-3 rounded-xl glass-subtle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-champagne-400/20 to-champagne-600/10 flex items-center justify-center border border-champagne-500/20">
                              <span className="text-champagne-400 font-medium text-[10px]">
                                {pkg.memberName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-white">{pkg.memberName}</span>
                          </div>
                          <span className={`text-xs font-bold ${
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
                      </motion.div>
                    ))}
                  </div>

                  <Link href="/coach/subscriptions" className="block mt-4">
                    <button className="w-full py-2.5 rounded-xl text-xs font-medium text-noir-400 hover:text-champagne-400 glass-subtle hover:glass transition-all">
                      View All Packages →
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Performance & Activity */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <motion.div variants={itemVariants}>
              <div className="card-glass rounded-2xl p-6 spotlight">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl glass-champagne">
                    <BarChart3 className="w-5 h-5 text-champagne-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">Performance</h3>
                    <p className="text-[10px] text-noir-500">This month</p>
                  </div>
                </div>

                {/* Circular Progress with enhanced glow */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <CircularProgress
                      value={mockStats.completionRate}
                      max={100}
                      size={140}
                      strokeWidth={10}
                      color="gold"
                      glowIntensity="high"
                      label="Completion"
                    />
                  </div>
                </div>

                {/* Stats list */}
                <div className="space-y-2">
                  {[
                    { label: 'Sessions Completed', value: 156, icon: Target },
                    { label: 'New Members', value: 12, icon: Users },
                    { label: 'Revenue', value: 24500, prefix: '', suffix: ' JOD', icon: TrendingUp },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="flex items-center justify-between p-3 rounded-xl glass-subtle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <div className="flex items-center gap-2">
                        <stat.icon className="w-3.5 h-3.5 text-noir-500" />
                        <span className="text-xs text-noir-400">{stat.label}</span>
                      </div>
                      <AnimatedCounter
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        className="text-sm font-semibold text-white"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <div className="card-glass rounded-2xl p-5 spotlight">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Activity className="w-4 h-4 text-violet-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm">Recent Activity</h3>
                </div>

                <div className="space-y-4">
                  {mockRecentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className={`p-2 rounded-lg mt-0.5 ${
                        activity.type === 'booking' ? 'bg-blue-500/10' :
                        activity.type === 'payment' ? 'bg-emerald-500/10' :
                        'bg-champagne-500/10'
                      }`}>
                        {activity.type === 'booking' && <Calendar className="w-3.5 h-3.5 text-blue-400" />}
                        {activity.type === 'payment' && <CreditCard className="w-3.5 h-3.5 text-emerald-400" />}
                        {activity.type === 'renewal' && <Zap className="w-3.5 h-3.5 text-champagne-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-300">{activity.message}</p>
                        <p className="text-[10px] text-noir-500 mt-0.5">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Notifications - Premium Style */}
            <motion.div variants={itemVariants}>
              <GlowCard className="p-4" glowColor="rgba(201, 169, 108, 0.2)">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative p-2.5 rounded-xl glass-champagne">
                      <Bell className="w-4 h-4 text-champagne-400" />
                      <motion.span
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        3
                      </motion.span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">3 unread</span>
                      <p className="text-[10px] text-noir-500">notifications</p>
                    </div>
                  </div>
                  <Link href="/coach/notifications">
                    <motion.button
                      className="text-xs font-medium text-champagne-400 hover:text-champagne-300 px-3 py-1.5 rounded-lg glass-subtle transition-all"
                      whileHover={{ x: 2 }}
                    >
                      View All →
                    </motion.button>
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
