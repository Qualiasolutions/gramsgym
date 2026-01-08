'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StatCard } from '@/components/ui/stat-card'
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
import { CreditCard, Dumbbell, Plus, Loader2, Users, Clock, AlertTriangle, TrendingUp } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { createGymMembership, createPTPackage } from '@/lib/actions/subscriptions'

interface Member {
  id: string
  name_en: string
  name_ar: string
  email: string
}

interface Coach {
  id: string
  name_en: string
  name_ar: string
}

interface GymMembership {
  id: string
  member_id: string
  type: string
  start_date: string
  end_date: string
  status: string
  price_paid: number | null
  member: Member
}

interface PTPackage {
  id: string
  member_id: string
  coach_id: string
  total_sessions: number
  remaining_sessions: number
  status: string
  price_paid: number | null
  member: Member
  coach: Coach
}

interface Pricing {
  id: string
  name_en: string
  name_ar: string
  type: string
  duration_or_sessions: string | null
  price: number
}

interface SubscriptionsManagerProps {
  members: Member[]
  coaches: Coach[]
  gymMemberships: GymMembership[]
  ptPackages: PTPackage[]
  pricing: Pricing[]
  defaultMemberId?: string
  defaultType?: string
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

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }
  })
}

export function SubscriptionsManager({
  members,
  coaches,
  gymMemberships,
  ptPackages,
  pricing,
  defaultMemberId,
  defaultType,
}: SubscriptionsManagerProps) {
  const [gymDialogOpen, setGymDialogOpen] = useState(defaultType === 'gym')
  const [ptDialogOpen, setPtDialogOpen] = useState(defaultType === 'pt')
  const [activeTab, setActiveTab] = useState<'gym' | 'pt'>('gym')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGymSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createGymMembership(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setGymDialogOpen(false)
    }
    setLoading(false)
  }

  const handlePTSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createPTPackage(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setPtDialogOpen(false)
    }
    setLoading(false)
  }

  const activeMemberships = gymMemberships.filter((m) => m.status === 'active')
  const expiredMemberships = gymMemberships.filter((m) => m.status !== 'active')
  const activePT = ptPackages.filter((p) => p.status === 'active')
  const completedPT = ptPackages.filter((p) => p.status !== 'active')

  // Calculate stats
  const expiringMemberships = activeMemberships.filter(m => {
    const daysLeft = differenceInDays(new Date(m.end_date), new Date())
    return daysLeft <= 7 && daysLeft > 0
  }).length

  const lowSessionsPT = activePT.filter(p => p.remaining_sessions <= 3).length

  const totalRevenue = [...gymMemberships, ...ptPackages].reduce((sum, item) => {
    return sum + (item.price_paid || 0)
  }, 0)

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
              <span className="text-gradient italic">Subscriptions</span>
            </h1>
            <p className="text-noir-400 text-sm md:text-base">
              Manage gym memberships and PT packages
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Dialog open={gymDialogOpen} onOpenChange={setGymDialogOpen}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(201, 169, 108, 0.35)' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium px-4 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Membership
                </motion.button>
              </DialogTrigger>
              <DialogContent className="glass border-noir-700 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-gradient">Add Gym Membership</DialogTitle>
                  <DialogDescription className="text-noir-400">
                    Create a new gym membership for a member
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGymSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-noir-300">Member</Label>
                    <Select name="member_id" defaultValue={defaultMemberId} required>
                      <SelectTrigger className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent className="bg-noir-900 border-noir-700">
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name_en} ({member.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-noir-300">Membership Type</Label>
                    <Select name="type" required>
                      <SelectTrigger className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-noir-900 border-noir-700">
                        <SelectItem value="monthly">Monthly (1 month)</SelectItem>
                        <SelectItem value="quarterly">Quarterly (3 months)</SelectItem>
                        <SelectItem value="yearly">Yearly (12 months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-noir-300">Start Date</Label>
                    <Input
                      type="date"
                      name="start_date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required
                      className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-noir-300">Price (JOD)</Label>
                    <Input
                      type="number"
                      name="price_paid"
                      step="0.01"
                      placeholder="0.00"
                      className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50"
                    />
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
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Membership'}
                  </motion.button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={ptDialogOpen} onOpenChange={setPtDialogOpen}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-ghost px-4 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add PT Package
                </motion.button>
              </DialogTrigger>
              <DialogContent className="glass border-noir-700 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-gradient">Add PT Package</DialogTitle>
                  <DialogDescription className="text-noir-400">
                    Create a new personal training package
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePTSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-noir-300">Member</Label>
                    <Select name="member_id" defaultValue={defaultMemberId} required>
                      <SelectTrigger className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent className="bg-noir-900 border-noir-700">
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name_en} ({member.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-noir-300">Coach</Label>
                    <Select name="coach_id" required>
                      <SelectTrigger className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                        <SelectValue placeholder="Select coach" />
                      </SelectTrigger>
                      <SelectContent className="bg-noir-900 border-noir-700">
                        {coaches.map((coach) => (
                          <SelectItem key={coach.id} value={coach.id}>
                            {coach.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-noir-300">Number of Sessions</Label>
                    <Select name="total_sessions" required>
                      <SelectTrigger className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent className="bg-noir-900 border-noir-700">
                        <SelectItem value="5">5 Sessions</SelectItem>
                        <SelectItem value="10">10 Sessions</SelectItem>
                        <SelectItem value="20">20 Sessions</SelectItem>
                        <SelectItem value="30">30 Sessions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-noir-300">Price (JOD)</Label>
                    <Input
                      type="number"
                      name="price_paid"
                      step="0.01"
                      placeholder="0.00"
                      className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50"
                    />
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
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Package'}
                  </motion.button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Memberships"
          value={activeMemberships.length}
          icon={CreditCard}
          color="gold"
          delay={0}
        />
        <StatCard
          label="Active PT Packages"
          value={activePT.length}
          icon={Dumbbell}
          color="blue"
          delay={0.1}
        />
        <StatCard
          label="Expiring Soon"
          value={expiringMemberships + lowSessionsPT}
          icon={AlertTriangle}
          color="orange"
          delay={0.2}
        />
        <StatCard
          label="Total Revenue"
          value={totalRevenue}
          suffix=" JOD"
          icon={TrendingUp}
          color="green"
          delay={0.3}
        />
      </motion.div>

      {/* Premium Tabs */}
      <motion.div variants={itemVariants}>
        <div className="glass-subtle rounded-2xl p-1.5 inline-flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab('gym')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'gym'
                ? 'bg-champagne-500/20 text-champagne-400 shadow-lg shadow-champagne-500/10'
                : 'text-noir-400 hover:text-noir-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Gym Memberships ({activeMemberships.length})
          </button>
          <button
            onClick={() => setActiveTab('pt')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'pt'
                ? 'bg-champagne-500/20 text-champagne-400 shadow-lg shadow-champagne-500/10'
                : 'text-noir-400 hover:text-noir-200'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            PT Packages ({activePT.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'gym' ? (
            <motion.div
              key="gym"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-glass rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-noir-800">
                <h3 className="text-lg font-medium text-foreground">Active Gym Memberships</h3>
                <p className="text-sm text-noir-500 mt-1">Members with active gym access</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-noir-800">
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider">Member</th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden md:table-cell">Start Date</th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden md:table-cell">End Date</th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden sm:table-cell">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeMemberships.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12">
                          <p className="text-noir-500">No active memberships</p>
                        </td>
                      </tr>
                    ) : (
                      activeMemberships.map((membership, i) => {
                        const daysLeft = differenceInDays(
                          new Date(membership.end_date),
                          new Date()
                        )
                        const isExpiringSoon = daysLeft <= 7
                        return (
                          <motion.tr
                            key={membership.id}
                            custom={i}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            className={`border-b border-noir-800/50 hover:bg-champagne-500/5 transition-colors ${isExpiringSoon ? 'bg-orange-500/5' : ''}`}
                          >
                            <td className="py-4 px-6 font-medium">{membership.member.name_en}</td>
                            <td className="py-4 px-6 capitalize text-noir-400 hidden sm:table-cell">{membership.type}</td>
                            <td className="py-4 px-6 text-noir-400 hidden md:table-cell">
                              {format(new Date(membership.start_date), 'MMM d, yyyy')}
                            </td>
                            <td className="py-4 px-6 text-noir-400 hidden md:table-cell">
                              {format(new Date(membership.end_date), 'MMM d, yyyy')}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                isExpiringSoon
                                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                  : 'bg-green-500/20 text-green-400 border-green-500/30'
                              }`}>
                                {daysLeft} days left
                                {isExpiringSoon && (
                                  <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="ml-1.5 w-1.5 h-1.5 rounded-full bg-orange-400"
                                  />
                                )}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-noir-400 hidden sm:table-cell">
                              {membership.price_paid ? `${membership.price_paid} JOD` : '—'}
                            </td>
                          </motion.tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="pt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-glass rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-noir-800">
                <h3 className="text-lg font-medium text-foreground">Active PT Packages</h3>
                <p className="text-sm text-noir-500 mt-1">Personal training packages with remaining sessions</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-noir-800">
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider">Member</th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden sm:table-cell">Coach</th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider">Sessions</th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden sm:table-cell">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePT.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <p className="text-noir-500">No active PT packages</p>
                        </td>
                      </tr>
                    ) : (
                      activePT.map((pkg, i) => {
                        const isLow = pkg.remaining_sessions <= 3
                        return (
                          <motion.tr
                            key={pkg.id}
                            custom={i}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            className={`border-b border-noir-800/50 hover:bg-champagne-500/5 transition-colors ${isLow ? 'bg-orange-500/5' : ''}`}
                          >
                            <td className="py-4 px-6 font-medium">{pkg.member.name_en}</td>
                            <td className="py-4 px-6 text-noir-400 hidden sm:table-cell">{pkg.coach.name_en}</td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-noir-800 rounded-full overflow-hidden max-w-[100px]">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(pkg.remaining_sessions / pkg.total_sessions) * 100}%` }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className={`h-full rounded-full ${isLow ? 'bg-orange-500' : 'bg-champagne-500'}`}
                                  />
                                </div>
                                <span className="text-sm text-noir-400">
                                  {pkg.remaining_sessions}/{pkg.total_sessions}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                isLow
                                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                  : 'bg-green-500/20 text-green-400 border-green-500/30'
                              }`}>
                                {isLow ? 'Low' : 'Active'}
                                {isLow && (
                                  <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="ml-1.5 w-1.5 h-1.5 rounded-full bg-orange-400"
                                  />
                                )}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-noir-400 hidden sm:table-cell">
                              {pkg.price_paid ? `${pkg.price_paid} JOD` : '—'}
                            </td>
                          </motion.tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
