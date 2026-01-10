'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, CheckCircle, Clock, AlertCircle, Sparkles, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/client'

interface NotificationLog {
  id: string
  member_id: string
  type: string
  channel: string
  message_content: string | null
  status: string
  sent_at: string | null
  created_at: string
  member?: {
    name_en: string
    name_ar: string
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
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

// Demo notifications for demo mode
const demoNotifications: NotificationLog[] = [
  {
    id: '1',
    member_id: 'demo-member',
    type: 'booking_reminder',
    channel: 'whatsapp',
    message_content: 'Reminder: You have a PT session tomorrow at 10:00 AM',
    status: 'sent',
    sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    member: { name_en: 'Ahmad Khalil', name_ar: 'أحمد خليل' }
  },
  {
    id: '2',
    member_id: 'demo-member-2',
    type: 'membership_expiry',
    channel: 'email',
    message_content: 'Your gym membership will expire in 7 days',
    status: 'sent',
    sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    member: { name_en: 'Sara Ahmed', name_ar: 'سارة أحمد' }
  },
  {
    id: '3',
    member_id: 'demo-member',
    type: 'booking_confirmation',
    channel: 'whatsapp',
    message_content: 'Your booking has been confirmed for Jan 15 at 3:00 PM',
    status: 'pending',
    sent_at: null,
    created_at: new Date().toISOString(),
    member: { name_en: 'Ahmad Khalil', name_ar: 'أحمد خليل' }
  },
  {
    id: '4',
    member_id: 'demo-member-3',
    type: 'pt_package_low',
    channel: 'email',
    message_content: 'You have only 2 sessions remaining in your PT package',
    status: 'sent',
    sent_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    member: { name_en: 'Omar Faisal', name_ar: 'عمر فيصل' }
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationLog[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchNotifications = async () => {
      // Check for demo mode
      const cookies = document.cookie.split(';')
      const demoCookie = cookies.find(c => c.trim().startsWith('demo_mode='))
      if (demoCookie?.includes('coach')) {
        setNotifications(demoNotifications)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('notifications_log')
        .select(`
          *,
          member:members(name_en, name_ar)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      setNotifications(data || [])
      setLoading(false)
    }

    fetchNotifications()
  }, [supabase])

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return 'bg-emerald-500/10 text-emerald-400'
      case 'email':
        return 'bg-blue-500/10 text-blue-400'
      default:
        return 'bg-champagne-500/10 text-champagne-400'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            Sent
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        )
      default:
        return (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-noir-700 text-noir-300">
            {status}
          </span>
        )
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'booking_reminder':
        return 'Booking Reminder'
      case 'booking_confirmation':
        return 'Booking Confirmation'
      case 'membership_expiry':
        return 'Membership Expiry'
      case 'pt_package_low':
        return 'PT Sessions Low'
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'booking_reminder':
        return 'text-blue-400'
      case 'booking_confirmation':
        return 'text-emerald-400'
      case 'membership_expiry':
        return 'text-amber-400'
      case 'pt_package_low':
        return 'text-red-400'
      default:
        return 'text-noir-400'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-champagne-500/20 border-t-champagne-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 pb-6"
    >
      {/* Premium Header */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl glass-champagne glow-champagne p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-champagne-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <span className="text-xs text-champagne-400 uppercase tracking-[0.25em] font-medium mb-3 block">
              Notifications
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground/95 mb-1">
              Member <span className="text-gradient italic">Communications</span>
            </h1>
            <p className="text-noir-300 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-champagne-500" />
              View sent and pending notifications
            </p>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-champagne-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Send className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground/90">Notification History</h2>
                <p className="text-xs text-noir-400">Recent notifications sent to members</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-noir-800/50 flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-noir-500" />
                </div>
                <h3 className="font-medium text-foreground/80">No Notifications Yet</h3>
                <p className="text-sm text-noir-500 mt-1 max-w-xs mx-auto">
                  Sent notifications will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="glass-subtle rounded-xl p-4 flex items-start gap-4"
                  >
                    <div className={`p-2.5 rounded-xl ${getChannelColor(notification.channel)}`}>
                      {getChannelIcon(notification.channel)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-foreground/90">
                          {notification.member?.name_en || 'Unknown'}
                        </span>
                        <span className="text-noir-600">•</span>
                        <span className={`text-xs ${getTypeColor(notification.type)}`}>
                          {getTypeLabel(notification.type)}
                        </span>
                      </div>
                      <p className="text-sm text-noir-400 mb-2 line-clamp-2">
                        {notification.message_content || 'No message content'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-noir-500">
                        <span className="flex items-center gap-1.5 capitalize">
                          {getChannelIcon(notification.channel)}
                          {notification.channel}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {notification.sent_at
                            ? formatDistanceToNow(new Date(notification.sent_at), { addSuffix: true })
                            : formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(notification.status)}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
