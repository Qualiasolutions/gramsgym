'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LanguageSwitcher } from './language-switcher'
import { Menu, Dumbbell } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/coaches', key: 'coaches' },
  { href: '/pricing', key: 'pricing' },
  { href: '/schedule', key: 'schedule' },
  { href: '/contact', key: 'contact' },
]

export function Header() {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">
            <span className="text-foreground">GRAMS</span>{' '}
            <span className="text-primary">GYM</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Desktop login button */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/member/login">
              <Button variant="ghost" size="sm">
                {t('memberLogin')}
              </Button>
            </Link>
            <Link href="/coach/login">
              <Button size="sm">
                {t('coachLogin')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <div className="border-t border-border pt-4 mt-4 flex flex-col gap-2">
                  <Link href="/member/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t('memberLogin')}
                    </Button>
                  </Link>
                  <Link href="/coach/login" onClick={() => setOpen(false)}>
                    <Button className="w-full">
                      {t('coachLogin')}
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
