'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, ChevronRight, Mail, Phone, Grid, List } from 'lucide-react'
import { format } from 'date-fns'

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

interface MembersListProps {
  members: Member[]
  coaches: Coach[]
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  })
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  })
}

export function MembersList({ members, coaches }: MembersListProps) {
  const [search, setSearch] = useState('')
  const [coachFilter, setCoachFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        search === '' ||
        member.name_en.toLowerCase().includes(searchLower) ||
        member.name_ar.includes(search) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.phone?.includes(search)

      const matchesCoach =
        coachFilter === 'all' || member.assigned_coach_id === coachFilter

      let matchesStatus = true
      if (statusFilter !== 'all') {
        const hasActiveMembership = member.gym_memberships.some(
          (m) => m.status === 'active'
        )
        const hasActivePT = member.pt_packages.some((p) => p.status === 'active')

        if (statusFilter === 'active') {
          matchesStatus = hasActiveMembership || hasActivePT
        } else if (statusFilter === 'expired') {
          matchesStatus = !hasActiveMembership && !hasActivePT
        }
      }

      return matchesSearch && matchesCoach && matchesStatus
    })
  }, [members, search, coachFilter, statusFilter])

  const getMemberStatus = (member: Member) => {
    const hasActiveMembership = member.gym_memberships.some(
      (m) => m.status === 'active'
    )
    const hasActivePT = member.pt_packages.some((p) => p.status === 'active')

    if (hasActiveMembership && hasActivePT) {
      return { label: 'Gym + PT', color: 'bg-champagne-500/20 text-champagne-400 border-champagne-500/30' }
    } else if (hasActiveMembership) {
      return { label: 'Gym', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
    } else if (hasActivePT) {
      return { label: 'PT Only', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
    }
    return { label: 'Expired', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
  }

  return (
    <div className="space-y-4">
      {/* Premium Filters */}
      <div className="glass-subtle rounded-2xl p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-noir-500" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 bg-noir-900/50 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20 rounded-xl h-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={coachFilter} onValueChange={setCoachFilter}>
              <SelectTrigger className="w-[160px] bg-noir-900/50 border-noir-700 rounded-xl h-11">
                <Filter className="h-4 w-4 mr-2 text-noir-500" />
                <SelectValue placeholder="Coach" />
              </SelectTrigger>
              <SelectContent className="bg-noir-900 border-noir-700">
                <SelectItem value="all">All Coaches</SelectItem>
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-noir-900/50 border-noir-700 rounded-xl h-11">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-noir-900 border-noir-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-noir-900/50 border border-noir-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-champagne-500/20 text-champagne-400' : 'text-noir-500 hover:text-noir-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-champagne-500/20 text-champagne-400' : 'text-noir-500 hover:text-noir-300'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-noir-500 px-1">
        Showing <span className="text-champagne-400 font-medium">{filteredMembers.length}</span> of {members.length} members
      </p>

      {/* Table View */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card-glass rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-noir-800">
                    <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider">Member</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden lg:table-cell">Coach</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                    <th className="w-[50px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <p className="text-noir-500">No members found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member, i) => {
                      const status = getMemberStatus(member)
                      return (
                        <motion.tr
                          key={member.id}
                          custom={i}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          className="border-b border-noir-800/50 hover:bg-champagne-500/5 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="w-10 h-10 border-2 border-noir-700 group-hover:border-champagne-500/50 transition-colors">
                                  <AvatarImage src={member.profile_photo_url || undefined} />
                                  <AvatarFallback className="bg-noir-800 text-champagne-400">
                                    {member.name_en.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-noir-900 bg-green-500" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground group-hover:text-champagne-400 transition-colors">{member.name_en}</p>
                                <p className="text-sm text-noir-500">{member.name_ar}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-noir-300">
                                <Mail className="h-3.5 w-3.5 text-noir-500" />
                                <span className="truncate max-w-[180px]">{member.email}</span>
                              </div>
                              {member.phone && (
                                <div className="flex items-center gap-2 text-sm text-noir-500">
                                  <Phone className="h-3.5 w-3.5" />
                                  {member.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 hidden lg:table-cell">
                            {member.coach?.name_en || (
                              <span className="text-noir-600">—</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-noir-500 text-sm hidden sm:table-cell">
                            {format(new Date(member.created_at), 'MMM d, yyyy')}
                          </td>
                          <td className="py-4 px-4">
                            <Link href={`/coach/members/${member.id}`}>
                              <motion.button
                                whileHover={{ x: 4 }}
                                className="p-2 rounded-lg hover:bg-champagne-500/10 text-noir-500 hover:text-champagne-400 transition-colors"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </motion.button>
                            </Link>
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
          /* Grid View */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredMembers.length === 0 ? (
              <div className="col-span-full card-glass rounded-2xl p-12 text-center">
                <p className="text-noir-500">No members found</p>
              </div>
            ) : (
              filteredMembers.map((member, i) => {
                const status = getMemberStatus(member)
                return (
                  <motion.div
                    key={member.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link href={`/coach/members/${member.id}`}>
                      <motion.div
                        whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(201, 169, 108, 0.15)' }}
                        className="card-glass rounded-2xl p-5 h-full cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="relative">
                            <Avatar className="w-14 h-14 border-2 border-noir-700 group-hover:border-champagne-500/50 transition-colors">
                              <AvatarImage src={member.profile_photo_url || undefined} />
                              <AvatarFallback className="bg-noir-800 text-champagne-400 text-lg">
                                {member.name_en.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-noir-900 bg-green-500" />
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        <h3 className="font-medium text-foreground group-hover:text-champagne-400 transition-colors mb-1">
                          {member.name_en}
                        </h3>
                        <p className="text-sm text-noir-500 mb-3">{member.name_ar}</p>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-noir-400">
                            <Mail className="h-3.5 w-3.5 text-noir-600" />
                            <span className="truncate">{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-2 text-noir-500">
                              <Phone className="h-3.5 w-3.5 text-noir-600" />
                              {member.phone}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-noir-800 flex items-center justify-between text-xs text-noir-500">
                          <span>Joined {format(new Date(member.created_at), 'MMM yyyy')}</span>
                          <ChevronRight className="h-4 w-4 group-hover:text-champagne-400 transition-colors" />
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
