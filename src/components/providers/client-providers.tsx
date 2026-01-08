'use client'

import dynamic from 'next/dynamic'

// Dynamic import for ChatWidget - loaded only when needed
const ChatWidget = dynamic(
  () => import("@/components/chat/chat-widget").then(mod => ({ default: mod.ChatWidget })),
  { ssr: false }
)

export function ClientProviders() {
  return <ChatWidget />
}
