'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MembersList } from '@/components/coach/members-list'
import { MemberImport } from '@/components/coach/member-import'
import { ExpiryReminderButton } from '@/components/coach/expiry-reminder-button'
import { StatCard } from '@/components/ui/stat-card'
import { UserPlus, Users, UserCheck, UserX, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { demoMembers, demoCoach } from '@/lib/demo-data'
import Cookies from 'js-cookie'

interface Member {
  id: string
  name_en: string
  name_ar: string
  email: string
  phone: string | null
  whatsapp_number: string | null
  profile_photo_url: string | null
  assigned_coach_id: string | null
  created_at: string
  coach: { id: string; name_en: string; name_ar: string } | null
  gym_memberships: { id: string; type: string; status: string; end_date: string }[]
  pt_packages: { id: string; remaining_sessions: number; status: string; coach: { id: string; name_en: string } }[]
}

interface Coach {
  id: string
  name_en: string
  name_ar: string
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
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const demoMode = Cookies.get('demo_mode')

      if (demoMode === 'coach') {
        setMembers(demoMembers as Member[])
        setCoaches([demoCoach])
        setIsLoading(false)
        return
      }

      // Fetch real data
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()

        const [membersRes, coachesRes] = await Promise.all([
          supabase
            .from('members')
            .select(`
              *,
              coach:coaches!members_assigned_coach_id_fkey(id, name_en, name_ar),
              gym_memberships(id, type, status, end_date),
              pt_packages(id, remaining_sessions, status, coach:coaches(id, name_en))
            `)
            .order('created_at', { ascending: false }),
          supabase
            .from('coaches')
            .select('id, name_en, name_ar')
        ])

        if (membersRes.data) setMembers(membersRes.data as Member[])
        if (coachesRes.data) setCoaches(coachesRes.data)
      } catch (error) {
        console.error('Error loading members:', error)
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  // Calculate stats
  const totalMembers = members.length
  const activeMembers = members.filter(m =>
    m.gym_memberships.some(gm => gm.status === 'active') ||
    m.pt_packages.some(pt => pt.status === 'active')
  ).length
  const expiredMembers = totalMembers - activeMembers

  // Members with expiring subscriptions (within 7 days)
  const expiringMembers = members.filter(m => {
    const activeGym = m.gym_memberships.find(gm => gm.status === 'active')
    if (!activeGym) return false
    const endDate = new Date(activeGym.end_date)
    const daysUntilExpiry = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }).length

  // New this month
  const newThisMonth = members.filter(m => {
    const createdDate = new Date(m.created_at)
    const now = new Date()
    return createdDate.getMonth() === now.getMonth() &&
           createdDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <motion.div
      className="space-y-6 md:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Premium Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl glass-champagne glow-champagne p-6 md:p-8">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-champagne-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-medium mb-2">
              <span className="text-gradient italic">Members</span>
            </h1>
            <p className="text-noir-400 text-sm md:text-base">
              Manage your gym members and their subscriptions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <ExpiryReminderButton />
            <MemberImport coaches={coaches || []} />
            <Link href="/coach/members/new">
              <motion.button
                whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(201, 169, 108, 0.35)' }}
                whileTap={{ scale: 0.98 }}
                className="btn-premium px-4 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </motion.button>
            </Link>
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
          delay={0}
        />
        <StatCard
          label="Active"
          value={activeMembers}
          icon={UserCheck}
          color="green"
          trend={{ value: newThisMonth, isPositive: true }}
          delay={0.1}
        />
        <StatCard
          label="Expired"
          value={expiredMembers}
          icon={UserX}
          color="red"
          delay={0.2}
        />
        <StatCard
          label="Expiring Soon"
          value={expiringMembers}
          icon={AlertTriangle}
          color="orange"
          delay={0.3}
        />
      </motion.div>

      {/* Members List */}
      <motion.div variants={itemVariants}>
        {isLoading ? (
          <div className="card-glass rounded-2xl p-12 text-center">
            <div className="w-8 h-8 border-2 border-champagne-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-noir-400">Loading members...</p>
          </div>
        ) : (
          <MembersList members={members || []} coaches={coaches || []} />
        )}
      </motion.div>
    </motion.div>
  )
}
