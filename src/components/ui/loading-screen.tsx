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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center justify-center">
            {/* Logo centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[180px] h-[65px] sm:w-[220px] sm:h-[79px] md:w-[260px] md:h-[93px]"
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
            <div className="flex gap-1.5 mt-6 sm:mt-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-champagne-500"
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
