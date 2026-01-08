'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation, translations } from '@/lib/i18n'
import { LanguageToggle } from '@/components/ui/language-toggle'

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

// Navigation items with unique colors
const navigation = [
  { nameKey: 'dashboard' as const, href: '/member/dashboard', icon: Home, color: 'text-champagne-400', bgColor: 'bg-champagne-500/10' },
  { nameKey: 'myProfile' as const, href: '/member/profile', icon: User, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { nameKey: 'subscriptions' as const, href: '/member/subscriptions', icon: CreditCard, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  { nameKey: 'bookSession' as const, href: '/member/book', icon: CalendarPlus, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  { nameKey: 'myBookings' as const, href: '/member/bookings', icon: Calendar, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
]

function SidebarContent({ member, onClose }: MemberSidebarProps & { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t, language, isRTL } = useTranslation()

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
                <span className="flex-1">{t(translations.member[item.nameKey])}</span>
                {isActive && (
                  <motion.div
                    layoutId="member-sidebar-active"
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

      {/* Coach Section */}
      {member.coach && (
        <div className="px-4 pb-4">
          <p className={`text-xs font-medium text-champagne-500/70 uppercase tracking-wider mb-3 px-2 ${isRTL ? 'text-right' : ''}`}>
            {t(translations.member.myCoach)}
          </p>
          <div className="bg-gradient-to-r from-champagne-500/10 to-champagne-600/5 rounded-xl p-4 border border-champagne-500/20">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-champagne-400 to-champagne-600 flex items-center justify-center shadow-lg shadow-champagne-500/20">
                <span className="text-noir-950 font-bold text-lg">
                  {(language === 'ar' ? member.coach.name_ar : member.coach.name_en)?.charAt(0) || member.coach.name_en.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{language === 'ar' ? member.coach.name_ar || member.coach.name_en : member.coach.name_en}</p>
                <p className="text-xs text-champagne-500/70">{t(translations.member.personalTrainer)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User section */}
      <div className="border-t border-champagne-500/20 p-4">
        <div className="bg-gradient-to-r from-champagne-500/10 to-champagne-600/5 rounded-xl p-4 mb-3 border border-champagne-500/20">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-champagne-400 to-champagne-600 flex items-center justify-center shadow-lg shadow-champagne-500/20">
              <span className="text-noir-950 font-bold text-lg">
                {(language === 'ar' ? member.name_ar : member.name_en)?.charAt(0) || member.name_en.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{language === 'ar' ? member.name_ar || member.name_en : member.name_en}</p>
              <p className="text-xs text-champagne-500/70 truncate">{member.email}</p>
            </div>
          </div>
        </div>
        <motion.button
          onClick={handleSignOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-noir-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          {t(translations.nav.signOut)}
        </motion.button>
      </div>
    </div>
  )
}

export function MemberSidebar({ member }: MemberSidebarProps) {
  const pathname = usePathname()
  const { t, isRTL } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={cn(
          "lg:hidden fixed top-4 z-40 p-2.5 rounded-xl bg-noir-900/90 backdrop-blur-sm border border-champagne-500/20",
          isRTL ? "right-4" : "left-4"
        )}
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
              initial={{ x: isRTL ? 280 : -280 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 280 : -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                "lg:hidden fixed inset-y-0 z-50 w-72",
                isRTL ? "right-0" : "left-0"
              )}
            >
              <SidebarContent member={member} onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r border-champagne-500/10",
        isRTL ? "lg:right-0" : ""
      )}>
        <SidebarContent member={member} />
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-noir-950/95 backdrop-blur-xl border-t border-champagne-500/20 pb-[env(safe-area-inset-bottom)]">
        <nav className={`flex justify-around py-2 sm:py-2.5 px-2 sm:px-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const label = t(translations.member[item.nameKey])
            return (
              <Link
                key={item.nameKey}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all min-w-[44px] min-h-[44px] justify-center',
                  isActive ? item.color : 'text-noir-500'
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    isActive && item.bgColor
                  )}
                >
                  <item.icon className="w-5 h-5 sm:w-5 sm:h-5" />
                </motion.div>
                <span className="text-[9px] sm:text-[10px] font-medium truncate max-w-[50px] sm:max-w-[60px]">
                  {label.split(' ')[0]}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className={cn(
                      "absolute bottom-0 w-10 sm:w-12 h-0.5 rounded-full",
                      item.color.replace('text-', 'bg-')
                    )}
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
