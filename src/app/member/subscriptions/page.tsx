import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo-mode'
import { demoGymMembership, demoPTPackage, demoCoach } from '@/lib/demo-data'
import { SubscriptionsContent } from '@/components/member/subscriptions-content'

export default async function MemberSubscriptionsPage() {
  const demoMode = await isDemoMode()

  let gymMemberships: typeof demoGymMembership[] | null = null
  let ptPackages: (typeof demoPTPackage & { coach: typeof demoCoach })[] | null = null

  if (demoMode === 'member') {
    gymMemberships = [demoGymMembership]
    ptPackages = [{ ...demoPTPackage, coach: demoCoach }]
  } else {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any

    const { data: { user } } = await supabase.auth.getUser()

    const { data: gm } = await client
      .from('gym_memberships')
      .select('*')
      .eq('member_id', user?.id)
      .order('created_at', { ascending: false })
    gymMemberships = gm

    const { data: pt } = await client
      .from('pt_packages')
      .select(`
        *,
        coach:coaches(id, name_en, name_ar, profile_photo_url)
      `)
      .eq('member_id', user?.id)
      .order('created_at', { ascending: false })
    ptPackages = pt
  }

  const activeGymMembership = gymMemberships?.find((m: { status: string }) => m.status === 'active') || null
  const activePTPackages = ptPackages?.filter((p: { status: string }) => p.status === 'active') || []
  const expiredGymMemberships = gymMemberships?.filter((m: { status: string }) => m.status !== 'active') || []
  const completedPTPackages = ptPackages?.filter((p: { status: string }) => p.status !== 'active') || []

  return (
    <SubscriptionsContent
      activeGymMembership={activeGymMembership}
      activePTPackages={activePTPackages}
      expiredGymMemberships={expiredGymMemberships}
      completedPTPackages={completedPTPackages}
    />
  )
}
