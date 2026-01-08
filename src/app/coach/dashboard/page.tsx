'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users,
  AlertTriangle,
  Calendar,
  TrendingUp,
  UserPlus,
  CreditCard,
  Clock,
  ChevronRight,
  Dumbbell,
  ArrowUpRight,
} from 'lucide-react'

// Mock data for demo
const mockStats = {
  activeMembers: 127,
  expiringThisWeek: 8,
  todaySessions: 12,
  lowSessionPackages: 5,
}

const mockTodayBookings = [
  { id: '1', memberName: 'Ahmad Khalil', time: '9:00 AM', duration: 60 },
  { id: '2', memberName: 'Sara Hassan', time: '10:30 AM', duration: 45 },
  { id: '3', memberName: 'Mohammed Ali', time: '2:00 PM', duration: 60 },
  { id: '4', memberName: 'Layla Noor', time: '4:30 PM', duration: 45 },
  { id: '5', memberName: 'Omar Faisal', time: '6:00 PM', duration: 60 },
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

export default function CoachDashboardPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Members', value: mockStats.activeMembers, icon: Users, color: 'gold' },
          { label: 'Expiring This Week', value: mockStats.expiringThisWeek, icon: AlertTriangle, color: 'orange' },
          { label: "Today's Sessions", value: mockStats.todaySessions, icon: Calendar, color: 'gold' },
          { label: 'Low PT Sessions', value: mockStats.lowSessionPackages, icon: TrendingUp, color: 'gold' },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <div className="glass-light rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-all" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.color === 'orange' ? 'bg-orange-500/10' : 'bg-gold-500/10'}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color === 'orange' ? 'text-orange-400' : 'text-gold-400'}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600" />
                </div>
                <p className={`text-3xl font-display font-semibold ${stat.color === 'orange' ? 'text-orange-400' : ''}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
        <Link href="/coach/members/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-premium flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </motion.button>
        </Link>
        <Link href="/coach/subscriptions">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-ghost flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            New Subscription
          </motion.button>
        </Link>
        <Link href="/coach/bookings">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-ghost flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            View Bookings
          </motion.button>
        </Link>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants}>
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold-500/10">
                  <Clock className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Today&apos;s Schedule</h3>
                  <p className="text-xs text-zinc-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gold-400 font-medium px-2 py-1 rounded-full bg-gold-500/10">
                {mockTodayBookings.length} sessions
              </span>
            </div>

            <div className="space-y-3">
              {mockTodayBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                      <span className="text-gold-400 font-semibold text-sm">
                        {booking.memberName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{booking.memberName}</p>
                      <p className="text-xs text-zinc-500">{booking.duration} min session</p>
                    </div>
                  </div>
                  <span className="text-sm text-gold-400 font-medium">{booking.time}</span>
                </motion.div>
              ))}
            </div>

            <Link href="/coach/bookings">
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

        {/* Expiring Soon */}
        <motion.div variants={itemVariants}>
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Expiring Soon</h3>
                  <p className="text-xs text-zinc-500">Memberships need renewal</p>
                </div>
              </div>
              <span className="text-xs text-orange-400 font-medium px-2 py-1 rounded-full bg-orange-500/10">
                {mockExpiringMemberships.length} members
              </span>
            </div>

            <div className="space-y-3">
              {mockExpiringMemberships.map((membership) => (
                <motion.div
                  key={membership.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                      <span className="text-gold-400 font-semibold text-sm">
                        {membership.memberName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{membership.memberName}</p>
                      <p className="text-xs text-zinc-500">{membership.type} membership</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    membership.daysLeft <= 3
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-orange-500/10 text-orange-400'
                  }`}>
                    {membership.daysLeft === 1 ? '1 day' : `${membership.daysLeft} days`}
                  </span>
                </motion.div>
              ))}
            </div>

            <Link href="/coach/subscriptions">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all flex items-center justify-center gap-2"
              >
                Manage Subscriptions
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Low PT Sessions */}
      <motion.div variants={itemVariants}>
        <div className="glass-light rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10">
                <Dumbbell className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="font-semibold">Low PT Sessions</h3>
                <p className="text-xs text-zinc-500">Members with 3 or fewer sessions remaining</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockLowSessions.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -4 }}
                className="p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                    <span className="text-gold-400 font-semibold text-sm">
                      {pkg.memberName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{pkg.memberName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pkg.remaining <= 1 ? 'bg-red-500' : 'bg-gold-500'
                      }`}
                      style={{ width: `${(pkg.remaining / pkg.total) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    pkg.remaining <= 1 ? 'text-red-400' : 'text-gold-400'
                  }`}>
                    {pkg.remaining}/{pkg.total}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
