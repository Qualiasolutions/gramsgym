'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ConfigErrorProps {
  title?: string
  message?: string
}

export function ConfigError({
  title = 'Configuration Required',
  message = 'This feature requires additional configuration. Please contact the administrator.'
}: ConfigErrorProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="glass-light rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>

          <h1 className="text-2xl font-display font-semibold mb-2">{title}</h1>
          <p className="text-zinc-400 mb-8">{message}</p>

          <div className="space-y-4">
            <div className="glass-light rounded-xl p-4 text-left">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-gold-400" />
                <span className="font-medium text-sm">For Administrators</span>
              </div>
              <p className="text-xs text-zinc-500">
                Configure the environment variables in your deployment settings.
              </p>
            </div>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-ghost flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
