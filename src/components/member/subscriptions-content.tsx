'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CreditCard, Dumbbell, Calendar, AlertCircle, Sparkles } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { CircularProgress } from '@/components/ui/circular-progress'
import { AnimatedProgress } from '@/components/ui/animated-progress'

interface GymMembership {
  id: string
  type: string
  status: string
  start_date: string
  end_date: string
}

interface PTPackage {
  id: string
  total_sessions: number
  remaining_sessions: number
  price_paid: number | null
  created_at: string
  status: string
  coach: { name_en: string; profile_photo_url: string | null }
}

interface SubscriptionsContentProps {
  activeGymMembership: GymMembership | null
  activePTPackages: PTPackage[]
  expiredGymMemberships: GymMembership[]
  completedPTPackages: PTPackage[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

export function SubscriptionsContent({
  activeGymMembership,
  activePTPackages,
  expiredGymMemberships,
  completedPTPackages,
}: SubscriptionsContentProps) {
  const today = new Date()
  const daysLeft = activeGymMembership
    ? differenceInDays(new Date(activeGymMembership.end_date), today)
    : 0
  const totalDays = activeGymMembership
    ? differenceInDays(new Date(activeGymMembership.end_date), new Date(activeGymMembership.start_date))
    : 1

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
          <div className="relative">
            <span className="text-xs text-champagne-400 uppercase tracking-[0.25em] font-medium mb-3 block">
              Subscriptions
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground/95 mb-2">
              Your <span className="text-gradient italic">Memberships</span>
            </h1>
            <p className="text-noir-300 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-champagne-500" />
              Track your gym access and PT packages
            </p>
          </div>
        </div>
      </motion.div>

      {/* Active Gym Membership */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-champagne-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground/90">Gym Membership</h2>
                <p className="text-xs text-noir-400">Your current gym access status</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            {activeGymMembership ? (
              <div className="glass-champagne rounded-xl p-5 glow-champagne">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                    <h3 className="text-xl font-display font-medium capitalize text-foreground/95">
                      {activeGymMembership.type} Membership
                    </h3>
                    <p className="text-sm text-noir-400 mt-1">
                      Valid until {format(new Date(activeGymMembership.end_date), 'MMMM d, yyyy')}
                    </p>
                    <div className="mt-4 pt-4 border-t border-champagne-500/10">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-noir-500 text-xs uppercase tracking-wider mb-1">Start Date</p>
                          <p className="text-foreground/80 font-medium">{format(new Date(activeGymMembership.start_date), 'MMM d, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-noir-500 text-xs uppercase tracking-wider mb-1">End Date</p>
                          <p className="text-foreground/80 font-medium">{format(new Date(activeGymMembership.end_date), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <CircularProgress
                      value={daysLeft}
                      max={totalDays}
                      size={90}
                      strokeWidth={6}
                      color={daysLeft <= 7 ? 'orange' : 'green'}
                      glowIntensity="medium"
                    />
                    <p className="text-center text-xs text-noir-400 mt-2">days remaining</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-noir-800/50 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-noir-500" />
                </div>
                <h3 className="font-medium text-foreground/80">No Active Membership</h3>
                <p className="text-sm text-noir-500 mt-1 max-w-xs mx-auto">
                  Contact the gym to purchase a membership
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Active PT Packages */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-champagne-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-champagne-500/10">
                <Dumbbell className="w-5 h-5 text-champagne-400" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground/90">PT Packages</h2>
                <p className="text-xs text-noir-400">Your personal training session packages</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            {activePTPackages.length > 0 ? (
              <div className="space-y-3">
                {activePTPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="glass-subtle rounded-xl p-4 flex items-center gap-4"
                  >
                    <Avatar className="h-14 w-14 ring-2 ring-champagne-500/20">
                      <AvatarImage src={pkg.coach.profile_photo_url || undefined} />
                      <AvatarFallback className="bg-champagne-500/10 text-champagne-400 font-medium">
                        {pkg.coach.name_en.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground/90 truncate">{pkg.coach.name_en}</h3>
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-noir-400 mb-2">
                        {pkg.total_sessions} session package
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <AnimatedProgress
                            value={pkg.remaining_sessions}
                            max={pkg.total_sessions}
                            color={pkg.remaining_sessions <= 3 ? 'orange' : 'gold'}
                            size="sm"
                            showPercentage={false}
                          />
                        </div>
                        <span className={`text-sm font-medium ${
                          pkg.remaining_sessions <= 3 ? 'text-amber-400' : 'text-champagne-400'
                        }`}>
                          {pkg.remaining_sessions}/{pkg.total_sessions}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-noir-800/50 flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-8 w-8 text-noir-500" />
                </div>
                <h3 className="font-medium text-foreground/80">No Active PT Packages</h3>
                <p className="text-sm text-noir-500 mt-1 max-w-xs mx-auto">
                  Contact your coach to purchase a PT package
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* History */}
      {(expiredGymMemberships.length > 0 || completedPTPackages.length > 0) && (
        <motion.div variants={itemVariants}>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-champagne-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-noir-700">
                  <Calendar className="w-5 h-5 text-noir-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground/90">History</h2>
                  <p className="text-xs text-noir-400">Past memberships and completed packages</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-2">
              {expiredGymMemberships.map((membership) => (
                <motion.div
                  key={membership.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-noir-800/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-noir-700">
                      <CreditCard className="h-4 w-4 text-noir-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground/70 capitalize">{membership.type} Membership</p>
                      <p className="text-xs text-noir-500">
                        {format(new Date(membership.start_date), 'MMM d')} - {format(new Date(membership.end_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-noir-700 text-noir-300 capitalize">
                    {membership.status}
                  </span>
                </motion.div>
              ))}
              {completedPTPackages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-noir-800/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-noir-700">
                      <Dumbbell className="h-4 w-4 text-noir-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground/70">{pkg.total_sessions} Sessions with {pkg.coach.name_en}</p>
                      <p className="text-xs text-noir-500">PT Package</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-noir-700 text-noir-300 capitalize">
                    {pkg.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
