'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, User, CheckCircle, AlertCircle, Mail, Phone, Globe, Bell, Sparkles } from 'lucide-react'
import { updateMemberProfile } from '@/lib/actions/member-profile'

interface Member {
  id: string
  email: string
  name_en: string
  name_ar: string
  phone: string | null
  whatsapp_number: string | null
  profile_photo_url: string | null
  preferred_language: 'ar' | 'en'
  notification_preference: 'whatsapp' | 'email' | 'both'
}

interface MemberProfileFormProps {
  member: Member
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

export function MemberProfileForm({ member }: MemberProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const result = await updateMemberProfile(member.id, formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

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
          <div className="relative flex items-center gap-5">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-2 ring-champagne-500/30 shadow-lg">
                <AvatarImage src={member.profile_photo_url || undefined} />
                <AvatarFallback className="bg-champagne-500/10 text-champagne-400">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-noir-900 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xs text-champagne-400 uppercase tracking-[0.25em] font-medium mb-1 block">
                Profile
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground/95">
                {member.name_en}
              </h1>
              <p className="text-noir-400 text-sm flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-champagne-500" />
                Manage your personal information
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Email Section */}
            <div className="p-5 border-b border-champagne-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-medium text-foreground/90 text-sm">Email Address</h2>
                  <p className="text-xs text-noir-500">Your login email (contact support to change)</p>
                </div>
              </div>
              <Input
                type="email"
                value={member.email}
                disabled
                className="bg-noir-800/50 border-noir-700 text-noir-400"
              />
            </div>

            {/* Name Section */}
            <div className="p-5 border-b border-champagne-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-champagne-500/10">
                  <User className="w-4 h-4 text-champagne-400" />
                </div>
                <div>
                  <h2 className="font-medium text-foreground/90 text-sm">Your Name</h2>
                  <p className="text-xs text-noir-500">How you appear in the system</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_en" className="text-xs text-noir-400 uppercase tracking-wider">English</Label>
                  <Input
                    id="name_en"
                    name="name_en"
                    defaultValue={member.name_en}
                    required
                    className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_ar" className="text-xs text-noir-400 uppercase tracking-wider">Arabic</Label>
                  <Input
                    id="name_ar"
                    name="name_ar"
                    defaultValue={member.name_ar}
                    dir="rtl"
                    required
                    className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Phone Section */}
            <div className="p-5 border-b border-champagne-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-medium text-foreground/90 text-sm">Contact Numbers</h2>
                  <p className="text-xs text-noir-500">For notifications and communication</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs text-noir-400 uppercase tracking-wider">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={member.phone || ''}
                    placeholder="+962..."
                    className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number" className="text-xs text-noir-400 uppercase tracking-wider">WhatsApp</Label>
                  <Input
                    id="whatsapp_number"
                    name="whatsapp_number"
                    type="tel"
                    defaultValue={member.whatsapp_number || ''}
                    placeholder="+962..."
                    className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50 focus:ring-champagne-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="p-5 border-b border-champagne-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h2 className="font-medium text-foreground/90 text-sm">Preferences</h2>
                  <p className="text-xs text-noir-500">Language and notification settings</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-noir-400 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    Language
                  </Label>
                  <Select name="preferred_language" defaultValue={member.preferred_language}>
                    <SelectTrigger className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-noir-900 border-noir-700">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-noir-400 uppercase tracking-wider flex items-center gap-2">
                    <Bell className="w-3 h-3" />
                    Notifications
                  </Label>
                  <Select name="notification_preference" defaultValue={member.notification_preference}>
                    <SelectTrigger className="bg-noir-800/30 border-noir-700 focus:border-champagne-500/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-noir-900 border-noir-700">
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mx-5 mt-5"
                >
                  <div className="glass-subtle rounded-xl p-4 flex items-center gap-3 border border-red-500/20">
                    <div className="p-1.5 rounded-lg bg-red-500/10">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mx-5 mt-5"
                >
                  <div className="glass-subtle rounded-xl p-4 flex items-center gap-3 border border-emerald-500/20">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-sm text-emerald-400">Profile updated successfully!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="p-5">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="btn-premium w-full sm:w-auto px-8 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}
