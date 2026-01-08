'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createMember, updateMember } from '@/lib/actions/members'
import type { Member } from '@/types/database'

interface Coach {
  id: string
  name_en: string
  name_ar: string
}

interface MemberFormProps {
  coaches: Coach[]
  member?: Member
  isEdit?: boolean
}

export function MemberForm({ coaches, member, isEdit = false }: MemberFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      let result
      if (isEdit && member) {
        result = await updateMember(member.id, formData)
        if (result.success) {
          router.refresh()
        }
      } else {
        result = await createMember(formData)
      }

      if (result?.error) {
        setError(result.error)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Name fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name_en">Name (English) *</Label>
              <Input
                id="name_en"
                name="name_en"
                defaultValue={member?.name_en}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">Name (Arabic) *</Label>
              <Input
                id="name_ar"
                name="name_ar"
                defaultValue={member?.name_ar}
                required
                disabled={loading}
                dir="rtl"
              />
            </div>
          </div>

          {/* Email - only shown for new members */}
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
                placeholder="member@example.com"
              />
            </div>
          )}

          {/* Password - only shown for new members */}
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
                placeholder="Minimum 6 characters"
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                The member will use this password to log in
              </p>
            </div>
          )}

          {/* Phone numbers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={member?.phone || ''}
                disabled={loading}
                placeholder="+962 XX XXX XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                type="tel"
                defaultValue={member?.whatsapp_number || ''}
                disabled={loading}
                placeholder="+962 XX XXX XXXX"
              />
            </div>
          </div>

          {/* Assigned Coach */}
          <div className="space-y-2">
            <Label htmlFor="assigned_coach_id">Assigned Coach</Label>
            <Select
              name="assigned_coach_id"
              defaultValue={member?.assigned_coach_id || ''}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a coach (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No assigned coach</SelectItem>
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.name_en} ({coach.name_ar})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferences */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preferred_language">Preferred Language</Label>
              <Select
                name="preferred_language"
                defaultValue={member?.preferred_language || 'ar'}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notification_preference">Notification Preference</Label>
              <Select
                name="notification_preference"
                defaultValue={member?.notification_preference || 'whatsapp'}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Link href="/coach/members">
              <Button type="button" variant="outline" disabled={loading}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEdit ? 'Saving...' : 'Creating...'}
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Create Member'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
