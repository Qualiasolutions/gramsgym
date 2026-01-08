'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'

interface Member {
  id: string
  name_en: string
  name_ar: string
  email: string
  profile_photo_url: string | null
}

interface MemberHeaderProps {
  member: Member
}

const pageTitles: Record<string, string> = {
  '/member/dashboard': 'Dashboard',
  '/member/profile': 'My Profile',
  '/member/subscriptions': 'Subscriptions',
  '/member/book': 'Book Session',
  '/member/bookings': 'My Bookings',
}

export function MemberHeader({ member }: MemberHeaderProps) {
  const pathname = usePathname()

  const pageTitle = pageTitles[pathname] || 'Member Portal'

  return (
    <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-display font-semibold">{pageTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold-400 rounded-full" />
          </motion.button>

          {/* User Avatar */}
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-zinc-800">
            <div className="text-right">
              <p className="text-sm font-medium">{member.name_en}</p>
              <p className="text-xs text-zinc-500">Member</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
              <span className="text-gold-400 font-semibold text-sm">
                {member.name_en.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
