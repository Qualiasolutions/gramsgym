'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreditCard, Dumbbell, Plus, Loader2 } from 'lucide-react'
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

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-3">
        <Dialog open={gymDialogOpen} onOpenChange={setGymDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Gym Membership
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gym Membership</DialogTitle>
              <DialogDescription>
                Create a new gym membership for a member
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleGymSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Member</Label>
                <Select name="member_id" defaultValue={defaultMemberId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name_en} ({member.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Membership Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly (1 month)</SelectItem>
                    <SelectItem value="quarterly">Quarterly (3 months)</SelectItem>
                    <SelectItem value="yearly">Yearly (12 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="start_date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Price (JOD)</Label>
                <Input
                  type="number"
                  name="price_paid"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Membership'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={ptDialogOpen} onOpenChange={setPtDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add PT Package
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add PT Package</DialogTitle>
              <DialogDescription>
                Create a new personal training package
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePTSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Member</Label>
                <Select name="member_id" defaultValue={defaultMemberId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name_en} ({member.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Coach</Label>
                <Select name="coach_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coach" />
                  </SelectTrigger>
                  <SelectContent>
                    {coaches.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>
                        {coach.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Number of Sessions</Label>
                <Select name="total_sessions" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Sessions</SelectItem>
                    <SelectItem value="10">10 Sessions</SelectItem>
                    <SelectItem value="20">20 Sessions</SelectItem>
                    <SelectItem value="30">30 Sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price (JOD)</Label>
                <Input
                  type="number"
                  name="price_paid"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Package'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="gym">
        <TabsList>
          <TabsTrigger value="gym">
            <CreditCard className="h-4 w-4 mr-2" />
            Gym Memberships ({activeMemberships.length})
          </TabsTrigger>
          <TabsTrigger value="pt">
            <Dumbbell className="h-4 w-4 mr-2" />
            PT Packages ({activePT.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gym" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Gym Memberships</CardTitle>
              <CardDescription>Members with active gym access</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeMemberships.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No active memberships
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeMemberships.map((membership) => {
                      const daysLeft = differenceInDays(
                        new Date(membership.end_date),
                        new Date()
                      )
                      return (
                        <TableRow key={membership.id}>
                          <TableCell>{membership.member.name_en}</TableCell>
                          <TableCell className="capitalize">{membership.type}</TableCell>
                          <TableCell>
                            {format(new Date(membership.start_date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            {format(new Date(membership.end_date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={daysLeft <= 7 ? 'destructive' : 'default'}>
                              {daysLeft} days left
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {membership.price_paid ? `${membership.price_paid} JOD` : '—'}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pt" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active PT Packages</CardTitle>
              <CardDescription>Personal training packages with remaining sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Coach</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activePT.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No active PT packages
                      </TableCell>
                    </TableRow>
                  ) : (
                    activePT.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell>{pkg.member.name_en}</TableCell>
                        <TableCell>{pkg.coach.name_en}</TableCell>
                        <TableCell>
                          {pkg.remaining_sessions} / {pkg.total_sessions}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={pkg.remaining_sessions <= 3 ? 'destructive' : 'default'}
                          >
                            {pkg.remaining_sessions <= 3 ? 'Low' : 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {pkg.price_paid ? `${pkg.price_paid} JOD` : '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
