'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  CreditCard,
  Edit,
  Trash2,
  Plus,
  Clock,
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { MemberForm } from './member-form'
import { deleteMember } from '@/lib/actions/members'
import type { Member, GymMembership, PTPackage, Booking, Coach } from '@/types/database'

interface MemberDetailProps {
  member: Member & { coach: Coach | null }
  gymMemberships: GymMembership[]
  ptPackages: (PTPackage & { coach: Coach })[]
  bookings: (Booking & { coach: Coach })[]
  coaches: Coach[]
}

export function MemberDetail({
  member,
  gymMemberships,
  ptPackages,
  bookings,
  coaches,
}: MemberDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteMember(member.id)
  }

  const activeMembership = gymMemberships.find((m) => m.status === 'active')
  const activePTPackage = ptPackages.find((p) => p.status === 'active')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/coach/members">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel Edit' : 'Edit'}
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Member</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {member.name_en}? This action cannot be undone and will remove all their data including subscriptions and bookings.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Member'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isEditing ? (
        <MemberForm coaches={coaches} member={member} isEdit />
      ) : (
        <>
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={member.profile_photo_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {member.name_en.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold">{member.name_en}</h2>
                    <p className="text-lg text-muted-foreground">{member.name_ar}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {member.email}
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {member.phone}
                      </div>
                    )}
                    {member.whatsapp_number && (
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        {member.whatsapp_number}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeMembership && (
                      <Badge variant="default">
                        Gym: {activeMembership.type}
                      </Badge>
                    )}
                    {activePTPackage && (
                      <Badge variant="secondary">
                        PT: {activePTPackage.remaining_sessions} sessions left
                      </Badge>
                    )}
                    {!activeMembership && !activePTPackage && (
                      <Badge variant="destructive">No Active Subscriptions</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="subscriptions">
            <TabsList>
              <TabsTrigger value="subscriptions">
                <CreditCard className="h-4 w-4 mr-2" />
                Subscriptions
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subscriptions" className="space-y-4 mt-4">
              {/* Gym Memberships */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Gym Memberships</CardTitle>
                    <Link href={`/coach/subscriptions?member=${member.id}&type=gym`}>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {gymMemberships.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No gym memberships
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {gymMemberships.map((membership) => {
                        const daysLeft = differenceInDays(
                          new Date(membership.end_date),
                          new Date()
                        )
                        return (
                          <div
                            key={membership.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div>
                              <p className="font-medium capitalize">
                                {membership.type} Membership
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(membership.start_date), 'MMM d, yyyy')} -{' '}
                                {format(new Date(membership.end_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  membership.status === 'active'
                                    ? daysLeft <= 7
                                      ? 'destructive'
                                      : 'default'
                                    : 'secondary'
                                }
                              >
                                {membership.status === 'active'
                                  ? `${daysLeft} days left`
                                  : membership.status}
                              </Badge>
                              {membership.price_paid && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {membership.price_paid} JOD
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* PT Packages */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">PT Packages</CardTitle>
                    <Link href={`/coach/subscriptions?member=${member.id}&type=pt`}>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {ptPackages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No PT packages
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {ptPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">
                              {pkg.total_sessions} Sessions Package
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Coach: {pkg.coach.name_en}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                pkg.status === 'active'
                                  ? pkg.remaining_sessions <= 3
                                    ? 'destructive'
                                    : 'default'
                                  : 'secondary'
                              }
                            >
                              {pkg.status === 'active'
                                ? `${pkg.remaining_sessions}/${pkg.total_sessions} left`
                                : pkg.status}
                            </Badge>
                            {pkg.price_paid && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {pkg.price_paid} JOD
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Bookings</CardTitle>
                  <CardDescription>Last 10 bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No bookings yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {format(new Date(booking.scheduled_at), 'EEEE, MMM d, yyyy')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(booking.scheduled_at), 'h:mm a')} with{' '}
                                {booking.coach.name_en}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              booking.status === 'scheduled'
                                ? 'default'
                                : booking.status === 'completed'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
