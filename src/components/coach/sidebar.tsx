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

const navigation = [
  { nameKey: 'dashboard' as const, href: '/coach/dashboard', icon: LayoutDashboard },
  { nameKey: 'members' as const, href: '/coach/members', icon: Users },
  { nameKey: 'bookings' as const, href: '/coach/bookings', icon: Calendar },
  { nameKey: 'mySchedule' as const, href: '/coach/schedule', icon: Clock },
  { nameKey: 'subscriptions' as const, href: '/coach/subscriptions', icon: CreditCard },
  { nameKey: 'notifications' as const, href: '/coach/notifications', icon: Bell },
  { nameKey: 'reports' as const, href: '/coach/reports', icon: BarChart3 },
  { nameKey: 'settings' as const, href: '/coach/settings', icon: Settings },
]

interface CoachSidebarProps {
  coach: Coach
}

function SidebarContent({ coach, onClose }: CoachSidebarProps & { onClose?: () => void }) {
  const pathname = usePathname()
  const { t, language, isRTL } = useTranslation()

  return (
    <div className={`flex h-full flex-col bg-zinc-950 ${isRTL ? 'text-right' : ''}`}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800/50">
        <Link href="/" className="flex items-center">
          <div className="relative w-[100px] h-[36px] bg-zinc-950 rounded-lg">
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
            className="lg:hidden p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
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
                    ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 text-gold-400'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive && 'text-gold-400')} />
                {t(translations.coach[item.nameKey])}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-gold-400',
                      isRTL ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'
                    )}
                  />
                )}
                <ChevronRight className={cn(
                  'w-4 h-4 transition-opacity',
                  isRTL ? 'mr-auto rotate-180' : 'ml-auto',
                  isActive ? 'opacity-100' : 'opacity-0'
                )} />
              </motion.div>
            </Link>
          )
        })}

        {/* Language Toggle */}
        <div className="pt-2">
          <LanguageToggle variant="sidebar" />
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-zinc-800/50 p-4">
        <div className="glass-light rounded-xl p-4 mb-3">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
              <span className="text-gold-400 font-semibold">
                {(language === 'ar' ? coach.name_ar : coach.name_en)?.charAt(0) || coach.name_en.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{language === 'ar' ? coach.name_ar || coach.name_en : coach.name_en}</p>
              <p className="text-xs text-zinc-500 truncate">{coach.email}</p>
            </div>
          </div>
        </div>
        <form action={signOutCoach}>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
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
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl glass-light"
      >
        <Menu className="w-5 h-5" />
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent coach={coach} />
      </div>
    </>
  )
}
