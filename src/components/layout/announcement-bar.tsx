'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

export function AnnouncementBar() {
  const { language } = useLanguage()

  return (
    <div className="bg-teal-600 text-white py-2 px-4 text-center text-xs sm:text-sm">
      <span className="opacity-90">
        {language === 'ar' ? 'تم تطويره وتصميمه بواسطة: ' : 'Developed & Designed by: '}
      </span>
      <Link
        href="https://qualiasolutions.net"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-teal-100 hover:text-white transition-colors underline underline-offset-2"
      >
        Qualia Solutions
      </Link>
    </div>
  )
}
