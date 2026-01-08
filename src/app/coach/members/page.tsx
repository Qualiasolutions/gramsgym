import { createClient } from '@/lib/supabase/server'
import { MembersList } from '@/components/coach/members-list'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: members } = await supabase
    .from('members')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar),
      gym_memberships(id, type, status, end_date),
      pt_packages(id, remaining_sessions, status, coach:coaches(id, name_en))
    `)
    .order('created_at', { ascending: false })

  const { data: coaches } = await supabase
    .from('coaches')
    .select('id, name_en, name_ar')
    .eq('is_active', true)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">All Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage your gym members and their subscriptions
          </p>
        </div>
        <Link href="/coach/members/new">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </Link>
      </div>

      <MembersList members={members || []} coaches={coaches || []} />
    </div>
  )
}
