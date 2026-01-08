import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MemberSidebar } from '@/components/member/sidebar'
import { MemberHeader } from '@/components/member/header'

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/member/login')
  }

  // Get member data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: member } = await (supabase as any)
    .from('members')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar, profile_photo_url)
    `)
    .eq('id', user.id)
    .single()

  if (!member) {
    redirect('/member/login')
  }

  return (
    <div className="min-h-screen bg-black">
      <MemberSidebar member={member} />
      <div className="lg:pl-72">
        <MemberHeader member={member} />
        <main className="p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
