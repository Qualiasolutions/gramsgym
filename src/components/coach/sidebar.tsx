'use client'

import Link from 'next/link'
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
  Dumbbell,
  Menu,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { signOutCoach } from '@/lib/auth/actions'

const navigation = [
  { name: 'Dashboard', href: '/coach/dashboard', icon: LayoutDashboard },
  { name: 'Members', href: '/coach/members', icon: Users },
  { name: 'Bookings', href: '/coach/bookings', icon: Calendar },
  { name: 'My Schedule', href: '/coach/schedule', icon: Clock },
  { name: 'Subscriptions', href: '/coach/subscriptions', icon: CreditCard },
  { name: 'Notifications', href: '/coach/notifications', icon: Bell },
  { name: 'Reports', href: '/coach/reports', icon: BarChart3 },
  { name: 'Settings', href: '/coach/settings', icon: Settings },
]

interface CoachSidebarProps {
  coach: Coach
}

function SidebarContent({ coach, onClose }: CoachSidebarProps & { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-800/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <span className="text-black font-bold text-xl">G</span>
          </div>
          <span className="font-semibold tracking-tight">
            Grams<span className="text-gold-400">Gym</span>
          </span>
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
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="relative block"
            >
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 text-gold-400'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive && 'text-gold-400')} />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold-400 rounded-r-full"
                  />
                )}
                <ChevronRight className={cn(
                  'w-4 h-4 ml-auto transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-0'
                )} />
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-zinc-800/50 p-4">
        <div className="glass-light rounded-xl p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
              <span className="text-gold-400 font-semibold">
                {coach.name_en.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{coach.name_en}</p>
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
            Sign Out
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
