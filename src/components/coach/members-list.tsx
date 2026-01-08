'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, ChevronRight, Mail, Phone } from 'lucide-react'
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

export function MembersList({ members, coaches }: MembersListProps) {
  const [search, setSearch] = useState('')
  const [coachFilter, setCoachFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Search filter
      const searchLower = search.toLowerCase()
      const matchesSearch =
        search === '' ||
        member.name_en.toLowerCase().includes(searchLower) ||
        member.name_ar.includes(search) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.phone?.includes(search)

      // Coach filter
      const matchesCoach =
        coachFilter === 'all' || member.assigned_coach_id === coachFilter

      // Status filter (based on active memberships)
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
      return { label: 'Gym + PT', variant: 'default' as const }
    } else if (hasActiveMembership) {
      return { label: 'Gym', variant: 'secondary' as const }
    } else if (hasActivePT) {
      return { label: 'PT Only', variant: 'outline' as const }
    }
    return { label: 'Expired', variant: 'destructive' as const }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={coachFilter} onValueChange={setCoachFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by coach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Coaches</SelectItem>
                  {coaches.map((coach) => (
                    <SelectItem key={coach.id} value={coach.id}>
                      {coach.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredMembers.length} of {members.length} members
      </p>

      {/* Members Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No members found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => {
                const status = getMemberStatus(member)
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.profile_photo_url || undefined} />
                          <AvatarFallback>
                            {member.name_en.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name_en}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.name_ar}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.coach?.name_en || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(member.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Link href={`/coach/members/${member.id}`}>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
