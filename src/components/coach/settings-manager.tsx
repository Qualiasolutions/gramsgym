'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
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
import { Building2, Clock, DollarSign, Plus, Loader2, Edit, Trash2 } from 'lucide-react'
import {
  updateGymSettings,
  createPricing,
  updatePricing,
  deletePricing,
  updateWorkingHours,
} from '@/lib/actions/settings'

interface GymSettings {
  id: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  address_en: string | null
  address_ar: string | null
  phone: string | null
  email: string | null
  instagram: string | null
  whatsapp: string | null
}

interface Pricing {
  id: string
  name_en: string
  name_ar: string
  type: string
  duration_or_sessions: string | null
  price: number
  is_active: boolean
}

interface WorkingHours {
  id: string
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

interface SettingsManagerProps {
  gymSettings: GymSettings | null
  pricing: Pricing[]
  workingHours: WorkingHours[]
}

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = (i % 2) * 30
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
})

export function SettingsManager({ gymSettings, pricing, workingHours }: SettingsManagerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false)
  const [editingPricing, setEditingPricing] = useState<Pricing | null>(null)

  const handleGymSettingsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateGymSettings(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Gym settings updated successfully')
    }
    setLoading(false)
  }

  const handlePricingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = editingPricing
      ? await updatePricing(editingPricing.id, formData)
      : await createPricing(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setPricingDialogOpen(false)
      setEditingPricing(null)
    }
    setLoading(false)
  }

  const handleDeletePricing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing?')) return

    setLoading(true)
    const result = await deletePricing(id)
    if (result.error) {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleWorkingHoursSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateWorkingHours(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Working hours updated successfully')
    }
    setLoading(false)
  }

  const getWorkingHoursForDay = (day: number) => {
    return workingHours.find((h) => h.day_of_week === day)
  }

  const gymMemberships = pricing.filter((p) => p.type === 'gym_membership')
  const ptPackages = pricing.filter((p) => p.type === 'pt_package')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage gym information, pricing, and working hours</p>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 text-green-500 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <Tabs defaultValue="gym">
        <TabsList>
          <TabsTrigger value="gym">
            <Building2 className="h-4 w-4 mr-2" />
            Gym Info
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <DollarSign className="h-4 w-4 mr-2" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="hours">
            <Clock className="h-4 w-4 mr-2" />
            Working Hours
          </TabsTrigger>
        </TabsList>

        {/* Gym Info Tab */}
        <TabsContent value="gym" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gym Information</CardTitle>
              <CardDescription>
                Basic information about your gym displayed on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGymSettingsSubmit} className="space-y-4">
                <input type="hidden" name="id" value={gymSettings?.id || ''} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gym Name (English)</Label>
                    <Input
                      name="name_en"
                      defaultValue={gymSettings?.name_en || ''}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gym Name (Arabic)</Label>
                    <Input
                      name="name_ar"
                      defaultValue={gymSettings?.name_ar || ''}
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Description (English)</Label>
                    <Textarea
                      name="description_en"
                      defaultValue={gymSettings?.description_en || ''}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Arabic)</Label>
                    <Textarea
                      name="description_ar"
                      defaultValue={gymSettings?.description_ar || ''}
                      dir="rtl"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Address (English)</Label>
                    <Input
                      name="address_en"
                      defaultValue={gymSettings?.address_en || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address (Arabic)</Label>
                    <Input
                      name="address_ar"
                      defaultValue={gymSettings?.address_ar || ''}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      name="phone"
                      type="tel"
                      defaultValue={gymSettings?.phone || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      name="email"
                      type="email"
                      defaultValue={gymSettings?.email || ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      name="instagram"
                      placeholder="@gramsgym"
                      defaultValue={gymSettings?.instagram || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input
                      name="whatsapp"
                      placeholder="+962..."
                      defaultValue={gymSettings?.whatsapp || ''}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Dialog open={pricingDialogOpen} onOpenChange={(open) => {
              setPricingDialogOpen(open)
              if (!open) setEditingPricing(null)
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pricing
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingPricing ? 'Edit Pricing' : 'Add New Pricing'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPricing ? 'Update pricing details' : 'Create a new pricing option'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePricingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name (English)</Label>
                      <Input
                        name="name_en"
                        defaultValue={editingPricing?.name_en || ''}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Name (Arabic)</Label>
                      <Input
                        name="name_ar"
                        defaultValue={editingPricing?.name_ar || ''}
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select name="type" defaultValue={editingPricing?.type || 'gym_membership'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gym_membership">Gym Membership</SelectItem>
                        <SelectItem value="pt_package">PT Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Duration/Sessions</Label>
                    <Input
                      name="duration_or_sessions"
                      placeholder="e.g., 1 month, 10 sessions"
                      defaultValue={editingPricing?.duration_or_sessions || ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price (JOD)</Label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingPricing?.price || ''}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      name="is_active"
                      defaultChecked={editingPricing?.is_active ?? true}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      editingPricing ? 'Update Pricing' : 'Create Pricing'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Gym Memberships */}
          <Card>
            <CardHeader>
              <CardTitle>Gym Memberships</CardTitle>
              <CardDescription>Monthly, quarterly, and yearly membership options</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gymMemberships.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No gym membership pricing configured
                      </TableCell>
                    </TableRow>
                  ) : (
                    gymMemberships.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name_en}</TableCell>
                        <TableCell>{item.duration_or_sessions || '—'}</TableCell>
                        <TableCell>{item.price} JOD</TableCell>
                        <TableCell>
                          <Badge variant={item.is_active ? 'default' : 'secondary'}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingPricing(item)
                                setPricingDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePricing(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* PT Packages */}
          <Card>
            <CardHeader>
              <CardTitle>PT Packages</CardTitle>
              <CardDescription>Personal training session packages</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ptPackages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No PT package pricing configured
                      </TableCell>
                    </TableRow>
                  ) : (
                    ptPackages.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name_en}</TableCell>
                        <TableCell>{item.duration_or_sessions || '—'}</TableCell>
                        <TableCell>{item.price} JOD</TableCell>
                        <TableCell>
                          <Badge variant={item.is_active ? 'default' : 'secondary'}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingPricing(item)
                                setPricingDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePricing(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours Tab */}
        <TabsContent value="hours" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gym Working Hours</CardTitle>
              <CardDescription>
                Set the opening and closing times for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWorkingHoursSubmit} className="space-y-4">
                {DAYS.map((day) => {
                  const hours = getWorkingHoursForDay(day.value)
                  return (
                    <div
                      key={day.value}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-28 font-medium">{day.label}</div>

                        <input type="hidden" name={`day_${day.value}_id`} value={hours?.id || ''} />

                        <div className="flex items-center gap-2">
                          <Switch
                            id={`day_${day.value}_open`}
                            name={`day_${day.value}_open`}
                            defaultChecked={!hours?.is_closed}
                          />
                          <Label htmlFor={`day_${day.value}_open`} className="text-sm">
                            Open
                          </Label>
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                          <Select
                            name={`day_${day.value}_open_time`}
                            defaultValue={hours?.open_time || '06:00'}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <span className="text-muted-foreground">to</span>

                          <Select
                            name={`day_${day.value}_close_time`}
                            defaultValue={hours?.close_time || '22:00'}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )
                })}

                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Working Hours
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
