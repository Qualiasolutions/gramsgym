import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CoachSidebar } from '@/components/coach/sidebar'
import { CoachHeader } from '@/components/coach/header'

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/coach/login')
  }

  // Get coach info
  const { data: coach } = await supabase
    .from('coaches')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!coach) {
    redirect('/coach/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <CoachSidebar coach={coach} />
      <div className="lg:pl-72">
        <CoachHeader coach={coach} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
