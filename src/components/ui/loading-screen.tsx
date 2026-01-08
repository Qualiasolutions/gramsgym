'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

interface LoadingScreenProps {
  isVisible: boolean
}

export function LoadingScreen({ isVisible }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          {/* Logo on top */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-[200px] h-[72px] md:w-[240px] md:h-[86px]"
          >
            <Image
              src="/logo.png"
              alt="Grams Gym"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Simple loading dots */}
          <div className="flex gap-1.5 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-champagne-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
