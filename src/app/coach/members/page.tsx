import { MembersList } from '@/components/coach/members-list'
import { MemberImport } from '@/components/coach/member-import'
import { ExpiryReminderButton } from '@/components/coach/expiry-reminder-button'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'
import { isDemoMode, demoMembers, demoCoach } from '@/lib/demo-data'
import { getCachedMembers, getCachedCoaches } from '@/lib/cache'

export default async function MembersPage() {
  // Check for demo mode
  const demoMode = await isDemoMode()

  let members = null
  let coaches = null

  if (demoMode === 'coach') {
    members = demoMembers
    coaches = [demoCoach]
  } else {
    // Use cached queries for better performance
    const [membersData, coachesData] = await Promise.all([
      getCachedMembers(),
      getCachedCoaches(),
    ])
    members = membersData
    coaches = coachesData
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">All Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage your gym members and their subscriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExpiryReminderButton />
          <MemberImport coaches={coaches || []} />
          <Link href="/coach/members/new">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      <MembersList members={members || []} coaches={coaches || []} />
    </div>
  )
}
