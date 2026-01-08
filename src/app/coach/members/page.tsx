import { MembersPageClient } from '@/components/coach/members-page-client'
import { MemberImport } from '@/components/coach/member-import'
import { ExpiryReminderButton } from '@/components/coach/expiry-reminder-button'
import { isDemoMode } from '@/lib/demo-mode'
import { demoMembers, demoCoach } from '@/lib/demo-data'
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
    <MembersPageClient
      members={members || []}
      coaches={coaches || []}
      importButton={<MemberImport coaches={coaches || []} />}
      reminderButton={<ExpiryReminderButton />}
    />
  )
}
