import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MemberDetail } from '@/components/coach/member-detail'
import { isDemoMode } from '@/lib/demo-mode'
import { demoMembers, demoCoach, demoGymMembership, demoPTPackage, demoBookings } from '@/lib/demo-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MemberDetailPage({ params }: PageProps) {
  const { id } = await params

  // Check for demo mode
  const demoMode = await isDemoMode()
  if (demoMode === 'coach') {
    const foundMember = demoMembers.find(m => m.id === id)
    const member = foundMember
      ? { ...foundMember, coach: demoCoach }
      : { ...demoMembers[0], coach: demoCoach }
    return (
      <MemberDetail
        member={member}
        gymMemberships={[demoGymMembership]}
        ptPackages={[{ ...demoPTPackage, coach: demoCoach }]}
        bookings={demoBookings.map(b => ({ ...b, coach: demoCoach }))}
        coaches={[demoCoach]}
      />
    )
  }

  const supabase = await createClient()

  // PERFORMANCE: Parallel queries using Promise.all() - reduces ~300ms waterfall to ~100ms
  const [
    { data: member },
    { data: gymMemberships },
    { data: ptPackages },
    { data: bookings },
    { data: coaches }
  ] = await Promise.all([
    supabase
      .from('members')
      .select(`
        *,
        coach:coaches(id, name_en, name_ar)
      `)
      .eq('id', id)
      .single(),
    supabase
      .from('gym_memberships')
      .select('*')
      .eq('member_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('pt_packages')
      .select(`
        *,
        coach:coaches(id, name_en, name_ar)
      `)
      .eq('member_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('bookings')
      .select(`
        *,
        coach:coaches(id, name_en, name_ar)
      `)
      .eq('member_id', id)
      .order('scheduled_at', { ascending: false })
      .limit(10),
    supabase
      .from('coaches')
      .select('id, name_en, name_ar')
      .eq('is_active', true)
  ])

  if (!member) {
    notFound()
  }

  return (
    <MemberDetail
      member={member}
      gymMemberships={gymMemberships || []}
      ptPackages={ptPackages || []}
      bookings={bookings || []}
      coaches={coaches || []}
    />
  )
}
