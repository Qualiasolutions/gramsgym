'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Home,
  User,
  CreditCard,
  Calendar,
  CalendarPlus,
  LogOut,
  Dumbbell,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
  { name: 'My Subscriptions', href: '/member/subscriptions', icon: CreditCard },
  { name: 'Book Session', href: '/member/book', icon: CalendarPlus },
  { name: 'My Bookings', href: '/member/bookings', icon: Calendar },
]

export function MemberSidebar({ member }: MemberSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/member/login')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Grams Gym</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            'group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>

              {/* Assigned Coach */}
              {member.coach && (
                <li>
                  <div className="text-xs font-semibold leading-6 text-muted-foreground">
                    My Coach
                  </div>
                  <div className="mt-2 flex items-center gap-3 rounded-md bg-muted/50 p-3">
                    <Avatar>
                      <AvatarImage src={member.coach.profile_photo_url || undefined} />
                      <AvatarFallback>{member.coach.name_en.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.coach.name_en}</p>
                      <p className="text-xs text-muted-foreground">Personal Trainer</p>
                    </div>
                  </div>
                </li>
              )}

              {/* User section */}
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 py-3 border-t border-border">
                  <Avatar>
                    <AvatarImage src={member.profile_photo_url || undefined} />
                    <AvatarFallback>{member.name_en.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name_en}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border">
        <nav className="flex justify-around py-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 text-xs',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="truncate max-w-[60px]">{item.name.split(' ')[0]}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
