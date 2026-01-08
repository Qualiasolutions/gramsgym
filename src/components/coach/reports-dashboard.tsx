'use client'

import { motion } from 'framer-motion'
import { StatCard } from '@/components/ui/stat-card'
import { Users, Calendar, CreditCard, TrendingUp, Download, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

interface ReportsDashboardProps {
  totalMembers: number
  activeMembers: number
  totalBookings: number
  completedBookings: number
  scheduledBookings: number
  cancelledBookings: number
  totalRevenue: number
  activeMemberships: number
  activePTPackages: number
  membershipsByType: { monthly: number; quarterly: number; yearly: number }
  revenueByMonth: { month: string; revenue: number }[]
  memberGrowth: { month: string; members: number }[]
}

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

// Custom colors
const COLORS = {
  champagne: '#c9a96c',
  green: '#22c55e',
  blue: '#3b82f6',
  orange: '#f97316',
  red: '#ef4444',
  noir: {
    700: '#27272a',
    800: '#18181b',
    900: '#09090b',
  }
}

const PIE_COLORS = [COLORS.champagne, COLORS.blue, COLORS.green]

export function ReportsDashboard({
  totalMembers,
  activeMembers,
  totalBookings,
  completedBookings,
  scheduledBookings,
  cancelledBookings,
  totalRevenue,
  activeMemberships,
  activePTPackages,
  membershipsByType,
  revenueByMonth,
  memberGrowth,
}: ReportsDashboardProps) {
  // Prepare pie chart data
  const membershipPieData = [
    { name: 'Monthly', value: membershipsByType.monthly },
    { name: 'Quarterly', value: membershipsByType.quarterly },
    { name: 'Yearly', value: membershipsByType.yearly },
  ].filter(d => d.value > 0)

  // Session stats for bar chart
  const sessionData = [
    { name: 'Completed', value: completedBookings, fill: COLORS.green },
    { name: 'Scheduled', value: scheduledBookings, fill: COLORS.blue },
    { name: 'Cancelled', value: cancelledBookings, fill: COLORS.red },
  ]

  const handleExportCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Members', totalMembers],
      ['Active Members', activeMembers],
      ['Total Bookings', totalBookings],
      ['Completed Bookings', completedBookings],
      ['Scheduled Bookings', scheduledBookings],
      ['Total Revenue', `${totalRevenue} JOD`],
      ['Active Memberships', activeMemberships],
      ['Active PT Packages', activePTPackages],
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grams-gym-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleExportPDF = async () => {
    // Dynamic import for PDF generation
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text('Grams Gym Report', 20, 20)

    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30)

    doc.setFontSize(14)
    doc.text('Summary Statistics', 20, 45)

    doc.setFontSize(11)
    const stats = [
      `Total Members: ${totalMembers}`,
      `Active Members: ${activeMembers}`,
      `Total Bookings: ${totalBookings}`,
      `Completed Sessions: ${completedBookings}`,
      `Scheduled Sessions: ${scheduledBookings}`,
      `Total Revenue: ${totalRevenue} JOD`,
      `Active Memberships: ${activeMemberships}`,
      `Active PT Packages: ${activePTPackages}`,
    ]

    stats.forEach((stat, i) => {
      doc.text(stat, 20, 55 + i * 8)
    })

    doc.save(`grams-gym-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

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
            <h1 className="text-2xl md:text-3xl font-display font-medium mb-2">
              <span className="text-gradient italic">Reports</span>
            </h1>
            <p className="text-noir-400 text-sm md:text-base">
              Overview of gym performance and statistics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <motion.button
              onClick={handleExportCSV}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-ghost px-4 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
            <motion.button
              onClick={handleExportPDF}
              whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(201, 169, 108, 0.35)' }}
              whileTap={{ scale: 0.98 }}
              className="btn-premium px-4 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Members"
          value={totalMembers}
          icon={Users}
          color="gold"
          trend={{ value: activeMembers, isPositive: true }}
          delay={0}
        />
        <StatCard
          label="Total Bookings"
          value={totalBookings}
          icon={Calendar}
          color="blue"
          trend={{ value: completedBookings, isPositive: true }}
          delay={0.1}
        />
        <StatCard
          label="Active Subscriptions"
          value={activeMemberships + activePTPackages}
          icon={CreditCard}
          color="green"
          delay={0.2}
        />
        <StatCard
          label="Total Revenue"
          value={totalRevenue}
          suffix=" JOD"
          icon={TrendingUp}
          color="gold"
          delay={0.3}
        />
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card-glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-foreground">Revenue Trend</h3>
            <p className="text-sm text-noir-500 mt-1">Monthly revenue over the last 6 months</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.champagne} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.champagne} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.noir[700]} vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke={COLORS.noir[700]}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke={COLORS.noir[700]}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.noir[900],
                    border: `1px solid ${COLORS.noir[700]}`,
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value) => [`${value} JOD`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.champagne}
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Membership Distribution */}
        <div className="card-glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-foreground">Membership Distribution</h3>
            <p className="text-sm text-noir-500 mt-1">Active memberships by type</p>
          </div>
          <div className="h-[280px] flex items-center justify-center">
            {membershipPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {membershipPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: COLORS.noir[900],
                      border: `1px solid ${COLORS.noir[700]}`,
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-noir-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No active memberships</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {membershipPieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                <span className="text-sm text-noir-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Session Statistics */}
        <div className="card-glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-foreground">Session Statistics</h3>
            <p className="text-sm text-noir-500 mt-1">PT session breakdown by status</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.noir[700]} horizontal={false} />
                <XAxis
                  type="number"
                  stroke={COLORS.noir[700]}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke={COLORS.noir[700]}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.noir[900],
                    border: `1px solid ${COLORS.noir[700]}`,
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value) => [value, 'Sessions']}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {sessionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-lg font-medium">{completedBookings}</span>
              </div>
              <span className="text-xs text-noir-500">Completed</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-lg font-medium">{scheduledBookings}</span>
              </div>
              <span className="text-xs text-noir-500">Scheduled</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-red-400 mb-1">
                <XCircle className="w-4 h-4" />
                <span className="text-lg font-medium">{cancelledBookings}</span>
              </div>
              <span className="text-xs text-noir-500">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Member Growth */}
        <div className="card-glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-foreground">Member Growth</h3>
            <p className="text-sm text-noir-500 mt-1">Member count over the last 6 months</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memberGrowth}>
                <defs>
                  <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.noir[700]} vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke={COLORS.noir[700]}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke={COLORS.noir[700]}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.noir[900],
                    border: `1px solid ${COLORS.noir[700]}`,
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value) => [value, 'Members']}
                />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke={COLORS.green}
                  strokeWidth={2}
                  fill="url(#memberGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-glass rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-champagne-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-champagne-400" />
            </div>
            <div>
              <p className="text-sm text-noir-500">Completion Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-noir-500">Avg Revenue/Member</p>
              <p className="text-2xl font-bold text-foreground">
                {totalMembers > 0 ? Math.round(totalRevenue / totalMembers) : 0} JOD
              </p>
            </div>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-noir-500">Avg Sessions/Member</p>
              <p className="text-2xl font-bold text-foreground">
                {totalMembers > 0 ? (totalBookings / totalMembers).toFixed(1) : 0}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
