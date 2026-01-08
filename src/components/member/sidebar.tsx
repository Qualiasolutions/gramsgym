'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import {
  Home,
  User,
  CreditCard,
  Calendar,
  CalendarPlus,
  LogOut,
  ChevronRight,
} from 'lucide-react'

interface Member {
  id: string
  name_en: string
  name_ar: string
  email: string
  profile_photo_url: string | null
  coach: {
    id: string
    name_en: string
    name_ar: string
    profile_photo_url: string | null
  } | null
}

interface MemberSidebarProps {
  member: Member
}

const navigation = [
  { name: 'Dashboard', href: '/member/dashboard', icon: Home },
  { name: 'My Profile', href: '/member/profile', icon: User },
  { name: 'Subscriptions', href: '/member/subscriptions', icon: CreditCard },
  { name: 'Book Session', href: '/member/book', icon: CalendarPlus },
  { name: 'My Bookings', href: '/member/bookings', icon: Calendar },
]

export function MemberSidebar({ member }: MemberSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      if (supabase) {
        await supabase.auth.signOut()
      }
    }
    router.push('/member/login')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex h-full flex-col bg-zinc-950">
          {/* Logo */}
          <div className="flex h-16 items-center px-4 border-b border-zinc-800/50">
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
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
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
                        layoutId="member-sidebar-active"
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

          {/* Coach Section */}
          {member.coach && (
            <div className="px-4 pb-4">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 px-2">
                My Coach
              </p>
              <div className="glass-light rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                    <span className="text-gold-400 font-semibold">
                      {member.coach.name_en.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.coach.name_en}</p>
                    <p className="text-xs text-zinc-500">Personal Trainer</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User section */}
          <div className="border-t border-zinc-800/50 p-4">
            <div className="glass-light rounded-xl p-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                  <span className="text-gold-400 font-semibold">
                    {member.name_en.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name_en}</p>
                  <p className="text-xs text-zinc-500 truncate">{member.email}</p>
                </div>
              </div>
            </div>
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50 pb-[env(safe-area-inset-bottom)]">
        <nav className="flex justify-around py-2 sm:py-2.5 px-2 sm:px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all min-w-[44px] min-h-[44px] justify-center',
                  isActive
                    ? 'text-gold-400'
                    : 'text-zinc-500'
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5 sm:w-5 sm:h-5" />
                </motion.div>
                <span className="text-[9px] sm:text-[10px] font-medium truncate max-w-[50px] sm:max-w-[60px]">
                  {item.name.split(' ')[0]}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute bottom-0 w-10 sm:w-12 h-0.5 bg-gold-400 rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
