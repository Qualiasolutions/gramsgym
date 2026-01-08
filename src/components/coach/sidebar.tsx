'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Coach } from '@/types/database'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  CreditCard,
  Bell,
  Settings,
  BarChart3,
  Menu,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { signOutCoach } from '@/lib/auth/actions'
import { useTranslation, translations } from '@/lib/i18n'
import { LanguageToggle } from '@/components/ui/language-toggle'

// Navigation items with colors
const navigation = [
  { nameKey: 'dashboard' as const, href: '/coach/dashboard', icon: LayoutDashboard, color: 'text-champagne-400', bgColor: 'bg-champagne-500/10' },
  { nameKey: 'members' as const, href: '/coach/members', icon: Users, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { nameKey: 'bookings' as const, href: '/coach/bookings', icon: Calendar, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  { nameKey: 'mySchedule' as const, href: '/coach/schedule', icon: Clock, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  { nameKey: 'subscriptions' as const, href: '/coach/subscriptions', icon: CreditCard, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  { nameKey: 'notifications' as const, href: '/coach/notifications', icon: Bell, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
  { nameKey: 'reports' as const, href: '/coach/reports', icon: BarChart3, color: 'text-teal-400', bgColor: 'bg-teal-500/10' },
  { nameKey: 'settings' as const, href: '/coach/settings', icon: Settings, color: 'text-zinc-400', bgColor: 'bg-zinc-500/10' },
]

interface CoachSidebarProps {
  coach: Coach
}

function SidebarContent({ coach, onClose }: CoachSidebarProps & { onClose?: () => void }) {
  const pathname = usePathname()
  const { t, language, isRTL } = useTranslation()

  return (
    <div className={`flex h-full flex-col bg-gradient-to-b from-noir-950 to-noir-900 ${isRTL ? 'text-right' : ''}`}>
      {/* Logo - Doubled size and centered */}
      <div className="flex h-24 items-center justify-center px-4 border-b border-champagne-500/20">
        <Link href="/" className="flex items-center justify-center">
          <div className="relative w-[180px] h-[64px]">
            <Image
              src="/logo.png"
              alt="Grams Gym"
              fill
              className="object-contain"
            />
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute right-4 p-2 rounded-lg hover:bg-noir-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Decorative accent */}
      <div className="h-1 bg-gradient-to-r from-champagne-500/0 via-champagne-500/50 to-champagne-500/0" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.nameKey}
              href={item.href}
              onClick={onClose}
              className="relative block"
            >
              <motion.div
                whileHover={{ x: isRTL ? -4 : 4 }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  isRTL && 'flex-row-reverse',
                  isActive
                    ? `${item.bgColor} ${item.color} border border-current/20`
                    : 'text-noir-400 hover:bg-noir-800/50 hover:text-white'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                  isActive ? item.bgColor : 'bg-noir-800/50'
                )}>
                  <item.icon className={cn('w-5 h-5', isActive ? item.color : 'text-noir-500')} />
                </div>
                <span className="flex-1">{t(translations.coach[item.nameKey])}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 w-1 h-8 rounded-full',
                      isRTL ? 'right-0' : 'left-0',
                      item.color.replace('text-', 'bg-')
                    )}
                  />
                )}
                <ChevronRight className={cn(
                  'w-4 h-4 transition-all',
                  isRTL && 'rotate-180',
                  isActive ? `opacity-100 ${item.color}` : 'opacity-0'
                )} />
              </motion.div>
            </Link>
          )
        })}

        {/* Language Toggle */}
        <div className="pt-4 border-t border-noir-800/50 mt-4">
          <LanguageToggle variant="sidebar" />
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-champagne-500/20 p-4">
        <div className="bg-gradient-to-r from-champagne-500/10 to-champagne-600/5 rounded-xl p-4 mb-3 border border-champagne-500/20">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-champagne-400 to-champagne-600 flex items-center justify-center shadow-lg shadow-champagne-500/20">
              <span className="text-noir-950 font-bold text-lg">
                {(language === 'ar' ? coach.name_ar : coach.name_en)?.charAt(0) || coach.name_en.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{language === 'ar' ? coach.name_ar || coach.name_en : coach.name_en}</p>
              <p className="text-xs text-champagne-500/70 truncate">{coach.email}</p>
            </div>
          </div>
        </div>
        <form action={signOutCoach}>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-noir-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {t(translations.nav.signOut)}
          </motion.button>
        </form>
      </div>
    </div>
  )
}

export function CoachSidebar({ coach }: CoachSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-noir-900/90 backdrop-blur-sm border border-champagne-500/20"
      >
        <Menu className="w-5 h-5 text-champagne-400" />
      </motion.button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72"
            >
              <SidebarContent coach={coach} onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r border-champagne-500/10">
        <SidebarContent coach={coach} />
      </div>
    </>
  )
}
