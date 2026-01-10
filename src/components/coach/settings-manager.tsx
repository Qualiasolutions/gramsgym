'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
import { Building2, Clock, DollarSign, Plus, Loader2, Edit, Trash2, Sparkles, CheckCircle, AlertCircle, Settings } from 'lucide-react'
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

export function SettingsManager({ gymSettings, pricing, workingHours }: SettingsManagerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false)
  const [editingPricing, setEditingPricing] = useState<Pricing | null>(null)
  const [activeTab, setActiveTab] = useState<'gym' | 'pricing' | 'hours'>('gym')

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
      setTimeout(() => setSuccess(null), 3000)
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
      setTimeout(() => setSuccess(null), 3000)
    }
    setLoading(false)
  }

  const getWorkingHoursForDay = (day: number) => {
    return workingHours.find((h) => h.day_of_week === day)
  }

  const gymMemberships = pricing.filter((p) => p.type === 'gym_membership')
  const ptPackages = pricing.filter((p) => p.type === 'pt_package')

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

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-champagne-500/20">
              <Settings className="w-5 h-5 text-champagne-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-medium">
              <span className="text-gradient italic">Settings</span>
            </h1>
          </div>
          <p className="text-noir-400 text-sm md:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-champagne-500" />
            Manage gym information, pricing, and working hours
          </p>
        </div>
      </motion.div>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-subtle rounded-xl p-4 flex items-center gap-3 border border-red-500/20"
          >
            <div className="p-1.5 rounded-lg bg-red-500/10">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-subtle rounded-xl p-4 flex items-center gap-3 border border-emerald-500/20"
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm text-emerald-400">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

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
            <Building2 className="w-4 h-4" />
            Gym Info
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'pricing'
                ? 'bg-champagne-500/20 text-champagne-400 shadow-lg shadow-champagne-500/10'
                : 'text-noir-400 hover:text-noir-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Pricing
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'hours'
                ? 'bg-champagne-500/20 text-champagne-400 shadow-lg shadow-champagne-500/10'
                : 'text-noir-400 hover:text-noir-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Working Hours
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Gym Info Tab */}
          {activeTab === 'gym' && (
            <motion.div
              key="gym"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-champagne-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground/90">Gym Information</h2>
                    <p className="text-xs text-noir-400">Basic information displayed on the website</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <form onSubmit={handleGymSettingsSubmit} className="space-y-5">
                  <input type="hidden" name="id" value={gymSettings?.id || ''} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-noir-400 uppercase tracking-wider">Gym Name (English)</Label>
                      <Input
                        name="name_en"
                        defaultValue={gymSettings?.name_en || ''}
                        required
                        className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-noir-400 uppercase tracking-wider">Gym Name (Arabic)</Label>
                      <Input
                        name="name_ar"
                        defaultValue={gymSettings?.name_ar || ''}
                        dir="rtl"
                        required
                        className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-noir-400 uppercase tracking-wider">Description (English)</Label>
                      <Textarea
                        name="description_en"
                        defaultValue={gymSettings?.description_en || ''}
                        rows={3}
                        className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-noir-400 uppercase tracking-wider">Description (Arabic)</Label>
                      <Textarea
                        name="description_ar"
                        defaultValue={gymSettings?.description_ar || ''}
                        dir="rtl"
                        rows={3}
                        className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-noir-400 uppercase tracking-wider">Address (English)</Label>
                      <Input
                        name="address_en"
                        defaultValue={gymSettings?.address_en || ''}
                        className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-noir-400 uppercase tracking-wider">Address (Arabic)</Label>
                      <Input
                        name="address_ar"
                        defaultValue={gymSettings?.address_ar || ''}
                        dir="rtl"
                        className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-noir-400 uppercase tracking-wider">Phone</Label>
                      <Input
                        name="phone"
                        type="tel"
                        defaultValue={gymSettings?.phone || ''}
                        className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-noir-400 uppercase tracking-wider">Email</Label>
                      <Input
                        name="email"
                        type="email"
                        defaultValue={gymSettings?.email || ''}
                        className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-noir-400 uppercase tracking-wider">Instagram</Label>
                      <Input
                        name="instagram"
                        placeholder="@gramsgym"
                        defaultValue={gymSettings?.instagram || ''}
                        className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-noir-400 uppercase tracking-wider">WhatsApp</Label>
                      <Input
                        name="whatsapp"
                        placeholder="+962..."
                        defaultValue={gymSettings?.whatsapp || ''}
                        className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn-premium px-8 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-end">
                <Dialog open={pricingDialogOpen} onOpenChange={(open) => {
                  setPricingDialogOpen(open)
                  if (!open) setEditingPricing(null)
                }}>
                  <DialogTrigger asChild>
                    <motion.button
                      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(201, 169, 108, 0.35)' }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-premium px-4 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Pricing
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent className="glass border-noir-700 sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-gradient">
                        {editingPricing ? 'Edit Pricing' : 'Add New Pricing'}
                      </DialogTitle>
                      <DialogDescription className="text-noir-400">
                        {editingPricing ? 'Update pricing details' : 'Create a new pricing option'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePricingSubmit} className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-noir-300">Name (English)</Label>
                          <Input
                            name="name_en"
                            defaultValue={editingPricing?.name_en || ''}
                            required
                            className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-noir-300">Name (Arabic)</Label>
                          <Input
                            name="name_ar"
                            defaultValue={editingPricing?.name_ar || ''}
                            dir="rtl"
                            required
                            className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-noir-300">Type</Label>
                        <Select name="type" defaultValue={editingPricing?.type || 'gym_membership'}>
                          <SelectTrigger className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-noir-900 border-noir-700">
                            <SelectItem value="gym_membership">Gym Membership</SelectItem>
                            <SelectItem value="pt_package">PT Package</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-noir-300">Duration/Sessions</Label>
                        <Input
                          name="duration_or_sessions"
                          placeholder="e.g., 1 month, 10 sessions"
                          defaultValue={editingPricing?.duration_or_sessions || ''}
                          className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-noir-300">Price (JOD)</Label>
                        <Input
                          name="price"
                          type="number"
                          step="0.01"
                          defaultValue={editingPricing?.price || ''}
                          required
                          className="bg-noir-900/50 border-noir-700 focus:border-champagne-500/50"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          name="is_active"
                          defaultChecked={editingPricing?.is_active ?? true}
                        />
                        <Label htmlFor="is_active" className="text-noir-300">Active</Label>
                      </div>

                      {error && <p className="text-sm text-red-400">{error}</p>}

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-premium w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                          editingPricing ? 'Update Pricing' : 'Create Pricing'
                        )}
                      </motion.button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Gym Memberships */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-champagne-500/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-champagne-500/10">
                      <DollarSign className="w-5 h-5 text-champagne-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground/90">Gym Memberships</h2>
                      <p className="text-xs text-noir-400">Monthly, quarterly, and yearly membership options</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-noir-800">
                        <th className="text-left py-4 px-5 text-xs font-medium text-champagne-500 uppercase tracking-wider">Name</th>
                        <th className="text-left py-4 px-5 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden sm:table-cell">Duration</th>
                        <th className="text-left py-4 px-5 text-xs font-medium text-champagne-500 uppercase tracking-wider">Price</th>
                        <th className="text-left py-4 px-5 text-xs font-medium text-champagne-500 uppercase tracking-wider">Status</th>
                        <th className="text-right py-4 px-5 text-xs font-medium text-champagne-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gymMemberships.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-noir-500">
                            No gym membership pricing configured
                          </td>
                        </tr>
                      ) : (
                        gymMemberships.map((item, i) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="border-b border-noir-800/50 hover:bg-champagne-500/5 transition-colors"
                          >
                            <td className="py-4 px-5 font-medium">{item.name_en}</td>
                            <td className="py-4 px-5 text-noir-400 hidden sm:table-cell">{item.duration_or_sessions || '—'}</td>
                            <td className="py-4 px-5 text-champagne-400 font-medium">{item.price} JOD</td>
                            <td className="py-4 px-5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                item.is_active
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-noir-700 text-noir-400 border-noir-600'
                              }`}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-4 px-5">
                              <div className="flex justify-end gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setEditingPricing(item)
                                    setPricingDialogOpen(true)
                                  }}
                                  className="p-2 rounded-lg bg-noir-800 hover:bg-noir-700 transition-colors"
                                >
                                  <Edit className="h-4 w-4 text-noir-400" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeletePricing(item.id)}
                                  className="p-2 rounded-lg bg-noir-800 hover:bg-red-500/20 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4 text-noir-400 hover:text-red-400" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PT Packages */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-champagne-500/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground/90">PT Packages</h2>
                      <p className="text-xs text-noir-400">Personal training session packages</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-noir-800">
                        <th className="text-left py-4 px-5 text-xs font-medium text-champagne-500 uppercase tracking-wider">Name</th>
                        <th className="text-left py-4 px-5 text-xs font-medium text-champagne-500 uppercase tracking-wider hidden sm:table-cell">Sessions</th>
                        <th className="text-left py-4 px-5 text-xs font-medium text-champagne-500 uppercase tracking-wider">Price</th>
                        <th className="text-left py-4 px-5 text-xs font-medium text-champagne-500 uppercase tracking-wider">Status</th>
                        <th className="text-right py-4 px-5 text-xs font-medium text-champagne-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ptPackages.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-noir-500">
                            No PT package pricing configured
                          </td>
                        </tr>
                      ) : (
                        ptPackages.map((item, i) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="border-b border-noir-800/50 hover:bg-champagne-500/5 transition-colors"
                          >
                            <td className="py-4 px-5 font-medium">{item.name_en}</td>
                            <td className="py-4 px-5 text-noir-400 hidden sm:table-cell">{item.duration_or_sessions || '—'}</td>
                            <td className="py-4 px-5 text-champagne-400 font-medium">{item.price} JOD</td>
                            <td className="py-4 px-5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                item.is_active
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-noir-700 text-noir-400 border-noir-600'
                              }`}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-4 px-5">
                              <div className="flex justify-end gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setEditingPricing(item)
                                    setPricingDialogOpen(true)
                                  }}
                                  className="p-2 rounded-lg bg-noir-800 hover:bg-noir-700 transition-colors"
                                >
                                  <Edit className="h-4 w-4 text-noir-400" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeletePricing(item.id)}
                                  className="p-2 rounded-lg bg-noir-800 hover:bg-red-500/20 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4 text-noir-400 hover:text-red-400" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Working Hours Tab */}
          {activeTab === 'hours' && (
            <motion.div
              key="hours"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-champagne-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground/90">Gym Working Hours</h2>
                    <p className="text-xs text-noir-400">Set opening and closing times for each day</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <form onSubmit={handleWorkingHoursSubmit} className="space-y-4">
                  {DAYS.map((day, i) => {
                    const hours = getWorkingHoursForDay(day.value)
                    return (
                      <motion.div
                        key={day.value}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-subtle rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-24 font-medium text-foreground/90">{day.label}</div>

                          <input type="hidden" name={`day_${day.value}_id`} value={hours?.id || ''} />

                          <div className="flex items-center gap-2">
                            <Switch
                              id={`day_${day.value}_open`}
                              name={`day_${day.value}_open`}
                              defaultChecked={!hours?.is_closed}
                            />
                            <Label htmlFor={`day_${day.value}_open`} className="text-sm text-noir-400">
                              Open
                            </Label>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                          <Select
                            name={`day_${day.value}_open_time`}
                            defaultValue={hours?.open_time || '06:00'}
                          >
                            <SelectTrigger className="w-[100px] bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-noir-900 border-noir-700 max-h-[200px]">
                              {TIME_SLOTS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <span className="text-noir-500">to</span>

                          <Select
                            name={`day_${day.value}_close_time`}
                            defaultValue={hours?.close_time || '22:00'}
                          >
                            <SelectTrigger className="w-[100px] bg-noir-900/50 border-noir-700 focus:border-champagne-500/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-noir-900 border-noir-700 max-h-[200px]">
                              {TIME_SLOTS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    )
                  })}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn-premium px-8 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Working Hours</span>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
