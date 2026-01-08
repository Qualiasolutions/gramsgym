'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Dumbbell, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const t = useTranslations('nav')

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">
                <span className="text-foreground">GRAMS</span>{' '}
                <span className="text-primary">GYM</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Each Gram Matters
            </p>
            <p className="text-sm text-muted-foreground">
              كل جرام مهم
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/coaches" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('coaches')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('schedule')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Sat - Wed</span>
                <span>7 AM - 11 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Thursday</span>
                <span>7 AM - 9 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Friday</span>
                <span>6 PM - 9 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Amman, Jordan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+962 XX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@gramsgym.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                <a
                  href="https://www.instagram.com/gramsgym/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  @gramsgym
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Grams Gym. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
