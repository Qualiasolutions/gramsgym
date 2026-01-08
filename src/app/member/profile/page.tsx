import { createClient } from '@/lib/supabase/server'
import { MemberProfileForm } from '@/components/member/profile-form'

export default async function MemberProfilePage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  const { data: { user } } = await supabase.auth.getUser()

  const { data: member } = await client
    .from('members')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="max-w-2xl pb-20 lg:pb-6">
      <MemberProfileForm member={member} />
    </div>
  )
}
