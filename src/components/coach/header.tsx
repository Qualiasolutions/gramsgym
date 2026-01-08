'use client'

import { usePathname } from 'next/navigation'
import type { Coach } from '@/types/database'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/coach/dashboard': 'Dashboard',
  '/coach/members': 'Members',
  '/coach/members/new': 'Add New Member',
  '/coach/bookings': 'Bookings',
  '/coach/schedule': 'My Schedule',
  '/coach/subscriptions': 'Subscriptions',
  '/coach/notifications': 'Notifications',
  '/coach/reports': 'Reports',
  '/coach/settings': 'Settings',
}

interface CoachHeaderProps {
  coach: Coach
}

export function CoachHeader({ coach }: CoachHeaderProps) {
  const pathname = usePathname()

  // Get page title, handling dynamic routes
  let pageTitle = pageTitles[pathname]
  if (!pageTitle) {
    if (pathname.startsWith('/coach/members/') && pathname !== '/coach/members/new') {
      pageTitle = 'Member Details'
    } else {
      pageTitle = 'Coach Portal'
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      <div className="flex items-center gap-4">
        <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {/* Notification badge - can be made dynamic */}
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
            3
          </span>
        </Button>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
