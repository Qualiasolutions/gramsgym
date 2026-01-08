'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Coach } from '@/types/database'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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

function SidebarContent({ coach }: CoachSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <div className="p-1.5 bg-primary rounded-lg">
          <Dumbbell className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg">
          <span className="text-foreground">GRAMS</span>{' '}
          <span className="text-primary">GYM</span>
        </span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={coach.profile_photo_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {coach.name_en.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{coach.name_en}</p>
            <p className="text-xs text-muted-foreground truncate">{coach.email}</p>
          </div>
        </div>
        <form action={signOutCoach}>
          <Button variant="outline" size="sm" className="w-full" type="submit">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}

export function CoachSidebar({ coach }: CoachSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent coach={coach} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col border-r border-border bg-card">
          <SidebarContent coach={coach} />
        </div>
      </div>
    </>
  )
}
